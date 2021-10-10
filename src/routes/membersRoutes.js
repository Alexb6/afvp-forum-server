const express = require('express');

const {
   getAllMember,
   getMember,
   updateMember,
   deleteMember,
   deactivateMember,
   restoreMember,
   signUpMember,
   verifyEmailMember,
   loginMember,
   tokenProtectMember,
   checkRefreshAndSendTokensMember,
   forgotPasswordMember,
   resetPasswordMember,
   updateMyPasswordMember,
   getMyProfileMember,
   updateMyProfileMember
} = require('./../controllers/memberControllers');
const { restrictTo, logoutOne, testSendEmail } = require('./../controllers/authControllers');
const { updateMyProfilePhoto } = require('./../controllers/factoryControllers');

const router = express.Router();

// router.post('/test-email', testSendEmail);
router.post('/signup', signUpMember);
router.patch('/verify-email/:token', verifyEmailMember);
router.post('/login', loginMember);
router.post('/forgot-password', forgotPasswordMember);
router.post('/refresh-token', checkRefreshAndSendTokensMember);
router.patch('/reset-password/:token', resetPasswordMember);

/* Token protected routes */
router.use(tokenProtectMember);

router.post('/logout', logoutOne);
router.patch('/update-my-password', updateMyPasswordMember);
router.get('/profile', getMyProfileMember);
router.patch('/profile/update-profile', updateMyProfilePhoto, updateMyProfileMember);
router.route('/')
   .get(getAllMember);
router.route('/:id')
   .get(getMember)
   .patch(updateMember);

/* Token & roles protected routes */
router.use(restrictTo('developer', 'administrator'));

router.delete('/:id', deleteMember);
router.patch('/deactivate/:id', deactivateMember);
router.patch('/restore/:id', restoreMember);

module.exports = router;
