var http = require('http');
var url = '';
http.get(url, function  (response) {
    let resTxt = '';
    response.on('data', function (chunk) {
        resTxt += chunk;
    });
    response.on('end', function (){
        res.send(JSON.parse(chunk));
    });
}).on('error', function (err) {
    res.send(err);
    return;
})
