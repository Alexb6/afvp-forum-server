'use strict';
const {
	Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Donation extends Model {
		static associate(models) {
			this.belongsTo(models.Member, { foreignKey: 'member_id' });
			this.belongsTo(models.Donor, { foreignKey: 'donor_id' });
			this.belongsTo(models.PaymentType, { foreignKey: 'payment_id' });
		}
	};
	Donation.init({
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
		date: {
			allowNull: false,
			type: DataTypes.DATE,
			validate: {
				notNull: true
			}
		},
		amount: {
			allowNull: false,
			type: DataTypes.DECIMAL,
			validate: {
				notNull: true
			}
		},
		payment_id: {
			allowNull: false,
			type: DataTypes.UUID,
			validate: {
				notNull: true,
				isUUID: 4
			}
		},
		member_id: {
			allowNull: false,
			type: DataTypes.UUID,
			validate: {
				notNull: true,
				isUUID: 4
			}
		},
		donor_id: {
			allowNull: false,
			type: DataTypes.UUID,
			validate: {
				notNull: true,
				isUUID: 4
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
		modelName: 'Donation',
		createdAt: 'created_at',
		updatedAt: 'updated_at'
	});
	return Donation;
};