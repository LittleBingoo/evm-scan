const DB = require('../../models/index');
const setting = require('../../setting');
const Transaction = DB.Transaction;

async function serialize(token) {

    // contract creator
    let transaction = await Transaction.findOne({
        where: {created_contract_address_hash: token.contract_address_hash}
    });

    return {
        contract_address: token.contract_address_hash,
        name: token.name,
        symbol: token.symbol,
        total_supply: token.total_supply,
        decimals: token.decimals,
        icon: token.icon ? setting.TOKEN_ICON_BASE_URL + token.icon : null,
        type: token.type,
        creator: transaction ? transaction.from_address_hash : '',
        created_transaction_hash: transaction ? transaction.hash : '',
        official: token.official,
        verified: token.verified
    }
}

module.exports = {
    serialize
}