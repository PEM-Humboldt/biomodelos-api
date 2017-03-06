//DB connection
var db = connect('localhost:27017/records');//localhost:27017/records

//unsetting useless/deprecated fields
db.species.updateMany({}, {"$unset": {"consecutivoID": "", "originalGenus": "", "originalScientificNameID": "", "originalSpecificEpithet": "", "scientificNameID": ""}});

//setting new field with its default value
db.species.updateMany({}, {"$set": {"migratoryType": null}});

//db field update for species collection
db.species.updateMany({"$or": [{"acceptedNameUsage": {"$exists": false}}, {"acceptedNameUsage": {"$in": ["","[\"NA\"]", "NA", "[]"]}}]},{"$set": {"acceptedNameUsage": null}});
db.species.updateMany({"$or": [{"species": {"$exists": false}}, {"species": {"$in": ["","[\"NA\"]", "NA", "[]"]}}]}, {"$set": {"species": null}});
db.species.updateMany({"$or": [{"genus": {"$exists": false}}, {"genus": {"$in": ["","[\"NA\"]", "NA", "[]"]}}]}, {"$set": {"genus": null}});
db.species.updateMany({"$or": [{"family": {"$exists": false}}, {"family": {"$in": ["","[\"NA\"]", "NA", "[]"]}}]}, {"$set": {"family": null}});
db.species.updateMany({"$or": [{"order": {"$exists": false}}, {"order": {"$in": ["","[\"NA\"]", "NA", "[]"]}}]}, {"$set": {"order": null}});
db.species.updateMany({"$or": [{"class": {"$exists": false}}, {"class": {"$in": ["","[\"NA\"]", "NA", "[]"]}}]}, {"$set": {"class": null}});
db.species.updateMany({"$or": [{"phylum": {"$exists": false}}, {"phylum": {"$in": ["","[\"NA\"]", "NA", "[]"]}}]}, {"$set": {"phylum": null}});
db.species.updateMany({"$or": [{"kingdom": {"$exists": false}}, {"kingdom": {"$in": ["","[\"NA\"]", "NA", "[]"]}}]}, {"$set": {"kingdom": null}});
db.species.updateMany({"bmClass": "Mamíferos"}, {"$set": {"bmClass": "Mamiferos"}});
db.species.updateMany({"$or": [{"bmClass": {"$exists": false}}, {"bmClass": {"$nin": ["Plantas", "Invertebrados", "Aves", "Peces","Reptiles", "Mamíferos", "Anfibios"]}}]}, {"$set": {"bmClass": null}});
db.species.updateMany({"$or": [{"cites": {"$exists": false}}, {"cites": {"$nin": ["I", "II", "III", "NC", "III/NC", "I/NC", "I/II", "I/III", "II/NC", "I/II/III/NC", "I/II/NC"]}}]}, {"$set": {"cites": null}});
db.species.updateMany({"$or": [{"endemic": {"$exists": false}}, {"endemic": {"$in": ["","[\"NA\"]", "NA", "[]"]}}]}, {"$set": {"endemic": null}});
db.species.updateMany({"endemic": {"$in":["1", 1]}}, {"$set": {"endemic": true}});
db.species.updateMany({"endemic": {"$in":["0", 0]}}, {"$set": {"endemic": false}});
db.species.updateMany({"$or": [{"invasive": {"$exists": false}}, {"invasive": {"$in": ["","[\"NA\"]", "NA", "[]"]}}]}, {"$set": {"invasive": null}});
db.species.updateMany({"invasive": {"$in":["1", 1]}}, {"$set": {"invasive": true}});
db.species.updateMany({"invasive": {"$in":["0", 0]}}, {"$set": {"invasive": false}});
db.species.updateMany({"$or": [{"migratoryType": {"$exists": false}}, {"migratoryType": {"$nin": ["Altitudinal","Boreal","Austral"]}}]}, {"$set": {"migratoryType": null}});
db.species.updateMany({"$or": [{"iucn": {"$exists": false}}, {"iucn": {"$nin": ["EX", "EW", "CR", "EN", "VU", "NT", "LC", "DD", "NE"]}}]},  {"$set": {"iucn": null}});
db.species.updateMany({"$or": [{"TaxVerifSource": {"$exists": false}}, {"TaxVerifSource": {"$in": ["","[\"NA\"]", "NA", "[]", "Record author"]}}]}, {"$set": {"TaxVerifSource": null}});
db.species.updateMany({"$or": [{"nameAccordingTo": {"$exists": false}}, {"nameAccordingTo": {"$in": ["","[\"NA\"]", "NA", "[]"]}}]},  {"$set": {"nameAccordingTo": null}});
db.species.updateMany({"$or": [{"scientificNameAuthorship": {"$exists": false}}, {"scientificNameAuthorship": {"$in": ["","[\"NA\"]", "NA", "[]"]}}]}, {"$set": {"scientificNameAuthorship": null}});
db.species.updateMany({"$or": [{"specificEpithet": {"$exists": false}}, {"specificEpithet": {"$in": ["","[\"NA\"]", "NA", "[]"]}}]}, {"$set": {"specificEpithet": null}});
db.species.updateMany({"$or": [{"taxonomicStatus": {"$exists": false}}, {"taxonomicStatus": {"$in": ["","[\"NA\"]", "NA", "[]"]}}]}, {"$set": {"taxonomicStatus": null}});
db.species.updateMany({"$or": [{"validName": {"$exists": false}}, {"validName": {"$in": ["","[\"NA\"]", "NA", "[]"]}}]},{"$set":  {"validName": null}});
db.species.updateMany({"validName": {"$in":["1", 1]}}, {"$set": {"validName": true}});
db.species.updateMany({"validName": {"$in":["0", 0]}}, {"$set": {"validName": false}});
db.species.updateMany({"$or": [{"speciesInCountry": {"$exists": false}}, {"speciesInCountry": {"$in": ["","[\"NA\"]", "NA", "[]"]}}]}, {"$set": {"speciesInCountry": null}});
db.species.updateMany({"speciesInCountry": {"$in":["1", 1]}}, {"$set": {"speciesInCountry": true}});
db.species.updateMany({"speciesInCountry": {"$in":["0", 0]}}, {"$set": {"speciesInCountry": false}});
db.species.updateMany({"$or": [{"sppInCol": {"$exists": false}}, {"sppInCol": {"$in": ["","[\"NA\"]", "NA", "[]"]}}]}, {"$set": {"sppInCol": null}});
db.species.updateMany({"sppInCol": {"$in":["1", 1]}}, {"$set": {"sppInCol": true}});
db.species.updateMany({"sppInCol": {"$in":["0", 0]}}, {"$set": {"sppInCol": false}});
db.species.updateMany({"$or": [{"totalModels": {"$exists": false}}, {"totalModels": {"$in": ["","[\"NA\"]", "NA", "[]", -9999]}}]}, {"$set": {"totalModels": null}});