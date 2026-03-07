# 📈 Stock Analyzer – Real-Time Stock Analysis Web Application

A full-stack stock analysis web application built using **Node.js, Express, and Data Structures & Algorithms (DSA)**.

This project demonstrates backend engineering concepts along with algorithmic stock analysis techniques such as Stock Span, Moving Average (Sliding Window), Binary Search, and Trend Detection.

---

## 🚀 Project Overview

Stock Analyzer is a backend-driven financial analytics system that:

- Reads historical stock data from CSV files
- Performs algorithmic analysis using DSA concepts
- Exposes REST APIs
- Displays results through a dynamic frontend dashboard

This project integrates:

- ✅ Backend Engineering (BEE)
- ✅ Data Structures & Algorithms
- ✅ OOPS in JavaScript
- ✅ File System CRUD operations
- ✅ Client–Server Architecture

---

## 🏗️ System Architecture

Client (Browser UI)  
⬇  
Express Server (Node.js)  
⬇  
File System (CSV Data Storage)  
⬇  
Algorithm Processing (DSA Layer)  
⬇  
JSON Response  

---

## 🧠 DSA Concepts Implemented

### 1️⃣ Stock Span Problem (Stack – O(n))
Calculates how many consecutive previous days had lower stock prices.

### 2️⃣ Moving Average (Sliding Window – O(n))
Efficient 5-day moving average calculation.

### 3️⃣ Binary Search (O(log n))
Search stock price by date efficiently.

### 4️⃣ Sorting & Aggregation
Find highest price, lowest price, and growth analysis.

### 5️⃣ Trend Detection
Identifies:
- 📈 Bullish
- 📉 Bearish
- ➖ Sideways

---

## ⚙️ Backend Features

- Express Server Setup
- REST API Design
- File Handling using `fs`
- Modular OOPS-based architecture
- Static File Serving
- Error Handling
- JSON API Responses

---

## 📊 API Endpoints

| Method | Endpoint | Description |
|--------|----------|------------|
| GET | `/api/analysis` | Get stock analytics (highest, lowest, moving average, trend) |
| GET | `/api/stock` | Get full historical stock data |
| GET | `/api/search?date=YYYY-MM-DD` | Search stock price by date |

---

## 🎨 Frontend Features

- Modern dashboard UI
- Run stock analysis
- Search stock by date
- Historical stock data table
- Percentage change calculation
- Trend visualization

---

## 📁 Project Structure
stock-analyzer/
│
├── server.js
├── data/
│ ├── stock-data.csv
│ └── stocks.json
│
├── services/
│ ├── DataManager.js
│ ├── Stock.js
│ ├── StockAnalyzer.js
│ └── TrendDetector.js
│
├── public/
│ ├── index.html
│ ├── style.css
│ └── script.js
│
└── package.json


---

## 💻 Tech Stack

- Node.js
- Express.js
- JavaScript (ES6)
- HTML5
- CSS3
- File System (No Database)

---

## 🎓 Learning Outcomes

This project demonstrates:

- Real-world backend system design
- Clean modular coding using OOPS
- Efficient algorithm implementation
- REST API architecture
- Client–Server communication
- Time complexity optimization

---

## 🔥 Why This Project Is Strong

Unlike basic CRUD projects, this application:

✔ Implements real DSA algorithms  
✔ Demonstrates engineering-level thinking  
✔ Shows understanding of time complexity  
✔ Integrates backend + algorithm + UI  
✔ Simulates financial analytics systems  

---

## 🚀 How to Run the website Locally

```bash
git clone https://github.com/Arjunuk1/stock-analyzer.git
cd stock-analyzer
npm install
node server.js
