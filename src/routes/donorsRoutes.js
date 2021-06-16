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
   getMyProfileDonor,
   updateMyProfileDonor } = require('./../controllers/donorControllers');
   const { restrictTo } = require('./../controllers/authControllers');

const router = express.Router();

router.post('/signup', signUpDonor);
router.post('/login', loginDonor);
router.post('/forgot-password', forgotPasswordDonor);
router.patch('/reset-password/:token', resetPasswordDonor);

/* Token protected routes */
router.use(tokenProtectDonor);

router.patch('/update-my-password', updateMyPasswordDonor);
router.get('/profile', getMyProfileDonor);
router.patch('/profile/update-profile', updateMyProfileDonor);

/* Token & roles protected routes */
router.use(restrictTo('developer', 'administrator'));

router.route('/')
   .get(getAllDonor);
router.route('/:id')
   .get(getDonor)
   .patch(updateDonor)
   .delete(deleteDonor);

module.exports = router;