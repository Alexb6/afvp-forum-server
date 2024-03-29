'use strict';
const {
	Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Subscription extends Model {
		static associate(models) {
			this.belongsTo(models.Member, { foreignKey: 'member_id' });
			this.belongsTo(models.SubscriptionType, { foreignKey: 'subscriptiontype_id' });
			// this.hasMany(models.Member, { foreignKey: 'subscriptiontype_id' });
		}
	};
	Subscription.init({
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
		member_id: {
			allowNull: false,
			type: DataTypes.UUID,
			validate: {
				isUUID: 4
			}
		},
		subscriptiontype_id: {
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
		}
	}, {
		sequelize,
		modelName: 'Subscription',
		createdAt: 'created_at',
		updatedAt: 'updated_at'
	});
	return Subscription;
};