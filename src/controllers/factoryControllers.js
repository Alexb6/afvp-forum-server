const { Role, sequelize } = require('./../models');
const { OK, CREATED, BAD_REQUEST, NO_CONTENT } = require('./../helpers/status_codes');
const AppError = require('./../utils/appError');

exports.createOne = Model => async (req, res) => {
   const t = await sequelize.transaction();
   try {
      if (Model.name === 'Donor') {
         const role = await Role.findOne({ where: { name: 'donator' } });
         req.body.role_id = role.id;
      }
      const datum = await Model.create(req.body, { transaction: t });
      res.status(CREATED).json({
         status: 'Success',
         data: { datum }
      });
      await t.commit();
   } catch (err) {
      res.status(BAD_REQUEST).json({
         status: 'Fail to create the data!',
         message: err.message
      });
      await t.rollback();
   }
}

exports.getOne = Model => async (req, res) => {
   try {
      if (Model.name === 'Member') req.query.is_active = true;
      const datum = await Model.findOne({
         where: { id: req.params.id }
      });
      res.status(OK).json({
         status: 'Success',
         data: { datum }
      });
   } catch (err) {
      res.status(BAD_REQUEST).json({
         status: 'Fail to get the datum!',
         message: err.message
      });
   }
}

exports.updateOne = Model => async (req, res) => {
   const t = await sequelize.transaction();
   try {
      await Model.update(
         req.body,
         { where: { id: req.params.id } },
         { transaction: t }
      );
      const newDatum = await Model.findByPk(req.params.id);
      res.status(OK).json({
         status: 'Success',
         data: { newDatum }
      });
      await t.commit();
   } catch (err) {
      res.status(BAD_REQUEST).json({
         status: 'Fail to update the datum!',
         message: err.message
      });
      await t.rollback();
   }
}

exports.deleteOne = Model => async (req, res) => {
   const t = await sequelize.transaction();
   try {
      await Model.destroy({
         where: { id: req.params.id }
      }, { transaction: t });
      res.status(NO_CONTENT).json({
         status: 'Success',
         data: null
      })
      await t.commit();
   } catch (err) {
      res.status(BAD_REQUEST).json({
         status: 'Fail to delete the datum!',
         message: err.message
      });
      await t.rollback();
   }
}

exports.getAll = Model => async (req, res) => {
   try {
      const myQuery = {};
      /* Fields to exclude from req.query & fields to include in the where clause */
      const queryString = JSON.parse(JSON.stringify(req.query));
      const excludeParamsKeys = ['page', 'limit', 'sort', 'fields'];
      excludeParamsKeys.forEach(key => delete queryString[key]);
      if (Model.name === 'Member') {
         queryString.is_active = true;
         myQuery.where = queryString;
      }
      /* Pagination with limit & page keys */
      const limit = parseInt(req.query.limit);
      const page = parseInt(req.query.page);
      const offset = (page - 1) * limit;
      if (req.query.limit) {
         myQuery.limit = limit;
      }
      if (req.query.limit && req.query.page) {
         myQuery.limit = limit;
         myQuery.offset = offset;
      }
      /* Sorting with sort key */
      const orderBy = [];
      if (req.query.sort) {
         const sortFields = req.query.sort.split(',');
         sortFields.forEach(field => {
            if (field.startsWith('-')) {
               const fieldToArray = [];
               fieldToArray.push(field.substring(1), 'DESC');
               orderBy.push(fieldToArray);
            } else {
               const fieldToArray = [];
               fieldToArray.push(field);
               orderBy.push(fieldToArray);
            };
         });
         myQuery.order = orderBy;
      }
      /* Selecting fields with fields key */
      const fields = [];
      if (req.query.fields) {
         const fieldsToArray = req.query.fields.split(',');
         fieldsToArray.forEach(field => fields.push(field));
         myQuery.attributes = fields;
      }
      /* Make the request with myQuery */
      const data = await Model.findAll(myQuery);
      res.status(OK).json({
         status: 'Success',
         results: data.length,
         data: { data }
      });
   } catch (err) {
      res.status(BAD_REQUEST).json({
         status: 'Fail to get the data!',
         message: err.message
      });
   }
}

exports.getMyProfile = fn => async (req, res) => {
   const user = await fn(req.user.id);

   res.status(OK).json({
      status: 'Success',
      data: { user }
   });
}

exports.updateMyProfile = Model => async (req, res, next) => {
   const t = await sequelize.transaction();
   try {
      if (req.body.password || req.body.pass_confirm) {
         return next(new AppError('This route is not for updating your password. Please use the dedicated "Change my password" option!', BAD_REQUEST));
      }
      
      let filteredReqBody = {};
      if (Model.name === 'Member') {
         const allowedFields = ['family_name', 'first_name', 'email', 'biography', 'address', 'country', 'title', 'speciality', 'hobby'];
         Object.keys(req.body).forEach(field => {
            if (allowedFields.includes(field)) filteredReqBody[field] = req.body[field];
         });
      }
      if (Model.name === 'Donor') {
         const allowedFields = ['family_name', 'first_name', 'email', 'address', 'country', 'firm'];
         Object.keys(req.body).forEach(field => {
            if (allowedFields.includes(field)) filteredReqBody[field] = req.body[field];
         });
      }
      
      await Model.update(
         filteredReqBody,
         { where: { id: req.user.id } },
         { transaction: t }
      );
      const updatedUser = await Model.findByPk(req.user.id);
      res.status(OK).json({
         status: 'Success',
         data: { updatedUser }
      });
      await t.commit();

   } catch (err) {
      res.status(BAD_REQUEST).json({
         status: 'Fail to update the member!',
         message: err.message
      });
      await t.rollback();
   }
}
