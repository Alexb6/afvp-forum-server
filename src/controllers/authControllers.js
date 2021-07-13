require('dotenv').config();
const { promisify } = require('util');
const crypto = require('crypto');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Role, sequelize } = require('./../models');
const { Op } = require("sequelize");
const AppError = require('./../utils/appError');
const sendEmail = require('./../utils/nodeMailer');
const { OK, CREATED, BAD_REQUEST, UNAUTHORIZED, FORBIDDEN, NOT_FOUND, SERVER_ERROR, UNPROCESSABLE_ENTITY } = require('./../helpers/status_codes');

const hashPassword = async password => {
   return await bcrypt.hash(password, 12);
}

const createJwtToken = id => {
   return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN
   });
}

const createAndSendToken = (aUser, statusCode, res) => {
   const token = createJwtToken(aUser.id);

   const cookieOptions = {
      expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
      httpOnly: true,
      sameSite: 'lax'
   };
   if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
   res.cookie('jwtToken', 'Bearer ' + token, cookieOptions);

   const user = JSON.parse(JSON.stringify(aUser));
   if (user.password) delete user.password;
   if (user.pass_confirm) delete user.pass_confirm;
   if (user.role_id) delete user.role_id;

   res.status(statusCode).json({
      status: 'Success',
      token,
      data: { user }
   });
}

const comparePassword = async (password, hashedPassword) => {
   return await bcrypt.compare(password, hashedPassword);
}

const passwordChangedDate = (passChangedDate, jwtTimestamp) => {
   if (passChangedDate) {
      const passwordChangedTimestamp = parseInt(passChangedDate.getTime() / 1000, 10);
      return jwtTimestamp < passwordChangedTimestamp;
   }
   return false;
}

const createPasswordResetToken = async (user) => {
   const resetToken = crypto.randomBytes(32).toString('hex');
   const hashToken = crypto.createHash('sha256').update(resetToken).digest('hex');
   user.pass_reset_token = hashToken;
   user.pass_reset_expired_dt = Date.now() + 2 * 60 * 60 * 1000;
   await user.save();
   return resetToken;
}


exports.signUpOne = Model => async (req, res, next) => {
   const t = await sequelize.transaction();
   try {
      const existingUser = await Model.findOne({
         where: { email: req.body.email },
         attributes: ['id', 'email', 'first_name', 'family_name']
      });
      if (existingUser) {
         return next(new AppError('Un utilisateur avec ce courriel existe déjà ! Si vous êtes inscrit, veuillez vous connecter à votre espace.', UNPROCESSABLE_ENTITY));
      }

      if (Model.name === 'Donor') {
         const role = await Role.findOne({ where: { name: 'donator' } });
         req.body.role_id = role.id;
      }
      (req.body.gender === 'Monsieur' || 'Ông') ? req.body.gender = 'Mr' : req.body.gender = 'Mrs';

      req.body.password = await hashPassword(req.body.password);
      req.body.pass_confirm = req.body.password;

      const newUser = await Model.create(req.body, { transaction: t });
      createAndSendToken(newUser, CREATED, res);

      await t.commit();
   } catch (err) {
      res.status(BAD_REQUEST).json({
         status: 'Fail to create the data!',
         message: err.message
      });
      await t.rollback();
   }
}

exports.loginOne = Model => async (req, res, next) => {
   try {
      // if (!req.body.email || !req.body.password) {
      //    return next(new AppError('Please provide an email and a password!', UNAUTHORIZED));
      // }
      const user = await Model.findOne({
         where: { email: req.body.email },
         attributes: ['id', 'email', 'first_name', 'family_name', 'password']
      });
      if (!user) {
         return next(new AppError('Votre courriel ou votre mot de passe est incorrect !', UNAUTHORIZED));
      }

      const correctPassword = await comparePassword(req.body.password, user.password);
      if (!correctPassword) {
         return next(new AppError('Votre courriel ou votre mot de passe est incorrect !', UNAUTHORIZED));
      }

      createAndSendToken(user, OK, res);
   } catch (err) {
      res.status(UNAUTHORIZED).json({
         status: 'Fail to login!',
         message: err.message
      })
   }
}

