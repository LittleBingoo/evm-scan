'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Address extends Model {
    static associate(models) {

    }
  };
  Address.init({
      hash: { type: DataTypes.STRING, allowNull: false, primaryKey: true, unique: true },
      fetched_coin_balance: { type: DataTypes.NUMERIC(100,0), defaultValue: 0 },
      fetched_coin_balance_block_number: {type: DataTypes.INTEGER, defaultValue: 0 },
      nonce: { type: DataTypes.INTEGER },
      decompiled: {type: DataTypes.BOOLEAN},
      verified: {type: DataTypes.BOOLEAN},
      contract_code: { type: DataTypes.TEXT, allowNull: true },
      created_at: { type: DataTypes.DATE },
      updated_at: { type: DataTypes.DATE },
  }, {
    sequelize,
    tableName: 'addresses',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return Address;
};