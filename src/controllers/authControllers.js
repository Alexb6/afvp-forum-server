require('dotenv').config();
const crypto = require('crypto');
const randtoken = require('rand-token');
const moment = require('moment');
const ms = require('ms');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const { Role, sequelize } = require('./../models');
const { Op } = require("sequelize");
const AppError = require('./../utils/appError');
const sendEmail = require('./../utils/sendEmail');
const { OK, CREATED, NO_CONTENT, BAD_REQUEST, UNAUTHORIZED, FORBIDDEN, NOT_FOUND, SERVER_ERROR, UNPROCESSABLE_ENTITY } = require('./../helpers/status_codes');

const hashPassword = async password => {
   return await bcrypt.hash(password, 12);
}

const createAccessXsrfTokens = id => {
   const xsrfToken = randtoken.generate(24);
   const signKey = process.env.JWT_SECRET + xsrfToken;
   const accessToken = jwt.sign({ id }, signKey, {
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN
   });

   const accessTokenRefreshInterval = ms(process.env.JWT_ACCESS_EXPIRES_IN) - 60000;
   return { xsrfToken, accessToken, accessTokenRefreshInterval };
}

const createRefreshToken = id => {
   return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN
   });
}

const removeUserFileds = aUser => {
   const user = JSON.parse(JSON.stringify(aUser));
   if (user.password) delete user.password;
   if (user.pass_confirm) delete user.pass_confirm;
   if (user.refresh_token) delete user.refresh_token;
   if (user.updated_at) delete user.updated_at;
   if (user.role_id) delete user.role_id;
   return user;
}

const createAndSendTokens = async (aUser, statusCode, res, Model) => {
   const tokens = createAccessXsrfTokens(aUser.id);
   const refreshToken = createRefreshToken(aUser.id);

   const cookieOptions = {
      expires: new Date(moment().add(ms(process.env.JWT_REFRESH_EXPIRES_IN), 'ms')),
      sameSite: 'lax'
   };
   const refreshCookieOptions = {
      ...cookieOptions,
      httpOnly: true
   };
   if (process.env.NODE_ENV === 'production') refreshCookieOptions.secure = true;

   if (Model) {
      if (Model.name === 'Member') res.cookie('userResource', 'members', cookieOptions);
      if (Model.name === 'Donor') res.cookie('userResource', 'donors', cookieOptions);
   }

   const { xsrfToken, accessToken, accessTokenRefreshInterval } = tokens;
   res.cookie('xsrfToken', xsrfToken, cookieOptions);
   res.cookie('refreshToken', refreshToken, refreshCookieOptions);

   const user = removeUserFileds(aUser);

   res.status(statusCode).json({
      status: 'Succès',
      data: { token: { accessToken, accessTokenRefreshInterval }, user }
   });
}

const sendAndClearTokens = async (statusCode, res) => {
   const accessToken = null;
   const accessTokenRefreshInterval = null;

   const cookieOptions = {
      maxAge: -1,
      sameSite: 'lax'
   };
   const refreshCookieOptions = {
      ...cookieOptions,
      httpOnly: true
   };

   res.cookie('userResource', '', cookieOptions);
   res.cookie('xsrfToken', '', cookieOptions);
   res.cookie('refreshToken', '', refreshCookieOptions);

   res.status(statusCode).json({
      status: 'Succès',
      data: { token: { accessToken, accessTokenRefreshInterval } }
   });
}

