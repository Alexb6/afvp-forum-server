'use strict';
const {
	Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class PaymentType extends Model {
		static associate(models) {
			this.hasMany(models.Donation, { foreignKey: 'payment_id' });
		}
	};
	PaymentType.init({
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
		type: {
			allowNull: false,
			type: DataTypes.STRING,
			validate: {
				notNull: true
			}
		},
		created_at: {
			allowNull: false,
			type: DataTypes.DATE,
			validate: {
				notNull: true
			}
		},
		updated_at: {
			allowNull: false,
			type: DataTypes.DATE,
			validate: {
				notNull: true
			}
		}
	}, {
		sequelize,
		modelName: 'PaymentType',
		createdAt: 'created_at',
		updatedAt: 'updated_at'
	});
	return PaymentType;
};