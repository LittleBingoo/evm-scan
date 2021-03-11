'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {

    /* Blocks */

    /**
     * Block
     */
    await queryInterface.createTable('blocks', {
      hash: { type: Sequelize.STRING, allowNull: false, primaryKey: true, unique: true},
      consensus: {type: Sequelize.BOOLEAN},
      difficulty: { type: Sequelize.NUMERIC(50,0) },
      gas_limit: { type: Sequelize.NUMERIC(100, 0) },
      gas_used: { type: Sequelize.NUMERIC(100, 0) },
      miner_hash: { type: Sequelize.STRING },
      nonce: { type: Sequelize.STRING },
      number: { type: Sequelize.INTEGER },
      parent_hash: { type: Sequelize.STRING },
      size: { type: Sequelize.INTEGER },
      timestamp: { type: Sequelize.INTEGER },
      total_difficulty: { type: Sequelize.NUMERIC(50,0) },
      created_at: { type: Sequelize.DATE },
      updated_at: { type: Sequelize.DATE },
    }, {
      comment: 'Blocks'
    });

    await queryInterface.addIndex('blocks', ['number']);


    /**
     * Block Rewards
     */
    await queryInterface.createTable('block_rewards', {
      address_hash: { type: Sequelize.STRING, allowNull: false, primaryKey: true },
      address_type: { type: Sequelize.STRING, allowNull: false },
      block_hash: { type: Sequelize.STRING, allowNull: false },
      reward: { type: Sequelize.NUMERIC(100,0) },
      created_at: { type: Sequelize.DATE },
      updated_at: { type: Sequelize.DATE },
    }, {
      comment: 'Block Rewards'
    });

    await queryInterface.addIndex('block_rewards', ['block_hash']);



    /**
     * Block second degree relations
     */
    await queryInterface.createTable('block_second_degree_relations', {
      nephew_hash: { type: Sequelize.STRING, allowNull: false },
      uncle_hash: { type: Sequelize.STRING, allowNull: false },
      uncle_fetched_at: { type: Sequelize.INTEGER },
      index: { type: Sequelize.INTEGER },
    }, {
      comment: 'Block second degree relations'
    });

    await queryInterface.addIndex('block_second_degree_relations', ['nephew_hash']);
    await queryInterface.addIndex('block_second_degree_relations', ['uncle_hash']);



    /**
     * Pending block operations
     */
    await queryInterface.createTable('pending_block_operations', {
      block_hash: { type: Sequelize.STRING, allowNull: false, primaryKey: true },
      fetch_internal_transactions: {type: Sequelize.BOOLEAN},
      created_at: { type: Sequelize.DATE },
      updated_at: { type: Sequelize.DATE },
    }, {
      comment: 'Pending block operations'
    });








    /* Addresses */


    /**
     * Addresses
     */
    await queryInterface.createTable('addresses', {
      hash: { type: Sequelize.STRING, allowNull: false, primaryKey: true, unique: true },
      fetched_coin_balance: { type: Sequelize.NUMERIC(100,0), defaultValue: 0 },
      fetched_coin_balance_block_number: {type: Sequelize.INTEGER, defaultValue: 0 },
      nonce: { type: Sequelize.INTEGER },
      decompiled: {type: Sequelize.BOOLEAN},
      verified: {type: Sequelize.BOOLEAN},
      contract_code: { type: Sequelize.TEXT, allowNull: true },
      created_at: { type: Sequelize.DATE },
      updated_at: { type: Sequelize.DATE },
    }, {
      comment: 'Addresses'
    });


    /**
     * Address Coin balances
     */
    await queryInterface.createTable('address_coin_balances', {
      address_hash: { type: Sequelize.STRING, allowNull: false, primaryKey: true},
      block_number: { type: Sequelize.INTEGER, allowNull: false },
      value: { type: Sequelize.NUMERIC(100,0), defaultValue: 0 },
      created_at: { type: Sequelize.DATE },
      updated_at: { type: Sequelize.DATE },
    }, {
      comment: 'Address Coin balances'
    });


    /**
     * Address Coin balances Daily
     */
    await queryInterface.createTable('address_coin_balances_daily', {
      address_hash: { type: Sequelize.STRING, allowNull: false, primaryKey: true},
      day: { type: Sequelize.DATE, allowNull: false },
      value: { type: Sequelize.NUMERIC(100,0), defaultValue: 0 },
      created_at: { type: Sequelize.DATE },
      updated_at: { type: Sequelize.DATE },
    }, {
      comment: 'Address Coin balances Daily'
    });


    /**
     * Smart contracts
     */
    await queryInterface.createTable('smart_contracts', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, allowNull: false, primaryKey: true, unique: true },
      name: { type: Sequelize.STRING },
      compiler_version: { type: Sequelize.STRING },
      optimization: {type: Sequelize.BOOLEAN},
      contract_source_code: { type: Sequelize.TEXT, allowNull: true },
      abi: { type: Sequelize.JSONB, allowNull: true },
      address_hash: { type: Sequelize.STRING },
      constructor_arguments: { type: Sequelize.TEXT, allowNull: true },
      optimization_runs: { type: Sequelize.INTEGER },
      evm_version: { type: Sequelize.STRING },
      external_libraries: { type: Sequelize.JSONB, allowNull: true },
      created_at: { type: Sequelize.DATE },
      updated_at: { type: Sequelize.DATE },
    }, {
      comment: 'Smart Contracts'
    });

    await queryInterface.addIndex('smart_contracts', ['address_hash']);


    /**
     * Decompiled smart contracts
     */
    await queryInterface.createTable('decompiled_smart_contracts', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, allowNull: false, primaryKey: true, unique: true },
      decompiler_version: { type: Sequelize.STRING },
      decompiled_source_code: { type: Sequelize.TEXT, allowNull: false },
      address_hash: { type: Sequelize.STRING },
      created_at: { type: Sequelize.DATE },
      updated_at: { type: Sequelize.DATE },
    }, {
      comment: 'Decompiled Smart Contracts'
    });

    await queryInterface.addIndex('decompiled_smart_contracts', ['address_hash']);








    /* Tokens */


    /**
     * Tokens
     */
    await queryInterface.createTable('tokens', {
      contract_address_hash: { type: Sequelize.STRING, allowNull: false, primaryKey: true, unique: true },
      name: { type: Sequelize.STRING },
      symbol: { type: Sequelize.STRING },
      total_supply: { type: Sequelize.NUMERIC(100,0) },
      decimals: { type: Sequelize.NUMERIC(100,0) },
      type: { type: Sequelize.STRING },
      cataloged: {type: Sequelize.BOOLEAN},
      holder_count: { type: Sequelize.INTEGER },
      created_at: { type: Sequelize.DATE },
      updated_at: { type: Sequelize.DATE },
    }, {
      comment: 'Tokens'
    });


    /**
     * Token Instances
     */
    await queryInterface.createTable('token_instances', {
      token_contract_address_hash: { type: Sequelize.STRING, allowNull: false, primaryKey: true, unique: true },
      token_id: { type: Sequelize.NUMERIC(100,0), allowNull: false },
      metadata: { type: Sequelize.JSONB, allowNull: true },
      error: { type: Sequelize.STRING },
      created_at: { type: Sequelize.DATE },
      updated_at: { type: Sequelize.DATE },
    }, {
      comment: 'Token instances'
    });

    await queryInterface.addIndex('token_instances', ['token_contract_address_hash', 'token_id']);


    /**
     * Address Current Token Balances
     */
    await queryInterface.createTable('address_current_token_balances', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, allowNull: false, primaryKey: true, unique: true },
      address_hash: { type: Sequelize.STRING, allowNull: false },
      block_number: { type: Sequelize.INTEGER, allowNull: false },
      token_contract_address_hash: { type: Sequelize.STRING, allowNull: false },
      value: { type: Sequelize.NUMERIC(100,0) },
      value_fetched_at: { type: Sequelize.INTEGER },
      old_value: { type: Sequelize.NUMERIC(100,0) },
      created_at: { type: Sequelize.DATE },
      updated_at: { type: Sequelize.DATE },
    }, {
      comment: 'Address Current Token Balances'
    });


    /**
     * Address Token Balances
     */
    await queryInterface.createTable('address_token_balances', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, allowNull: false, primaryKey: true, unique: true },
      address_hash: { type: Sequelize.STRING, allowNull: false },
      block_number: { type: Sequelize.INTEGER, allowNull: false },
      token_contract_address_hash: { type: Sequelize.STRING, allowNull: false },
      value: { type: Sequelize.NUMERIC(100,0) },
      value_fetched_at: { type: Sequelize.INTEGER },
      created_at: { type: Sequelize.DATE },
      updated_at: { type: Sequelize.DATE },
    }, {
      comment: 'Address Token Balances'
    });









    /* Transactions */


    /**
     * Transactions
     */
    await queryInterface.createTable('transactions', {
      hash: { type: Sequelize.STRING, allowNull: false, primaryKey: true, unique: true},
      cumulative_gas_used: { type: Sequelize.NUMERIC(100, 0) },
      error: { type: Sequelize.STRING },
      gas: { type: Sequelize.NUMERIC(100, 0) },
      gas_price: { type: Sequelize.NUMERIC(100, 0) },
      gas_used: { type: Sequelize.NUMERIC(100, 0) },
      index: { type: Sequelize.INTEGER },
      input: { type: Sequelize.TEXT },
      nonce: { type: Sequelize.INTEGER },
      status: { type: Sequelize.INTEGER },
      r: { type: Sequelize.NUMERIC(100, 0) },
      s: { type: Sequelize.NUMERIC(100, 0) },
      v: { type: Sequelize.NUMERIC(100, 0) },
      value: { type: Sequelize.NUMERIC(100, 0) },
      block_hash: { type: Sequelize.STRING },
      block_number: { type: Sequelize.INTEGER },
      from_address_hash: { type: Sequelize.STRING },
      to_address_hash: { type: Sequelize.STRING },
      created_contract_address_hash: { type: Sequelize.STRING, allowNull: true },
      created_contract_code_indexed_at: { type: Sequelize.INTEGER },
      earliest_processing_start: { type: Sequelize.INTEGER },
      old_block_hash: { type: Sequelize.STRING },
      revert_reason: { type: Sequelize.TEXT },
      created_at: { type: Sequelize.DATE },
      updated_at: { type: Sequelize.DATE },
    }, {
      comment: 'Transactions'
    });

    await queryInterface.addIndex('transactions', ['block_hash']);
    await queryInterface.addIndex('transactions', ['block_number']);
    await queryInterface.addIndex('transactions', ['from_address_hash']);
    await queryInterface.addIndex('transactions', ['to_address_hash']);



    /**
     * Transaction forks
     */
    await queryInterface.createTable('transaction_forks', {
      index: { type: Sequelize.INTEGER, allowNull: false},
      uncle_hash: { type: Sequelize.STRING, allowNull: false },
      hash: { type: Sequelize.STRING, allowNull: false },
      created_at: { type: Sequelize.DATE },
      updated_at: { type: Sequelize.DATE },
    }, {
      comment: 'Transaction Forks'
    });

    await queryInterface.addIndex('transaction_forks', ['index']);
    await queryInterface.addIndex('transaction_forks', ['uncle_hash']);


    /**
     * Logs
     */
    await queryInterface.createTable('logs', {
      index: { type: Sequelize.INTEGER, allowNull: false},
      transaction_hash: { type: Sequelize.STRING, allowNull: false },
      block_hash: { type: Sequelize.STRING, allowNull: false },
      data: { type: Sequelize.TEXT },
      type: { type: Sequelize.STRING },
      first_topic: { type: Sequelize.STRING },
      second_topic: { type: Sequelize.STRING },
      third_topic: { type: Sequelize.STRING },
      fourth_topic: { type: Sequelize.STRING },
      address_hash: { type: Sequelize.STRING },
      block_number: { type: Sequelize.INTEGER },
      created_at: { type: Sequelize.DATE },
      updated_at: { type: Sequelize.DATE },
    }, {
      comment: 'Logs'
    });

    await queryInterface.addIndex('logs', ['index']);
    await queryInterface.addIndex('logs', ['transaction_hash']);
    await queryInterface.addIndex('logs', ['block_hash']);
    await queryInterface.addIndex('logs', ['address_hash']);
    await queryInterface.addIndex('logs', ['block_number']);
    await queryInterface.addIndex('logs', ['first_topic']);
    await queryInterface.addIndex('logs', ['second_topic']);
    await queryInterface.addIndex('logs', ['third_topic']);
    await queryInterface.addIndex('logs', ['fourth_topic']);



    /**
     * Internal transactions
     */
    await queryInterface.createTable('internal_transactions', {
      block_hash: { type: Sequelize.STRING, allowNull: false, primaryKey: true},
      block_index: { type: Sequelize.STRING, allowNull: false},
      call_type: { type: Sequelize.STRING },
      created_contract_code: { type: Sequelize.TEXT, allowNull: true },
      error: { type: Sequelize.STRING },
      gas: { type: Sequelize.NUMERIC(100, 0) },
      gas_used: { type: Sequelize.NUMERIC(100, 0) },
      index: { type: Sequelize.INTEGER },
      init: { type: Sequelize.TEXT },
      input: { type: Sequelize.TEXT },
      output: { type: Sequelize.TEXT },
      trace_address: { type: Sequelize.INTEGER },
      type: { type: Sequelize.STRING },
      value: { type: Sequelize.NUMERIC(100, 0) },
      created_contract_address_hash: { type: Sequelize.STRING, allowNull: true },
      from_address_hash: { type: Sequelize.STRING },
      to_address_hash: { type: Sequelize.STRING },
      transaction_hash: { type: Sequelize.STRING },
      block_number: { type: Sequelize.INTEGER },
      transaction_index: { type: Sequelize.INTEGER },
      created_at: { type: Sequelize.DATE },
      updated_at: { type: Sequelize.DATE },
    }, {
      comment: 'Internal Transactions'
    });

    await queryInterface.addIndex('internal_transactions', ['block_index']);
    await queryInterface.addIndex('internal_transactions', ['from_address_hash']);
    await queryInterface.addIndex('internal_transactions', ['to_address_hash']);
    await queryInterface.addIndex('internal_transactions', ['transaction_hash']);
    await queryInterface.addIndex('internal_transactions', ['block_number']);



    /**
     * Token Transfers
     */
    await queryInterface.createTable('token_transfers', {
      transaction_hash: { type: Sequelize.STRING, allowNull: false},
      log_index: { type: Sequelize.INTEGER },
      block_hash: { type: Sequelize.STRING },
      from_address_hash: { type: Sequelize.STRING , allowNull: false },
      to_address_hash: { type: Sequelize.STRING , allowNull: false },
      amount: { type: Sequelize.NUMERIC(100, 0) },
      token_id: { type: Sequelize.NUMERIC(78, 0) },
      token_contract_address_hash: { type: Sequelize.STRING, allowNull: false },
      block_number: { type: Sequelize.INTEGER },
      created_at: { type: Sequelize.DATE },
      updated_at: { type: Sequelize.DATE },
    }, {
      comment: 'Token Transfers'
    });

    await queryInterface.addIndex('token_transfers', ['transaction_hash']);
    await queryInterface.addIndex('token_transfers', ['log_index']);
    await queryInterface.addIndex('token_transfers', ['block_hash']);
    await queryInterface.addIndex('token_transfers', ['from_address_hash']);
    await queryInterface.addIndex('token_transfers', ['to_address_hash']);
    await queryInterface.addIndex('token_transfers', ['token_contract_address_hash']);
    await queryInterface.addIndex('token_transfers', ['block_number']);



  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('blocks');
    await queryInterface.dropTable('block_rewards');
    await queryInterface.dropTable('block_second_degree_relations');
    await queryInterface.dropTable('pending_block_operations');
    await queryInterface.dropTable('addresses');
    await queryInterface.dropTable('address_coin_balances');
    await queryInterface.dropTable('address_coin_balances_daily');
    await queryInterface.dropTable('smart_contracts');
    await queryInterface.dropTable('decompiled_smart_contracts');
    await queryInterface.dropTable('tokens');
    await queryInterface.dropTable('token_instances');
    await queryInterface.dropTable('address_current_token_balances');
    await queryInterface.dropTable('address_token_balances');
    await queryInterface.dropTable('transactions');
    await queryInterface.dropTable('transaction_forks');
    await queryInterface.dropTable('logs');
    await queryInterface.dropTable('internal_transactions');
    await queryInterface.dropTable('token_transfers');
  }
};