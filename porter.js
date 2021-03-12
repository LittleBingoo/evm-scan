const setting = require('./setting');
const Web3 = require('web3');
const DB = require('./models/index');
const BigNumber = require('bignumber.js');
const { BlockData } = require('./processors/block');
const { TransactionData } = require('./processors/transaction');
const { LogData } = require('./processors/log');
const { ContactData, ContractProcessor } = require('./processors/contract');


const sequelize = DB.sequelize;
const Block = DB.Block;
const BlockSecondDegreeRelation = DB.BlockSecondDegreeRelation;
const Transaction = DB.Transaction;
const Log = DB.Log;
const SmartContract = DB.SmartContract;
const Token = DB.Token;
const TokenTransfer = DB.TokenTransfer;
const InternalTransaction = DB.InternalTransaction;
const Address = DB.Address;
const AddressTokenBalance = DB.AddressTokenBalance;

let web3 = new Web3(setting.WEB3_PROVIDER_URL);

var delay = function(time) {
    var startTime = new Date().getTime() + parseInt(time, 10);
    while(new Date().getTime() < startTime) {}
};

function uniqueArray(arr){
  var hash=[];
  for (var i = 0; i < arr.length; i++) {
    for (var j = i+1; j < arr.length; j++) {
      if(arr[i]===arr[j]){
        ++i;
      }
    }
      hash.push(arr[i]);
  }
  return hash;
}

