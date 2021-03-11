'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('transactions', {
      hash: { type: Sequelize.STRING, allowNull: false, primaryKey: true, unique: true },
      block_number: { type: Sequelize.INTEGER },
      transaction_index: { type: Sequelize.INTEGER },
      from: { type: Sequelize.STRING },
      to: { type: Sequelize.STRING },
      contract_address: { type: Sequelize.STRING },
      gas: { type: Sequelize.INTEGER },
      gas_price: { type: Sequelize.STRING },
      cumulative_gas_used: { type: Sequelize.INTEGER },
      nonce: { type: Sequelize.INTEGER },
      value: { type: Sequelize.STRING },
      status: { type: Sequelize.BOOLEAN },
      input: { type: Sequelize.TEXT },
    }, {
      comment: 'Transactions'
    });

    await queryInterface.addIndex('transactions', ['from']);
    await queryInterface.addIndex('transactions', ['to']);
    await queryInterface.addIndex('transactions', ['block_number']);
    await queryInterface.addIndex('transactions', ['contract_address']);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('transactions');
  }
};