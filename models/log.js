'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Log extends Model {
    static associate(models) {

    }
  };
  Log.init({
      index: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true},
      transaction_hash: { type: DataTypes.STRING, allowNull: false },
      block_hash: { type: DataTypes.STRING, allowNull: false },
      data: { type: DataTypes.TEXT },
      type: { type: DataTypes.STRING },
      first_topic: { type: DataTypes.STRING },
      second_topic: { type: DataTypes.STRING },
      third_topic: { type: DataTypes.STRING },
      fourth_topic: { type: DataTypes.STRING },
      address_hash: { type: DataTypes.STRING },
      block_number: { type: DataTypes.INTEGER },
      created_at: { type: DataTypes.DATE },
      updated_at: { type: DataTypes.DATE },
  }, {
    sequelize,
    tableName: 'logs',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        name: 'transaction_hash',
        unique: false,
        method: 'BTREE',
        fields: ['transaction_hash']
      },{
        name: 'block_hash',
        unique: false,
        method: 'BTREE',
        fields: ['block_hash']
      },{
        name: 'address_hash',
        unique: false,
        method: 'BTREE',
        fields: ['address_hash']
      },{
        name: 'block_number',
        unique: false,
        method: 'BTREE',
        fields: ['block_number']
      },{
        name: 'first_topic',
        unique: false,
        method: 'BTREE',
        fields: ['first_topic']
      },{
        name: 'second_topic',
        unique: false,
        method: 'BTREE',
        fields: ['second_topic']
      },{
        name: 'third_topic',
        unique: false,
        method: 'BTREE',
        fields: ['third_topic']
      },{
        name: 'fourth_topic',
        unique: false,
        method: 'BTREE',
        fields: ['fourth_topic']
      }
    ]
  });
  return Log;
};