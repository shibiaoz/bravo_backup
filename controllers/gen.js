/**
 * 主要是处理 客户端构建的逻辑h5gen
 *
 */
var _ = require('lodash');
var http = require('http');
var pageModel = require('../models/page');
var log = require('../log').logger;



exports.page = function  (req, res, next) {
    var pageType = req.param('pageType');
    var author = req.param('author');
    var pageid =  req.param('pageid');

    if (!pageType || !pageid) {
        res.send({
            no: -1,
            msg: 'some param is null'
        });
        return;
    }
    pageModel.getOne({
        _id: pageid,
    }, function (err, result) {
        if (result) {
            var config = result.config || {};
            log.info('gen => page -> result');
            log.info(result);
            delete result.config;
            var resObj = _.assign(result, config);
            res.send(resObj);
        }
        else {
            res.warn('not find');
            res.send('not find ');
        }

    });

}
