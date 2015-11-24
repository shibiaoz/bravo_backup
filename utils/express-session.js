/**
 * To  把会话session信息存在mongodb中，express中好多的中间件都从express中分离出来
 * Please see https://github.com/senchalabs/connect#middleware.
 * 一栏的模块有express-session connect-mongo
 * session 
 */
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var settings = require('../settings');
module.exports = session({
    secret : settings.cookieSecret,
    resave: false,
    saveUninitialized:true,
    store : new MongoStore(
        {
            db : settings.db
        }, function() {
            console.log('connect session mongodb success...');
        }),
    cookie : {
        maxAge : new Date(Date.now() + 1000 * 60 * 60)
    }
});
