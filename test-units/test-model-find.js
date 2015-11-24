var pageModel = require('../models/page');
var conditionObj = {
    author: 'zhangshibiao',
};
pageModel.get(conditionObj, function (err, page) {
    if (page) {
        console.log('find success...');
        console.log(page);
    }
    else {
        console.log('find error...');
        console.log(err);
    }
});
