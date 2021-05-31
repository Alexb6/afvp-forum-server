'use strict';

const slugify = require('slugify');
const slugify_options = require('./../helpers/slugify_options');

const {
	Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Donor extends Model {
		static associate(models) {
			this.hasMany(models.Donation, { foreignKey: 'donor_id' });
			this.belongsTo(models.Role, { foreignKey: 'role_id' });
		}
	};
	Donor.init({
		id: {
			allowNull: false,
			autoIncrement: false,
			primaryKey: true,
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			validate: {
				notNull: true,
				isUUID: 4
			}
		},
		gender: {
			allowNull: false,
			type: DataTypes.ENUM('Mr', 'Mrs')
		},
		first_name: {
			allowNull: false,
			type: DataTypes.STRING,
			validate: {
				notNull: true,
				len: [3, 255]
			}
		},
		family_name: {
			allowNull: false,
			type: DataTypes.STRING,
			validate: {
				notNull: true,
				len: [3, 255]
			}
		},
		email: {
			allowNull: false,
			type: DataTypes.STRING,
			validate: {
				notNull: true,
				len: [3, 255]
			}
		},
		password: {
			allowNull: false,
			type: DataTypes.STRING,
			validate: {
				notNull: true,
				len: [3, 255]
			}
		},
		pass_confirm: {
			allowNull: false,
			type: DataTypes.STRING,
			validate: {
				notNull: true,
				len: [3, 255]
			}
		},
		pass_changed_dt: {
			type: DataTypes.DATE
		},
		pass_reset_token: {
			type: DataTypes.STRING,
			validate: {
				len: [3, 255]
			}
		},
		pass_reset_expired_dt: {
			type: DataTypes.DATE,
			validate: {
				len: [3, 255]
			}
		},
		photo: {
			type: DataTypes.STRING
		},
		address: {
			type: DataTypes.STRING
		},
		country: {
			type: DataTypes.STRING
		},
		firm: {
			type: DataTypes.STRING
		},
		role_id: {
			allowNull: false,
			type: DataTypes.UUID,
			validate: {
				notNull: true,
				isUUID: 4
			}
		},
		created_at: {
			allowNull: false,
			type: DataTypes.DATE
		},
		updated_at: {
			allowNull: false,
			type: DataTypes.DATE
		},
		full_name_slug: {
			type: DataTypes.VIRTUAL,
			get() {
				const full_name = `${this.first_name} ${this.family_name}`;
				return slugify(full_name, slugify_options);
			}
		}
	}, {
		sequelize,
		modelName: 'Donor',
		createdAt: 'created_at',
		updatedAt: 'updated_at',
		defaultScope: {
			attributes: {
				exclude: [
					'password',
					'pass_confirm',
					'pass_reset_token',
					'pass_reset_expired_dt'
				]
			}
		},
		validate: {
			checkPassConfirm() {
				if (this.pass_confirm !== this.password) {
					throw new Error('The password confirm is not identical to the password!')
				}
			},
		}
	});
	/* Hooks */

	return Donor;
};