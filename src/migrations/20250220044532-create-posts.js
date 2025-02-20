'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Posts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
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
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    },
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Posts');
  }
};