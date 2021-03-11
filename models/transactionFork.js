'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TransactionFork extends Model {
    static associate(models) {

    }
  };
  TransactionFork.init({
      index: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true},
      uncle_hash: { type: DataTypes.STRING, allowNull: false },
      hash: { type: DataTypes.STRING, allowNull: false },
      created_at: { type: DataTypes.DATE },
      updated_at: { type: DataTypes.DATE },
  }, {
    sequelize,
    tableName: 'transaction_forks',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        name: 'uncle_hash',
        unique: false,
        method: 'BTREE',
        fields: ['uncle_hash']
      }
    ]
  });
  return TransactionFork;
};