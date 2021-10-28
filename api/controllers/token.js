const setting = require('../../setting');
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
        where: {cataloged: true},
        order: [['official', 'ASC'], ['verified', 'ASC'], ['holder_count', order], ['created_at', 'DESC']],
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


async function search(req, res, next) {
    let keyword = req.params.keyword.toLowerCase();
    keyword = '%' + keyword + '%';

    let tokens = await Token.findAll({
        where: {
            [Sequelize.Op.or]: [
                {
                    name: {
                        [Sequelize.Op.iLike]: keyword
                    }
                },
                {
                    symbol: {
                        [Sequelize.Op.iLike]: keyword
                    }
                },
            ]
        }
    });

    let data = [];

    for (let token of tokens) {
        let tokenData = await TokenResource.serialize(token, true);
        data.push(tokenData);
    }

    res.json({
        code: 0,
        data: data,
    });
}



async function saveInformation(req, res, next) {

    const { contract_address } = req.body;
    const { name } = req.body;
    const { symbol } = req.body;
    const { total_supply } = req.body;
    const { decimals } = req.body;
    const { icon } = req.body;

    let token = await Token.findOne({where: {contract_address_hash: contract_address.toLowerCase()}});

    if (token == null) {
        await Token.create({
            contract_address_hash: contract_address.toLowerCase(),
            name: name,
            symbol: symbol,
            total_supply: total_supply,
            decimals: decimals,
            icon: icon,
            cataloged: 0,
        });
    } else if(token.icon == null) {
        token.icon = icon;
        await token.save();
    } else {
        return res.json({
            code: 400,
            data: null
        })
    }

    res.json({
        code: 0,
        data: null,
    });
}


async function tokenList(req, res, next) {
    const limit = parseInt(req.query.limit);
    const orderby = parseInt(req.query.orderby);

    let order = 'DESC'
    if (orderby == 1) {
        order = 'ASC'
    }

    let condition = {
        where: {cataloged: true, official: true},
        order: [['verified', 'ASC'], ['holder_count', order], ['created_at', 'DESC']],
        limit: limit && limit <= 200 ? limit : 200
    }


    const tokens = await Token.findAll(condition);

    let data = [];

    for (let token of tokens) {
        let tokenData = {
            chainId: setting.CHAIN_ID,
            address: token.contract_address_hash,
            name: token.name,
            symbol: token.symbol,
            decimals: token.decimals,
            logoURI: setting.TOKEN_ICON_BASE_URL + token.icon,
        }
        data.push(tokenData);
    }

    res.json({
        name: setting.CHAIN_NAME,
        logoURI: setting.CHAIN_LOGO,
        keywords: [
            setting.CHAIN_NAME
        ],
        timestamp: new Date(),
        version: {
            major: 1,
            minor: 1,
            patch: 0
        },
        tokens: data,
    });
}


module.exports = {
    index,
    getByContract,
    search,
    saveInformation,
    tokenList
}