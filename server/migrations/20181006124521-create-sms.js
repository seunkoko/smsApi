'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Sms', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      senderId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Contacts',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      receiverId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Contacts',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'set null'
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      smsStatus: {
        type: Sequelize.ENUM,
        values: ['pending', 'delivered'],
        defaultValue: 'pending'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Sms');
  }
};
