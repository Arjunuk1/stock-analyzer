class TrendDetector {
    constructor(stockData) {
        this.stockData = stockData;
        this.closingPrices = stockData.map(day => day.close);
    }

    detectTrend(days = 5) {
        const prices = this.closingPrices.slice(-days);

        let increasing = 0;
        let decreasing = 0;

        for (let i = 1; i < prices.length; i++) {
            if (prices[i] > prices[i - 1]) {
                increasing++;
            } else if (prices[i] < prices[i - 1]) {
                decreasing++;
            }
        }

        if (increasing > decreasing) {
            return "Bullish 📈";
        } else if (decreasing > increasing) {
            return "Bearish 📉";
        } else {
            return "Sideways ➖";
        }
    }
}

module.exports = TrendDetector;