const setting = require('../../setting');

async function serialize(token) {

    return {
        contract_address: token.contract_address_hash,
        name: token.name,
        symbol: token.symbol,
        total_supply: token.total_supply,
        decimals: token.decimals,
        icon: token.icon ? setting.TOKEN_ICON_BASE_URL + token.icon : null,
        type: token.type,
    }
}

module.exports = {
    serialize
}