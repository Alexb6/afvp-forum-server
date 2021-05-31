const express = require('express');
const {
   getAllDonor,
   getDonor,
   updateDonor,
   deleteDonor,
   signUpDonor,
   loginDonor,
   tokenProtectDonor,
   forgotPasswordDonor,
   resetPasswordDonor,
   updateMyPasswordDonor,
   viewMyProfileDonor,
   updateMyProfileDonor } = require('./../controllers/donorControllers');

const router = express.Router();

router.post('/signup', signUpDonor);

router.post('/login', loginDonor);

router.post('/forgot-password', forgotPasswordDonor);

router.patch('/reset-password/:token', resetPasswordDonor);

router.patch('/update-my-password', tokenProtectDonor, updateMyPasswordDonor);

router.get('/profile', tokenProtectDonor, viewMyProfileDonor);

router.patch('/profile/update-profile', tokenProtectDonor, updateMyProfileDonor);

router.route('/')
   .get(getAllDonor);

router.route('/:id')
   .get(getDonor)
   .patch(updateDonor)
   .delete(deleteDonor);

module.exports = router;