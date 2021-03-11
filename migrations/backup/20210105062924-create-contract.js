'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('contracts', {
      address: { type: Sequelize.STRING, allowNull: false, primaryKey: true, unique: true },
      creator: { type: Sequelize.STRING },
      label: { type: Sequelize.STRING },
      code: { type: Sequelize.TEXT },
      compatible_abi: { type: Sequelize.STRING },
      custom_abi: { type: Sequelize.TEXT },
      created_at: { allowNull: false, type: Sequelize.DATE },
      updated_at: { allowNull: false, type: Sequelize.DATE }
    }, {
      comment: 'Contracts'
    });

    await queryInterface.addIndex('contracts', ['creator']);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('contracts');
  }
};