'use strict';
const roles = require('./../seeds/roles_seeds');

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.bulkInsert('Roles', roles, {});
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.bulkDelete('Roles', null, {});
	}
};
