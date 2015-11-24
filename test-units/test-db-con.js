var MongoClient = require('mongodb').MongoClient
var assert = require('assert');

// Connection URL
var url = 'mongodb://127.0.0.1:27017/h5gen';
// Use connect method to connect to the Server
MongoClient.connect(url, function(err, db) {
    if (err) {
        console.log('error......');
        console.log(err);
    }
    if (db) {
        console.log("Connected correctly to server");
        console.log(db);
    }
    db.close();
});

