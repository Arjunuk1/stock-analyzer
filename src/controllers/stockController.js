const fs = require('fs');
const path = require('path');
const Stock = require('../models/Stock');

const csvFilePath = path.join(__dirname, '../../data/stock-data.csv');

function readStockCsv() {
    const raw = fs.readFileSync(csvFilePath, 'utf-8').trim();
    const lines = raw.split('\n');

    if (lines.length <= 1) return [];

    return lines.slice(1).map((line) => {
        const [date, open, high, low, close, volume] = line.split(',');
        return {
            date,
            open: Number(open),
            high: Number(high),
            low: Number(low),
            close: Number(close),
            volume: Number(volume)
        };
    });
}

exports.getStocks = async (req, res) => {
    try {
        const stocks = readStockCsv();
        return res.json(stocks);
    } catch (error) {
        return res.status(500).json({ message: 'Failed to fetch stocks' });
    }
};

exports.searchByDate = async (req, res) => {
    try {
        const { date } = req.query;

        if (!date) {
            return res.status(400).json({ message: 'Date query is required' });
        }

        const stocks = readStockCsv();
        const result = stocks.find((item) => item.date === date);

        if (!result) {
            return res.status(404).json({ message: 'No stock data found for this date' });
        }

        return res.json(result);
    } catch (error) {
        return res.status(500).json({ message: 'Failed to search stock by date' });
    }
};

exports.runAnalysis = async (req, res) => {
    try {
        const stocks = readStockCsv();

        if (!stocks.length) {
            return res.status(404).json({ message: 'No stock data found' });
        }

        const closes = stocks.map((item) => item.close);
        const highs = stocks.map((item) => item.high);
        const lows = stocks.map((item) => item.low);
        const volumes = stocks.map((item) => item.volume);

        const highestPrice = Math.max(...highs);
        const lowestPrice = Math.min(...lows);
        const averageClose = closes.reduce((sum, value) => sum + value, 0) / closes.length;
        const averageVolume = Math.round(volumes.reduce((sum, value) => sum + value, 0) / volumes.length);
        const firstClose = closes[0];
        const lastClose = closes[closes.length - 1];
        const trend = lastClose > firstClose ? 'Uptrend' : lastClose < firstClose ? 'Downtrend' : 'Sideways';

        return res.json({
            totalDays: stocks.length,
            highestPrice,
            lowestPrice,
            averageClose: Number(averageClose.toFixed(2)),
            averageVolume,
            firstDate: stocks[0].date,
            lastDate: stocks[stocks.length - 1].date,
            trend
        });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to run stock analysis' });
    }
};

exports.addStock = async (req, res) => {
    try {
        const { name, price } = req.body;

        if (!name || price === undefined) {
            return res.status(400).json({ message: 'Name and price are required' });
        }

        const stock = await Stock.create({
            name,
            price: Number(price),
            date: new Date()
        });

        return res.status(201).json(stock);
    } catch (error) {
        return res.status(500).json({ message: 'Failed to add stock' });
    }
};