const mongoose = require('mongoose');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

let localMongoProcess = null;

function getMongoUri() {
  return process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/stock-analyzer';
}

function isLocalMongoUri(uri) {
  return /^mongodb:\/\/(localhost|127\.0\.0\.1)(:\d+)?\//.test(uri);
}

function startLocalMongoServer() {
  if (localMongoProcess) {
    return;
  }

  const dbPath = path.join(__dirname, '../../.mongo-data');
  fs.mkdirSync(dbPath, { recursive: true });

  const args = [
    '--dbpath', dbPath,
    '--bind_ip', '127.0.0.1',
    '--port', '27017',
    '--nounixsocket',
    '--quiet'
  ];

  localMongoProcess = spawn('mongod', args, {
    detached: true,
    stdio: 'ignore'
  });

  localMongoProcess.unref();
}

function waitFor(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function connectWithRetry(uri, attempts = 10) {
  let lastError = null;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 3000
      });
      return true;
    } catch (error) {
      lastError = error;

      if (attempt < attempts) {
        await waitFor(1000);
      }
    }
  }

  throw lastError;
}

const connectDB = async () => {
  const mongoUri = getMongoUri();

  try {
    await connectWithRetry(mongoUri, 1);
    console.log('MongoDB connected');
  } catch (err) {
    if (isLocalMongoUri(mongoUri)) {
      console.warn('MongoDB is not running locally. Starting a local MongoDB process for this app.');
      startLocalMongoServer();

      try {
        await connectWithRetry(mongoUri, 15);
        console.log('MongoDB connected');
        return;
      } catch (retryError) {
        console.error('MongoDB connection failed:', retryError.message);
        console.error('Auth/profile features will remain unavailable until MongoDB starts.');
        return;
      }
    }

    console.error('MongoDB connection failed:', err.message);
    console.error('Auth/profile features will remain unavailable until MongoDB starts.');
  }
};

module.exports = connectDB;
