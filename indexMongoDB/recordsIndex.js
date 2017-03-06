//DB connection
var db = connect('localhost:27017/records');//localhost:27017/records

//creating indexes for records.records collection
db.records.createIndex({"taxID": 1});
db.records.createIndex({"taxID": 1, "reported": 1, "updated": 1});
db.records.createIndex({"taxID": 1, "created": 1});
db.records.createIndex({"taxID": 1, "use": 1, "visualizationPrivileges": 1});
db.records.createIndex({"taxID": 1, "institution": 1});
db.records.createIndex({"taxID": 1, "collector": 1});