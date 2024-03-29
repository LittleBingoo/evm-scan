const DB = require('../../models/index');
const BigNumber = require('bignumber.js');
const Block = DB.Block;
const Log = DB.Log;
const TokenTransfer = DB.TokenTransfer;
const Token = DB.Token;
const setting = require('../../setting');

async function serialize(transaction, isBrief = false) {

    let block = await Block.findOne({
        attributes: ['timestamp'],
        where: {number: transaction.block_number}
    });

    if (isBrief) {
        return {
            hash: transaction.hash,
            from: transaction.from_address_hash,
            to: transaction.to_address_hash,
            value: transaction.value,
            status: transaction.status,
            index: transaction.index,
            nonce: transaction.nonce,
            gas: transaction.gas,
            gas_price: transaction.gas_price,
            gas_used: transaction.gas_used,
            block: {
                number: transaction.block_number,
                hash: transaction.block_hash,
                timestamp: block.timestamp
            },
        }
    } else {
        // logs
        let logs = await Log.findAll({
            where: {transaction_hash: transaction.hash}
        });

        logData = [];
        for (let log of logs) {
            logData.push({
                index: log.index,
                data: log.data,
                topic_1: log.first_topic,
                topic_2: log.second_topic,
                topic_3: log.third_topic,
                topic_4: log.fourth_topic,
                address: log.address_hash,
            })
        }

        // token transfers
        let tokenTransfers = await TokenTransfer.findAll({
            where: {transaction_hash: transaction.hash}
        });

        tokenTransfersData = [];
        for (let tokenTransfer of tokenTransfers) {
            let token = await Token.findOne({where: {contract_address_hash: tokenTransfer.token_contract_address_hash}});
            tokenTransfersData.push({
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
                }
            });
        }

        return {
            hash: transaction.hash,
            from: transaction.from_address_hash,
            to: transaction.to_address_hash,
            value: transaction.value,
            status: transaction.status,
            index: transaction.index,
            nonce: transaction.nonce,
            cumulative_gas_used: transaction.cumulative_gas_used,
            gas: transaction.gas,
            gas_price: transaction.gas_price,
            gas_used: transaction.gas_used,
            input: transaction.input,
            r: '0x' + new BigNumber(transaction.r).toString(16),
            s: '0x' + new BigNumber(transaction.s).toString(16),
            v: '0x' + new BigNumber(transaction.v).toString(16),
            contract_address: transaction.created_contract_address_hash,
            block: {
                number: transaction.block_number,
                hash: transaction.block_hash,
                timestamp: block.timestamp
            },
            logs: logData,
            token_transfers: tokenTransfersData
        }
    }
}

module.exports = {
    serialize
}