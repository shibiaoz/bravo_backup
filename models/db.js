/**
 * db connect tools
 *
 */
var poolModule = require('generic-pool');
var settings = require('../settings'),
    serverOptions = {
        auto_reconnect: true,
        poolSize: 5, // 默认情况下为5，并发为5
    },
    dbOptions = {
        w:-1,// 设置w=-1是mongodb 1.2后的强制要求，见官方api文档
        logger:{
            doDebug:true,
            debug:function(msg,obj){
                console.log('[debug]',msg);
            },
            log:function(msg,obj){
                console.log('[log]',msg);
            },
            error:function(msg,obj){
                console.log('[error]',msg);
            }
        },
        safe: true
    },
    Db = require('mongodb').Db,
    Connection = require('mongodb').Connection,
    Server = require('mongodb').Server;
module.exports = new Db(settings.db, new Server(settings.host, settings.port, serverOptions), dbOptions);


var pool = poolModule.Pool({
    name: 'mongodb',
    create: function(callback) {
        var server_options={'auto_reconnect':false,poolSize:1};
        var db_options={w:-1};
        var mongoserver = new require('mongodb').Server(settings.host, settings.port,server_options );
        var db=new require('mongodb').Db(settings.db, mongoserver, db_options);
        db.open(function(err,db){
            if(err)return callback(err);
            callback(null,db);
        });
    },
    destroy: function(db) { db.close(); },
    max: 10,//根据应用的可能最高并发数设置
    idleTimeoutMillis : 30000,
    log : false
});
//module.exports = pool;
