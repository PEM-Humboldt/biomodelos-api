//DB connection
var db = connect('localhost:27017/records');//localhost:27017/records

//creating indexes for records.species collection
db.species.createIndex({"taxID": 1});
db.species.createIndex({"bmClass": 1});
db.species.createIndex({"endemic": 1});
db.species.createIndex({"invasive": 1});
db.species.createIndex({"iucn": 1});
db.species.createIndex({"taxID": 1, "bmClass": 1});
db.species.createIndex({"taxID": 1, "endemic": 1});
db.species.createIndex({"taxID": 1, "invasive": 1});
db.species.createIndex({"taxID": 1, "iucn": 1});
db.species.createIndex({"taxID": 1, "bmClass": 1, "invasive": 1});
db.species.createIndex({"taxID": 1, "bmClass": 1, "endemic": 1});
db.species.createIndex({"taxID": 1, "bmClass": 1, "iucn": 1});
db.species.createIndex({"taxID": 1, "bmClass": 1, "endemic": 1, "invasive": 1, "iucn": 1});