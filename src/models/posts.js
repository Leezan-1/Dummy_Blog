'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Posts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Posts_Images, Tags }) {
      this.hasMany(Posts_Images, {
        foreignKey: 'posts_id',
        as: 'images',
        allowNull: false,
        onDelete: 'CASCADE'
      },
        this.belongsToMany(Tags, {
          through: 'Posts_Tags',
          foreignKey: 'posts_id',
          as: 'tags',
          otherKey: 'tags_id',
        })
      );
      // define association here
    }
  }
  Posts.init({
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      unique: true,
    },
    title: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false,
    },
    excerpt: {
      type: DataTypes.TEXT('tiny'),
    },
    description: {
      type: DataTypes.TEXT,
    },
    view_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    }

  }, {
    sequelize,
    tableName: 'posts',
    modelName: 'Posts',
  });
  return Posts;
};