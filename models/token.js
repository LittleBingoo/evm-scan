'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Token extends Model {
    static associate(models) {

    }
  };
  Token.init({
      contract_address_hash: { type: DataTypes.STRING, allowNull: false, primaryKey: true, unique: true },
      name: { type: DataTypes.STRING },
      symbol: { type: DataTypes.STRING },
      total_supply: { type: DataTypes.NUMERIC(100,0) },
      decimals: { type: DataTypes.NUMERIC(100,0) },
      type: { type: DataTypes.STRING },
      cataloged: {type: DataTypes.BOOLEAN},
      holder_count: { type: DataTypes.INTEGER },
      icon: { type: DataTypes.STRING },
      official: {type: DataTypes.BOOLEAN},
      created_at: { type: DataTypes.DATE },
      updated_at: { type: DataTypes.DATE },
  }, {
    sequelize,
    tableName: 'tokens',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return Token;
};