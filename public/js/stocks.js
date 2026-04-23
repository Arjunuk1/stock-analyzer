const stocksList = document.getElementById('stocksList');
const stockMessage = document.getElementById('stockMessage');
const loadStocksBtn = document.getElementById('loadStocksBtn');
const stockDateInput = document.getElementById('stockDateInput');
const stockDateSearchBtn = document.getElementById('stockDateSearchBtn');

function renderStocks(stocks) {
  if (!Array.isArray(stocks) || stocks.length === 0) {
    stocksList.textContent = 'No stocks available';
    return;
  }

  const rows = stocks.map((stock) => `
    <tr>
      <td>${stock.date}</td>
      <td>${stock.open.toFixed(2)}</td>
      <td>${stock.high.toFixed(2)}</td>
      <td>${stock.low.toFixed(2)}</td>
      <td>${stock.close.toFixed(2)}</td>
      <td>${stock.volume.toLocaleString()}</td>
    </tr>
  `).join('');

  stocksList.innerHTML = `
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
}

async function loadStocks() {
  stocksList.textContent = 'Loading...';
  try {
    const response = await fetch('/stocks');
    const data = await response.json();

    if (!response.ok) {
      stocksList.textContent = data.message || 'Failed to load stocks';
      return;
    }

    renderStocks(data);
  } catch (error) {
    stocksList.textContent = 'Request failed';
  }
}

stockDateSearchBtn.addEventListener('click', async () => {
  const date = stockDateInput.value;

  if (!date) {
    stockMessage.textContent = 'Please select a date first';
    return;
  }

  stockMessage.textContent = 'Searching...';
  try {
    const response = await fetch(`/stocks/search?date=${encodeURIComponent(date)}`);

    const data = await response.json();

    if (!response.ok) {
      stockMessage.textContent = data.message || 'Search failed';
      return;
    }

    stockMessage.innerHTML = `
      <p><strong>Date:</strong> ${data.date}</p>
      <p><strong>Open:</strong> ${data.open.toFixed(2)}</p>
      <p><strong>High:</strong> ${data.high.toFixed(2)}</p>
      <p><strong>Low:</strong> ${data.low.toFixed(2)}</p>
      <p><strong>Close:</strong> ${data.close.toFixed(2)}</p>
      <p><strong>Volume:</strong> ${data.volume.toLocaleString()}</p>
    `;
  } catch (error) {
    stockMessage.textContent = 'Request failed';
  }
});

loadStocksBtn.addEventListener('click', loadStocks);

loadStocks();
