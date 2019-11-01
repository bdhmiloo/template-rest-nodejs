const config = require('../../config/config');
const jwt = require('jsonwebtoken');

const checkToken = (req, res, next) => {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (token) {
        token = token.split(' ')[1];

        jwt.verify(token, config.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    success: 'false',
                    message: 'Token is not valid'
                });
            } else {
                req.userData = decoded;
                next();
            }
        });
    } else {
        return res.status(403).json({
            success: 'false',
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
