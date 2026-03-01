class StockAnalyzer {
    constructor(stockData) {
        this.stockData = stockData;
        this.closingPrices = stockData.map(day => day.close);
    }

    // 1️⃣ Highest price
    getHighestPrice() {
        return Math.max(...this.closingPrices);
    }

    // 2️⃣ Lowest price
    getLowestPrice() {
        return Math.min(...this.closingPrices);
    }

    // 3️⃣ Moving Average (Sliding Window)
    getMovingAverage(windowSize = 5) {
        const prices = this.closingPrices;
        const result = [];

        let sum = 0;

        for (let i = 0; i < prices.length; i++) {
            sum += prices[i];

            if (i >= windowSize) {
                sum -= prices[i - windowSize];
            }

            if (i >= windowSize - 1) {
                result.push((sum / windowSize).toFixed(2));
            }
        }

        return result;
    }

    // 4️⃣ Stock Span (Stack Algorithm)
    getStockSpan() {
        const prices = this.closingPrices;
        const stack = [];
        const span = new Array(prices.length);

        for (let i = 0; i < prices.length; i++) {

            while (stack.length > 0 && prices[stack[stack.length - 1]] <= prices[i]) {
                stack.pop();
            }

            span[i] = stack.length === 0 ? i + 1 : i - stack[stack.length - 1];

            stack.push(i);
        }

        return span;
    }
    // 5️⃣ Binary Search by Date
searchByDate(targetDate) {
    let left = 0;
    let right = this.stockData.length - 1;

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        const midDate = this.stockData[mid].date;

        if (midDate === targetDate) {
            return this.stockData[mid];
        }

        if (midDate < targetDate) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    return null; // Not found
}
}

module.exports = StockAnalyzer;