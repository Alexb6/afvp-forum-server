'use strict';
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('Categories', {
			id: {
				allowNull: false,
				autoIncrement: false,
				primaryKey: true,
				type: Sequelize.UUID
			},
			name: {
				allowNull: false,
				type: Sequelize.STRING(100)
			},
			datetime: {
				allowNull: false,
				type: Sequelize.DATE
			},
			member_id: {
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
		await queryInterface.dropTable('Categories');
	}
};