var http  = require('http');
var url = 'http://legend-dev-backend.baidu.com/legend/create';
// http://legend.baidu.com:8121/edit/legend/08faf341-77be-11e5-873e-70e2840c1e14?appKey=local&secretKey=local-key
// 08faf341-77be-11e5-873e-70e2840c1e14
var reqData = JSON.stringify({
    appKey: 'local',
    secretKey: 'local-key'
});
var post_options = {
    host: 'legend-dev-backend.baidu.com',
    port: '80',
    path: '/legend/create',
    method: 'POST',
    headers: {
      // 'Content-Type': 'application/x-www-form-urlencoded',
      "Content-Type": 'application/json',
      'Content-Length': reqData.length
    }
};
var req = http.request(post_options, function  (response) {
    // body...
    var responseText='';
    if (response.statusCode == 200) {
        response.on('data', function (data) {
            responseText += data;
        });
        response.on('end', function () {
            console.log(responseText);
        });
    }
    else {
        console.log(500);
    }

});
req.write(reqData + "\n");
req.end();
