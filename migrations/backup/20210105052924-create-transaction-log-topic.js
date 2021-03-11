'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('transaction_log_topics', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, unique: true, type: Sequelize.INTEGER },
      log_id: { type: Sequelize.STRING },
      address: { type: Sequelize.STRING },
      topic_index: { type: Sequelize.INTEGER },
      topic: { type: Sequelize.STRING },
    }, {
      comment: 'Transaction log topics'
    });

    await queryInterface.addIndex('transaction_log_topics', ['log_id']);
    await queryInterface.addIndex('transaction_log_topics', ['address']);
    await queryInterface.addIndex('transaction_log_topics', ['topic']);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('transaction_log_topics');
  }
};