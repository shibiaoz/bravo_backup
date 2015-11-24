
function indexProcess (req, res, next) {
    var renderObj = {
        page: 'home',
        title: 'Express'
    };
    res.render('index', renderObj);
}
exports.index = indexProcess;
