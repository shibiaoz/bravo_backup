var mongodb = require('./db');

function Page(page) {
    this.title = page.title;
    this._id = page._id;
    // this.lengendId = page.lengendId;
    this.legendId = page.legendId;
    this.author = page.author;
    this.name = page.name || page.desp;
    this.coverUrl = page.coverUrl;
    this.createTime = page.createTime;
    this.updateTime = page.updateTime;
    this.pageStatus = page.pageStatus;
};

module.exports = Page;

/**
 * 存入Mongodb的文档
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
Page.prototype.save = function (callback) {

    // 虽然这种方法麻烦些，但能控制document的结构
    // 应该在数据库那一层也可以控制，目前还不知道
    var page = {
        title: this.title,
        _id: this._id,
        // lengendId: this.lengendId,
        legendId: this.legendId,
        author: this.author,
        name: this.name || this.desp,
        coverUrl: this.coverUrl,
        createTime: this.createTime,
        updateTime: this.updateTime,
        pageStatus: this.pageStatus
    };

    // 取到instance 的属性，然后赋值给Page，但容易导致instance
    // 携带额外的属性存储到数据库中
    // var page = {};
    // for (var key in this) {
    //     if (this.hasOwnProperty(key)) {
    //         ownPropery[key] = this[key];
    //     }
    // }

    mongodb.open(function(err, db) {
        if (err) {
            mongodb.close();
            console.log('open.......');
            return callback(err);
        }
        //读取Page集合,open collection,return collection handler
        db.collection('page', function(err, collection) {
            if (err) {
                console.log('collection.......');
                mongodb.close();
                return callback(err);
            }

            //添加索引,set unique field
            // collection.ensureIndex('pageId', {unique: true});
            // collection.ensureIndex('lengendId', {unique: true});

            //写入page文档,insert into
            collection.insert(page, {safe: true}, function(err, page) {
                console.log('collection.......');
                mongodb.close();
                callback(err, page);
            });
        });
    });
}

/**
 * 实例的删除方法，同时支持条件删除
 * call eg: page.del(null,callback) || page.del({
            $or:[
              {age:21},
              {name:"aa"}
            ]
        },callback)
 * @param  {[type]}   obj      [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
Page.prototype.del = function (obj,callback) {
    var filter = {};
    var isEmptyObj = function (obj) {
        var flag = true;
        for (var key in obj) {
            falg = false;
            break;
        }
        return flag;
    }

    if (isEmptyObj(obj)) {
        filter._id = this._id;
    }
    else {
        filter = obj;
    }
    mongodb.open(function (err, db) {
        var collection = db.collection('page');
        // collection.deleteOne
        // deleteMany
        collection.deleteOne(filter).then(function (result) {
            console.log(result);
            console.log('delete count => ' + result.deletedCount);
            if (result && result.deletedCount) {
                callback(result,true);
            }
            else {
                callback(result,false);
            }
            db.close();
        });
    });
}

/**
 * 实例的更新方法
 * @param  {Function} callback [回调]
 * @return {[type]}            [description]
 */
Page.prototype.update = function (callback) {
    if (!callback) {
        // 不传 callback 不会报错
        callback = function (err,result) {

        }
    }
    var filter = {
        _id: this._id,
    };

    var newPage = {};
    // 取到instance 的属性，然后赋值给Page， 尽量不要往Page上随便挂载属性
    for (var key in this) {
        if (this.hasOwnProperty(key)) {
            newPage[key] = this[key];
        }
    }
    // Get a collection
    mongodb.open(function (err, db) {
        if (err) {
            mongodb.close();
            callback(err, false);
        }
        var collection = db.collection('page');
        // collection.updateOne
        collection.updateOne(filter, {$set: newPage},{upsert:false,multi:true}).then(function (result) {
            db.close();
            if (result && result.result && result.result.n) {
                callback(result,true)
            }
            else {
                callback(result,false);
            }
        });
    });
return this;
}


// 读取文档
/**
 * get poge list based on coditionObj
 * @param  {[Object]}   conditionObj [description]
 * @param  {Function} callback     [description]
 * @return {[type]}                [description]
 */
Page.get = function (conditionObj, callback, pageNumber) {
    if (!conditionObj) {
        console.log('---------查询条件为空---------------->');
        conditionObj = {};
    }
    mongodb.open(function(err, db) {
        if (err) {
            mongodb.close();
            return callback(err);
        }
        //读取page集合
        db.collection('page', function(err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            // 查找[pageId属性为pageId]的文档
            // 任意查找， by conditionObj
            // 分页、排序
            collection.count(conditionObj, function  (err, total) {
                collection.find(conditionObj,{
                        skip: (pageNumber - 1)*10,
                        limit: 10,
                    })
                    .sort({updateTime: -1})
                    .toArray(function(err, result) {
                        mongodb.close();
                        if (result) {
                            //封装文档为Page对象
                            //var page = new Page(result);
                            callback(err, result);
                        } else {
                            callback(err, null);
                        }
                    });
                });
        });
    });
};

Page.prototype.test = function (){
    console.log('page prototype test....');
}


/**
 * 获取一个page文档对象,findOne, return page document object
 * @param  {Object}   conditionObj ,select condition eg:{author:zhangshibiao,title:'test'}
 * @param  {Function} callback     [description]
 * @return {Object}  page          [if success,return page object]
 */
Page.getOne = function (conditionObj, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            mongodb.close();
            callback(err,null);
            return false;
        }
        db.collection('page', function (err, collection) {
            if (err) {
                mongodb.close();
                callback(err,null);
                return false;
            }
            collection.findOne(conditionObj, function (err, result) {
                mongodb.close();
                if (result) {
                    callback(err,result);
                    return result;
                } else {
                    callback(err, null);
                    return false;
                }
            })
        });

    });
}

/**
 * [getOneInstance]
 * @param  {[type]}   conditionObj [description]
 * @param  {Function} callback     [description]
 * @return {Object}  page          [page instance or null]
 */
Page.getOneInstance = function (conditionObj, callback) {
    var page = null;
    var findCallback = function (err, result) {
        if (result) {
            console.log('find one page ');
            // instance
            var page = new Page(result);
            callback(err, page);
            return page;
        }
        else {
            callback(err, null);
        }
    }
    Page.getOne(conditionObj, findCallback);
    return page;
}



