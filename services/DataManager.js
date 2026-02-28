const fs = require('fs');
const path = require('path');

class DataManager {
    constructor() {
        this.csvPath = path.join(__dirname, '../data/stock-data.csv');
    }

    // Read CSV file
    readCSV() {
        const fileData = fs.readFileSync(this.csvPath, 'utf-8');

        const lines = fileData.trim().split('\n');

        // Remove header
        const dataLines = lines.slice(1);

        const stockData = dataLines.map(line => {
            const [date, open, high, low, close, volume] = line.split(',');

            return {
                date,
                open: parseFloat(open),
                high: parseFloat(high),
                low: parseFloat(low),
                close: parseFloat(close),
                volume: parseInt(volume)
            };
        });

        return stockData;
    }
}

module.exports = DataManager;