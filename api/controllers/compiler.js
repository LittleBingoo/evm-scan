const setting = require('../../setting');
var fs = require('fs');
const Web3 = require('web3');
const solc = require('solc');
const Sequelize = require('sequelize');
const DB = require('../../models/index');
const SmartContract = DB.SmartContract;

let web3 = new Web3(setting.WEB3_PROVIDER_URL);
let eth = web3.eth;

async function index(req, res, next) {

    // get bytecode at address
    const { address } = req.body;
    const { version } = req.body;
    const { name } = req.body;
    // const input = req.body.code;
    const input = Buffer.from(req.body.code,'base64').toString();
    const optimization = !!(req.body.optimization);
    const optimise = (optimization) ? 1 : 0;

    if (!address) {
        return res.json({
            code: 404,
            data: null,
            message: 'Invalid address',
        })
    }

    let contract = await SmartContract.findOne({where: {address_hash: address}});
    if (contract === null) {
        return res.json({
            code: 404,
            data: null,
            message: 'SmartContract not found',
        })
    }

    // version list
    let allowVersionList = getAllowVersionList();
    if (!allowVersionList.includes(version)) {
        return res.json({
            code: 403,
            data: null,
            message: 'Version not support',
        })
    }

    let bytecode = await eth.getCode(contract.address_hash);

    // if (bytecode.substring(0, 2) == '0x') bytecode = bytecode.substring(2);

    let data = {
        'address': contract.address_hash,
        'compilerVersion': version,
        'optimization': optimization,
        'contractName': name,
        'sourceCode': input,
        'valid': false,
        'version': version,
        'bytecode': null,
        'abi': {},
    };


    try {
        let params = {
            language: 'Solidity',
            sources: {
                'verify.sol': {
                    content: input
                }
            },
            settings: {
                outputSelection: {
                    '*': {
                        '*': ['*']
                    }
                },
                optimizer: {
                    enabled: optimization
                }
            }
        }


        // load version
        let solcV = solc.setupMethods(require("../../solc-repo/soljson-"+version+".js"));


        const output = JSON.parse(solcV.compile(JSON.stringify(params)));
        data = await testValidCode(output.contracts['verify.sol'], data, bytecode);

    } catch (e) {
        return res.json({
            code: 403,
            data: null,
            message: 'Valid error',
        })
    }


    if (!data.valid) {
        return res.json({
            code: 403,
            data: null,
            message: 'Valid failed',
        })
    }

    // update contract
    contract.name = data.name;
    contract.compiler_version = data.compilerVersion;
    contract.optimization = data.optimization;
    contract.contract_source_code = data.bytecode;
    contract.abi = data.abi;
    contract.save();

    res.json({
        code: 0,
        data: {
            address: data.address,
            compilerVersion: data.compilerVersion,
            optimization: data.optimization,
            contractName: data.contractName,
            bytecode: data.bytecode,
            valid: data.valid
        },
        message: 'Success'
    });
}


async function testValidCode(compiled, data, blockchain_bytecode) {

    for (contractName in compiled) {
        compiledEvm = compiled[contractName].evm.deployedBytecode;

        let compiled_bytecode = compiledEvm.object;
        if (compiled_bytecode == '') {
            console.log("Skipped!");
            continue;
        }

        let processed_compiled_bytecode = processBytecode(compiled_bytecode, data.compilerVersion);
        let processed_blockchain_bytecode = processBytecode(blockchain_bytecode, data.compilerVersion);


        if (processed_compiled_bytecode == processed_blockchain_bytecode) {
            console.log("Verified!");
            data['valid'] = true;
            data['bytecode'] = blockchain_bytecode;
            data['abi'] = compiled[contractName].abi;
            break;
        } else {
            const immutableReferences = compiledEvm.immutableReferences;
            // console.log(JSON.stringify(immutableReferences, null, 2));

            processed_blockchain_bytecode = await remove_immutable(processed_blockchain_bytecode, immutableReferences);
            // console.log(processed_blockchain_bytecode);
            // console.log(processed_compiled_bytecode);
            if (processed_compiled_bytecode == processed_blockchain_bytecode) {
                console.log("Verified!");
                data['valid'] = true;
                data['bytecode'] = blockchain_bytecode;
                data['abi'] = compiled[contractName].abi;
                break;
            } else {
                console.log("Not Verified");
            }
        }
    }

    return data;
}



