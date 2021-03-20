'use strict';
const {
	Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Category extends Model {
		static associate(models) {
			this.belongsTo(models.Member, { foreignKey: 'member_id' });
			this.hasMany(models.Post, { foreignKey: 'category_id' });
		}
	};
	Category.init({
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
				len: [3, 100]
			}
		},
		datetime: {
			allowNull: false,
			type: DataTypes.DATE,
			validate: {
				notNull: true
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
		modelName: 'Category',
		createdAt: 'created_at',
		updatedAt: 'updated_at'
	});
	return Category;
};