const { Member, sequelize } = require('./../models');
const { OK, CREATED, BAD_REQUEST, NO_CONTENT } = require('./../helpers/status_codes');
const factoryControllers = require('./factoryControllers');
const authControllers = require('./authControllers');

exports.signUpMember = authControllers.signUpOne(Member);

exports.getMember = factoryControllers.getOne(Member);

exports.updateMember = factoryControllers.updateOne(Member);

exports.deleteMember = factoryControllers.deleteOne(Member);

exports.getAllMember = factoryControllers.getAll(Member);

exports.deactivateMember = async (req, res) => {
   const t = await sequelize.transaction();
   try {
      await Member.update(
         { is_active: false, deleted_at: new Date() },
         { where: { id: req.params.id } },
         { transaction: t }
      );
      res.status(OK).json({
         status: 'Success',
         data: null
      });
      await t.commit();
   } catch (err) {
      res.status(BAD_REQUEST).json({
         status: 'Fail to deactivate the member!',
         message: err
      });
      await t.rollback();
   }
}

exports.restoreMember = async (req, res) => {
   const t = await sequelize.transaction();
   try {
      await Member.update(
         { is_active: true, deleted_at: null },
         { where: { id: req.params.id } },
         { transaction: t }
      );
      const member = await Member.findByPk(req.params.id);
      res.status(OK).json({
         status: 'Success',
         data: { member }
      });
      await t.commit();
   } catch (err) {
      res.status(BAD_REQUEST).json({
         status: 'Fail to restore the member!',
         message: err
      });
      await t.rollback();
   }
}




