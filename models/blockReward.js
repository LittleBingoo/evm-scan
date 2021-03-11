'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BlockReward extends Model {
    static associate(models) {

    }
  };
  BlockReward.init({
      address_hash: { type: DataTypes.STRING, allowNull: false, primaryKey: true },
      address_type: { type: DataTypes.STRING, allowNull: false },
      block_hash: { type: DataTypes.STRING, allowNull: false },
      reward: { type: DataTypes.NUMERIC(100,0) },
      created_at: { type: DataTypes.DATE },
      updated_at: { type: DataTypes.DATE },
  }, {
    sequelize,
    tableName: 'block_rewards',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        name: 'block_hash',
        unique: false,
        method: 'BTREE',
        fields: ['block_hash']
      }
    ]
  });
  return BlockReward;
};