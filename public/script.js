// DOM Elements
const analyzeBtn = document.getElementById('analyzeBtn');
const searchBtn = document.getElementById('searchBtn');
const loadDataBtn = document.getElementById('loadDataBtn');
const dateInput = document.getElementById('dateInput');

// Analysis Function
analyzeBtn.addEventListener('click', async () => {
    try {
        showLoading(analyzeBtn, 'Analyzing...');
        
        const response = await fetch('/api/analysis');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // Update stat cards
        document.getElementById('highest-price').textContent = `$${data.highestPrice.toFixed(2)}`;
        document.getElementById('lowest-price').textContent = `$${data.lowestPrice.toFixed(2)}`;
        
        const trendEmoji = data.trend === 'Bullish' ? '🟢' : data.trend === 'Bearish' ? '🔴' : '🟡';
        document.getElementById('trend-display').textContent = `${trendEmoji} ${data.trend}`;
        
        const movingAvgArray = data.movingAverage;
        const lastMovingAvg = movingAvgArray[movingAvgArray.length - 1];
        document.getElementById('moving-avg-display').textContent = `$${lastMovingAvg.toFixed(2)}`;
        
        // Display detailed analysis
        const analysisResult = document.getElementById('analysis-result');
        analysisResult.innerHTML = `
            <div class="result-item">
                <span class="result-label">Highest Price:</span>
                <span class="result-value">$${data.highestPrice.toFixed(2)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Lowest Price:</span>
                <span class="result-value">$${data.lowestPrice.toFixed(2)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Market Trend:</span>
                <span class="result-value">${trendEmoji} ${data.trend}</span>
            </div>
            <div class="result-item">
                <span class="result-label">5-Day Moving Average:</span>
                <span class="result-value">$${lastMovingAvg.toFixed(2)}</span>
            </div>
            <div class="result-item">
                <span class="result-label">Stock Span (Last 5):</span>
                <span class="result-value">${data.stockSpan.slice(-5).join(', ')}</span>
            </div>
        `;
        analysisResult.classList.add('active');
        
        hideLoading(analyzeBtn, 'Run Analysis');
    } catch (error) {
        console.error('Error:', error);
        showError(document.getElementById('analysis-result'), 'Failed to fetch analysis data');
        hideLoading(analyzeBtn, 'Run Analysis');
    }
});

// Search by Date Function
searchBtn.addEventListener('click', async () => {
    const date = dateInput.value;
    
    if (!date) {
        showError(document.getElementById('search-result'), 'Please select a date');
        return;
    }
    
    try {
        showLoading(searchBtn, 'Searching...');
        
        const response = await fetch(`/api/search?date=${date}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        const searchResult = document.getElementById('search-result');
        
        if (data.message) {
            searchResult.innerHTML = `
                <div class="result-item">
                    <span class="result-value">⚠️ ${data.message}</span>
                </div>
            `;
        } else {
            searchResult.innerHTML = `
                <div class="result-item">
                    <span class="result-label">Date:</span>
                    <span class="result-value">${data.date}</span>
                </div>
                <div class="result-item">
                    <span class="result-label">Price:</span>
                    <span class="result-value">$${data.close.toFixed(2)}</span>
                </div>
            `;
        }
        
        searchResult.classList.add('active');
        hideLoading(searchBtn, 'Search');
    } catch (error) {
        console.error('Error:', error);
        showError(document.getElementById('search-result'), 'Failed to search date');
        hideLoading(searchBtn, 'Search');
    }
});

// Load All Stock Data
loadDataBtn.addEventListener('click', async () => {
    try {
        showLoading(loadDataBtn, 'Loading...');
        
        const response = await fetch('/api/stock');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        const dataTable = document.getElementById('data-table');
        
        if (!data || data.length === 0) {
            dataTable.innerHTML = '<div class="loading">No data available</div>';
            dataTable.classList.add('active');
            hideLoading(loadDataBtn, 'Load Data');
            return;
        }
        
        let tableHTML = `
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Date</th>
                        <th>Price</th>
                        <th>Change</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        data.forEach((item, index) => {
            let change = '';
            if (index > 0) {
                const priceDiff = item.close - data[index - 1].close;
                const changePercent = ((priceDiff / data[index - 1].close) * 100).toFixed(2);
                const arrow = priceDiff > 0 ? '🟢 ▲' : priceDiff < 0 ? '🔴 ▼' : '⚪ ━';
                change = `${arrow} ${Math.abs(changePercent)}%`;
            } else {
                change = '━';
            }
            
            tableHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${item.date}</td>
                    <td>$${item.close.toFixed(2)}</td>
                    <td>${change}</td>
                </tr>
            `;
        });
        
        tableHTML += `
                </tbody>
            </table>
        `;
        
        dataTable.innerHTML = tableHTML;
        dataTable.classList.add('active');
        hideLoading(loadDataBtn, 'Load Data');
    } catch (error) {
        console.error('Error:', error);
        showError(document.getElementById('data-table'), 'Failed to load stock data');
        hideLoading(loadDataBtn, 'Load Data');
    }
});

// Helper Functions
function showLoading(button, text) {
    button.disabled = true;
    button.style.opacity = '0.6';
    button.querySelector('.btn-text').textContent = text;
}

function hideLoading(button, text) {
    button.disabled = false;
    button.style.opacity = '1';
    button.querySelector('.btn-text').textContent = text;
}

function showError(element, message) {
    element.innerHTML = `
        <div class="result-item">
            <span class="result-value" style="color: #f5576c;">❌ ${message}</span>
        </div>
    `;
    element.classList.add('active');
}

// Auto-load analysis on page load
window.addEventListener('load', () => {
    analyzeBtn.click();
});