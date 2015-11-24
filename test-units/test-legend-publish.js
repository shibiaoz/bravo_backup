var http  = require('http');
var reqData = JSON.stringify({
    _id: 'h5_1445166489898',
    pageStatus: 'published'
});
var post_options = {
    host: '127.0.0.1',
    port: '8081',
    path: '/page/publish',
    method: 'POST',
    headers: {
      // 'Content-Type': 'application/x-www-form-urlencoded',
      "Content-Type": 'application/json',
      'Content-Length': reqData.length
    }
};
var req = http.request(post_options, function  (response) {
    // body...
    var responseText=''
    var size = 0;
    response.on('data', function (data) {
        responseText += data;
      // responseText.push(data);
      // size+=data.length;
    });
    response.on('end', function () {
        console.log(responseText);
      // Buffer 是node.js 自带的库，直接使用
      // responseText = Buffer.concat(responseText,size);
      // callback(responseText);
    });
});
req.write(reqData + "\n");
req.end();
