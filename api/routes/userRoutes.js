const router = require('express').Router();
const userController = require('../controllers/userController');
const checkToken = require('../_middleware/auth');

// endpoints {ROOT}/users
router
    .route('/')
    .get(checkToken, userController.getAllUsers)
    .post(checkToken, userController.createUser);

// endpoints {ROOT}/users/:user_id
router.route('/:user_id')
    .get(checkToken, userController.getOneUser)
    .put(checkToken, userController.createUser)
    .delete(checkToken, userController.deleteUser);

module.exports = router;
