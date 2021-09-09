const erc20Abi = require(__dirname + '/../contracts/abi/erc20.json');
const erc20AbiCompatible = require(__dirname + '/../contracts/abi/erc20compatible.json');

class ContractData {

    contract_address = null
    contract_abi = null
    contract_code = null
    contract_info = null
    erc20_compatible = null
    erc721_compatible = null

    constructor(contractAddress) {
        this.contract_address = contractAddress
    }

    serialize() {
        return {
            address: this.contract_address.toLowerCase(),
            creator: this.contract_info.creator.toLowerCase(),
            name: this.contract_info.name,
            code: this.contract_code,
            abi: this.contract_abi,
            erc20_compatible: this.erc20_compatible,
            erc721_compatible: this.erc721_compatible,
        }
    }
}

class ContractProcessor {

    constructor(contractData) {
        this.contractData = contractData;
    }

    getWeb3Contract(web3, abi) {
        return new web3.eth.Contract(abi, this.contractData.contract_address);
    }

    getErc20Web3Contract(web3) {
        return this.getWeb3Contract(web3, erc20Abi);
    }

    async isErc20Compatible(web3) {

        let web3Contract = this.getErc20Web3Contract(web3);

        // test
        try {

            return await this.erc20CompatibleTest(web3Contract);

        } catch(e) {
            // token compatible mode
            if (e.code == 'NUMERIC_FAULT') {

                let web3Contract = new web3.eth.Contract(erc20AbiCompatible, this.contractData.contract_address);

                try {
                    return await this.erc20CompatibleTest(web3Contract);
                } catch(err) {
                    console.log(err);
                    return false;
                }
            } else {
                console.log(e);
                return false;
            }
        }
    }

    async erc20CompatibleTest(web3Contract) {
        let [name, totalSupply, decimals, symbol] = await Promise.all([
            web3Contract.methods.name().call(),
            web3Contract.methods.totalSupply().call(),
            web3Contract.methods.decimals().call(),
            web3Contract.methods.symbol().call()
            // web3Contract.methods.balanceOf(this.contractData.contract_address).call()
        ]);

        return {
            name: name,
            totalSupply: totalSupply,
            decimals: decimals,
            symbol: symbol
        };
    }
}


module.exports = { ContractData, ContractProcessor };