'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('transaction_logs', {
      id: { type: Sequelize.STRING, allowNull: false, primaryKey: true, unique: true },
      address: { type: Sequelize.STRING },
      transaction_hash: { type: Sequelize.STRING },
      transaction_index: { type: Sequelize.INTEGER },
      block_number: { type: Sequelize.INTEGER },
      log_index: { type: Sequelize.INTEGER },
      removed: { type: Sequelize.BOOLEAN },
      data: { type: Sequelize.TEXT },
    }, {
      comment: 'Transaction log'
    });

    await queryInterface.addIndex('transaction_logs', ['address']);
    await queryInterface.addIndex('transaction_logs', ['transaction_hash']);
    await queryInterface.addIndex('transaction_logs', ['block_number']);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('transaction_logs');
  }
};