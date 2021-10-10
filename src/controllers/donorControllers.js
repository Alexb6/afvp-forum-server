const { Donor } = require('./../models');
const { OK, CREATED, BAD_REQUEST, NO_CONTENT } = require('./../helpers/status_codes');
const factoryControllers = require('./factoryControllers');
const authControllers = require('./authControllers');

const getDonorProfileInfos = async (id) => {
   const user = await Donor.findOne({
      where: { id },
      attributes: [
         'first_name',
         'family_name',
         'email',
         'address01',
         'address02',
         'address03',
         'country',
         'firm',
         'photo_url'
      ]
   });
   return user;
}

exports.signUpDonor = authControllers.signUpOne(Donor);

exports.verifyEmailDonor = authControllers.verifyEmailOne(Donor);

exports.getDonor = factoryControllers.getOne(Donor);

exports.updateDonor = factoryControllers.updateOne(Donor);

exports.deleteDonor = factoryControllers.deleteOne(Donor);

exports.getAllDonor = factoryControllers.getAll(Donor);

exports.loginDonor = authControllers.loginOne(Donor);

exports.tokenProtectDonor = authControllers.tokenProtect(Donor);

exports.checkRefreshAndSendTokensDonor = authControllers.checkRefreshAndSendTokens(Donor);

exports.forgotPasswordDonor = authControllers.forgotPassword(Donor);

exports.resetPasswordDonor = authControllers.resetPassword(Donor);

exports.updateMyPasswordDonor = authControllers.updateMyPassword(Donor);

exports.getMyProfileDonor = factoryControllers.getMyProfile(getDonorProfileInfos);

exports.updateMyProfileDonor = factoryControllers.updateMyProfile(Donor);
