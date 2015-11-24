/**
 * router.js
 *
 */

var express = require('express');
var router = express.Router();

var auth = require('./middlewares/auth');

//  index
var index = require('./controllers/index');

// channel
var channel = require('./controllers/channel');

// page
var page = require('./controllers/page');


// for gen h5gen generator
var gen = require('./controllers/gen');

// home
router.get('/', index.index);
router.get('/home', index.index);



// channel
router.get('/channel', channel.channel);



// page
router.post('/page/create',auth.authSure, page.save);
router.get('/page/del/:id',page.delById);
router.get('/page', page.list); // page list for /page

router.post('/page/list',page.legendPostCreate); // legend create post data
router.post('/page/publish', page.legendPostPublish); // legend publis post data

router.get('/gen/page', gen.page); // 构建工具构建请求，拉取配置

module.exports = router
