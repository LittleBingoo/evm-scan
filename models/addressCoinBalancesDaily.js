'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AddressCoinBalancesDaily extends Model {
    static associate(models) {

    }
  };
  AddressCoinBalancesDaily.init({
      address_hash: { type: DataTypes.STRING, allowNull: false, primaryKey: true},
      day: { type: DataTypes.DATE, allowNull: false },
      value: { type: DataTypes.NUMERIC(100,0), defaultValue: 0 },
      created_at: { type: DataTypes.DATE },
      updated_at: { type: DataTypes.DATE },
  }, {
    sequelize,
    tableName: 'address_coin_balances_daily',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return AddressCoinBalancesDaily;
};