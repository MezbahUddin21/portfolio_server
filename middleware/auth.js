const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (error) {
    // Return the JWT error message so the client can act appropriately (expired, malformed, etc.)
    res.status(401).json({ message: error.message || 'Token is not valid' });
  }
};

module.exports = authMiddleware;
