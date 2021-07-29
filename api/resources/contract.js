const DB = require('../../models/index');
const Transaction = DB.Transaction;

async function serialize(contract) {

    // contract creator
    let transaction = await Transaction.findOne({
        where: {created_contract_address_hash: contract.address_hash}
    });

    return {
        name: contract.name,
        address_hash: contract.address_hash,
        abi: contract.abi,
        compiler_version: contract.compiler_version,
        optimization: contract.optimization,
        contract_source_code: contract.contract_source_code,
        creator: transaction ? transaction.from_address_hash : '',
        created_transaction_hash: transaction ? transaction.hash : '',
    }
}

module.exports = {
    serialize
}