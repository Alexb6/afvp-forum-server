const express = require('express');
const {
   getAllMember,
   getMember,
   updateMember,
   deleteMember,
   deactivateMember,
   restoreMember,
   signUpMember,
   loginMember,
   tokenProtectMember,
   forgotPasswordMember,
   resetPasswordMember,
   updateMyPasswordMember,
   getMyProfileMember,
   updateMyProfileMember
} = require('./../controllers/memberControllers');
const { restrictTo } = require('./../controllers/authControllers');

const router = express.Router();

router.post('/signup', signUpMember);
router.post('/login', loginMember);
router.post('/forgot-password', forgotPasswordMember);
router.patch('/reset-password/:token', resetPasswordMember);

/* Token protected routes */
router.use(tokenProtectMember);

router.patch('/update-my-password', updateMyPasswordMember);
router.get('/profile', getMyProfileMember);
router.patch('/profile/update-profile', updateMyProfileMember);
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