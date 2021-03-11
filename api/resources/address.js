const setting = require('../../setting');
const Web3 = require('web3');
const DB = require('../../models/index');
const AddressTokenBalance = DB.AddressTokenBalance;
const Token = DB.Token;



async function serialize(address, isBrief = false) {

    if (isBrief) {
        return {
            hash: address.hash,
            balance: address.fetched_coin_balance
        }
    } else {
        let balance = address.fetched_coin_balance;
        
        // let web3 = new Web3(setting.WEB3_PROVIDER_URL);
        // let balance = await web3.eth.getBalance(address.hash);

        // token banlances
        let addressTokenBalances = await AddressTokenBalance.findAll({
            where: {address_hash: address.hash}
        });

        let addressTokenBalanceData = [];
        for (let addressTokenBalance of addressTokenBalances) {
            let token = await Token.findOne({where: {contract_address_hash: addressTokenBalance.token_contract_address_hash}});
            addressTokenBalanceData.push({
                contract: addressTokenBalance.token_contract_address_hash,
                value: addressTokenBalance.value,
                name: token?.name,
                symbol: token?.symbol,
                decimals: token?.decimals,
            });
        }

        return {
            hash: address.hash,
            balance: balance,
            tokens: addressTokenBalanceData
        }
    }
}

module.exports = {
    serialize
}