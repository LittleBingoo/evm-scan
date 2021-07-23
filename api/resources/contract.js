const DB = require('../../models/index');

async function serialize(contract) {

    return {
        name: contract.name,
        address_hash: contract.address_hash,
        abi: contract.abi,
        compiler_version: contract.compiler_version,
        optimization: contract.optimization,
        contract_source_code: contract.contract_source_code
    }
}

module.exports = {
    serialize
}