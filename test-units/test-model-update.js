var MongoClient = require('mongodb').MongoClient,
  test = require('assert');
MongoClient.connect('mongodb://127.0.0.1:27017/test', function(err, db) {

  // Get a collection
  var collection = db.collection('testuser');
  // collection.updateOne
  collection.update({name:'shibiao'}, {$set:{age:22, hobby:'sfsf'}},{upsert:false,multi:true}).then(function (result) {
    console.log(result);
    if (result && result.result && result.result.nModified) {
      console.log('update success....');
    }
    else {
      console.log('update error....');
    }
    db.close();
  });
});