const verifyToken = (token, xsrfToken = '') => {
   try {
      const signKey = process.env.JWT_SECRET + xsrfToken;
      return jwt.verify(token, signKey);
   } catch (err) {
      return new AppError(`Votre token n'est pas valide ou a expiré !`, UNAUTHORIZED)
   }
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

const createModelRelatedToken = Model => {
   let modelRelatedToken;
   if (Model.name === 'Member') modelRelatedToken = crypto.randomBytes(48).toString('hex');
   if (Model.name === 'Donor') modelRelatedToken = crypto.randomBytes(32).toString('hex');
   return modelRelatedToken;
}

const hashPasswordResetToken = async (resetToken, user) => {
   const hashResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
   user.pass_reset_token = hashResetToken;
   user.pass_reset_expired_dt = Date.now() + ms(process.env.PASSWORD_RESET_TOKEN_EXPIRES_IN);
   await user.save({ validate: false });
}

const getFrontEndHost = () => {
   let frontendHost;
   if (process.env.NODE_ENV === 'development') {
      frontendHost = 'localhost:3000'
   } else {
      frontendHost = '' // put production host here
   }
   return frontendHost;
}


exports.signUpOne = Model => async (req, res, next) => {
   const t = await sequelize.transaction();
   try {
      const existingUser = await Model.findOne({
         where: { email: req.body.email },
         attributes: ['id', 'email', 'first_name', 'family_name']
      });
      if (existingUser) {
         return next(new AppError(`Un utilisateur avec ce courriel existe déjà ! Si vous êtes inscrit, veuillez vous connecter à votre espace.`, UNPROCESSABLE_ENTITY));
      }

      if (Model.name === 'Donor') {
         const role = await Role.findOne({ where: { name: 'donateur' } });
         req.body.role_id = role.id;
      }
      if (req.body.gender === 'Monsieur') req.body.gender = 'Mr';
      if (req.body.gender === 'Ông') req.body.gender = 'Mr';
      if (req.body.gender === 'Madame') req.body.gender = 'Mrs';
      if (req.body.gender === 'Bà') req.body.gender = 'Mrs';

      req.body.password = await hashPassword(req.body.password);
      req.body.pass_confirm = req.body.password;

      const emailVerificationToken = createModelRelatedToken(Model);
      req.body.email_verification_token = emailVerificationToken;
      const frontendHost = getFrontEndHost();
      const emailVerificationUrl = `${req.protocol}://${frontendHost}/verify-email/${emailVerificationToken}`;
      const message = `Vous recevez ce courriel suite à votre demande d'inscription sur le site de l'association AFVP. Veuillez cliquer sur ce lien pour confirmer votre courriel. \n\n${emailVerificationUrl}\n\nSi vous n'avez pas demandé une inscription à l'association, veuillez ignorer ce message.\nCe courriel est envoyé par un service automatique, n'envoyez pas de réponse !`;
      try {
         await sendEmail({
            // email: req.body.email,
            email: 'dev-notifications@afvp.net',
            subject: 'Confirmation de votre courriel',
            message
         })
      } catch (err) {
         return next(new AppError(`Une erreur s\'est produite lors de l\'envoi du courriel de vérification. Veuillez essayer plus tard !`, SERVER_ERROR));
      }

      const newUser = await Model.create(req.body, { transaction: t });
      const user = removeUserFileds(newUser);
      res.status(CREATED).json({
         status: 'Succès',
         data: { user }
      })

      await t.commit();
   } catch (err) {
      res.status(BAD_REQUEST).json({
         status: 'Échec de la création du compte de l\'utilisateur !',
         message: err.message
      });
      await t.rollback();
   }
}

exports.verifyEmailOne = Model => async (req, res, next) => {
   const t = await sequelize.transaction();
   try {
      const user = await Model.findOne({
         where: { email_verification_token: req.params.token },
         attributes: ['id', 'email', 'first_name', 'family_name', 'photo_url', 'email_verified']
      });
      if (!user) {
         return next(new AppError(`Le token de vérification de votre courriel est incorrect ! Contactez-nous à ce courriel : contact@afvp.net`, UNAUTHORIZED))
      }
      if (user.email_verified) {
         return next(new AppError(`Votre courriel est déjà verifié. Vous pouvez vous connecter à votre espace personnel.`, BAD_REQUEST))
      }
      user.email_verified = true;
      await user.save({ validate: false });

      const verifiedUser = await Model.findOne({
         where: { email_verification_token: req.params.token },
         attributes: ['id', 'email', 'first_name', 'family_name', 'photo_url', 'email_verified']
      });

      res.status(200).json({
         status: 'Succès',
         data: { user: verifiedUser }
      })
   } catch (err) {
      res.status(BAD_REQUEST).json({
         status: 'Échec de la vérification du courriel !',
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
         attributes: ['id', 'email', 'first_name', 'family_name', 'password', 'photo_url', 'email_verified']
      });
      if (!user) {
         return next(new AppError(`Votre courriel ou votre mot de passe est incorrect !`, UNAUTHORIZED));
      }
      if (!user.email_verified) {
         return next(new AppError(`Pour se connecter à votre espace personnel, veuillez d'abord valider votre courriel grâce au lien que nous avons envoyé !`, UNAUTHORIZED))
      }

      const correctPassword = await comparePassword(req.body.password, user.password);
      if (!correctPassword) {
         return next(new AppError(`Votre courriel ou votre mot de passe est incorrect !`, UNAUTHORIZED));
      }

      createAndSendTokens(user, OK, res, Model);
   } catch (err) {
      res.status(UNAUTHORIZED).json({
         status: 'Échec du processus de connexion !',
         message: err.message
      })
   }
}

exports.logoutOne = async (req, res, next) => {
   try {
      const user = req.user;
      if (!user) {
         return next(new AppError(`Pour se déconnecter, vous devez d'abord être connecté !`, BAD_REQUEST));
      }

      sendAndClearTokens(OK, res);
   } catch (err) {
      res.status(UNAUTHORIZED).json({
         status: 'Échec de la déconnexion !',
         message: err.message
      })
   }
}

exports.tokenProtect = Model => async (req, res, next) => {
   try {
      let accessToken;
      if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
         accessToken = req.headers.authorization.split(' ')[1];
      }
      const xsrfToken = req.headers.xsrftoken;
      if (!accessToken || !xsrfToken) {
         return next(new AppError(`Veuillez vous connecter pour accéder à cette donnée !`, UNAUTHORIZED));
      }

      const accessTokenPayload = verifyToken(accessToken, xsrfToken);

      const currentUser = await Model.findOne({
         where: { id: accessTokenPayload.id },
         attributes: [
            'id',
            'first_name',
            'family_name',
            'email',
            'pass_changed_dt',
            'role_id',
            'photo_url'
         ]
      });
      if (!currentUser) {
         return next(new AppError(`L'utilisateur qui possède ce token n\'existe plus !`, FORBIDDEN));
      }

      if (passwordChangedDate(currentUser.pass_changed_dt, accessTokenPayload.iat)) {
         return next(new AppError(`L'utilisateur a récemment changé de mot de passe. Veuillez vous connecter à nouveau !`, UNAUTHORIZED));
      }

      // const userRole = await Role.findOne({
      //    where: { id: currentUser.role_id }
      // });
      // currentUser.role = userRole.name;
      req.user = currentUser;

   } catch (err) {
      res.status(UNAUTHORIZED).json({
         status: 'Échec',
         message: err.message
      })
   }
   next();
}

