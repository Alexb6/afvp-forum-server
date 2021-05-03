'use strict';
const subscriptionTypes = require('./../seeds/subscription_types_seeds');

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.bulkInsert('Subscriptions', subscriptionTypes, {});
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.bulkDelete('Subscriptions', null, {});
	}
};
