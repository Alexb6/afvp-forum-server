'use strict';
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('Posts', {
			id: {
				allowNull: false,
				autoIncrement: false,
				primaryKey: true,
				type: Sequelize.UUID
			},
			title: {
				allowNull: false,
				type: Sequelize.STRING(255)
			},
			datetime: {
				allowNull: false,
				type: Sequelize.DATE
			},
			updatetime: {
				type: Sequelize.DATE
			},
			body: {
				allowNull: false,
				type: Sequelize.TEXT('long')
			},
			category_id: {
				type: Sequelize.UUID
			},
			member_id: {
				type: Sequelize.UUID
			},
			parent_id: {
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
		await queryInterface.dropTable('Posts');
	}
};