exports.checkRefreshAndSendTokens = Model => async (req, res, next) => {
   try {
      const refreshToken = req.cookies.refreshToken;
      const xsrfToken = req.headers.xsrftoken;
      if (!refreshToken || !xsrfToken) {
         return next(new AppError(`Votre token n'existe pas. Veuillez vous connecter !`, NO_CONTENT));
      }

      const refreshTokenPayload = jwt.verify(refreshToken, process.env.JWT_SECRET);
      const currentUser = await Model.findOne({
         where: { id: refreshTokenPayload.id },
         attributes: [
            'id',
            'first_name',
            'family_name',
            'email',
            'photo_url'
         ]
      });

      if (!currentUser) {
         return next(new AppError(`Le propriétaire de ce token n'existe plus. Veuillez vous connecter à nouveau !`, UNAUTHORIZED));
      }

      createAndSendTokens(currentUser, OK, res, Model);
   } catch (err) {
      res.status(BAD_REQUEST).json({
         status: 'Échec',
         message: err.message
      })
   }
}

exports.restrictTo = (...roles) => {
   return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
         return next(new AppError(`Vous n'avez pas l'autorisation pour effectuer cette action !`, FORBIDDEN));
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
         return next(new AppError(`Il n'y a pas d'utilisateur avec ce courriel !`, NOT_FOUND));
      }
      
      const resetToken = createModelRelatedToken(Model);
      await hashPasswordResetToken(resetToken, user);

      const frontendHost = getFrontEndHost();
      const resetUrl = `${req.protocol}://${frontendHost}/reset-password/${resetToken}`;
      const message = `Vous recevez ce courriel suite à votre demande pour changer votre mot de passe. Veuillez suivre le lien ci-dessous pour le réinitialiser. Il est valide pendant 2 heures seulement !\n\n${resetUrl}\n\nSi vous n'avez pas oublié votre mot de passe, veuillez ignorer ce message.\nCe courriel est envoyé par un service automatique, n'envoyez pas de réponse !`;

      try {
         await sendEmail({
            // email: user.email,
            email: 'dev-notifications@afvp.net',
            subject: 'Réinitialisation de votre mot de passe',
            message
         })
         res.status(OK).json({
            status: 'Succès',
            message: `Un lien pour réinitialiser le mot de passe a été envoyé à votre courriel !`
         })
      } catch (err) {
         user.pass_reset_token = null;
         user.pass_reset_expired_dt = null;
         await user.save();

         return next(new AppError(`Une erreur s'est produite lors de l'envoi du courriel pour réinitialiser le mot de passe. Veuillez essayer plus tard !`, SERVER_ERROR));
      }

   } catch (err) {
      res.status(BAD_REQUEST).json({
         status: 'Impossibilité de traiter votre demande. Veuillez essayer plus tard !',
         message: err.message
      })
   }
}

