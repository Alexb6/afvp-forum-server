const express = require('express');

const membersRoutes = require('./membersRoutes');
const donorsRoutes = require('./donorsRoutes');

const mainRouter = express.Router();

mainRouter.use('/members', membersRoutes);
mainRouter.use('/donors', donorsRoutes);

module.exports = mainRouter;