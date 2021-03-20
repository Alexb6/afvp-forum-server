'use strict';
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
			this.belongsTo(models.Donation, { foreignKey: 'donor_id' });
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
		fullname_slug: {
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
		title: {
			type: DataTypes.STRING
		},
		speciality: {
			type: DataTypes.STRING
		},
		hobby: {
			type: DataTypes.TEXT
		},
		subscription_dt: {
			type: DataTypes.DATE,
		},
		active_dt: {
			type: DataTypes.DATE,
		},
		donor: {
			type: DataTypes.BOOLEAN
		},
		role_id: {
			allowNull: false,
			type: DataTypes.UUID,
			validate: {
				notNull: true,
				isUUID: 4
			}
		},
		subscription_id: {
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
		}
	}, {
		sequelize,
		modelName: 'Member',
		createdAt: 'created_at',
		updatedAt: 'updated_at'
	});
	return Member;
};