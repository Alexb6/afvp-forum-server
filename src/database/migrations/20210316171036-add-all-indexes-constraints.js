'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		try {
			await queryInterface.sequelize.transaction(async t => {
				await queryInterface.addIndex('members', {
					fields: ['first_name', 'family_name'],
					name: 'memb_name_idx',
					transaction: t
				});
				await queryInterface.addIndex('members', {
					fields: ['email'],
					name: 'memb_email_idx',
					transaction: t
				});
				await queryInterface.addIndex('donors', {
					fields: ['first_name', 'family_name'],
					name: 'dono_name_idx',
					transaction: t
				});
				await queryInterface.addIndex('donors', {
					fields: ['email'],
					name: 'dono_email_idx',
					transaction: t
				});
				await queryInterface.addIndex('categories', {
					fields: ['name'],
					name: 'cate_name_idx',
					transaction: t
				});
				await queryInterface.addIndex('posts', {
					fields: ['title'],
					name: 'post_title_idx',
					transaction: t
				});
				await queryInterface.addIndex('posts', {
					fields: ['datetime'],
					name: 'post_datetime_idx',
					transaction: t
				});
			});
		} catch (err) {
			console.log('Transaction has been rolled back!');
		}
	},

	down: async (queryInterface, Sequelize) => {
		try {
			await queryInterface.sequelize.transaction(async t => {
				await queryInterface.removeIndex('members', 'memb_name_idx', { transaction: t });
				await queryInterface.removeIndex('members', 'memb_email_idx', { transaction: t });
				await queryInterface.removeIndex('donors', 'dono_name_idx', { transaction: t });
				await queryInterface.removeIndex('donors', 'dono_email_idx', { transaction: t });
				await queryInterface.removeIndex('categories', 'cate_name_idx', { transaction: t });
				await queryInterface.removeIndex('posts', 'post_title_idx', { transaction: t });
				await queryInterface.removeIndex('posts', 'post_datetime_idx', { transaction: t });
			});
		} catch (err) {
			console.log('Transaction has been rolled back!');
		}
	}
};
