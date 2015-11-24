var express = require('express');
var router = express.Router();

/* GET chanel listing. */
router.get('/', function(req, res, next) {
    var renderObj = {
        page: 'channel',
        title: 'Express'
    };
    res.render('channel', renderObj);
});

module.exports = router;
