var express = require('express');
var router = express.Router();
var controller = require('../controllers/userController')

/* GET users listing. */
router.get('/', controller.getLogin);

module.exports = router;
