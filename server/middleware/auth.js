const dotenv = require('dotenv');
dotenv.config();

const auth = (req, res, next) => {
    // Get token from header
    const token = req.header('x-auth-token');

    // Check if no token
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        // Verify token (Simple match with env variable for this scope)
        if (token === process.env.ADMIN_SECRET) {
            next();
        } else {
            res.status(401).json({ msg: 'Token is not valid' });
        }
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

module.exports = auth;
