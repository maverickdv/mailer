var mongoClient = require('mongodb');
var baseUrl = 'mongodb://localhost/';
var dbConn = "";

connectToDb("mydb");

function connectToDb(database) {
    var url = baseUrl + database;
    mongoClient.connect(url, function(err, db) {
        dbConn = db;
        var cursor = db.collection('c1').find();
        cursor.each(function(err, doc) {
            console.log(doc);
        });
    });
}
console.log(mongoClient);