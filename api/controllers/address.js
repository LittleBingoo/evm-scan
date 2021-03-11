const Sequelize = require('sequelize');
const DB = require('../../models/index');
const Address = DB.Address;
const AddressResource = require('../resources/address');

async function index(req, res, next) {
    const limit = parseInt(req.query.limit);
    const offset = parseInt(req.query.offset);
    const orderby = parseInt(req.query.orderby);

    let order = 'DESC'
    if (orderby == 1) {
        order = 'ASC'
    }

    let condition = {
        order: [['fetched_coin_balance', order], ['fetched_coin_balance_block_number', 'DESC']],
        offset: offset ? offset : 0,
        limit: limit && limit <= 50 ? limit : 50
    }


    const addresses = await Address.findAll(condition);

    let data = [];

    for (let address of addresses) {
        let addressData = await AddressResource.serialize(address, true);
        data.push(addressData);
    }

    res.json({
        code: 0,
        data: data,
        pagination: {
            offset: condition.offset,
            limit: condition.limit,
            total: await Address.count(condition)
        }
    });
}


async function getByHash(req, res, next) {
    const hash = req.params.hash;
    let address = await Address.findOne({where: {hash: hash}});
    if (address === null) {
        address = Address.build({
            hash: hash
        })
    }
    let addressData = await AddressResource.serialize(address);
    res.json({
        code: 0,
        data: addressData
    });
}


module.exports = {
    index,
    getByHash
}