'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Posts_Images extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Posts }) {

      // define association here
    }
  }
  Posts_Images.init({
    img_name: { type: DataTypes.STRING },
    path: {
      type: DataTypes.STRING,
      allowNull: false,

    },
  }, {
    sequelize,
    tableName: 'posts_images',
    modelName: 'Posts_Images',
    timestamps: false,
  });
  return Posts_Images;
};