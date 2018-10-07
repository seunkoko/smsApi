import { db } from '../models/';

module.exports = (sequelize, DataTypes) => {
  const Contact = sequelize.define('Contact', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
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

  Contact.associate = (db) => {
    Contact.hasMany(db.Sms, {
      as: 'sender',
      foreignKey: 'senderId'
    });
    Contact.hasMany(db.Sms, {
      as: 'receiver',
      foreignKey: 'receiverId'
    });
  } 
  return Contact;
};
