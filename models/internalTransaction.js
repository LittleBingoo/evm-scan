'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class InternalTransaction extends Model {
    static associate(models) {

    }
  };
  InternalTransaction.init({
      block_hash: { type: DataTypes.STRING, allowNull: false, primaryKey: true},
      block_index: { type: DataTypes.STRING, allowNull: false},
      call_type: { type: DataTypes.STRING },
      created_contract_code: { type: DataTypes.TEXT, allowNull: true },
      error: { type: DataTypes.STRING },
      gas: { type: DataTypes.NUMERIC(100, 0) },
      gas_used: { type: DataTypes.NUMERIC(100, 0) },
      index: { type: DataTypes.INTEGER },
      init: { type: DataTypes.TEXT },
      input: { type: DataTypes.TEXT },
      output: { type: DataTypes.TEXT },
      trace_address: { type: DataTypes.INTEGER },
      type: { type: DataTypes.STRING },
      value: { type: DataTypes.NUMERIC(100, 0) },
      created_contract_address_hash: { type: DataTypes.STRING, allowNull: true },
      from_address_hash: { type: DataTypes.STRING },
      to_address_hash: { type: DataTypes.STRING },
      transaction_hash: { type: DataTypes.STRING },
      block_number: { type: DataTypes.INTEGER },
      transaction_index: { type: DataTypes.INTEGER },
      created_at: { type: DataTypes.DATE },
      updated_at: { type: DataTypes.DATE },
  }, {
    sequelize,
    tableName: 'internal_transactions',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        name: 'block_index',
        unique: false,
        method: 'BTREE',
        fields: ['block_index']
      },{
        name: 'from_address_hash',
        unique: false,
        method: 'BTREE',
        fields: ['from_address_hash']
      },{
        name: 'to_address_hash',
        unique: false,
        method: 'BTREE',
        fields: ['to_address_hash']
      },{
        name: 'transaction_hash',
        unique: false,
        method: 'BTREE',
        fields: ['transaction_hash']
      },{
        name: 'block_number',
        unique: false,
        method: 'BTREE',
        fields: ['block_number']
      }
    ]
  });
  return InternalTransaction;
};