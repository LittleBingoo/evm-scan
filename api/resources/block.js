const DB = require('../../models/index');
const Transaction = DB.Transaction;

async function serialize(block) {

    transactionCount = await Transaction.count({
        where: {block_number: block.number},
    });

    return {
        hash: block.hash,
        difficulty: block.hash,
        gas_limit: block.gas_limit,
        gas_used: block.gas_used,
        miner: block.miner_hash,
        number: block.number,
        parent_hash: block.parent_hash,
        size: block.size,
        timestamp: block.timestamp,
        transaction_count: transactionCount
    }
}

module.exports = {
    serialize
}