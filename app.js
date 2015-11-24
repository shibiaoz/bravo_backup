var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ejs = require('ejs');

var log = require('./log');

// express引入的ejs是最简版，不支持layout partial 等
//  ejs-mate 支持layout partial
//
// ejs https://github.com/mde/ejs ,not implement the filters
// var moment = require('moment');
// ejs.filters.dateformat=function(obj, format) {
//     if (format == undefined) {
//         format = 'YYYY-MM-DD HH:mm:ss';
//     }
//     var ret = moment(obj).format(format);
//     return ret == 'Invalid date' ? '0000-00-00 00:00:00' : ret;
// };

// express-session
var expressSession = require('./utils/express-session');

// routes
var webRouter = require('./web_router');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views/'));


/**
 * 设置模板引擎为ejs ,但是更改扩展名为html
 * 更改扩展名的原因： 我的sublime 装ejs的高亮插件没装上，没别的
 * set engine ejs ,
 * but change extension ejs to html,for sulblime lighter
 */
app.engine('.html', ejs.__express);
app.set('view engine', 'html');
//app.set('view engine', 'ejs');


// before other app use
log.use(app);


/**
 * 提供session支持,
 * sessiton 的配置 => utils/express-session 对session 的配置
 *
 */
app.use(expressSession);
// app.use(session({ resave: true,
//                   saveUninitialized: true,
//                   secret: 'bravoh5' }));


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// app.use(flash());

app.use(webRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.render('404',{
    title: "404 Not Found"
  });
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
