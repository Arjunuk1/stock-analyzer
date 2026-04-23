const express = require('express');
const router = express.Router();
const { getStocks, addStock, searchByDate, runAnalysis } = require('../controllers/stockController');

router.get('/stocks', getStocks);
router.post('/stocks', addStock);
router.get('/stocks/search', searchByDate);
router.get('/stocks/analysis', runAnalysis);

module.exports = router;