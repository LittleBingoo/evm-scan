const Sequelize = require('sequelize');
const DB = require('../../models/index');
const Block = DB.Block;
const BlockResource = require('../resources/block');

async function index(req, res, next) {
    const limit = parseInt(req.query.limit);
    const offset = parseInt(req.query.offset);
    const orderby = parseInt(req.query.orderby);

    let order = 'DESC'
    if (orderby == 1) {
        order = 'ASC'
    }

    let condition = {
        order: [['number', order]],
        offset: offset ? offset : 0,
        limit: limit && limit <= 200 ? limit : 50
    };

    const blocks = await Block.findAll(condition);

    let data = [];

    for (let block of blocks) {
        let blockData = await BlockResource.serialize(block);
        data.push(blockData);
    }

    res.json({
        code: 0,
        data: data,
        pagination: {
            offset: condition.offset,
            limit: condition.limit,
            total: await Block.count(condition)
        }
    });
}

async function getByNumber(req, res, next) {
    const number = req.params.number;
    let block = await Block.findOne({where: {number: number}});
    if (block === null) {
        return res.json({
            code: 404,
            data: null
        })
    }

    
    let blockData = await BlockResource.serialize(block);

    res.json({
        code: 0,
        data: blockData
    });
}

async function getByHash(req, res, next) {
    const hash = req.params.hash;
    let block = await Block.findOne({where: {hash: hash}});
    if (block === null) {
        return res.json({
            code: 404,
            data: null
        })
    }
    let blockData = await BlockResource.serialize(block);
    res.json({
        code: 0,
        data: blockData
    });
}


module.exports = {
    index,
    getByNumber,
    getByHash
}