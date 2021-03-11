'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TokenInstance extends Model {
    static associate(models) {

    }
  };
  TokenInstance.init({
      token_contract_address_hash: { type: DataTypes.STRING, allowNull: false, primaryKey: true, unique: true },
      token_id: { type: DataTypes.NUMERIC(100,0), allowNull: false },
      metadata: { type: DataTypes.JSONB, allowNull: true },
      error: { type: DataTypes.STRING },
      created_at: { type: DataTypes.DATE },
      updated_at: { type: DataTypes.DATE },
  }, {
    sequelize,
    tableName: 'token_instances',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return TokenInstance;
};