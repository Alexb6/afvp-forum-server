'use strict';
module.exports = {
   up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable('Donations', {
         id: {
            allowNull: false,
            autoIncrement: false,
            primaryKey: true,
            type: Sequelize.UUID
         },
         date: {
            allowNull: false,
            type: Sequelize.DATE
         },
         amount: {
            allowNull: false,
            type: Sequelize.DECIMAL(10, 2)
         },
         payment_id: {
            type: Sequelize.UUID
         },
         donor_id: {
            type: Sequelize.UUID
         },
         created_at: {
            allowNull: false,
            type: Sequelize.DATE
         },
         updated_at: {
            allowNull: false,
            type: Sequelize.DATE
         }
      });
   },
   down: async (queryInterface, Sequelize) => {
      await queryInterface.dropTable('Donations');
   }
};