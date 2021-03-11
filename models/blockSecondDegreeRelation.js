'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BlockSecondDegreeRelation extends Model {
    static associate(models) {

    }
  };
  BlockSecondDegreeRelation.init({
      nephew_hash: { type: DataTypes.STRING, allowNull: false, primaryKey: true },
      uncle_hash: { type: DataTypes.STRING, allowNull: false },
      uncle_fetched_at: { type: DataTypes.INTEGER },
      index: { type: DataTypes.INTEGER },
  }, {
    sequelize,
    tableName: 'block_second_degree_relations',
    timestamps: false,
    indexes: [
      {
        name: 'uncle_hash',
        unique: false,
        method: 'BTREE',
        fields: ['uncle_hash']
      }
    ]
  });
  return BlockSecondDegreeRelation;
};