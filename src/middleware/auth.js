const jwt = require('jsonwebtoken');

const authenticate = (token) => {
  if (!token) return null;

  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
    return { id: decoded.userId };
  } catch (error) {
    return null;
  }
};

module.exports = { authenticate };