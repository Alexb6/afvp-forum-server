'use strict';
const subscriptionTypes = require('./../seeds/subscription_types_seeds');

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.bulkInsert('SubscriptionTypes', subscriptionTypes, {});
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.bulkDelete('SubscriptionTypes', null, {});
	}
};