exports.tokenProtect = Model => async (req, res, next) => {
   try {
      let token;
      if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
         token = req.headers.authorization.split(' ')[1];
      }
      if (!token) {
         return next(new AppError('Please log in to get access!', UNAUTHORIZED));
      }

      const tokenPayload = await promisify(jwt.verify)(token, process.env.JWT_SECRET)

      const currentUserExists = await Model.findOne({
         where: { id: tokenPayload.id },
         attributes: [
            'id',
            'first_name',
            'family_name',
            'email',
            'pass_changed_dt',
            'role_id']
      });
      if (!currentUserExists) {
         return next(new AppError('The user with this token does no longer exist!', UNAUTHORIZED));
      }

      if (passwordChangedDate(currentUserExists.pass_changed_dt, tokenPayload.iat)) {
         return next(new AppError('The user has recently changed password. Please login again!', UNAUTHORIZED));
      }

      const getUserRole = await Role.findOne({
         where: { id: currentUserExists.role_id }
      });
      currentUserExists.role = getUserRole.name;
      req.user = currentUserExists;

   } catch (err) {
      res.status(UNAUTHORIZED).json({
         status: 'You are not authorized to access this resource!',
         message: err.message
      })
   }
   next();
}

exports.restrictTo = (...roles) => {
   return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
         return next(new AppError('You do not have the authrorisation to perform this action!', FORBIDDEN));
      }
      next();
   }
}

exports.forgotPassword = Model => async (req, res, next) => {
   try {
      const user = await Model.findOne({
         where: { email: req.body.email },
         attributes: ['id', 'first_name', 'family_name', 'email', 'pass_reset_token', 'pass_reset_expired_dt']
      });
      if (!user) {
         return next(new AppError('There is no user with this email address!', NOT_FOUND));
      }

      const resetToken = await createPasswordResetToken(user);

      let endpoint;
      if (Model.name === 'Member') endpoint = 'members';
      if (Model.name === 'Donor') endpoint = 'donors';
      const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/${endpoint}/reset-password/${resetToken}`;
      const message = `Vous recevez ce courriel suite à votre demande pour changer votre mot de passe. Veuillez suivre le lien ci-dessous pour le réinitialiser. Il est valide pendant 2 heures seulement !\n\n${resetUrl}\n\nSi vous n'avez pas oublié votre mot de passe, veuillez ignorer ce message.\nCe courriel est envoyé par un service automatique, n'envoyez pas de réponse !`;

      try {
         await sendEmail({
            email: user.email,
            subject: 'Réinitialisation de votre mot de passe',
            message
         })
         res.status(OK).json({
            status: 'Success',
            message: 'A link to reset the password has been sent to user!'
         })
      } catch (err) {
         user.pass_reset_token = null;
         user.pass_reset_expired_dt = null;
         await user.save();

         return next(new AppError('There is an error sending the email. Please try again later!', SERVER_ERROR));
      }

   } catch (err) {
      res.status(BAD_REQUEST).json({
         status: 'Unable to process your request. Please try again later!',
         message: err.message
      })
   }
}

exports.resetPassword = Model => async (req, res, next) => {
   try {
      const hashToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

      const user = await Model.findOne({
         where: {
            pass_reset_token: hashToken,
            pass_reset_expired_dt: { [Op.gt]: new Date() }
         },
         attributes: [
            'id',
            'first_name',
            'family_name',
            'email',
            'password',
            'pass_confirm',
            'pass_changed_dt',
            'pass_reset_token',
            'pass_reset_expired_dt'
         ]
      });

      if (!user) {
         return next(new AppError('The token is invalid or has expired!', BAD_REQUEST));
      }
      user.password = await hashPassword(req.body.password);
      user.pass_confirm = user.password;
      user.pass_reset_token = null;
      user.pass_reset_expired_dt = null;
      user.pass_changed_dt = Date.now() - 3000; // remove 3s to make sure this timestamp is anterior to the below jwt's timestamp
      await user.save();

      createAndSendToken(user, OK, res);
   } catch (err) {
      res.status(BAD_REQUEST).json({
         status: 'Unable to process your request. Please try again later!',
         message: err.message
      })
   }
}

exports.updateMyPassword = Model => async (req, res, next) => {
   const t = await sequelize.transaction();
   try {
      const user = await Model.findOne({
         where: { id: req.user.id },
         attributes: [
            'id',
            'first_name',
            'family_name',
            'email',
            'password',
            'pass_confirm',
            'pass_changed_dt'
         ]
      });

      const correctPassword = await comparePassword(req.body.password_current, user.password);
      if (!correctPassword) {
         return next(new AppError('You entered a wrong current password! Please give the right password.', UNAUTHORIZED));
      }

      user.password = await hashPassword(req.body.password);
      user.pass_confirm = user.password;
      user.pass_changed_dt = Date.now() - 3000;
      await user.save({ transaction: t });

      createAndSendToken(user, OK, res);
      await t.commit();
   } catch (err) {
      res.status(BAD_REQUEST).json({
         status: 'Unable to process your request. Please try again later!',
         message: err.message
      });
      await t.rollback();
   }
}