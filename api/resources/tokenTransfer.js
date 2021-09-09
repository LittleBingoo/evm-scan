const DB = require('../../models/index');
const setting = require('../../setting');
const Token = DB.Token;
const Block = DB.Block;

async function serialize(tokenTransfer) {

    let token = await Token.findOne({where: {contract_address_hash: tokenTransfer.token_contract_address_hash}});
    let block = await Block.findOne({attributes: ['timestamp'], where: {number: tokenTransfer.block_number}});

    return {
        transaction_hash: tokenTransfer.transaction_hash,
        from: tokenTransfer.from_address_hash,
        to: tokenTransfer.to_address_hash,
        amount: tokenTransfer.amount,
        token_id: tokenTransfer.token_id,
        token: {
            contract_address: tokenTransfer.token_contract_address_hash,
            name: token?.name,
            symbol: token?.symbol,
            decimals: token?.decimals,
            icon: token.icon ? setting.TOKEN_ICON_BASE_URL + token.icon : null,
        },
        block: {
            number: tokenTransfer.block_number,
            timestamp: block?.timestamp,
        }
    }
}

module.exports = {
    serialize
}