(async() => {
    
    while (1) {

        // chain last block
        let currentBlockNumber = await web3.eth.getBlockNumber();

        // db last block
        lastBlock = await Block.findOne({order: [['number', 'DESC']]});

        let lastBlockNumber = setting.BLOCK_START_AT ? setting.BLOCK_START_AT - 1 : 0;
        if (lastBlock !== null) {
            lastBlockNumber = lastBlock.number;
        }

        if (currentBlockNumber > lastBlockNumber) {
            for (let i = lastBlockNumber+1; i <= currentBlockNumber; i++) {

                // Blocks
                let block = await web3.eth.getBlock(i);
                let blockData = new BlockData(block);
                if (blockData !== null) {

                    // start db transaction
                    const t = await sequelize.transaction();

                    try {
                        await Block.create(blockData.serialize(), {transaction: t});


                        // UpdatedAddresses
                        let updatedAddresses = [];
                        let createdContracts = [];
                        let updatedAddressTokens = [];

                        updatedAddresses.push(block.miner.toLowerCase());


                        // Uncles
                        for (let uncleIndex in block.uncles) {
                            await BlockSecondDegreeRelation.create({
                                nephew_hash: block.hash.toLowerCase(),
                                uncle_hash: block.uncles[uncleIndex].toLowerCase(),
                                index: uncleIndex,
                                uncle_fetched_at: block.timestamp
                            }, {transaction: t});
                        }


                        // Transactions
                        for (let transactionHash of block.transactions) {
                            let [transaction, transactionReceipt] = await Promise.all([
                                web3.eth.getTransaction(transactionHash), 
                                web3.eth.getTransactionReceipt(transactionHash)
                            ]);

                            let transactionData = new TransactionData(transaction);
                            transactionData.attachReceipt(transactionReceipt);

                            await Transaction.create(transactionData.serialize(), {transaction: t});

                            updatedAddresses.push(transaction.from.toLowerCase());

                            // Contact creation tx, Event logs of internal transaction
                            if (transaction.input && transaction.input.length > 2) {
                                // Contact creation tx
                                if (transaction.to === null) {
                                    contractAddress = transactionData.receipt.contract_address;

                                    // let smartContract = await SmartContract.create({
                                    //     address_hash: contractAddress
                                    // }, {transaction: t});

                                    createdContracts.push(contractAddress.toLowerCase());
                                    updatedAddresses.push(contractAddress.toLowerCase());


                                    // // Try Erc20
                                    // let contractProcessor = new ContractProcessor({contract_address: contractAddress});
                                    // if (await contractProcessor.isErc20Compatible(web3)) {
                                    //     let web3Contract = contractProcessor.getErc20Web3Contract(web3);
                                    //     try {
                                    //         let tokenData = await contractProcessor.erc20CompatibleTest(web3Contract);
                                    //         await Token.create({
                                    //             contract_address_hash: contractAddress,
                                    //             name: tokenData.name,
                                    //             symbol: tokenData.symbol,
                                    //             total_supply: tokenData.totalSupply,
                                    //             decimals: tokenData.decimals,
                                    //         }, {transaction: t});
                                    //     } catch(err) {
                                    //         console.log(err)
                                    //     }
                                    // }
                                }
                            } else {
                                if (transaction.to !== null) {
                                    updatedAddresses.push(transaction.to.toLowerCase());
                                }
                            }

                            // Logs
                            for (let log of transactionReceipt.logs) {
                                // fix frontier
                                log.transactionHash = transaction.hash

                                let logData = new LogData(log);
                                await Log.create(logData.serialize(), {transaction: t});

                                // Call Method
                                if (log.topics[0] && log.topics[0].length > 10) {
                                    // 0x23b872dd : Erc20 transfer from
                                    // 0xddf252ad : Erc20 transfer
                                    const methodCode = log.topics[0].substr(0, 10);
                                    if (methodCode == '0xddf252ad' || methodCode == '0x23b872dd') {

                                        if (log.topics[1] && log.topics[2]) {
                                            let from = '0x' + log.topics[1].substr(-40);
                                            let to = '0x' + log.topics[2].substr(-40);

                                            // transfer method
                                            await TokenTransfer.create({
                                                transaction_hash: transaction.hash.toLowerCase(),
                                                log_index: log.log_index,
                                                block_hash: block.hash.toLowerCase(),
                                                from_address_hash: from.toLowerCase(),
                                                to_address_hash: to.toLowerCase(),
                                                amount: new BigNumber(log.data, 16),
                                                token_id: log.topics[3] ? new BigNumber(log.topics[3], 16) : 0, //ERC721
                                                token_contract_address_hash: log.address.toLowerCase(),
                                                block_number: block.number
                                            }, {transaction: t});

                                            if (!updatedAddressTokens[log.address.toLowerCase()]) {
                                                updatedAddressTokens[log.address.toLowerCase()] = [];
                                            }
                                            updatedAddressTokens[log.address.toLowerCase()].push(from.toLowerCase());
                                            updatedAddressTokens[log.address.toLowerCase()].push(to.toLowerCase());
                                            updatedAddresses.push(from.toLowerCase());
                                            updatedAddresses.push(to.toLowerCase());
                                        }
                                    }
                                }
                            }
                        }

                        // Balance trace
                        updatedAddresses = uniqueArray(updatedAddresses)
                        for (let address of updatedAddresses) {
                            let addressModel = await Address.findOne({where: {hash: address}});

                            if (addressModel === null) {
                                addressModel = await Address.create({
                                    hash: address
                                }, {transaction: t});
                            }

                            // get balance
                            let balance = await web3.eth.getBalance(address);
                            addressModel.fetched_coin_balance = balance;
                            addressModel.fetched_coin_balance_block_number = block.number;
                            await addressModel.save({transaction: t});
                        }

                        // Add contract
                        createdContracts = uniqueArray(createdContracts)

                        for (let smartContract of createdContracts) {
                            let smartContract = await Token.findOne({where: {contract_address_hash: contractAddress}});
                            if (smartContract == null) {
                                let smartContract = await SmartContract.create({
                                    address_hash: contractAddress
                                }, {transaction: t});
                            }
                        }


                        // Token trace
                        for (let contractAddress in updatedAddressTokens) {

                            // isNewSmartContract
                            if (createdContracts.indexOf(contractAddress) == -1) {
                                let smartContract = await SmartContract.findOne({where: {contract_address_hash: contractAddress}});
                                if (smartContract == null) {
                                    let smartContract = await SmartContract.create({
                                        address_hash: contractAddress
                                    }, {transaction: t});
                                }
                            }

                            let contractProcessor = new ContractProcessor({contract_address: contractAddress});
                            let web3Contract = contractProcessor.getErc20Web3Contract(web3);

                            // isNewToken
                            let token = await Token.findOne({where: {contract_address_hash: contractAddress}});

                            if (token == null) {
                                // Try Erc20
                                if (await contractProcessor.isErc20Compatible(web3)) {
                                    let web3Contract = contractProcessor.getErc20Web3Contract(web3);
                                    try {
                                        let tokenData = await contractProcessor.erc20CompatibleTest(web3Contract);
                                        await Token.create({
                                            contract_address_hash: contractAddress,
                                            name: tokenData.name,
                                            symbol: tokenData.symbol,
                                            total_supply: tokenData.totalSupply,
                                            decimals: tokenData.decimals,
                                        }, {transaction: t});
                                    } catch(err) {
                                        console.log(err)
                                    }
                                }
                            }

                            // token balance

                            updatedAddressTokens[contractAddress] = uniqueArray(updatedAddressTokens[contractAddress])

                            for (let address of updatedAddressTokens[contractAddress]) {

                                let balance = await web3Contract.methods.balanceOf(address).call();

                                let addressTokenBalance = await AddressTokenBalance.findOne({where: {address_hash: address, token_contract_address_hash: contractAddress}});

                                if (addressTokenBalance === null) {
                                    addressTokenBalance = await AddressTokenBalance.create({
                                        address_hash: address,
                                        token_contract_address_hash: contractAddress,
                                        block_number: 0
                                    }, {transaction: t});
                                }

                                addressTokenBalance.value = balance;
                                addressTokenBalance.value_fetched_at = Math.round(new Date().getTime()/1000);
                                addressTokenBalance.block_number = block.number;
                                await addressTokenBalance.save({transaction: t});
                            }
                        }

                        // commit db transaction
                        await t.commit();
                    } catch (error) {
                        // rollback db transaction
                        await t.rollback();
                        console.log(error);
                        return;
                    }
                }


                // Delay
                delay(100);
            }
        } else {
            console.log('waitting for a new block');
        }

        delay(2000);

    }

})();
