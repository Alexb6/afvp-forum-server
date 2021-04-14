'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		try {
			await queryInterface.sequelize.transaction(async t => {
				await queryInterface.addConstraint('members', {
					fields: ['role_id'],
					type: 'foreign key',
					name: 'fk_memb_roles_id_idx',
					references: { table: 'roles', field: 'id' },
					onUpdate: 'CASCADE',
					onDelete: 'SET NULL',
					transaction: t
				});
				await queryInterface.addConstraint('members', {
					fields: ['subscription_id'],
					type: 'foreign key',
					name: 'fk_memb_subscriptions_id_idx',
					references: { table: 'subscriptions', field: 'id' },
					onUpdate: 'CASCADE',
					onDelete: 'SET NULL',
					transaction: t
				});
				await queryInterface.addConstraint('categories', {
					fields: ['member_id'],
					type: 'foreign key',
					name: 'fk_cate_members_id_idx',
					references: { table: 'members', field: 'id' },
					onUpdate: 'CASCADE',
					onDelete: 'SET NULL',
					transaction: t
				});
				await queryInterface.addConstraint('posts', {
					fields: ['member_id'],
					type: 'foreign key',
					name: 'fk_post_members_id_idx',
					references: { table: 'members', field: 'id' },
					onUpdate: 'CASCADE',
					onDelete: 'CASCADE',
					transaction: t
				});
				await queryInterface.addConstraint('posts', {
					fields: ['category_id'],
					type: 'foreign key',
					name: 'fk_post_categories_id_idx',
					references: { table: 'categories', field: 'id' },
					onUpdate: 'CASCADE',
					onDelete: 'SET NULL',
					transaction: t
				});
				await queryInterface.addConstraint('posts', {
					fields: ['parent_id'],
					type: 'foreign key',
					name: 'fk_post_posts_id_idx',
					references: { table: 'posts', field: 'id' },
					onUpdate: 'CASCADE',
					onDelete: 'CASCADE',
					transaction: t
				});
				await queryInterface.addConstraint('donations', {
					fields: ['payment_id'],
					type: 'foreign key',
					name: 'fk_dona_paymenttypes_id_idx',
					references: { table: 'paymenttypes', field: 'id' },
					onUpdate: 'CASCADE',
					onDelete: 'CASCADE',
					transaction: t
				});
				await queryInterface.addConstraint('donations', {
					fields: ['donor_id'],
					type: 'foreign key',
					name: 'fk_dona_donors_id_idx',
					references: { table: 'donors', field: 'id' },
					onUpdate: 'CASCADE',
					onDelete: 'CASCADE',
					transaction: t
				});
				await queryInterface.addConstraint('donations', {
					fields: ['donor_id'],
					type: 'foreign key',
					name: 'fk_dona_members_id_idx',
					references: { table: 'members', field: 'id' },
					onUpdate: 'CASCADE',
					onDelete: 'CASCADE',
					transaction: t
				});
				await queryInterface.addConstraint('donors', {
					fields: ['role_id'],
					type: 'foreign key',
					name: 'fk_dono_roles_id_idx',
					references: { table: 'roles', field: 'id' },
					onUpdate: 'CASCADE',
					onDelete: 'SET NULL',
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
				await queryInterface.removeConstraint('members', 'fk_memb_roles_id_idx');
				await queryInterface.removeConstraint('members', 'fk_memb_subscriptions_id_idx');
				await queryInterface.removeConstraint('categories', 'fk_cate_members_id_idx');
				await queryInterface.removeConstraint('posts', 'fk_post_members_id_idx');
				await queryInterface.removeConstraint('posts', 'fk_post_categories_id_idx');
				await queryInterface.removeConstraint('posts', 'fk_post_posts_id_idx');
				await queryInterface.removeConstraint('donations', 'fk_dona_paymenttypes_id_idx');
				await queryInterface.removeConstraint('donations', 'fk_dona_donors_id_idx');
				await queryInterface.removeConstraint('donations', 'fk_dona_members_id_idx');
				await queryInterface.removeConstraint('donors', 'fk_dono_roles_id_idx');
			});
		} catch (err) {
			console.log('Transaction has been rolled back!');
		}
	}
};
