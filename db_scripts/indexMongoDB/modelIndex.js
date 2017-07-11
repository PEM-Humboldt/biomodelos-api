//DB connection
var db = connect('localhost:27017/records'); //localhost:27017/records

//creating indexes for records.models collection
db.models.createIndex({ taxID: 1 });
db.models.createIndex({ taxID: 1, modelStatus: 1 });
db.models.createIndex({ modelID: 1 });
db.models.createIndex({
  taxID: 1,
  isActive: 1,
  modelStatus: 1,
  thresholdType: 1,
  published: 1,
  modelID: 1
});
