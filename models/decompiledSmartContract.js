'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DecompiledSmartContract extends Model {
    static associate(models) {

    }
  };
  DecompiledSmartContract.init({
      id: { type: DataTypes.INTEGER, autoIncrement: true, allowNull: false, primaryKey: true, unique: true },
      decompiler_version: { type: DataTypes.STRING },
      decompiled_source_code: { type: DataTypes.TEXT, allowNull: false },
      address_hash: { type: DataTypes.STRING },
      created_at: { type: DataTypes.DATE },
      updated_at: { type: DataTypes.DATE },
  }, {
    sequelize,
    tableName: 'decompiled_smart_contracts',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        name: 'address_hash',
        unique: true,
        method: 'BTREE',
        fields: ['address_hash']
      }
    ]
  });
  return DecompiledSmartContract;
};