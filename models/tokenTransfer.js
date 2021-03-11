'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TokenTransfer extends Model {
    static associate(models) {

    }
  };
  TokenTransfer.init({
      transaction_hash: { type: DataTypes.STRING, allowNull: false, primaryKey: true},
      log_index: { type: DataTypes.INTEGER },
      block_hash: { type: DataTypes.STRING },
      from_address_hash: { type: DataTypes.STRING , allowNull: false },
      to_address_hash: { type: DataTypes.STRING , allowNull: false },
      amount: { type: DataTypes.NUMERIC(100, 0) },
      token_id: { type: DataTypes.NUMERIC(78, 0) },
      token_contract_address_hash: { type: DataTypes.STRING, allowNull: false },
      block_number: { type: DataTypes.INTEGER },
      created_at: { type: DataTypes.DATE },
      updated_at: { type: DataTypes.DATE }
  }, {
    sequelize,
    tableName: 'token_transfers',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        name: 'transaction_hash',
        unique: false,
        method: 'BTREE',
        fields: ['transaction_hash']
      },
      {
        name: 'log_index',
        unique: false,
        method: 'BTREE',
        fields: ['log_index']
      },{
        name: 'block_hash',
        unique: false,
        method: 'BTREE',
        fields: ['block_hash']
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
        name: 'token_contract_address_hash',
        unique: false,
        method: 'BTREE',
        fields: ['token_contract_address_hash']
      },{
        name: 'block_number',
        unique: false,
        method: 'BTREE',
        fields: ['block_number']
      }
    ]
  });
  return TokenTransfer;
};