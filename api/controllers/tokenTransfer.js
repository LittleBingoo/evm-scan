const Sequelize = require('sequelize');
const DB = require('../../models/index');
const TokenTransfer = DB.TokenTransfer;
const TokenTransferResource = require('../resources/tokenTransfer');

async function getByHash(req, res, next) {
    const hash = req.params.hash;
    const limit = parseInt(req.query.limit);
    const offset = parseInt(req.query.offset);
    const orderby = parseInt(req.query.orderby);

    let order = 'DESC'
    if (orderby == 1) {
        order = 'ASC'
    }


    const tokenTransfers = await TokenTransfer.findAll({
        where: {
            token_contract_address_hash: hash
        },
        order: [['block_number', order]],
        offset: offset ? offset : 0,
        limit: limit && limit <= 200 ? limit : 50
    });

    let data = [];

    for (let tokenTransfer of tokenTransfers) {
        let tokenTransferData = await TokenTransferResource.serialize(tokenTransfer);
        data.push(tokenTransferData);
    }

    res.json({
        code: 0,
        data: data
    });
}


async function getByAddress(req, res, next) {
    const address = req.params.address;
    const limit = parseInt(req.query.limit);
    const offset = parseInt(req.query.offset);
    const orderby = parseInt(req.query.orderby);
    const erc721 = parseInt(req.query.erc721);

    let order = 'DESC'
    if (orderby == 1) {
        order = 'ASC'
    }

    if (erc721 == 1) {
        var condition = {
            where: {
                token_id: {[Sequelize.Op.ne]: 0},
                [Sequelize.Op.or]: [{ from_address_hash: address }, { to_address_hash: address }],
            },
            order: [['block_number', order]],
            offset: offset ? offset : 0,
            limit: limit && limit <= 200 ? limit : 50
        }
    } else {
        var condition = {
            where: {
                token_id: 0,
                [Sequelize.Op.or]: [{ from_address_hash: address }, { to_address_hash: address }],
            },
            order: [['block_number', order]],
            offset: offset ? offset : 0,
            limit: limit && limit <= 200 ? limit : 50
        }
    }


    let tokenTransfers = await TokenTransfer.findAll(condition);


    let data = [];

    for (let tokenTransfer of tokenTransfers) {
        let tokenTransferData = await TokenTransferResource.serialize(tokenTransfer);
        data.push(tokenTransferData);
    }

    res.json({
        code: 0,
        data: data,
        pagination: {
            offset: condition.offset,
            limit: condition.limit,
            total: await TokenTransfer.count(condition)
        }
    });
}

async function getByHashAndAddress(req, res, next) {
    const hash = req.params.hash;
    const address = req.params.address;
    const limit = parseInt(req.query.limit);
    const offset = parseInt(req.query.offset);
    const orderby = parseInt(req.query.orderby);

    let order = 'DESC'
    if (orderby == 1) {
        order = 'ASC'
    }

    let condition = {
        where: {
            token_contract_address_hash: hash,
            [Sequelize.Op.or]: [{ from_address_hash: address }, { to_address_hash: address }],
        },
        order: [['block_number', order]],
        offset: offset ? offset : 0,
        limit: limit && limit <= 200 ? limit : 50
    }


    const tokenTransfers = await TokenTransfer.findAll(condition);

    let data = [];

    for (let tokenTransfer of tokenTransfers) {
        let tokenTransferData = await TokenTransferResource.serialize(tokenTransfer);
        data.push(tokenTransferData);
    }

    res.json({
        code: 0,
        data: data,
        pagination: {
            offset: condition.offset,
            limit: condition.limit,
            total: await TokenTransfer.count(condition)
        }
    });
}


module.exports = {
    getByHash,
    getByAddress,
    getByHashAndAddress
}