exports.resetPassword = Model => async (req, res, next) => {
   try {
      const hashResetToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
      const user = await Model.findOne({
         where: {
            pass_reset_token: hashResetToken,
            pass_reset_expired_dt: { [Op.gt]: new Date() }
         },
         attributes: [
            'id',
            'first_name',
            'family_name',
            'email',
            'photo_url',
            'password',
            'pass_confirm',
            'pass_changed_dt',
            'pass_reset_token',
            'pass_reset_expired_dt'
         ]
      });

      if (!user) {
         return next(new AppError(`Votre token de réinitialisation n'est pas valide ou a expiré !`, UNAUTHORIZED));
      }
      user.password = await hashPassword(req.body.password);
      user.pass_confirm = user.password;
      user.pass_reset_token = null;
      user.pass_reset_expired_dt = null;
      user.pass_changed_dt = Date.now() - 3000; // remove 3s to make sure this timestamp is anterior to the below jwt's timestamp
      await user.save();

      res.status(OK).json({
         status: 'Succès',
         message: `Votre mot de passe a été réinitialisé avec succès !`
      })
   } catch (err) {
      res.status(BAD_REQUEST).json({
         status: 'Impossibilité de traiter votre demande. Veuillez essayer plus tard !',
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
            'photo_url',
            'password',
            'pass_confirm',
            'pass_changed_dt'
         ]
      });

      const correctPassword = await comparePassword(req.body.password_current, user.password);
      if (!correctPassword) {
         return next(new AppError(`Le mot de passe entré n'est pas correct! Veuillez entrer le bon mot de passe.`, UNAUTHORIZED));
      }

      user.password = await hashPassword(req.body.password);
      user.pass_confirm = user.password;
      user.pass_changed_dt = Date.now() - 3000;
      await user.save({ transaction: t });

      createAndSendTokens(user, OK, res, Model);
      await t.commit();
   } catch (err) {
      res.status(BAD_REQUEST).json({
         status: 'Impossibilité de traiter votre demande. Veuillez essayer plus tard !',
         message: err.message
      });
      await t.rollback();
   }
}

exports.testSendEmail = async (req, res) => {
   try {
      await sendEmail({
         email: 'dev-notifications@afvp.net',
         subject: 'Confirmation de votre courriel',
         message: 'Email test sending!'
      });
      res.status(OK).json({
         status: 'Succès'
      })
   } catch (err) {
      res.status(SERVER_ERROR).json({
         status: 'Fail',
         message: err.message
      });
   }
}
