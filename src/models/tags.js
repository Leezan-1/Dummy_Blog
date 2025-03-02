'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tags extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Posts }) {
      this.belongsToMany(Posts, {
        through: 'Posts_Tags',
        as: 'posts',
        foreignKey: 'tags_id',
        otherKey: 'posts_id',
      });
      // define association here
    }
  }
  Tags.init({
    name: { type: DataTypes.STRING(15) }

  }, {
    sequelize,
    tableName: 'tags',
    modelName: 'Tags',
    timestamps: false,
  });
  return Tags;
};