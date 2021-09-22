'use strict';
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('Donors', {
			id: {
				allowNull: false,
				autoIncrement: false,
				primaryKey: true,
				type: Sequelize.UUID
			},
			gender: {
				allowNull: false,
				type: Sequelize.ENUM('Mr', 'Mrs')
			},
			first_name: {
				allowNull: false,
				type: Sequelize.STRING(150)
			},
			family_name: {
				allowNull: false,
				type: Sequelize.STRING(150)
			},
			email: {
				allowNull: false,
				type: Sequelize.STRING(150)
			},
			password: {
				allowNull: false,
				type: Sequelize.STRING(255)
			},
			pass_confirm: {
				allowNull: false,
				type: Sequelize.STRING(255)
			},
			pass_changed_dt: {
				type: Sequelize.DATE
			},
			pass_reset_token: {
				type: Sequelize.STRING(255)
			},
			pass_reset_expired_dt: {
				type: Sequelize.DATE
			},
			photo_url: {
				type: Sequelize.STRING(255)
			},
			address01: {
				type: Sequelize.STRING(255)
			},
			address02: {
				type: Sequelize.STRING(255)
			},
			address03: {
				type: Sequelize.STRING(255)
			},
			country: {
				type: Sequelize.STRING(255)
			},
			firm: {
				type: Sequelize.STRING(150)
			},
			role_id: {
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
		await queryInterface.dropTable('Donors');
	}
};