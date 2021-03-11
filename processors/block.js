class BlockData {

    block = {}

    transactions = []

    constructor(block) {
        this.block.number = block.number;
        this.block.difficulty = block.difficulty;
        this.block.extra_data = block.extraData;
        this.block.gas_limit = block.gasLimit;
        this.block.gas_used = block.gasUsed;
        this.block.hash = block.hash;
        this.block.logs_bloom = block.logsBloom;
        this.block.miner = block.miner;
        this.block.mix_hash = block.mixHash;
        this.block.nonce = block.nonce;
        this.block.parent_hash = block.parentHash;
        this.block.receipts_root = block.receiptsRoot;
        this.block.sha3_uncles = block.sha3Uncles;
        this.block.size = block.size;
        this.block.state_root = block.stateRoot;
        this.block.timestamp = block.timestamp;
        this.block.total_difficulty = block.totalDifficulty;
        this.block.transactions = block.transactions;
        this.block.transactions_root = block.transactionsRoot;
        this.block.uncles = block.uncles;
    }

    serialize() {
        return {
            hash: this.block.hash,
            consensus: false,
            difficulty: this.block.difficulty,
            gas_limit: this.block.gas_limit,
            gas_used: this.block.gas_used,
            miner_hash: this.block.miner,
            nonce: this.block.nonce,
            number: this.block.number,
            parent_hash: this.block.parent_hash,
            size: this.block.size,
            timestamp: this.block.timestamp,
            total_difficulty: this.block.total_difficulty
        }
    }
}

module.exports = { BlockData };