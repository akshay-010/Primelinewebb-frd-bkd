const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET;

const verifyToken = (req, res, next) => {
    const authHeader = req.header('Authorization');

    if (!authHeader) {
        return res.status(401).json({ message: 'Access denied' });
    }

    // Extract the token by removing the "Bearer " prefix
    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access denied. Invalid token format.' });
    }

    try {
        const verified = jwt.verify(token, secretKey);
        req.user = verified;
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        console.error("Token verification failed:", err.message);
        res.status(400).json({ message: `Invalid token. Reason: ${err.message}` });
    }
};

module.exports = verifyToken;
