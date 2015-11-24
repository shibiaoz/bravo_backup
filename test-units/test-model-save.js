var pageModel = require('../models/page');
var pageObj = {
    _id:'h5_' + Date.now(),
    lengendId:'legendId' + Date.now(),
    author:'zhangshibiao',
    title: '测试title',
    desp: '测试描述',
    coverUrl: 'http://www.baidu.com/',
    createTime: '20151015121020',
    updateTime: '20151015121020',
    pageStatus: 'published',
};
console.log(pageObj);
var page = new pageModel(pageObj);
page.save(function (err, page) {
    if (err) {
        console.log('save page occur error...');
        console.log(err);
    }
    console.log(Date.now());
    if (page && page.result) {
        console.log('save page success....');
        console.log(page);
    }
});

