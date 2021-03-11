'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('blocks', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, unique: true, type: Sequelize.INTEGER },
      difficulty: { type: Sequelize.STRING },
      extra_data: { type: Sequelize.STRING },
      gas_limit: { type: Sequelize.INTEGER },
      gas_used: { type: Sequelize.INTEGER },
      hash: { type: Sequelize.STRING },
      miner: { type: Sequelize.STRING },
      mix_hash: { type: Sequelize.STRING },
      nonce: { type: Sequelize.STRING },
      parent_hash: { type: Sequelize.STRING },
      receipts_root: { type: Sequelize.STRING },
      sha3_uncles: { type: Sequelize.STRING },
      size: { type: Sequelize.INTEGER },
      state_root: { type: Sequelize.STRING },
      timestamp: { type: Sequelize.INTEGER },
      total_difficulty: { type: Sequelize.STRING },
      transactions_root: { type: Sequelize.STRING },
      uncles: { type: Sequelize.TEXT }
    }, {
      comment: 'Blocks'
    });

    await queryInterface.addIndex('blocks', ['hash']);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('blocks');
  }
};