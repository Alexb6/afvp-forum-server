const { Donor, Role, sequelize } = require('./../models');
const { OK, CREATED, BAD_REQUEST, NO_CONTENT } = require('./../helpers/status_codes');
const factoryControllers = require('./factoryControllers');
const authControllers = require('./authControllers');

exports.signUpDonor = authControllers.signUpOne(Donor);

exports.getDonor = factoryControllers.getOne(Donor);

exports.updateDonor = factoryControllers.updateOne(Donor);

exports.deleteDonor = factoryControllers.deleteOne(Donor);

exports.getAllDonor = factoryControllers.getAll(Donor);


