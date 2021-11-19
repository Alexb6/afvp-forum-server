'use strict';
const {
	Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class SubscriptionType extends Model {
		static associate(models) {
			this.hasMany(models.Member, { foreignKey: 'subscriptiontype_id' });
			this.hasMany(models.Subscription, { foreignKey: 'subscriptiontype_id' });
		}
	};
	SubscriptionType.init({
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
		name: {
			allowNull: false,
			type: DataTypes.STRING,
			validate: {
				notNull: true,
				len: [3, 45]
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
		modelName: 'SubscriptionType',
		createdAt: 'created_at',
		updatedAt: 'updated_at'
	});
	return SubscriptionType;
};