const Sequelize = require('sequelize');
const DB = require('../../models/index');
const Token = DB.Token;
const TokenResource = require('../resources/token');
const TokenDetailResource = require('../resources/tokenDetail');

async function index(req, res, next) {
    const limit = parseInt(req.query.limit);
    const offset = parseInt(req.query.offset);
    const orderby = parseInt(req.query.orderby);

    let order = 'DESC'
    if (orderby == 1) {
        order = 'ASC'
    }

    let condition = {
        order: [['holder_count', order], ['created_at', 'ASC']],
        offset: offset ? offset : 0,
        limit: limit && limit <= 50 ? limit : 50
    }


    const tokens = await Token.findAll(condition);

    let data = [];

    for (let token of tokens) {
        let tokenData = await TokenResource.serialize(token, true);
        data.push(tokenData);
    }

    res.json({
        code: 0,
        data: data,
        pagination: {
            offset: condition.offset,
            limit: condition.limit,
            total: await Token.count(condition)
        }
    });
}


async function getByContract(req, res, next) {
    const contract = req.params.contract.toLowerCase();

    let token = await Token.findOne({where: {contract_address_hash: contract}});

    if (token === null) {
        return res.json({
            code: 404,
            data: null
        })
    }
    let tokenData = await TokenDetailResource.serialize(token);
    res.json({
        code: 0,
        data: tokenData
    });
}


module.exports = {
    index,
    getByContract
}