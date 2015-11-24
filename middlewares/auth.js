/**
 * 中间件
 */

exports.authSure = function (req, res, next) {
    // todo in the future
    // if (false) {
    //     res.send('in middlewares stop...');
    // }
    // else {
    //     next();
    // }
    next();
}
