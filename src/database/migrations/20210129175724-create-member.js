'use strict';
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('Members', {
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
			email_verified: {
				type: Sequelize.BOOLEAN
			},
			email_verification_token: {
				type: Sequelize.STRING(255),
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
			title: {
				type: Sequelize.STRING(150)
			},
			speciality: {
				type: Sequelize.STRING(255)
			},
			biography: {
				type: Sequelize.TEXT('medium')
			},
			hobby: {
				type: Sequelize.TEXT('medium')
			},
			subscription_dt: {
				type: Sequelize.DATE,
				comment: 'Membership payment date'
			},
			active_dt: {
				type: Sequelize.DATE,
				comment: 'Membership active limit date'
			},
			is_active: {
				type: Sequelize.BOOLEAN,
				comment: 'Membership active status'
			},
			status: {
				type: Sequelize.ENUM('tovalidate', 'inregistration', 'registered', 'rejected'),
				comment: 'Statuses for the membership application process'
			},
			donor: {
				type: Sequelize.BOOLEAN
			},
			board_member: {
				type: Sequelize.BOOLEAN
			},
			role_id: {
				type: Sequelize.UUID
			},
			subscriptiontype_id: {
				type: Sequelize.UUID
			},
			created_at: {
				allowNull: false,
				type: Sequelize.DATE
			},
			updated_at: {
				allowNull: false,
				type: Sequelize.DATE
			},
			deactivated_at: {
				type: Sequelize.DATE,
				comment: 'Member deactivation date'
			}
		});
	},
	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable('Members');
	}
};