'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Posts, Tokens }) {
      this.hasMany(Tokens, {
        foreignKey: 'users_id',
        as: 'tokens',
        onDelete: 'CASCADE'
      });

      this.hasMany(Posts, {
        foreignKey: 'users_id',
        as: 'posts',
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
    first_name: {
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
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

  }, {
    sequelize,
    tableName: 'users',
    modelName: 'Users',
    timestamps: true,
    updatedAt: false,
  });

  Users.prototype.toJSON = function () {
    return {
      id: this.id,
      uuid: this.uuid,
      first_name: this.first_name,
      last_name: this.last_name,
      email: this.email,

    };
  };

  return Users;
};