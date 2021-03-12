class LogData {

    log = {}

    constructor(log) {
        this.log.address = log.address ? log.address.toLowerCase() : null;
        this.log.topics = log.topics;
        this.log.data = log.data;
        this.log.block_number = log.blockNumber;
        this.log.transaction_hash = log.transactionHash ? log.transactionHash.toLowerCase() : null;
        this.log.transaction_index = log.transactionIndex;
        this.log.block_hash = log.blockHash ? log.blockHash.toLowerCase() : null;
        this.log.log_index = log.logIndex;
        this.log.removed = log.removed;
        this.log.id = log.id;
    }

    serialize() {
        return {
            index: this.log.log_index,
            transaction_hash: this.log.transaction_hash,
            block_hash: this.log.block_hash,
            data: this.log.data,
            type: '',
            first_topic: this.log.topics[0],
            second_topic: this.log.topics[1],
            third_topic: this.log.topics[2],
            fourth_topic: this.log.topics[3],
            address_hash: this.log.address,
            block_number: this.log.block_number
        }
    }
}


module.exports = { LogData };