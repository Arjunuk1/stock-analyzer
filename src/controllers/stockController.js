const DataManager = require("../utils/DataManager");
const StockAnalyzer = require("../utils/StockAnalyzer");
const TrendDetector = require("../utils/TrendDetector");

exports.getStockData = (req, res) => {
    const dataManager = new DataManager();
    const stockData = dataManager.readCSV();
    res.json(stockData);
};

exports.getAnalysis = (req, res) => {

    const dataManager = new DataManager();
    const stockData = dataManager.readCSV();

    const analyzer = new StockAnalyzer(stockData);
    const trendDetector = new TrendDetector(stockData);

    res.json({
        highestPrice: analyzer.getHighestPrice(),
        lowestPrice: analyzer.getLowestPrice(),
        movingAverage: analyzer.getMovingAverage(5),
        stockSpan: analyzer.getStockSpan(),
        trend: trendDetector.detectTrend(5)
    });

};

exports.searchByDate = (req, res) => {

    const { date } = req.query;

    if (!date) {
        return res.status(400).json({ message: "Date query parameter required" });
    }

    const dataManager = new DataManager();
    const stockData = dataManager.readCSV();

    const analyzer = new StockAnalyzer(stockData);

    const result = analyzer.searchByDate(date);

    if (!result) {
        return res.status(404).json({ message: "Date not found" });
    }

    res.json(result);
};