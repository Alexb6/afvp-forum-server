'use strict';

const slugify = require('slugify');
const slugify_options = require('./../helpers/slugify_options');
const bcrypt = require('bcrypt');

const {
	Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Member extends Model {
		static associate(models) {
			this.belongsTo(models.Role, { foreignKey: 'role_id' });
			this.belongsTo(models.Subscription, { foreignKey: 'subscription_id' });
			this.hasMany(models.Category, { foreignKey: 'member_id' });
			this.hasMany(models.Post, { foreignKey: 'member_id' });
			this.hasMany(models.Donation, { foreignKey: 'member_id' });
		}
	};
	Member.init({
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
				len: [3, 150]
			}
		},
		family_name: {
			allowNull: false,
			type: DataTypes.STRING,
			validate: {
				notNull: true,
				len: [3, 150]
			}
		},
		email: {
			allowNull: false,
			type: DataTypes.STRING,
			validate: {
				notNull: true,
				len: [3, 150]
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
			type: DataTypes.STRING
		},
		pass_reset_expired_dt: {
			type: DataTypes.DATE
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
		title: {
			type: DataTypes.STRING
		},
		speciality: {
			type: DataTypes.STRING
		},
		biography: {
			type: DataTypes.STRING
		},
		hobby: {
			type: DataTypes.STRING
		},
		subscription_dt: {
			type: DataTypes.DATE
		},
		active_dt: {
			type: DataTypes.DATE
		},
		is_active: {
			type: DataTypes.BOOLEAN,
			defaultValue: true
		},
		status: {
			type: DataTypes.ENUM('tovalidate', 'inregistration', 'registered', 'rejected'),
			defaultValue: 'tovalidate'
		},
		donor: {
			type: DataTypes.BOOLEAN
		},
		role_id: {
			type: DataTypes.UUID,
			validate: {
				isUUID: 4
			}
		},
		subscription_id: {
			type: DataTypes.UUID,
			validate: {
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
		deleted_at: {
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
		modelName: 'Member',
		createdAt: 'created_at',
		updatedAt: 'updated_at',
		deletedAt: 'deleted_at',
		defaultScope: {
			attributes: {
				exclude: [
					'password',
					'pass_confirm',
					'pass_changed_dt',
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
	Member.beforeValidate(async (member, next) => {
		if (!member.changed('password')) return next();
		member.password = await bcrypt.hash(member.password, 12);
		member.pass_confirm = member.password;
	});

	return Member;
};

// const bcrypt = require('bcrypt');
// var userSchema = sequelize.define("users", {
// 	userId: {
// 		field: 'user_id',
// 		autoIncrement: true,
// 		primaryKey: true,
// 		type: Sequelize.INTEGER
// 	},
// 	password: {
// 		field: 'user_password',
// 		type: Sequelize.STRING,
// 		allowNull: true
// 	},
// 	name: {
// 		type: Sequelize.STRING,
// 		field: 'user_name',
// 		allowNull: false
// 	},
// 	email: {
// 		type: Sequelize.STRING,
// 		field: 'user_email',
// 		allowNull: false
// 	},
// },
// 	{
// 		hooks: {
// 			beforeCreate: async (user) => {
// 				if (user.password) {
// 					const salt = await bcrypt.genSaltSync(10, 'a');
// 					user.password = bcrypt.hashSync(user.password, salt);
// 				}
// 			},
// 			beforeUpdate: async (user) => {
// 				if (user.password) {
// 					const salt = await bcrypt.genSaltSync(10, 'a');
// 					user.password = bcrypt.hashSync(user.password, salt);
// 				}
// 			}
// 		},
// 		instanceMethods: {
// 			validPassword: (password) => {
// 				return bcrypt.compareSync(password, this.password);
// 			}
// 		}
// 	}
// );
// userSchema.prototype.validPassword = async (password, hash) => {
// 	return await bcrypt.compareSync(password, hash);
// }
// return userSchema;
