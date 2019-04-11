const auth = require('../middleware/auth');
const User = require('../models/userSchema');

/**
 * GET {ROOT}/users
 */
module.exports.getAllUsers = function (req, res) {
    User
        .find()
        .sort({ _id: 1 })
        .exec(function (err, mes) {
            if (err) {
                res.status(500).send(err);
                return;
            }

            res.json(mes);
        });
};

/**
 * GET {ROOT}/users/:user_id
 */
module.exports.getOneUser = function (req, res) {
    User
        .findById(req.params.user_id)
        .exec(function (err, mes) {
            if (err) {
                res.status(500).send(err);
                return;
            }

            res.json(mes);
        });
};
