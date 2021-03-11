var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Evm explorer api' });
});

// Api Controllers

const BlockController = require('../controllers/block.js');
router.get('/block/number/:number', BlockController.getByNumber);
router.get('/block/hash/:hash', BlockController.getByHash);
router.get('/blocks/', BlockController.index);


const TransactionController = require('../controllers/transaction.js');
router.get('/transaction/hash/:hash', TransactionController.getByHash);
router.get('/transactions/', TransactionController.index);
router.get('/transactions/address/:address', TransactionController.getByAddress);


const AddressController = require('../controllers/address.js');
router.get('/address/:hash', AddressController.getByHash);
router.get('/addresses/', AddressController.index);



const TokenTransferController = require('../controllers/tokenTransfer.js');
router.get('/token_transfers/address/:address', TokenTransferController.getByAddress);
router.get('/token_transfers/:hash', TokenTransferController.getByHash);
router.get('/token_transfers/:hash/address/:address', TokenTransferController.getByHashAndAddress);


module.exports = router;
