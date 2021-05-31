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
   viewMyProfileMember,
   updateMyProfileMember
} = require('./../controllers/memberControllers');

const router = express.Router();

router.post('/signup', signUpMember);

router.post('/login', loginMember);

router.post('/forgot-password', forgotPasswordMember);

router.patch('/reset-password/:token', resetPasswordMember);

router.patch('/update-my-password', tokenProtectMember, updateMyPasswordMember);

router.get('/profile', tokenProtectMember, viewMyProfileMember);

router.patch('/profile/update-profile', tokenProtectMember, updateMyProfileMember);

router.route('/')
   .get(getAllMember);

router.route('/:id')
   .get(getMember)
   .patch(tokenProtectMember, updateMember)
   .delete(deleteMember);

router.patch('/deactivate/:id', deactivateMember);
router.patch('/restore/:id', restoreMember);


module.exports = router;