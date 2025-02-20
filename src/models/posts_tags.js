'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Posts_Tags extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {

      // define association here
    }
  }
  Posts_Tags.init({

  }, {
    sequelize,
    tableName: 'posts_tags',
    modelName: 'Posts_Tags',
    timestamps: false,
  });
  return Posts_Tags;
};