var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    var renderObj = {
        page: 'home',
        title: 'Express'
    };
    //res.send('respond with a resource');
    res.render('index', renderObj);
});

module.exports = router;
