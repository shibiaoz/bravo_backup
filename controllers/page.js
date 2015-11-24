"use strict";
/**
 * page
 *  errno {
 *      1: success
 *      2: not find
 *      3: op database error
 *      4: param error
 * }
 */
var pageModel = require('../models/page');
var http = require('http');
var querystring = require('querystring');
var Q = require('q');
var logger = require('../log').logger;

//Parse, validate, manipulate, and display dates in javascript
var moment = require('moment');

/**
 * legend create
 * legendPost ,legeng post data,legend by zhangkejing
 * Contact _id and legendId
 * @param  {Object}   req  [description]
 * @param  {Object}   res  [description]
 * @param  {Function} next [description]
 */
exports.legendPostCreate = function (req, res, next) {
    var _id = req.param('_id');
    var legendId = req.param('legendId');
    var conditionObj = {
        _id: _id
    };
    pageModel.getOneInstance(conditionObj, function (err, page) {
        if (page) {
            page.pageStatus = 'created';
            page.legendId = legendId;
            console.log(page)
            page.update(function (result, flag) {
                if (flag) {
                    res.send({
                        no: 1,
                        msg: 'page update success',
                        result: result
                    });
                }
                else {
                    console.log('update failed ....');
                    res.send(result);
                }
            });
        }
        else {
            res.send({
                no: 0,
                msg: 'not find _id => ' + _id
            })
        }
    });
}

/**
 * legend 发布之后，更改状态，并且请求配置数据并做存储，
 * 这里的处理时间较长，请求2次，先拉一次配置在拉一次js中的数据
 * 用正则匹配之后存储
 * legend publish
 * if legend publish,completed,then post data to tell published
 * @param  {Object}   req  [description]
 * @param  {Object}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
exports.legendPostPublish = function (req, res, next) {
    var _id = req.param('_id');
    var conditionObj = {
        _id: _id
    };
    pageModel.getOneInstance(conditionObj, function (err, page) {
        if (page) {
            page.pageStatus = 'published';
            reqLegendCofig(page.legendId).done(function (legendConfig) {
                // page model 中update 方法中 特殊说明不应该随便扩展page的属性
                page.config = legendConfig;
                var pageUpdate = function () {
                    page.update(function (result, flag) {
                        if (flag) {
                            res.send({
                                no: 1,
                                msg: 'page update publish success',
                                result: result
                            });
                            logger.info('page publish success');
                        }
                        else {
                            console.log('update failed ....');
                            res.send(result);
                        }
                    });
                }
                logger.debug('before upate' + legendConfig.dataJsUrl);
                if (legendConfig && legendConfig.dataJsUrl) {

                    getData(legendConfig.dataJsUrl).done(function (resText){
                        logger.debug('getData callback =>' + resText);
                        // copy from 客户端的构建工具
                        var reg = /legend\.init\((.*)\)/gmi;
                        var result = resText.replace(reg, function  (s0, s1) {
                            return s1;
                        });
                        var dataStr = result.substring(0, result.lastIndexOf(','));

                        // 这里之前饭了一个错误，是dataStr 用JSON.stringify之后又parse
                        // 然后传给js2php 就导致无法正确的解析js => php
                        // 主要应该还是字符中双引号的问题，待研究
                        // 扩展config 的属性data 保证config· 的数据符合构建的数据
                        //
                        page.config.data = JSON.parse(dataStr);
                        pageUpdate();
                    });
                } else {
                    // 没有返回dataJsUrl，就不在去请求js's init data
                    pageUpdate();
                }
            });
        }
        else {
            res.send({
                no: 0,
                msg: 'not find _id => ' + _id
            })
        }
    });
}



/**
 * request => get
 * get page list
 * @param  {Object}   req  [description]
 * @param  {Object}   res  [description]
 * @param  {Function} next [description]
 */
exports.list = function (req, res, next) {
    // res.send('list....');
    // var readPageCallback = function (err, result) {
    //     res.render('page-list', result);
    // }
    // pageModel.get(null,readPageCallback);
    var p = req.query.p || 1;
    var sz = req.query.sz || 10;
    pageModel.get(null,function (err, result) {
        var format = 'YYYY-MM-DD HH:mm:ss';
        result.forEach(function (page, index) {
            result[index]['updateTime'] = moment(page.updateTime).format(format);
        });
        console.log(result);
        var size = result.length;
        var pageInfo = {
            p: p,
            total: size,
            totalPage: parseInt(size/sz) + 1,
            sz: sz
        }
        // var pageInfo = {
        //     p: 18,
        //     total: 30,
        //     totalPage: 20,
        //     sz: 10
        // }
        var renderObj = {
            page: 'page',
            list: result,
            pageInfo: pageInfo
        };
        res.render('page-list', renderObj);
    }, p);
}



