const jwt = require('jsonwebtoken');

const currentSecret = process.env.JWT_SECRET || 'secret';
const legacySecrets = Array.from(new Set([currentSecret, 'secret']));

function signToken(payload, options = {}) {
  return jwt.sign(payload, currentSecret, options);
}

function verifyToken(token) {
  let lastError = null;

  for (const secret of legacySecrets) {
    try {
      return jwt.verify(token, secret);
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
}

module.exports = {
  currentSecret,
  signToken,
  verifyToken
};