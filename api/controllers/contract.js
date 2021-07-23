const Sequelize = require('sequelize');
const DB = require('../../models/index');
const SmartContract = DB.SmartContract;
const ContractResource = require('../resources/contract');

async function getByHash(req, res, next) {
    const hash = req.params.hash.toLowerCase();
    let contract = await SmartContract.findOne({where: {address_hash: hash}});
    if (contract === null) {
        return res.json({
            code: 404,
            data: null
        })
    }
    let contractData = await ContractResource.serialize(contract);
    res.json({
        code: 0,
        data: contractData
    });
}


module.exports = {
    getByHash
}