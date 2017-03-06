//DB connection
var db = connect('localhost:27017/records');//localhost:27017/records

//creating indexes for records.models collection
db.models.createIndex({"taxID": 1});
db.models.createIndex({"taxID": 1, "modelStatus": 1});
db.models.createIndex({"modelID": 1});