document.getElementById("analyzeBtn").addEventListener("click", async () => {

    const response = await fetch('/api/analysis');
    const data = await response.json();

    document.getElementById("highest").textContent = data.highestPrice;
    document.getElementById("lowest").textContent = data.lowestPrice;
    document.getElementById("trend").textContent = data.trend;

    const movingAvgArray = data.movingAverage;
    const lastMovingAvg = movingAvgArray[movingAvgArray.length - 1];

    document.getElementById("movingAvg").textContent = lastMovingAvg;
});