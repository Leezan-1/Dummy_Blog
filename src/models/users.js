'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Posts }) {
      this.hasMany(Posts, {
        foreignKey: 'users_id',
        allowNull: false,
      })
      // define association here
    }
  }
  Users.init({
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      unique: true,

    },
    frist_name: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },

  }, {
    sequelize,
    tableName: 'users',
    modelName: 'Users',
    timestamps: true,
    updatedAt: false,
  });
  return Users;
};