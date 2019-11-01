const bcrypt = require('bcryptjs');
const User = require('../models/userSchema');

module.exports = {
    getAllUsers,
    getOneUser,
    createUser,
    updateUser,
    deleteUser
};

function getAllUsers(req, res) {
    User
        .find()
        .sort({ _id: 1 })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
}

function getOneUser(req, res) {
    User
        .findById(req.params.user_id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
}

function createUser(req, res) {
    const newUser = new User(req.body);
    newUser.password = bcrypt.hashSync(req.body.password, 20);

    newUser
        .save()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
}

function updateUser(req, res) {

}

function deleteUser(req, res) {
    User
        .findByIdAndRemove(req.params.user_id)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message
            });
        });
}
