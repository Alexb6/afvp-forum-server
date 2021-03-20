'use strict';
const {
	Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class Post extends Model {
		static associate(models) {
			this.belongsTo(models.Category, { foreignKey: 'category_id' });
			this.belongsTo(models.Member, { foreignKey: 'member_id' });
			this.belongsTo(models.Post, { foreignKey: 'parent_id' });
		}
	};
	Post.init({
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
		title: {
			allowNull: false,
			type: DataTypes.STRING,
			validate: {
				notNull: true,
				len: [3, 255]
			}
		},
		datetime: {
			allowNull: false,
			type: DataTypes.DATE,
			validate: {
				notNull: true
			}
		},
		updatetime: {
			allowNull: false,
			type: DataTypes.DATE,
			validate: {
				notNull: true
			}
		},
		body: {
			allowNull: false,
			type: DataTypes.TEXT('long'),
			validate: {
				notNull: true
			}
		},
		category_id: {
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
		parent_id: {
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
		modelName: 'Post',
		createdAt: 'created_at',
		updatedAt: 'updated_at'
	});
	return Post;
};