const BigNumber = require('bignumber.js');

class TransactionData {

    transaction = {}

    receipt = {}

    constructor(transaction) {
        this.transaction.block_hash = transaction.blockHash;
        this.transaction.block_number = transaction.blockNumber;
        this.transaction.from = transaction.from;
        this.transaction.gas = transaction.gas;
        this.transaction.gas_price = transaction.gasPrice;
        this.transaction.hash = transaction.hash;
        this.transaction.input = transaction.input;
        this.transaction.nonce = transaction.nonce;
        this.transaction.to = transaction.to;
        this.transaction.transaction_index = transaction.transactionIndex;
        this.transaction.value = transaction.value;
        this.transaction.v = transaction.v;
        this.transaction.r = transaction.r;
        this.transaction.s = transaction.s;
    }

    attachReceipt(receipt) {
        this.receipt.block_hash = receipt.blockHash;
        this.receipt.block_number = receipt.blockNumber;
        this.receipt.contract_address = receipt.contractAddress;
        this.receipt.cumulative_gas_used = receipt.cumulativeGasUsed;
        this.receipt.from = receipt.from;
        this.receipt.gas_used = receipt.gasUsed;
        this.receipt.logs = receipt.logs;
        this.receipt.logs_bloom = receipt.logsBloom;
        this.receipt.status = receipt.status;
        this.receipt.to = receipt.to;
        this.receipt.transaction_hash = receipt.transactionHash;
        this.receipt.transaction_index = receipt.transactionIndex;
    }

    serialize() {
        return {
            hash: this.transaction.hash,
            cumulative_gas_used: this.receipt.cumulative_gas_used,
            error: '',
            gas: this.transaction.gas,
            gas_price: this.transaction.gas_price,
            gas_used: this.receipt.gas_used,
            index: this.transaction.transaction_index,
            input: this.transaction.input,
            nonce: this.transaction.nonce,
            status: this.receipt.status ? 1 : 0,
            r: new BigNumber(this.transaction.r),
            s: new BigNumber(this.transaction.s),
            v: new BigNumber(this.transaction.v),
            value: this.transaction.value,
            block_hash: this.receipt.block_hash,
            block_number: this.receipt.block_number,
            from_address_hash: this.transaction.from,
            to_address_hash: this.transaction.to,
            created_contract_address_hash: this.receipt.contract_address,
            created_contract_code_indexed_at: 0,
            earliest_processing_start: 0,
            old_block_hash: '',
            revert_reason: ''
        }
    }
}

module.exports = { TransactionData };