/**
 * create a page
 * post data => title,name,
 * name 要做为control templete 的名字的
 */
exports.save = function (req, res, next) {
    console.log('page function save...');
    var title = req.body.title;
    var name = req.body.name;
    var pageObj = {
        _id: 'h5_' + Date.now(),
        title: title,
        name: name,
        author: 'zhangshibiao',
        createTime: Date.now(),
        updateTime: Date.now(),
        pageStatus: 'createing',
    };
    var page = new pageModel(pageObj);
    var reqData = JSON.stringify({
        appKey: 'tieba',
        secretKey: 'tieba-key',
        nickname: 'tiebaH5',
        avatorUrl: 'http://static.family.baidu.com/portal/static/img/family_people.jpg',
        onPublishedUrl: 'http://cp01-hj-lh-sandbox-tech00.epc.baidu.com:8081/page/publish'
    });
    var post_options = {
        host: 'legend.baidu.com',
        port: '8150',
        path: '/api/legend/create',
        method: 'POST',
        headers: {
          // 'Content-Type': 'application/x-www-form-urlencoded',
          "Content-Type": 'text/json',
          'Content-Length': reqData.length
        }
    };
    var reqLegend = http.request(post_options, function  (response) {
        // body...
        var responseText='';
        console.log('http request legend response => ' + response);
        if (response.statusCode == 200) {
            response.on('data', function (data) {
                console.log('page function save response.on => ' + data);
                responseText += data;
            });
            response.on('end', function () {
                var responseObj = JSON.parse(responseText);
                page.legendId = (responseObj && responseObj.data && responseObj.data.id) || '';
                page.pageStatus = 'created';
                if (!page.legendId || page.legendId == "") {
                    res.send('request legend not return legend id response=> ' + responseText);
                    return;
                }
                else {
                    page.save(function (err, result) {
                        if (result && result.result) {
                            console.log('save page success.... => legendId' + page.legendId);
                            var sendObj = {
                                no: 1,
                                _id: pageObj._id,
                                legendId: page.legendId,
                                msg: 'success createing',
                            };
                            res.send(sendObj);
                        }
                        else {
                            console.log('save page occur error...');
                            res.send(err);
                        }
                    });
                }
            });
        }
        else {
            console.log('request legend create ends code =>' + response );
            res.send('request legend create ends code=> ' + response.statusCode);
        }
    });
    reqLegend.write(reqData + "\n");
    reqLegend.end();
}


exports.delById = function (req, res, next) {
    var _id = req.param('id');
    if (_id) {
        var page = new pageModel({
            _id: _id
        });
        page.del(null, function (result, flag) {
            if (flag) {
                res.send({
                    no:1,
                    msg: 'success',
                    result: result
                });
            }else {
                res.send({
                    no:3, // op db erro
                    msg:'operate db error for del op  in page => ' + _id,
                    result: result
                });
            }

        });
    }
    else {
        res.send({
            no:4, // param
            msg: 'not find the page by _id=> ' + _id
        });
    }

}

/**
 * 根据id请求legend  的配置文件
 *
 */

function reqLegendCofig (id) {
    var deferred = Q.defer();
    var reqObj = {
        _data: 1,
        id: id,
    };
    var paramstring = querystring.stringify(reqObj);
    var prefixUrl = 'http://shushuo.baidu.com/legend/dev/?';
    var url = prefixUrl + paramstring;
    var httpReq = http.get(url);
    console.log('r')
    httpReq.on('error', function (e) {
        logger.error('httpReq error => ' + e.message);
        deferred.reject(e.message);
    });
    logger.info('request legend config url => ' + url);
    httpReq.on('response', function (response) {
        var resText = '';
        response.on('data' , function (chunk) {
            resText += chunk;
        });
        response.on('end', function () {
            try {
                logger.info('page => reqLegendCofig  ');
                deferred.resolve(JSON.parse(resText));
            }
            catch(e) {
                deferred.reject(e);
                logger.error('error in parse legend config => ' + e);
            }
        });
    });

    return deferred.promise;
}

/**
 *   根据url 获取文本内容
 *   返回的是promise
 * @param  {[type]} url [description]
 */
function getData (url) {
    logger.info('page getData =>' + url);
    var promise = Q.promise(function (resolve, reject, notify) {
        http.get(url, function (response) {
            var resTxt = '';
            response.on('data', function (trunk) {
                resTxt += trunk;
            });
            response.on('end' , function () {
                resolve(resTxt);
            });
        }).on('error', function (err) {
            reject(err);
        });
    });
    return promise;
}
