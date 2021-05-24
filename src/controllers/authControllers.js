require('dotenv').config();
const { Role, sequelize } = require('./../models');
const { OK, CREATED, BAD_REQUEST, NO_CONTENT } = require('./../helpers/status_codes');
const jwt = require('jsonwebtoken');

exports.signUpOne = Model => async (req, res) => {
   const t = await sequelize.transaction();
   try {
      if (Model.name === 'Donor') {
         const role = await Role.findOne({ where: { name: 'donator' } });
         req.body.role_id = role.id;
      }
      if (Model.name === 'Member') {
         const role = await Role.findOne({ where: { name: req.body.role } });
         req.body.role_id = role.id;
      }
      const newOne = await Model.create(req.body, { transaction: t });
      const token = jwt.sign({ id: newOne.id }, process.env.JWT_SECRET, {
         expiresIn: process.env.JWT_EXPIRES_IN
      });
      res.status(CREATED).json({
         status: 'Success',
         token,
         data: { newOne }
      });
      await t.commit();
   } catch (err) {
      res.status(BAD_REQUEST).json({
         status: 'Fail to create the data!',
         message: err
      });
   }
   await t.rollback();
}

