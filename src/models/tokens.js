'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tokens extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Users }) {
      // define association here
      this.belongsTo(Users, {
        foreignKey: 'users_id'
      })
    }
  }
  Tokens.init({
    jti: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      unique: true,
    },
    refresh_token: {
      type: DataTypes.STRING(500),
      allowNull: false,
      unique: true,
    },
    refresh_tokens_expiry: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    users_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    access_token: {
      type: DataTypes.STRING(500),
      allowNull: false,
      unique: true,
    }

  }, {
    sequelize,
    tableName: 'tokens',
    modelName: 'Tokens',
    timestamps: false,
  });
  return Tokens;
};