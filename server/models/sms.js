import { db } from '../models/';

module.exports = (sequelize, DataTypes) => {
  const Sms = sequelize.define('Sms', {
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    receiverId: {
      type: DataTypes.INTEGER,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    smsStatus: {
      type: DataTypes.ENUM,
      values: ['pending', 'delivered'],
      defaultValue: 'pending',
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  });

  Sms.associate = (db) => {
    Sms.belongsTo(db.Contact, { foreignKey: 'senderId' });
    Sms.belongsTo(db.Contact, { foreignKey: 'receiverId' });
  } 
  return Sms;
};
