var express = require('express');
var router = express.Router();
var controller = require('../controllers/controller')

/* GET home page. */
router.get('/', controller.getIndex);
router.get('/json', controller.getJson);
router.get('/page', controller.getPage);
router.get('/fileSync', controller.fileSync);
router.post('/list', controller.getList);
router.post('/detail', controller.getDetail);

module.exports = router;