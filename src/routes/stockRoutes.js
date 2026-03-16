const express = require("express");
const router = express.Router();

const stockController = require("../controllers/stockController");

router.get("/stock", stockController.getStockData);
router.get("/analysis", stockController.getAnalysis);
router.get("/search", stockController.searchByDate);

module.exports = router;