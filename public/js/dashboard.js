const userInfo = document.getElementById('userInfo');
const dateInput = document.getElementById('dateInput');
const searchDateBtn = document.getElementById('searchDateBtn');
const searchResult = document.getElementById('searchResult');
const runAnalysisBtn = document.getElementById('runAnalysisBtn');
const analysisResult = document.getElementById('analysisResult');
const loadStocksBtn = document.getElementById('loadStocksBtn');
const dataTable = document.getElementById('dataTable');

async function loadProfile() {
  const token = localStorage.getItem('token');

  if (!token) {
    userInfo.textContent = 'Please login first to view your profile.';
    return;
  }

  try {
    const response = await fetch('/profile', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await response.json();

    if (!response.ok) {
      userInfo.textContent = data.message || 'Failed to load profile';
      return;
    }

    userInfo.innerHTML = `
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      ${data.profilePic ? `<img src="${data.profilePic}" alt="Profile" width="84" class="profile-thumb">` : '<p>No profile image</p>'}
    `;
  } catch (error) {
    userInfo.textContent = 'Request failed';
  }
}

function renderTable(stocks) {
  if (!Array.isArray(stocks) || stocks.length === 0) {
    dataTable.textContent = 'No stock data found';
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
}

searchDateBtn.addEventListener('click', async () => {
  const date = dateInput.value;

  if (!date) {
    searchResult.textContent = 'Please select a date first';
    return;
  }

  searchResult.textContent = 'Searching...';
  try {
    const response = await fetch(`/stocks/search?date=${encodeURIComponent(date)}`);
    const data = await response.json();

    if (!response.ok) {
      searchResult.textContent = data.message || 'Search failed';
      return;
    }

    searchResult.innerHTML = `
      <p><strong>Date:</strong> ${data.date}</p>
      <p><strong>Open:</strong> ${data.open.toFixed(2)}</p>
      <p><strong>High:</strong> ${data.high.toFixed(2)}</p>
      <p><strong>Low:</strong> ${data.low.toFixed(2)}</p>
      <p><strong>Close:</strong> ${data.close.toFixed(2)}</p>
      <p><strong>Volume:</strong> ${data.volume.toLocaleString()}</p>
    `;
  } catch (error) {
    searchResult.textContent = 'Request failed';
  }
});

runAnalysisBtn.addEventListener('click', async () => {
  analysisResult.textContent = 'Analyzing CSV data...';
  try {
    const response = await fetch('/stocks/analysis');
    const data = await response.json();

    if (!response.ok) {
      analysisResult.textContent = data.message || 'Analysis failed';
      return;
    }

    analysisResult.innerHTML = `
      <p><strong>Total Days:</strong> ${data.totalDays}</p>
      <p><strong>Highest Price:</strong> ${data.highestPrice.toFixed(2)}</p>
      <p><strong>Lowest Price:</strong> ${data.lowestPrice.toFixed(2)}</p>
      <p><strong>Average Close:</strong> ${data.averageClose.toFixed(2)}</p>
      <p><strong>Average Volume:</strong> ${data.averageVolume.toLocaleString()}</p>
      <p><strong>Period:</strong> ${data.firstDate} to ${data.lastDate}</p>
      <p><strong>Trend:</strong> ${data.trend}</p>
    `;
  } catch (error) {
    analysisResult.textContent = 'Request failed';
  }
});

loadStocksBtn.addEventListener('click', async () => {
  dataTable.textContent = 'Loading...';
  try {
    const response = await fetch('/stocks');
    const data = await response.json();

    if (!response.ok) {
      dataTable.textContent = data.message || 'Failed to load stocks';
      return;
    }

    renderTable(data);
  } catch (error) {
    dataTable.textContent = 'Request failed';
  }
});

loadProfile();
