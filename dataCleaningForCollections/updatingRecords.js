//DB connection
//var db = connect('localhost:27017/produccion');//localhost:27017/records

//null-records removal
db.records.remove({"occurrenceID": "", "species": "", "continent":""}, {multi: true});

//duplicated records removal
db.records.aggregate([
    { "$group": {
        "_id": { "occurrenceID": "$occurrenceID" },
        "dups": { "$push": "$_id" },
        "count": { "$sum": 1 }
    }},
    { "$match": { "count": { "$gt": 1 } }}
]).forEach(function(doc) {
    doc.dups.shift();
    db.records.remove({ "_id": {"$in": doc.dups }});
});

//unsetting useless/deprecated fields
db.records.updateMany({}, {$unset: { "ID":"", "bigSizeRecord":"", "bmClass":"", "cites":"", "consecutivoID":"", "endemic":"", "hasTaxDoubt":"", "invasive":"", "iucn":"", "otherID":"", "privateDataset":"", "recSizeBytes":"", "scriptID":"", "tmpGeo":"", "tmpTax":"", "withLat":"", "withLon":""}});

//setting new field with its default value
db.records.updateMany({}, {$set: {interpretedElevation:null}});

//db field update for records collection
db.records.updateMany({"$or": [{"occurrenceID": {"$exists": false}}, {"occurrenceID": {"$in": ["","[\"NA\"]", "NA", -9999]}}]}, {"$set": {"occurrenceID": null}});
//db.records.updateMany({"$or": [{"acceptedNameUsage": {"$exists": false}},{"acceptedNameUsage": {"$in": ["","[\"NA\"]", "NA"]}}]}, {"$set": {"acceptedNameUsage": null}});//TRY NOT TO USE -> WILL BE A POTENTIAL LOSS OF INFORMATION BECAUSE IS A FOREIGN KEY SOMETIMES
db.records.updateMany({"$or": [{"species": {"$exists": false}}, {"species": {"$in": ["","[\"NA\"]", "NA", -9999]}}]}, {"$set": {"species": null}});
db.records.updateMany({"$or": [{"speciesOriginal": {"$exists": false}}, {"speciesOriginal": {"$in": ["","[\"NA\"]", "NA", -9999]}}]}, {"$set": {"speciesOriginal": null}});
db.records.updateMany({"$or": [{"continent": {"$exists": false}},{"continent": {"$in": ["","[\"NA\"]"]}}]}, {"$set": {"continent": null}});
db.records.updateMany({"$or": [{"country": {"$exists": false}},{"country": {"$in": ["","[\"NA\"]"]}}]}, {"$set": {"country": null}});
db.records.updateMany({"$or": [{"adm1": {"$exists": false}}, {"adm1": {"$in": ["","[\"NA\"]", "NA"]}}]}, {"$set": {"adm1": null}});
db.records.updateMany({"$or": [{"adm2": {"$exists": false}}, {"adm2": {"$in": ["","[\"NA\"]", "NA"]}}]}, {"$set": {"adm2": null}});
db.records.updateMany({"$or": [{"locality": {"$exists": false}}, {"locality": {"$in": ["","[\"NA\"]", "NA"]}}]}, {"$set": {"locality": null}});
db.records.updateMany({"$or": [{"alt": {"$exists": false}},{"alt": {"$in": ["","[\"NA\"]", "NA", -9999]}}]}, {"$set": {"alt": null}});
db.records.updateMany({"$or": [{"demAltitude": {"$exists": false}}, {"demAltitude": {"$gt": 8000}},{"demAltitude": {"$in": ["","[\"NA\"]", "NA"]}}]}, {"$set": {"demAltitude": null}});
db.records.updateMany({"$or": [{"interpretedElevation": {"$exists": false}}, {"interpretedElevation": {"$gt": 8000}}, {"interpretedElevation": {"$in": ["","[\"NA\"]", "NA", -9999]}}]}, {"$set": {"interpretedElevation": null}});
db.records.updateMany({"$or": [{"cellID": {"$exists": false}}, {"cellID": {"$in": ["","[\"NA\"]", "NA", -9999]}}]}, {"$set": {"cellID": null}});
db.records.updateMany({"$or": [{"basisOfRecord": {"$exists": false}}, {"basisOfRecord": {"$in": ["","[\"NA\"]", "NA", -9999]}}]}, {"$set": {"basisOfRecord": null}});
db.records.updateMany({"$or": [{"catalogNumber": {"$exists": false}}, {"catalogNumber": {"$in": ["","[\"NA\"]", "NA", -9999]}}]}, {"$set": {"catalogNumber": null}});
db.records.updateMany({"$or": [{"colection": {"$exists": false}}, {"colection": {"$in": ["","[\"NA\"]", "NA"]}}]}, {"$set": {"colection": null}});
db.records.updateMany({"$or": [{"collector": {"$exists": false}}, {"collector": {"$in": ["","[\"NA\"]", "NA"]}}]}, {"$set": {"collector": null}});
db.records.updateMany({"$or": [{"institution": {"$exists": false}}, {"institution": {"$in": ["","[\"NA\"]"]}}]}, {"$set": {"institution": null}});
db.records.updateMany({"$or": [{"url": {"$exists": false}}, {"url": {"$in": ["","[\"NA\"]", "NA"]}}]}, {"$set": {"url": null}});
db.records.updateMany({"$or": [{"earliestDateCollected": {"$exists": false}}, {"earliestDateCollected": {"$in": ["","[\"NA\"]", "NA", -9999]}}]}, {"$set": {"earliestDateCollected": null}});
db.records.updateMany({"$or": [{"latestDateCollected": {"$exists": false}}, {"latestDateCollected": {"$in": ["","[\"NA\"]", "NA", -9999]}}]}, {"$set": {"latestDateCollected": null}});
db.records.updateMany({"$or": [{"dd": {"$exists": false}},{"dd": {"$in": ["","[\"NA\"]", "NA", -9999]}}]}, {"$set": {"dd": null}});
db.records.updateMany({"$or": [{"mm": {"$exists": false}},{"mm": {"$in": ["","[\"NA\"]", "NA", -9999]}}]}, {"$set": {"mm": null}});
db.records.updateMany({"$or": [{"yyyy": {"$exists": false}}, {"yyyy": {"$in": ["","[\"NA\"]", "NA", -9999]}}]}, {"$set": {"yyyy": null}});
db.records.updateMany({"$or": [{"correctCountry": {"$exists": false}},{"correctCountry": {"$in": ["","[\"NA\"]", "NA"]}}]}, {"$set": {"correctCountry": null}});
db.records.updateMany({"correctCountry": {"$in": [1, "1"]}},{"$set": {"correctCountry":true}});
db.records.updateMany({"correctCountry": {"$in": [0, "0"]}},{"$set": {"correctCountry":false}});
db.records.updateMany({"$or": [{"correctStateProvince": {"$exists": false}},{"correctStateProvince": {"$in": ["","[\"NA\"]", "NA"]}}]}, {"$set": {"correctStateProvince": null}});
db.records.updateMany({"correctStateProvince": {"$in": [1, "1"]}},{"$set": {"correctStateProvince":true}});
db.records.updateMany({"correctStateProvince": {"$in": [0, "0"]}},{"$set": {"correctStateProvince":false}});
db.records.updateMany({"$or": [{"correctCounty": {"$exists": false}},{"correctCounty": {"$in": ["","[\"NA\"]", "NA"]}}]}, {"$set": {"correctCounty": null}});
db.records.updateMany({"correctCounty": {"$in": [1, "1"]}},{"$set": {"correctCounty":true}});
db.records.updateMany({"correctCounty": {"$in": [0, "0"]}},{"$set": {"correctCounty":false}});
db.records.updateMany({"$or": [{"hasLocality": {"$exists": false}}, {"hasLocality": {"$in": ["","[\"NA\"]", "NA"]}}]}, {"$set": {"hasLocality": null}});
db.records.updateMany({"hasLocality": {"$in": [1, "1"]}},{"$set": {"hasLocality":true}});
db.records.updateMany({"hasLocality": {"$in": [0, "0"]}},{"$set": {"hasLocality":false}});
db.records.updateMany({"$or": [{"inUrbanArea": {"$exists": false}}, {"inUrbanArea": {"$in": ["","[\"NA\"]", "NA"]}}]}, {"$set": {"inUrbanArea": null}});
db.records.updateMany({"inUrbanArea": {"$in": [1, "1"]}},{"$set": {"inUrbanArea":true}});
db.records.updateMany({"inUrbanArea": {"$in": [0,"0"]}},{"$set": {"inUrbanArea":false}});
db.records.updateMany({"$or": [{"suggestedCountry": {"$exists": false}}, {"suggestedCountry": {"$in": ["","[\"NA\"]", "NA"]}}]}, {"$set": {"suggestedCountry": null}});
db.records.updateMany({"$or": [{"suggestedCounty": {"$exists": false}}, {"suggestedCounty": {"$in": ["","[\"NA\"]", "NA"]}}]}, {"$set": {"suggestedCounty": null}});
db.records.updateMany({"$or": [{"suggestedMunicipality": {"$exists": false}}, {"suggestedMunicipality": {"$in": ["","[\"NA\"]", "NA"]}}]}, {"$set": {"suggestedMunicipality": null}});
db.records.updateMany({"$or": [{"suggestedStateProvince": {"$exists": false}}, {"suggestedStateProvince": {"$in": ["","[\"NA\"]", "NA"]}}]}, {"$set": {"suggestedStateProvince": null}});
db.records.updateMany({"$or": [{"sourceLayer": {"$exists": false}}, {"sourceLayer": {"$in": ["","[\"NA\"]", "NA"]}}]}, {"$set": {"sourceLayer": null}});
db.records.updateMany({"$or": [{"coordUncertaintyM": {"$exists": false}}, {"coordUncertaintyM": {"$in": ["","[\"NA\"]", "NA", -9999]}}]}, {"$set": {"coordUncertaintyM": null}});
db.records.updateMany({"$or": [{"lowUncertainty": {"$exists": false}}, {"lowUncertainty": {"$in": ["","[\"NA\"]", "NA"]}}]}, {"$set": {"lowUncertainty": null}});
db.records.updateMany({"lowUncertainty": {"$in": [1, "1"]}},{"$set": {"lowUncertainty":true}});
db.records.updateMany({"lowUncertainty": {"$in": [0, "0"]}},{"$set": {"lowUncertainty":false}});
db.records.updateMany({"$or": [{"altitudinalOutlier": {"$exists": false}}, {"altitudinalOutlier": {"$in": ["","[\"NA\"]", "NA"]}}]}, {"$set": {"altitudinalOutlier": null}});
db.records.updateMany({"altitudinalOutlier": {"$in": [1, "1"]}},{"$set": {"altitudinalOutlier":true}});
db.records.updateMany({"altitudinalOutlier": {"$in": [0, "0"]}},{"$set": {"altitudinalOutlier":false}});
db.records.updateMany({"$or": [{"consistentAltitude": {"$exists": false}},{"consistentAltitude": {"$in": ["","[\"NA\"]", "NA"]}}]}, {"$set": {"consistentAltitude": null}});
db.records.updateMany({"consistentAltitude": {"$in": [1, "1"]}},{"$set": {"consistentAltitude":true}});
db.records.updateMany({"consistentAltitude": {"$in": [0, "0"]}},{"$set": {"consistentAltitude":false}});
db.records.updateMany({"$or": [{"diferenceInAltitude": {"$exists": false}}, {"diferenceInAltitude": {"$gt": 8000}},{"diferenceInAltitude": {"$in": ["","[\"NA\"]", "NA", -9999]}}]}, {"$set": {"diferenceInAltitude": null}});
db.records.updateMany({"$or": [{"environmentalOutlier": {"$exists": false}}, {"environmentalOutlier": {"$in": ["","[\"NA\"]", "NA"]}}]}, {"$set": {"environmentalOutlier": null}});
db.records.updateMany({"environmentalOutlier": {"$in": [1, "1"]}},{"$set": {"environmentalOutlier":true}});
db.records.updateMany({"environmentalOutlier": {"$in": [0, "0"]}},{"$set": {"environmentalOutlier":false}});
db.records.updateMany({"$or": [{"insideKnownDistribution": {"$exists": false}}, {"insideKnownDistribution": {"$in": ["","[\"NA\"]", "NA"]}}]}, {"$set": {"insideKnownDistribution": null}});
db.records.updateMany({"insideKnownDistribution": {"$in": [1, "1"]}},{"$set": {"insideKnownDistribution":true}});
db.records.updateMany({"insideKnownDistribution": {"$in": [0, "0"]}},{"$set": {"insideKnownDistribution":false}});
db.records.updateMany({"$or": [{"dist2KnowRange": {"$exists": false}}, {"dist2KnowRange": {"$in": ["","[\"NA\"]", "NA", -9999]}}]}, {"$set": {"dist2KnowRange": null}});
db.records.updateMany({"$or": [{"dbDuplicate": {"$exists": false}},{"dbDuplicate": {"$in": ["","[\"NA\"]", "NA"]}}]}, {"$set": {"dbDuplicate": null}});
db.records.updateMany({"dbDuplicate": {"$in": [1, "1"]}},{"$set": {"dbDuplicate":true}});
db.records.updateMany({"dbDuplicate": {"$in": [0, "0"]}},{"$set": {"dbDuplicate":false}});
db.records.updateMany({"$or": [{"spatialDuplicated": {"$exists": false}}, {"spatialDuplicated": {"$in": ["","[\"NA\"]", "NA"]}}]}, {"$set": {"spatialDuplicated": null}});
db.records.updateMany({"spatialDuplicated": {"$in": [1, "1"]}},{"$set": {"spatialDuplicated":true}});
db.records.updateMany({"spatialDuplicated": {"$in": [0, "0"]}},{"$set": {"spatialDuplicated":false}});
db.records.updateMany({"$or": [{"reported": {"$exists": false}}, {"reported": {"$in": ["[]","[\"NA\"]", "[NA]"]}}]}, {"$set": {"reported": null}});
db.records.updateMany({"$or": [{"updated": {"$exists": false}}, {"updated": {"$in": ["[]","[\"NA\"]", "[NA]"]}}]}, {"$set": {"updated": null}});
db.records.updateMany({"$or": [{"created": {"$exists": false}}, {"created": {"$in": ["[]","[\"NA\"]", "[NA]"]}}]}, {"$set": {"created": null}});
db.records.updateMany({"$or": [{"downloadDate": {"$exists": false}}, {"downloadDate": {"$in": ["","[\"NA\"]", "NA", -9999]}}]}, {"$set": {"downloadDate": null}});
db.records.updateMany({"$or": [{"resourceFolder": {"$exists": false}}, {"resourceFolder": {"$in": ["","[\"NA\"]", "NA"]}}]}, {"$set": {"resourceFolder": null}});
db.records.updateMany({"$or": [{"resourceIncorporationDate": {"$exists": false}}, {"resourceIncorporationDate": {"$in": ["","[\"NA\"]", "NA"]}}]}, {"$set": {"resourceIncorporationDate": null}});
db.records.updateMany({"$or": [{"resourceName": {"$exists": false}}, {"resourceName": {"$in": ["","[\"NA\"]", "NA"]}}]}, {"$set": {"resourceName": null}});
db.records.updateMany({"$or": [{"source": {"$exists": false}}, {"source": {"$in": ["","[\"NA\"]", "NA"]}}]}, {"$set": {"source": null}});
db.records.updateMany({"$or": [{"contributedRecord": {"$exists": false}},{"contributedRecord": {"$in": ["","[\"NA\"]", "NA"]}}]}, {"$set": {"contributedRecord": null}}); 
db.records.updateMany({"contributedRecord": {"$in": [1, "1"]}},{"$set": {"contributedRecord":true}});
db.records.updateMany({"contributedRecord": {"$in": [0, "0"]}},{"$set": {"contributedRecord":false}});
db.records.updateMany({"$or": [{"override": {"$exists": false}}, {"override": {"$in": ["","[\"NA\"]", "NA"]}}]}, {"$set": {"override": null}});
db.records.updateMany({"override": {"$in": [0, "0"]}},{"$set": {"override":false}});
db.records.updateMany({"override": {"$in": [1, "1"]}},{"$set": {"override":true}});
db.records.updateMany({"$or": [{"privateData": {"$exists": false}}, {"privateData": {"$in": ["","[\"NA\"]", "NA"]}}]}, {"$set": {"privateData": null}});
db.records.updateMany({"privateData": {"$in": ["0"]}},{"$set": {"privateData":0}});
db.records.updateMany({"privateData": {"$in": ["1"]}},{"$set": {"privateData":1}});
db.records.updateMany({"$or": [{"use": {"$exists": false}}, {"use": {"$in": ["","[\"NA\"]", "NA"]}}]}, {"$set": {"use": null}});
db.records.updateMany({"use": {"$in": [0, "0"]}},{"$set": {"use":false}});
db.records.updateMany({"use": {"$in": [1, "1"]}},{"$set": {"use":true}});
db.records.updateMany({"$or": [{"visualizationPrivileges": {"$exists": false}}, {"visualizationPrivileges": {"$in": ["","[\"NA\"]", "NA"]}}]}, {"$set": {"visualizationPrivileges": null}});
db.records.updateMany({"visualizationPrivileges": {"$in": ["0"]}},{"$set": {"visualizationPrivileges":0}});
db.records.updateMany({"visualizationPrivileges": {"$in": ["1"]}},{"$set": {"visualizationPrivileges":1}});