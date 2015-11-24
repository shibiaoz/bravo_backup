/**
 * log4j config
 *
 * api method
 *  logger.trace(‘Entering cheese testing’);
    logger.debug(‘Got cheese.’);
    logger.info(‘Cheese is Gouda.’);
    logger.warn(‘Cheese is quite smelly.’);
    logger.error(‘Cheese is too ripe!’);
    logger.fatal(‘Cheese was breeding ground for listeria.’);
 *
 */
var log4js = require('log4js');
var LOGLEVELE = 'DEBUG';
log4js.configure({
    appenders: [
        {
            type: 'console'
        },
        {
            type: 'dateFile',
            filename: 'logs/access.log',
            pattern: "_yyyy-MM-dd.log",
            alwaysIncludePattern: true,
            // category: 'cheese', // 不知道这个干嘛用的
        }
    ],
    replaceConsole: true,   //替换console.log
    levels:{
        dateFileLog: 'debug' //  INFO in online
    }
});
var dateFileLog = log4js.getLogger('dateFileLog');

exports.logger = dateFileLog;
exports.use = function  (app) {
    // 线上运行时为info
    app.use(log4js.connectLogger(dateFileLog, {level:LOGLEVELE, format:':method :url'}));
}
