var MongoClient = require('mongodb').MongoClient,
  test = require('assert');
MongoClient.connect('mongodb://127.0.0.1:27017/test', function(err, db) {

  // Get a collection
  var collection = db.collection('testuser');
  // collection.deleteOne
  collection.deleteMany({
    $or:[
      {age:21},
      {name:"aa"}
    ]
  }).then(function (result) {
    console.log(result);
    console.log('delete count => ' + result.deletedCount);
    db.close();
  });
});
