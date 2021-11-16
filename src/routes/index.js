const express = require('express');

const membersRoutes = require('./membersRoutes');
const donorsRoutes = require('./donorsRoutes');
const afvpRoutes = require('./afvpRoutes');

const mainRouter = express.Router();

mainRouter.use('/members', membersRoutes);
mainRouter.use('/donors', donorsRoutes);
mainRouter.use('/afvp', afvpRoutes);

module.exports = mainRouter;