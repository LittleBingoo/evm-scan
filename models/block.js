'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Block extends Model {
    static associate(models) {

    }
  };
  Block.init({
      hash: { type: DataTypes.STRING, allowNull: false, primaryKey: true, unique: true},
      consensus: {type: DataTypes.BOOLEAN},
      difficulty: { type: DataTypes.NUMERIC(50,0) },
      gas_limit: { type: DataTypes.NUMERIC(100, 0) },
      gas_used: { type: DataTypes.NUMERIC(100, 0) },
      miner_hash: { type: DataTypes.STRING },
      nonce: { type: DataTypes.STRING },
      number: { type: DataTypes.INTEGER },
      parent_hash: { type: DataTypes.STRING },
      size: { type: DataTypes.INTEGER },
      timestamp: { type: DataTypes.INTEGER },
      total_difficulty: { type: DataTypes.NUMERIC(50,0) },
      created_at: { type: DataTypes.DATE },
      updated_at: { type: DataTypes.DATE },
  }, {
    sequelize,
    tableName: 'blocks',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        name: 'number',
        unique: true,
        method: 'BTREE',
        fields: ['number']
      }
    ]
  });
  return Block;
};