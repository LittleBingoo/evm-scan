'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    static associate(models) {

    }
  };
  Transaction.init({
      hash: { type: DataTypes.STRING, allowNull: false, primaryKey: true, unique: true},
      cumulative_gas_used: { type: DataTypes.NUMERIC(100, 0) },
      error: { type: DataTypes.STRING },
      gas: { type: DataTypes.NUMERIC(100, 0) },
      gas_price: { type: DataTypes.NUMERIC(100, 0) },
      gas_used: { type: DataTypes.NUMERIC(100, 0) },
      index: { type: DataTypes.INTEGER },
      input: { type: DataTypes.TEXT },
      nonce: { type: DataTypes.INTEGER },
      status: { type: DataTypes.INTEGER },
      r: { type: DataTypes.NUMERIC(100, 0) },
      s: { type: DataTypes.NUMERIC(100, 0) },
      v: { type: DataTypes.NUMERIC(100, 0) },
      value: { type: DataTypes.NUMERIC(100, 0) },
      block_hash: { type: DataTypes.STRING },
      block_number: { type: DataTypes.INTEGER },
      from_address_hash: { type: DataTypes.STRING },
      to_address_hash: { type: DataTypes.STRING },
      created_contract_address_hash: { type: DataTypes.STRING, allowNull: true },
      created_contract_code_indexed_at: { type: DataTypes.INTEGER },
      earliest_processing_start: { type: DataTypes.INTEGER },
      old_block_hash: { type: DataTypes.STRING },
      revert_reason: { type: DataTypes.TEXT },
      created_at: { type: DataTypes.DATE },
      updated_at: { type: DataTypes.DATE },
  }, {
    sequelize,
    tableName: 'transactions',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        name: 'block_hash',
        unique: false,
        method: 'BTREE',
        fields: ['block_hash']
      },{
        name: 'block_number',
        unique: false,
        method: 'BTREE',
        fields: ['block_number']
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
      }
    ]
  });
  return Transaction;
};