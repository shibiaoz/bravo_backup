var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.send('page....');
});

router.get('/page/aa', function(req, res, next) {
    res.send('page...aa.');
});

router.get('/aa', function(req, res, next) {
    res.send('page...aa.');
});



module.exports = router;
