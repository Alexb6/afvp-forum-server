const express = require('express');
const memberControllers = require('./../controllers/memberControllers');

const router = express.Router();

router.route('/')
   .get(memberControllers.getAllMember);

router.route('/signup')
   .post(memberControllers.signUpMember);

router.route('/:id')
   .get(memberControllers.getMember)
   .patch(memberControllers.updateMember)
   .delete(memberControllers.deleteMember);

router.route('/deactivate/:id').patch(memberControllers.deactivateMember);
router.route('/restore/:id').patch(memberControllers.restoreMember);


module.exports = router;