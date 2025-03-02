'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RefreshTokens extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
    }
  }
  RefreshTokens.init({
    token: {
      type: DataTypes.STRING(500),
      allowNull: false,
      unique: true,
    },
    expiry: {
      type: DataTypes.BIGINT,
      allowNull: false,
    }
  }, {
    sequelize,
    tableName: 'refresh_tokens',
    modelName: 'RefreshTokens',
    timestamps: false
  });
  return RefreshTokens;
};