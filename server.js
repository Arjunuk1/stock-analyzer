const express = require('express');
const path = require('path');

const DataManager = require('./services/DataManager');
const StockAnalyzer = require('./services/StockAnalyzer');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Test route
app.get('/api/test', (req, res) => {
    res.json({ message: "Server is running 🚀" });
});

// ✅ Stock data route
app.get('/api/stock', (req, res) => {
    const dataManager = new DataManager();
    const stockData = dataManager.readCSV();
    res.json(stockData);
});

// ✅ Analysis route (PUT IT HERE)
app.get('/api/analysis', (req, res) => {
    const dataManager = new DataManager();
    const stockData = dataManager.readCSV();

    const analyzer = new StockAnalyzer(stockData);

    res.json({
        highestPrice: analyzer.getHighestPrice(),
        lowestPrice: analyzer.getLowestPrice(),
        movingAverage: analyzer.getMovingAverage(5),
        stockSpan: analyzer.getStockSpan()
    });
});

// 🔎 Search by date
app.get('/api/search', (req, res) => {
    const date = req.query.date;

    if (!date) {
        return res.status(400).json({ error: "Date query parameter required" });
    }

    const dataManager = new DataManager();
    const stockData = dataManager.readCSV();

    const analyzer = new StockAnalyzer(stockData);

    const result = analyzer.searchByDate(date);

    if (!result) {
        return res.status(404).json({ message: "Date not found" });
    }

    res.json(result);
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});