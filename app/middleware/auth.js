const config = require('../../config/config');
const jwt = require('jsonwebtoken');

const checkToken = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];

    if (token) {
        jwt.verify(token, config.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    status: 'success',
                    code: '401',
                    message: 'Token is not valid'
                });
            } else {
                req.userData = decoded;
                next();
            }
        });
    } else {
        return res.status(401).json({
            status: 'success',
            code: '401',
            message: 'Auth token is not supplied'
        });
    }
};
module.exports = checkToken;

/**
 * Retrieves the user ID from the header inside the access token.
 * @param {String} req The request with header.
 * @returns The value of user ID.
 */
module.exports.getUserIdFromToken = function getUserIdFromToken(req) {
    const authorization = req.headers.authorization;
    const part = authorization.split(' ');
    const decoded = jwt.decode(part[1], { complete: true });
    const userId = decoded.payload.sub;
    return userId;
};
