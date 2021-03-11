'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SmartContract extends Model {
    static associate(models) {

    }
  };
  SmartContract.init({
      id: { type: DataTypes.INTEGER, autoIncrement: true, allowNull: false, primaryKey: true, unique: true },
      name: { type: DataTypes.STRING },
      compiler_version: { type: DataTypes.STRING },
      optimization: {type: DataTypes.BOOLEAN},
      contract_source_code: { type: DataTypes.TEXT, allowNull: true },
      abi: { type: DataTypes.JSONB, allowNull: true },
      address_hash: { type: DataTypes.STRING },
      constructor_arguments: { type: DataTypes.TEXT, allowNull: true },
      optimization_runs: { type: DataTypes.INTEGER },
      evm_version: { type: DataTypes.STRING },
      external_libraries: { type: DataTypes.JSONB, allowNull: true },
      created_at: { type: DataTypes.DATE },
      updated_at: { type: DataTypes.DATE },
  }, {
    sequelize,
    tableName: 'smart_contracts',
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
  return SmartContract;
};