const express = require('express');

const {contactUs} = require('./../controllers/afvpControllers');

const router = express.Router();

router.post('/contact-us', contactUs);

module.exports = router;