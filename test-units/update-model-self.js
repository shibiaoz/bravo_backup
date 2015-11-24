var pageModel = require('../models/page');
var conditionObj = {
    author: 'zhangshibiao',
};
pageModel.getOneInstance(conditionObj, function (err, page) {
    if (page) {
        page.desp = 'my desp4';
        console.log(page);
        page.update(function (result, flag) {
            if (flag) {
                console.log('del success...');
            }
            else {
                console.log('del failed ....');
                console.log(result);
                //result = null;
            }
        });
    }
    else {
        console.log('find error...');
        console.log(err);
    }
});
