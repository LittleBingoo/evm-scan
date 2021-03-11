'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PendingBlockOperation extends Model {
    static associate(models) {

    }
  };
  PendingBlockOperation.init({
      block_hash: { type: DataTypes.STRING, allowNull: false, primaryKey: true },
      fetch_internal_transactions: {type: DataTypes.BOOLEAN},
      created_at: { type: DataTypes.DATE },
      updated_at: { type: DataTypes.DATE },
  }, {
    sequelize,
    tableName: 'pending_block_operations',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return PendingBlockOperation;
};