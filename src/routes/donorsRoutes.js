const express = require('express');
const donorControllers = require('./../controllers/donorControllers');

const router = express.Router();

router.route('/')
   .get(donorControllers.getAllDonor);

router.route('/signup')
   .post(donorControllers.signUpDonor);

router.route('/:id')
   .get(donorControllers.getDonor)
   .patch(donorControllers.updateDonor)
   .delete(donorControllers.deleteDonor);

module.exports = router;