function processBytecode(bytecode, solc_version) {
    // Semantic versioning
    let solc_minor = parseInt(solc_version.match(/v\d+?\.\d+?\.\d+?[+-]/gi)[0].match(/\.\d+/g)[0].slice(1))
    let solc_patch = parseInt(solc_version.match(/v\d+?\.\d+?\.\d+?[+-]/gi)[0].match(/\.\d+/g)[1].slice(1))
    if (solc_minor > 4) {
        var starting_point = bytecode.lastIndexOf('6080604052');
        var ending_point = bytecode.search('a264697066735822');
        return bytecode.slice(starting_point, ending_point);
    } else if (solc_minor = 4 && solc_patch >= 7) {
        var starting_point = bytecode.lastIndexOf('6060604052');
        var ending_point = bytecode.search('a165627a7a72305820');
        return bytecode.slice(starting_point, ending_point);
    } else if (solc_minor = 4 && solc_patch >= 22) {
        var starting_point = bytecode.lastIndexOf('6080604052');
        var ending_point = bytecode.search('a165627a7a72305820');
        return bytecode.slice(starting_point, ending_point);
    } else {
        return bytecode;
    }
}

function remove_immutable(bytecode, immutableReferences) {
    let result = bytecode;
    Object.keys(immutableReferences).forEach(
        (refKeys) => immutableReferences[refKeys].forEach(
            (info) => result = result.substr(0, info["start"] * 2) + "0".repeat(info["length"] * 2) + result.substr(info["start"] * 2 + info["length"] * 2, result.length)
        )
    )
    return result;

}


function getAllowVersionList() {
    return [
        "v0.3.6+commit.3fc68da5",
        "v0.4.0+commit.acd334c9",
        "v0.4.1+commit.4fc6fc2c",
        "v0.4.10+commit.f0d539ae",
        "v0.4.11+commit.68ef5810",
        "v0.4.12+commit.194ff033",
        "v0.4.13+commit.0fb4cb1a",
        "v0.4.14+commit.c2215d46",
        "v0.4.15+commit.bbb8e64f",
        "v0.4.16+commit.d7661dd9",
        "v0.4.17+commit.bdeb9e52",
        "v0.4.18+commit.9cf6e910",
        "v0.4.19+commit.c4cbbb05",
        "v0.4.2+commit.af6afb04",
        "v0.4.20+commit.3155dd80",
        "v0.4.21+commit.dfe3193c",
        "v0.4.22+commit.4cb486ee",
        "v0.4.23+commit.124ca40d",
        "v0.4.24+commit.e67f0147",
        "v0.4.25+commit.59dbf8f1",
        "v0.4.26+commit.4563c3fc",
        "v0.4.3+commit.2353da71",
        "v0.4.4+commit.4633f3de",
        "v0.4.5+commit.b318366e",
        "v0.4.6+commit.2dabbdf0",
        "v0.4.7+commit.822622cf",
        "v0.4.8+commit.60cc1668",
        "v0.4.9+commit.364da425",
        "v0.5.0+commit.1d4f565a",
        "v0.5.1+commit.c8a2cb62",
        "v0.5.10+commit.5a6ea5b1",
        "v0.5.11+commit.c082d0b4",
        "v0.5.12+commit.7709ece9",
        "v0.5.13+commit.5b0b510c",
        "v0.5.14+commit.01f1aaa4",
        "v0.5.15+commit.6a57276f",
        "v0.5.16+commit.9c3226ce",
        "v0.5.2+commit.1df8f40c",
        "v0.5.3+commit.10d17f24",
        "v0.5.4+commit.9549d8ff",
        "v0.5.5+commit.47a71e8f",
        "v0.5.6+commit.b259423e",
        "v0.5.7+commit.6da8b019",
        "v0.5.8+commit.23d335f2",
        "v0.5.9+commit.e560f70d",
        "v0.6.0+commit.26b70077",
        "v0.6.1+commit.e6f7d5a4",
        "v0.6.10+commit.00c0fcaf",
        "v0.6.11+commit.5ef660b1",
        "v0.6.12+commit.27d51765",
        "v0.6.2+commit.bacdbe57",
        "v0.6.3+commit.8dda9521",
        "v0.6.4+commit.1dca32f3",
        "v0.6.5+commit.f956cc89",
        "v0.6.6+commit.6c089d02",
        "v0.6.7+commit.b8d736ae",
        "v0.6.8+commit.0bbfe453",
        "v0.6.9+commit.3e3065ac",
        "v0.7.0+commit.9e61f92b",
        "v0.7.1+commit.f4a555be",
        "v0.7.2+commit.51b20bc0",
        "v0.7.3+commit.9bfce1f6",
        "v0.7.4+commit.3f05b770",
        "v0.7.5+commit.eb77ed08",
        "v0.7.6+commit.7338295f",
        "v0.8.0+commit.c7dfd78e",
        "v0.8.1+commit.df193b15",
        "v0.8.2+commit.661d1103",
        "v0.8.3+commit.8d00100c",
        "v0.8.4+commit.c7e474f2",
        "v0.8.5+commit.a4f2e591",
        "v0.8.6+commit.11564f7e"
    ];
}

module.exports = {
    index
}