const { Member, sequelize } = require('./../models');
const { OK, BAD_REQUEST } = require('./../helpers/status_codes');
const factoryControllers = require('./factoryControllers');
const authControllers = require('./authControllers');

const getMemberProfileInfos = async (id) => {
   const user = await Member.findOne({
      where: { id },
      attributes: [
         'first_name',
         'family_name',
         'email',
         'address01',
         'address02',
         'address03',
         'country',
         'title',
         'speciality',
         'biography',
         'hobby',
         'photo_url'
      ]
   });
   return user;
}

exports.signUpMember = authControllers.signUpOne(Member);

exports.verifyEmailMember = authControllers.verifyEmailOne(Member);

exports.getMember = factoryControllers.getOne(Member);

exports.updateMember = factoryControllers.updateOne(Member);

exports.deleteMember = factoryControllers.deleteOne(Member);

exports.getAllMember = factoryControllers.getAll(Member);

exports.loginMember = authControllers.loginOne(Member);

exports.tokenProtectMember = authControllers.tokenProtect(Member);

exports.checkRefreshAndSendTokensMember = authControllers.checkRefreshAndSendTokens(Member);

exports.forgotPasswordMember = authControllers.forgotPassword(Member);

exports.resetPasswordMember = authControllers.resetPassword(Member);

exports.updateMyPasswordMember = authControllers.updateMyPassword(Member);

exports.getMyProfileMember = factoryControllers.getMyProfile(getMemberProfileInfos);

exports.updateMyProfileMember = factoryControllers.updateMyProfile(Member);

exports.deactivateMember = async (req, res) => {
   const t = await sequelize.transaction();
   try {
      await Member.update(
         { is_active: false, deleted_at: new Date() },
         { where: { id: req.params.id } },
         { transaction: t }
      );
      res.status(OK).json({
         status: 'Success',
         data: null
      });
      await t.commit();
   } catch (err) {
      res.status(BAD_REQUEST).json({
         status: 'Fail to deactivate the member!',
         message: err
      });
      await t.rollback();
   }
}

exports.restoreMember = async (req, res) => {
   const t = await sequelize.transaction();
   try {
      await Member.update(
         { is_active: true, deleted_at: null },
         { where: { id: req.params.id } },
         { transaction: t }
      );
      const member = await Member.findByPk(req.params.id);
      res.status(OK).json({
         status: 'Success',
         data: { member }
      });
      await t.commit();
   } catch (err) {
      res.status(BAD_REQUEST).json({
         status: 'Fail to restore the member!',
         message: err
      });
      await t.rollback();
   }
}
