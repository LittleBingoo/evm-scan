const setting = require('../../setting');
const DB = require('../../models/index');
const SmartContract = DB.SmartContract;

async function serialize(token) {

    // verified contract
    let contract = await SmartContract.findOne({
        where: {address_hash: token.contract_address_hash}
    });

    let verified = false;
    if (contract && contract.compiler_version) {
        verified = true;
    }

    return {
        contract_address: token.contract_address_hash,
        name: token.name,
        symbol: token.symbol,
        total_supply: token.total_supply,
        decimals: token.decimals,
        icon: token.icon ? setting.TOKEN_ICON_BASE_URL + token.icon : null,
        type: token.type,
        official: token.official,
        verified: verified
    }
}

module.exports = {
    serialize
}