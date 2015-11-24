var pageModel = require('../models/page');
var conditionObj = {
    author: 'zhangshibiao',
};
pageModel.getOneInstance(conditionObj, function (err, page) {
    if (page) {
        console.log('find success...');
        // page is Page's Instance
        console.log(page);
        page.del(null,function (result, flag) {
            if (flag) {
                console.log('del success...');
            }
            else {
                console.log('del failed ....');
                console.log(result);
                result = null;
            }
        });
    }
    else {
        console.log('find error...');
        console.log(err);
    }
});
