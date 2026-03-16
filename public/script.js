const analyzeBtn = document.getElementById("analyzeBtn");
const searchBtn = document.getElementById("searchBtn");
const loadDataBtn = document.getElementById("loadDataBtn");
const dateInput = document.getElementById("dateInput");

const analysisResult = document.getElementById("analysisResult");
const searchResult = document.getElementById("searchResult");
const dataTable = document.getElementById("dataTable");
const apiLog = document.getElementById("apiLog");

function setLog(title, payload) {
  apiLog.textContent = `${title}\n\n${JSON.stringify(payload, null, 2)}`;
}

analyzeBtn.addEventListener("click", async () => {
  try {
    const response = await fetch("/api/analysis");
    const data = await response.json();

    if (!response.ok) {
      analysisResult.textContent = data.message || "Failed to run analysis";
      setLog("GET /api/analysis", data);
      return;
    }

    const movingAvg = data.movingAverage.length
      ? data.movingAverage[data.movingAverage.length - 1]
      : null;

    analysisResult.innerHTML = `
      <div>Highest Price: Rs ${data.highestPrice.toFixed(2)}</div>
      <div>Lowest Price: Rs ${data.lowestPrice.toFixed(2)}</div>
      <div>Moving Average (5 Days): ${movingAvg !== null ? `Rs ${movingAvg.toFixed(2)}` : "N/A"}</div>
      <div>Trend: ${data.trend}</div>
      <div>Stock Span: [${data.stockSpan.slice(0, 12).join(", ")}${data.stockSpan.length > 12 ? ", ..." : ""}]</div>
    `;

    setLog("GET /api/analysis", data);
  } catch (error) {
    analysisResult.textContent = "Request failed";
    setLog("GET /api/analysis", { error: error.message });
  }
});

searchBtn.addEventListener("click", async () => {
  const date = dateInput.value;

  if (!date) {
    searchResult.textContent = "Please select a date";
    return;
  }

  try {
    const response = await fetch(`/api/search?date=${encodeURIComponent(date)}`);
    const data = await response.json();

    if (!response.ok) {
      searchResult.textContent = data.message || "Date not found";
      setLog(`GET /api/search?date=${date}`, data);
      return;
    }

    searchResult.textContent = `Stock Price on ${data.date}: Rs ${Number(data.close).toFixed(2)}`;
    setLog(`GET /api/search?date=${date}`, data);
  } catch (error) {
    searchResult.textContent = "Request failed";
    setLog(`GET /api/search?date=${date}`, { error: error.message });
  }
});

loadDataBtn.addEventListener("click", async () => {
  try {
    const response = await fetch("/api/stock");
    const data = await response.json();

    if (!response.ok) {
      dataTable.textContent = data.message || "Failed to load data";
      setLog("GET /api/stock", data);
      return;
    }

    if (!Array.isArray(data) || data.length === 0) {
      dataTable.textContent = "No historical data found";
      setLog("GET /api/stock", data);
      return;
    }

    const rows = data.slice(0, 50).map(item => `
      <tr>
        <td>${item.date}</td>
        <td>${item.open}</td>
        <td>${item.high}</td>
        <td>${item.low}</td>
        <td>${item.close}</td>
        <td>${item.volume}</td>
      </tr>
    `).join("");

    dataTable.innerHTML = `
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Open</th>
            <th>High</th>
            <th>Low</th>
            <th>Close</th>
            <th>Volume</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    `;

    setLog("GET /api/stock", data.slice(0, 5));
  } catch (error) {
    dataTable.textContent = "Request failed";
    setLog("GET /api/stock", { error: error.message });
  }
});