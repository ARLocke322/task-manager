var express = require('express');
var router = express.Router();
const UserController = require('../controllers/UserController');

/* GET users listing. */
router.post('/login', UserController.login);

router.post('/register', UserController.register);

router.get('/profile', UserController.getProfile);

module.exports = router;
