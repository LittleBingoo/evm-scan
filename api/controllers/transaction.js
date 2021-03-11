const Sequelize = require('sequelize');
const DB = require('../../models/index');
const Transaction = DB.Transaction;
const TransactionResource = require('../resources/transaction');

async function index(req, res, next) {
    const limit = parseInt(req.query.limit);
    const offset = parseInt(req.query.offset);
    const orderby = parseInt(req.query.orderby);

    let order = 'DESC'
    if (orderby == 1) {
        order = 'ASC'
    }

    let condition = {
        order: [['block_number', order], ['index', order]],
        offset: offset ? offset : 0,
        limit: limit && limit <= 200 ? limit : 50
    }


    const transactions = await Transaction.findAll(condition);

    let data = [];

    for (let transaction of transactions) {
        let transactionData = await TransactionResource.serialize(transaction, true);
        data.push(transactionData);
    }

    res.json({
        code: 0,
        data: data,
        pagination: {
            offset: condition.offset,
            limit: condition.limit,
            total: await Transaction.count(condition)
        }
    });
}


async function getByHash(req, res, next) {
    const hash = req.params.hash;
    let transaction = await Transaction.findOne({where: {hash: hash}});
    if (transaction === null) {
        return res.json({
            code: 404,
            data: null
        })
    }
    let transactionData = await TransactionResource.serialize(transaction);
    res.json({
        code: 0,
        data: transactionData
    });
}

async function getByAddress(req, res, next) {
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
            [Sequelize.Op.or]: [{ from_address_hash: address }, { to_address_hash: address }],
        },
        order: [['block_number', order], ['index', order]],
        offset: offset ? offset : 0,
        limit: limit && limit <= 200 ? limit : 50
    }


    const transactions = await Transaction.findAll(condition);

    let data = [];

    for (let transaction of transactions) {
        let transactionData = await TransactionResource.serialize(transaction, true);
        data.push(transactionData);
    }

    res.json({
        code: 0,
        data: data,
        pagination: {
            offset: condition.offset,
            limit: condition.limit,
            total: await Transaction.count(condition)
        }
    });
}


module.exports = {
    index,
    getByHash,
    getByAddress,
}