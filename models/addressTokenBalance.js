'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AddressTokenBalance extends Model {
    static associate(models) {

    }
  };
  AddressTokenBalance.init({
      id: { type: DataTypes.INTEGER, autoIncrement: true, allowNull: false, primaryKey: true, unique: true },
      address_hash: { type: DataTypes.STRING, allowNull: false },
      block_number: { type: DataTypes.INTEGER, allowNull: false },
      token_contract_address_hash: { type: DataTypes.STRING, allowNull: false },
      value: { type: DataTypes.NUMERIC(100,0) },
      value_fetched_at: { type: DataTypes.INTEGER },
      created_at: { type: DataTypes.DATE },
      updated_at: { type: DataTypes.DATE },
  }, {
    sequelize,
    tableName: 'address_token_balances',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return AddressTokenBalance;
};