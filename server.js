"use strict";
var express = require("express"); //middleware call
var app = express();
var bodyParser = require("body-parser");//req&res using JSON 
var mongoose = require("mongoose");//MongoDB driver
var GeoJSON = require("geojson");//JSON -> GeoJSON
var newDate = new Date();
mongoose.connect("mongodb://localhost:27017/records");//database address 

//Schema for all the collections
var Record = require("./models/record.js");//general schemaModel for records.records collection
var Reported = require("./models/record.js");//schemaModel for reporting (possible errors in documents) to records.records collection
var Updated = require("./models/record.js");//schemaModel for updating (changing values of main keys) to records.records collection
var Created = require("./models/record.js");//schemaModel for inserting records from web page to records.records collection
var Specie = require("./models/specie.js");//general schemaModel for records.species collection
var Model = require("./models/model.js");//general schemaModel for records.models collection

app.use(bodyParser.urlencoded({ extended: true }));//Node.js body parsing middleware
app.use(bodyParser.json());//Node.js body parsing middleware

var port = process.env.PORT || 4000;//connection port

var router = express.Router();//middleware addressing

router.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");//allowed origins
    res.setHeader("Access-Control-Allow-Methods", "GET, PUT, POST");//allowed methods 
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");//headers
    console.log("Conectado a BioModelos PRUEBA");//proof of connection
    next();
});

router.get("/", function (req, res) {
    res.json({message: "BioModelos v2 - No es una ruta de consulta!"});//doesn't do anything!
});

//REC1
//all the records of an acceptedNameUsage (using internal taxID as key): query (use = true & visualizationPrivileges = 0)
router.get("/species/records/:taxID", function (req, res) {
    if(req.params.taxID) {
        Record.aggregate(
          [
           {"$match": {taxID: + req.params.taxID, use: true, visualizationPrivileges: 0}
           }, 
           {"$project": { 
               reported:
          { $cond:
            {
              if: { $and: [ { $isArray: "$reported" }, {$ne:["$reported", []]}] },
              then: { $isArray:"$reported"},
              else: false
            }
          },
        updated:
          { $cond:
            {
              if: { $and: [ { $isArray: "$updated" }, {$ne:["$updated", []]}] },
              then: { $isArray:"$updated"},
              else: false
            }
          }, 
               "_id" : 1, "taxID": 1, "acceptedNameUsage" : 1, "species": 1, "speciesOriginal": 1, "locality" : 1, "lat" : 1, "lon" : 1, "alt" : 1, "basisOfRecord" : 1, "catalogNumber" : 1, "collector" : 1, "institution" : 1, "url" : 1, "dd" : 1, "mm" : 1, "yyyy" : 1, "suggestedStateProvince" : 1, "suggestedCounty" : 1, "environmentalOutlier": 1", source": 1}}
          ], 
       function (err, docs) {
            var data = docs.map(function (obj) {
                return {_id : obj._id, "taxID": obj.taxID, acceptedNameUsage: obj.acceptedNameUsage, species: obj.species, speciesOriginal: obj.speciesOriginal, locality: obj.locality, lat: obj.lat, lon: obj.lon, alt: obj.alt, basisOfRecord: obj.basisOfRecord, catalogNumber : obj.catalogNumber, collector : obj.collector, institution : obj.institution, url : obj.url, dd : obj.dd, mm : obj.mm, yyyy : obj.yyyy, suggestedStateProvince : obj.suggestedStateProvince, suggestedCounty : obj.suggestedCounty, environmentalOutlier: obj.environmentalOutlier, source: obj.source, reported: obj.reported, updated: obj.updated}
               })
           res.send(GeoJSON.parse(docs, {Point: ["lat", "lon"]}));
           res.json({message: "Records from acceptedNameUsage, with use=true & visualizationPrivileges = 0"});
        });
    }
});

//REC2
//updating main keys of a record of a species
router.put("/records/:record_id", function (req, res) {
    Record.findById( req.params.record_id, function (err, record) {
        if (err) {
            res.send(err);
            } else {
                var updated = new Updated();
                if (!req.body.taxID || (req.body.taxID === record.taxID)) {
                    !updated.taxID;
                } else {
                    updated.taxID = record.taxID;
                    record.taxID = req.body.taxID;
                }
                if (!req.body.acceptedNameUsage || (req.body.acceptedNameUsage === record.acceptedNameUsage)) {
                    !updated.acceptedNameUsage
                } else {
                    updated.acceptedNameUsage = record.acceptedNameUsage;
                    record.acceptedNameUsage = req.body.acceptedNameUsage;
                }
                if (!req.body.locality || (req.body.locality === record.locality)) {
                    !updated.locality;
                } else {
                    updated.locality = record.locality;
                    record.locality = req.body.locality;
                }
                if (!req.body.lat || (req.body.lat === record.lat)) {
                    !updated.lat;
                } else {
                    updated.lat = record.lat;
                    record.lat = req.body.lat;
                }
                if (!req.body.lon || (req.body.lon === record.lon)) {
                    !updated.lon;
                } else {
                    updated.lon = record.lon;
                    record.lon = req.body.lon;
                }
                if (!req.body.dd || (req.body.dd === record.dd)) {
                    !updated.dd;
                } else {
                    updated.dd = record.dd;
                    record.dd = req.body.dd;
                }
                if (!req.body.mm || (req.body.mm === record.mm)) {
                    !updated.mm;
                } else {
                    updated.mm = record.mm;
                    record.mm = req.body.mm;
                }
                if (!req.body.yyyy || (req.body.yyyy === record.yyyy)) {
                    !updated.yyyy;
                } else {
                    updated.yyyy = record.yyyy;
                    record.yyyy = req.body.yyyy;
                }
                if (!req.body.taxID && !req.body.acceptedNameUsage && !req.body.locality && !req.body.lat && !req.body.lon && !req.body.dd && !req.body.mm && !req.body.yyyy) {
                    updated = [];
                } else {
                    updated.userId_bm = req.body.userId_bm;
                    updated.updatedDate = Date.now;
                    record.updated.push(updated);
                }
            }
            record.save(function (err) {
                if (err) {
                    res.send(err);
                } else {
                    res.json({message: "The record " + record._id + " was successfully updated!"});
                }
            });
        }
    );
});

//REC3
//reporting probable errors of a record
router.post("/records/:record_id", function (req, res) {
    Record.findById(req.params.record_id, function (err, record) {
        if (err) {
            res.send(err);
            } else {
                var reported = new Reported();
                reported.userId_bm = req.body.userId_bm;
                if (!req.body.isOutlier_bm ) {
                    !reported.isOutlier_bm;
                } else {
                    reported.isOutlier_bm = req.body.isOutlier_bm;
                }
                if (!req.body.geoIssue_bm) {
                    !reported.geoIssue_bm;
                } else {
                    reported.geoIssue_bm = req.body.geoIssue_bm;
                }
                if (!req.body.idIssue_bm) {
                    !reported.idIssue_bm
                } else {
                    reported.idIssue_bm = req.body.idIssue_bm;
                }
                if (!req.body.oldTaxonomy_bm) {
                    !reported.oldTaxonomy_bm;
                } else {
                    reported.oldTaxonomy_bm = req.body.oldTaxonomy_bm;
                }
                if (!req.body.inCaptivity_bm) {
                    !reported.inCaptivity_bm;
                } else {
                    reported.inCaptivity_bm = req.body.inCaptivity_bm;
                }
                if (!req.body.otherIssues_bm) {
                    !reported.otherIssues_bm;
                } else {
                    reported.otherIssues_bm = req.body.otherIssues_bm;
                }
                if (!req.body.comments_bm) {
                    !reported.comments_bm;
                } else {
                    reported.comments_bm = req.body.comments_bm;
                }
                if (!req.body.isOutlier_bm && !req.body.geoIssue_bm && !req.body.idIssue_bm && !req.body.oldTaxonomy_bm && !req.body.inCaptivity_bm && !req.body.otherIssues_bm && !req.body.comments_bm) {
                    reported = [];
                } else {
                    reported.userId_bm = req.body.userId_bm;
                    reported.reportedDate = Date.now;
                    record.reported.push(reported);
                }
            }
            record.save(function (err) {
                if (err) {
                    res.send(err);
                } else {
                    res.json({message: "The record " + record._id + " was reported!"});
                }
            });
        });
    });

//REC4
//inserting a new (and just one) record that belongs to a specific species
router.post("/records", function(req, res) {
    var record = new Record();
    var created = new Created();
    record.taxID = +req.body.taxID;
    record.acceptedNameUsage = req.body.acceptedNameUsage;
    if (!req.body.locality || (req.body.locality === "")) {
            record.locality = null;
        } else {
            record.locality = req.body.locality;
        }
    record.lat = +req.body.lat;
    record.lon = +req.body.lon;
    if (!req.body.alt || (req.body.alt === "")) {
            record.alt = null;
        } else {
            record.alt = +req.body.alt;
        }
    if (!req.body.basisOfRecord || (req.body.basisOfRecord === "")) {
            record.basisOfRecord = null;
        } else {
            record.basisOfRecord = req.body.basisOfRecord;
        }
    if (!req.body.collector || (req.body.collector === "")) {
            record.collector = null;
        } else {
            record.collector = req.body.collector;
        }
    if (!req.body.source || (req.body.source === "")) {
            record.source = null;
        } else {
            record.source = req.body.source;
        }
    if (!req.body.mm || (req.body.mm === "")) {
            record.mm = null;
        } else {
            record.mm = +req.body.mm;
        }
    if (!req.body.dd || (req.body.dd === "")) {
            record.dd = null;
        } else {
            record.dd = +req.body.dd;
        }
    if (!req.body.yyyy || (req.body.yyyy === "")) {
            record.yyyy = null;
        } else {
            record.yyyy = +req.body.yyyy;
        }
    if (!req.body.comments_bm || (req.body.comments_bm === "")) {
            created.comments_bm = null;
        } else {
            created.comments_bm = req.body.comments_bm;
        }
    created.userId_bm = req.body.userId_bm;
    record.source = "BioModelos";
    created.createdDate = Date.now;
    if (!req.body.citation_bm || (req.body.citation_bm === "")) {
            created.citation_bm = null;
        } else {
            created.citation_bm = req.body.citation_bm;
        }
    record.contributedRecord = true;
    record.updated = [];
    record.reported = [];
    record.created.push(created);
    record.save(function(err) {
        if (err) {
           res.send(err); 
        } else {
            res.json({ message: "Record created! " + record._id});
        }
    });
});
	
//SPE1
//all the species in BioModelos
router.get("/species", function(req, res) {        
    Specie.find({}, {"species": 1, "taxID": 1, "_id": 0} , function (err, docs){
		if (err) {
			res.json(err);
		} else {
			res.json(docs);
			res.json({message: "All the species!"});
		}
	});
});

//SPE2
//superior taxonomy and the total of records of a species
router.get("/species/:taxID", function(req, res) {
    if(req.params.taxID) {
        Specie.find({"taxID": +req.params.taxID}, {"_id": 0, "acceptedNameUsage": 1, "species": 1, "kingdom": 1, "phylum": 1, "class": 1, "order": 1, "family": 1}, function(err, doc) {
            if (err) {
                res.json(err);
            } else {
                Record.aggregate([
                    {"$match": {"taxID": +req.params.taxID, "use": true, "visualizationPrivileges": 0}},
                    {"$group":{_id: {"characteristics": {"taxID": "$taxID"}},"totalRecords": {"$sum":1}}},
                    {"$project": {"_id": 0,"taxID": "$_id.characteristics.taxID", "totalRecords": "$totalRecords" }}
                ], function(err2, doc2) {
                    if (err2) {
                        res.json(err2);
                    } else {
                        if ( doc2[0] && doc2[0].totalRecords) {
                            doc[0]["_doc"]["totalRecords"] = doc2[0].totalRecords;
                        } else {
                          doc[0]["_doc"]["totalRecords"] = 0;
                        }
                        res.json(doc);
                        res.json({message: "Superior taxonomy of" + req.params.taxID});
                    }
                });
            }
        })
    };
});

//SPE3
//general query to obtain species with some specific characteristics
router.get("/species/search/:species", function (req, res) {
    if (req.params.species && (!req.query.bmClass1 && !req.query.bmClass2 && !req.query.bmClass3 && !req.query.bmClass4 && !req.query.bmClass5 && !req.query.bmClass6 && !req.query.bmClass7)) {
        var regEx = new RegExp(req.params.species, "ig");
        if (!req.query.endangered && !req.query.endemic && !req.query.invasive) {
            Specie.find({"species": {"$regex": regEx}}, {_id: 0, species: 1, taxID: 1, taxonomicStatus: 1, iucn: 1, bmClass: 1, endemic: 1, invasive: 1},
            function (err, docs) {
            if (err) {
                res.json(err);
            } else {
                res.json(docs);
                res.json({message: "Species, just from a text fragment!"});
            }
        });
    } else if (req.query.endangered == 1 && (!req.query.endemic && !req.query.invasive)) {
        Specie.find( {
            "$and" : [
            {"species": {"$regex": regEx}},
            { "$or" : [ { "iucn": {"$in": ["EN", "LC", "VU", "CR", "NT"] } } ] }
    ]
}, {_id: 0, species: 1, taxID: 1, taxonomicStatus: 1, iucn: 1, bmClass: 1, endemic: 1, invasive: 1},
            function (err, docs) {
            if (err) {
                res.json(err);
            } else {
                res.json(docs);
                res.json({message: "Species, just from a text fragment & iucn!"});
            }
        });
    } else if (req.query.endangered == 1 && req.query.endemic == 1 && !req.query.invasive) {
        Specie.find( {
            "$and" : [
            { "$or" : [ { "species": {"$regex": regEx} } ] },
            { "$or" : [ { "iucn": {"$in": ["EN", "LC", "VU", "CR", "NT"] } } ] },
            { "$or" : [ { "endemic": {"$in": [true]} } ] }
    ]
}, {_id: 0, species: 1, taxID: 1, taxonomicStatus: 1, iucn: 1, bmClass: 1, endemic: 1, invasive: 1},
            function (err, docs) {
            if (err) {
                res.json(err);
            } else {
                res.json(docs);
                res.json({message: "Species, just from a text fragment & iucn & endemic!"});
            }
        });
    } else if (req.query.endangered == 1 && req.query.endemic == 1 && req.query.invasive == 1) {
        Specie.find( {
            "$and" : [
            { "$or" : [ { "species": {"$regex": regEx} } ] },
            { "$or" : [ { "iucn": {"$in": ["EN", "LC", "VU", "CR", "NT"] } } ] },
            { "$or" : [ { "endemic": {"$in": [true]} } ] },
            { "$or" : [ { "invasive": {"$in": [true]} } ] }
           
    ]
}, {_id: 0, species: 1, taxID: 1, taxonomicStatus: 1, iucn: 1, bmClass: 1, endemic: 1, invasive: 1},
            function (err, docs) {
            if (err) {
                res.json(err);
            } else {
                res.json(docs);
                res.json({message: "Species, just from a text fragment & iucn & endemic & invasive!"});
            }
        });
    } else if (!req.query.endangered && req.query.endemic == 1 && !req.query.invasive) {
        Specie.find( {
            "$and" : [
            { "$or" : [ { "species": {"$regex": regEx} } ] },
            { "$or" : [ { "endemic": {"$in": [true]} } ] }
    ]
}, {_id: 0, species: 1, taxID: 1, taxonomicStatus: 1, iucn: 1, bmClass: 1, endemic: 1, invasive: 1},
            function (err, docs) {
            if (err) {
                res.json(err);
            } else {
                res.json(docs);
                res.json({message: "Species, just from a text fragment & endemic!"});
            }
        });
    } else if (!req.query.endangered && req.query.endemic == 1 && req.query.invasive == 1) {
        Specie.find( {
            "$and" : [
            { "$or" : [ { "species": {"$regex": regEx} } ] },
            { "$or" : [ { "endemic": {"$in": [true]} } ] },
            { "$or" : [ { "invasive": {"$in": [true]} } ] },
    ]
}, {_id: 0, species: 1, taxID: 1, taxonomicStatus: 1, iucn: 1, bmClass: 1, endemic: 1, invasive: 1},
            function (err, docs) {
            if (err) {
                res.json(err);
            } else {
                res.json(docs);
                res.json({message: "Species, just from a text fragment & endemic & invasive!"});
            }
        });
    } else if (!req.query.endangered && !req.query.endemic && req.query.invasive == 1) {
        Specie.find( {
            "$and" : [
            { "$or" : [ { "species": {"$regex": regEx} } ] },
            { "$or" : [ { "invasive": {"$in": [true]} } ] }
    ]
}, {_id: 0, species: 1, taxID: 1, taxonomicStatus: 1, iucn: 1, bmClass: 1, endemic: 1, invasive: 1},
            function (err, docs) {
            if (err) {
                res.json(err);
            } else {
                res.json(docs);
                res.json({message: "Species, just from a text fragment & invasive!"});
            }
        });
    } else if (req.query.endangered && !req.query.endemic && req.query.invasive == 1) {
        Specie.find( {
            "$and" : [
            { "$or" : [ { "species": {"$regex": regEx} } ] },
            { "$or" : [ { "iucn": {"$in": ["EN", "LC", "VU", "CR", "NT"] } } ] },
            { "$or" : [ { "invasive": {"$in": [true]} } ] }
        ]
}, {_id: 0, species: 1, taxID: 1, taxonomicStatus: 1, iucn: 1, bmClass: 1, endemic: 1, invasive: 1},
            function (err, docs) {
            if (err) {
                res.json(err);
            } else {
                res.json(docs);
                res.json({message: "Species, just from a text fragment & iucn & invasive!"});
            }
        });
    }
  } else if (req.params.species && (req.query.bmClass1 || req.query.bmClass2 || req.query.bmClass3 || req.query.bmClass4 || req.query.bmClass5 || req.query.bmClass6 || req.query.bmClass7)) {
        var regEx = new RegExp(req.params.species, "ig");
        if (!req.query.endangered && !req.query.endemic && !req.query.invasive) {
            Specie.find( {
            "$and" : [
            {"species": {"$regex": regEx}},
            { "$or" : [ { "bmClass": {"$in": [req.query.bmClass1, req.query.bmClass2, req.query.bmClass3, req.query.bmClass4, req.query.bmClass5, req.query.bmClass6, req.query.bmClass7] } } ] }
    ]
}, {_id: 0, species: 1, taxID: 1, taxonomicStatus: 1, iucn: 1, bmClass: 1, endemic: 1, invasive: 1},
            function (err, docs) {
            if (err) {
                res.json(err);
            } else {
                res.json(docs);
                res.json({message: "Species, just from a text fragment & several bmClass!"});
            }
        });
    } else if (req.query.endangered == 1 && (!req.query.endemic && !req.query.invasive)) {
        Specie.find( {
            "$and" : [
            {"species": {"$regex": regEx}},
            { "$or" : [ { "iucn": {"$in": ["EN", "LC", "VU", "CR", "NT"] } } ] },
            { "$or" : [ { "bmClass": {"$in": [req.query.bmClass1, req.query.bmClass2, req.query.bmClass3, req.query.bmClass4, req.query.bmClass5, req.query.bmClass6, req.query.bmClass7] } } ] }
    ]
}, {_id: 0, species: 1, taxID: 1, taxonomicStatus: 1, iucn: 1, bmClass: 1, endemic: 1, invasive: 1},
            function (err, docs) {
            if (err) {
                res.json(err);
            } else {
                res.json(docs);
                res.json({message: "Species, just from a text fragment & several bmClass & iucn!"});
            }
        });
    } else if (req.query.endangered == 1 && req.query.endemic == 1 && !req.query.invasive) {
        Specie.find( {
            "$and" : [
            { "$or" : [ { "species": {"$regex": regEx} } ] },
            { "$or" : [ { "iucn": {"$in": ["EN", "LC", "VU", "CR", "NT"] } } ] },
            { "$or" : [ { "endemic": {"$in": [true]} } ] },
            { "$or" : [ { "bmClass": {"$in": [req.query.bmClass1, req.query.bmClass2, req.query.bmClass3, req.query.bmClass4, req.query.bmClass5, req.query.bmClass6, req.query.bmClass7] } } ] }
    ]
}, {_id: 0, species: 1, taxID: 1, taxonomicStatus: 1, iucn: 1, bmClass: 1, endemic: 1, invasive: 1},
            function (err, docs) {
            if (err) {
                res.json(err);
            } else {
                res.json(docs);
                res.json({message: "Species, just from a text fragment & several bmClass & iucn & endemic!"});
            }
        });
    } else if (req.query.endangered == 1 && req.query.endemic == 1 && req.query.invasive == 1) {
        Specie.find( {
            "$and" : [
            { "$or" : [ { "species": {"$regex": regEx} } ] },
            { "$or" : [ { "iucn": {"$in": ["EN", "LC", "VU", "CR", "NT"] } } ] },
            { "$or" : [ { "endemic": {"$in": [true]} } ] },
            { "$or" : [ { "invasive": {"$in": [true]} } ] },
            { "$or" : [ { "bmClass": {"$in": [req.query.bmClass1, req.query.bmClass2, req.query.bmClass3, req.query.bmClass4, req.query.bmClass5, req.query.bmClass6, req.query.bmClass7] } } ] }
    ]
}, {_id: 0, species: 1, taxID: 1, taxonomicStatus: 1, iucn: 1, bmClass: 1, endemic: 1, invasive: 1},
            function (err, docs) {
            if (err) {
                res.json(err);
            } else {
                res.json(docs);
                res.json({message: "Species, just from a text fragment & several bmClass & iucn & endemic & invasive!"});
            }
        });
    } else if (!req.query.endangered && req.query.endemic == 1 && !req.query.invasive) {
        Specie.find( {
            "$and" : [
            { "$or" : [ { "species": {"$regex": regEx} } ] },
            { "$or" : [ { "endemic": {"$in": [true]} } ] },
            { "$or" : [ { "bmClass": {"$in": [req.query.bmClass1, req.query.bmClass2, req.query.bmClass3, req.query.bmClass4, req.query.bmClass5, req.query.bmClass6, req.query.bmClass7] } } ] }
    ]
}, {_id: 0, species: 1, taxID: 1, taxonomicStatus: 1, iucn: 1, bmClass: 1, endemic: 1, invasive: 1},
            function (err, docs) {
            if (err) {
                res.json(err);
            } else {
                res.json(docs);
                res.json({message: "Species, just from a text fragment & several bmClass & endemic!"});
            }
        });
    } else if (!req.query.endangered && req.query.endemic == 1 && req.query.invasive == 1) {
        Specie.find( {
            "$and" : [
            { "$or" : [ { "species": {"$regex": regEx} } ] },
            { "$or" : [ { "endemic": {"$in": [true]} } ] },
            { "$or" : [ { "invasive": {"$in": [true]} } ] },
            { "$or" : [ { "bmClass": {"$in": [req.query.bmClass1, req.query.bmClass2, req.query.bmClass3, req.query.bmClass4, req.query.bmClass5, req.query.bmClass6, req.query.bmClass7] } } ] }
    ]
}, {_id: 0, species: 1, taxID: 1, taxonomicStatus: 1, iucn: 1, bmClass: 1, endemic: 1, invasive: 1},
            function (err, docs) {
            if (err) {
                res.json(err);
            } else {
                res.json(docs);
                res.json({message: "Species, just from a text fragment & several bmClass & endemic & invasive!"});
            }
        });
    } else if (!req.query.endangered && !req.query.endemic && req.query.invasive == 1) {
        Specie.find( {
            "$and" : [
            { "$or" : [ { "species": {"$regex": regEx} } ] },
            { "$or" : [ { "invasive": {"$in": [true]} } ] },
            { "$or" : [ { "bmClass": {"$in": [req.query.bmClass1, req.query.bmClass2, req.query.bmClass3, req.query.bmClass4, req.query.bmClass5, req.query.bmClass6, req.query.bmClass7] } } ] }
    ]
}, {_id: 0, species: 1, taxID: 1, taxonomicStatus: 1, iucn: 1, bmClass: 1, endemic: 1, invasive: 1},
            function (err, docs) {
            if (err) {
                res.json(err);
            } else {
                res.json(docs);
                res.json({message: "Species, just from a text fragment & several bmClass & invasive!"});
            }
        });
    } else if (req.query.endangered && !req.query.endemic && req.query.invasive == 1) {
        Specie.find( {
            "$and" : [
            { "$or" : [ { "species": {"$regex": regEx} } ] },
            { "$or" : [ { "iucn": {"$in": ["EN", "LC", "VU", "CR", "NT"] } } ] },
            { "$or" : [ { "invasive": {"$in": [true]} } ] },
            { "$or" : [ { "bmClass": {"$in": [req.query.bmClass1, req.query.bmClass2, req.query.bmClass3, req.query.bmClass4, req.query.bmClass5, req.query.bmClass6, req.query.bmClass7] } } ] }
    ]
}, {_id: 0, species: 1, taxID: 1, taxonomicStatus: 1, iucn: 1, bmClass: 1, endemic: 1, invasive: 1},
            function (err, docs) {
            if (err) {
                res.json(err);
            } else {
                res.json(docs);
                res.json({message: "Species, just from a text fragment & several bmClass & iucn & invasive!"});
            }
        });
    }
}
});

//MOD1
//models of a specific species, with some query body
router.get("/models/:taxID", function (req, res) { 
    if (req.params.taxID && (!req.query.type)) {
        Model.find({taxID: req.params.taxID, isActive: true}, {_id: 0, taxID: 1, modelLevel: 1, modelStatus: 1, published: 1, modelID: 1, thresholdType: 1, thumbPath: 1,  zipPath: 1, pngPath: 1,  methodFile: 1}, function(err, docs) {
                if (err) {
                    res.json(err);
                    //return res.send();
                } else {
                    res.json(docs);
                    res.json({message: "All the models"});
                }
            });
        } else if (req.params.taxID && (req.query.type == "Continuous")){
            Model.find({taxID: req.params.taxID, modelStatus : "Developing", thresholdType: "Continuous", isActive: true}, {_id: 0, taxID: 1, modelLevel: 1, modelStatus: 1, published: 1, modelID: 1, thresholdType: 1, thumbPath: 1,  zipPath: 1, pngPath: 1,  methodFile: 1, modelStatus: 1}, function(err, doc) {
                if (err) {
                    res.json(err);
                    //return res.send();
                } else {
                    res.json(doc);
                    res.json({message: "Just the Continuous model of threslholdType"});
                }
            });
        } else if (req.params.taxID && (req.query.type == "Thresholds")){
            Model.find({taxID: req.params.taxID, modelStatus : "Developing",  thresholdType: {"$nin": ["Continuous"]}, isActive: true}, {_id: 0, taxID: 1, modelLevel: 1, modelStatus: 1, published: 1, modelID: 1, thresholdType: 1, thumbPath: 1,  zipPath: 1, pngPath: 1,  methodFile: 1},  function(err, docs) {
                if (err) {
                    res.json(err);
                    //return res.send();
                } else {
                    res.json(docs);
                    res.json({message: "All the thresholds models of threslholdType"});
                }
            });
        } else if (req.params.taxID && (req.query.type == "Hypothesis")){
            Model.find({taxID: req.params.taxID, modelStatus: {"$in": ["pendingValidation"]}, isActive: true}, {_id: 0, taxID: 1, modelLevel: 1, modelStatus: 1, published: 1, modelID: 1, thresholdType: 1, thumbPath: 1,  zipPath: 1, pngPath: 1,  methodFile: 1},  function(err, docs) {
                if (err) {
                    res.json(err);
                    //return res.send();
                } else {
                    res.json(docs);
                    res.json({message: "All the hypothesis models"});
                }
            });
        } else if (req.params.taxID && (req.query.type == "Valid")){
            Model.find({taxID: req.params.taxID, modelStatus: {"$in": ["Valid"]}, isActive: true}, {_id: 0, taxID: 1, modelLevel: 1, modelStatus: 1, published: 1, modelID: 1, thresholdType: 1, thumbPath: 1,  zipPath: 1, pngPath: 1,  methodFile: 1},  function(err, doc) {
                if (err) {
                    res.json(err);
                    //return res.send();
                } else {
                    res.json(doc);
                    res.json({message: "Just the valid model"});
                }
            });
        }  else if (req.params.taxID && (req.query.type == "Published")){
            Model.find({taxID: req.params.taxID, isActive: true, published: true, isActive: true}, {_id: 0, taxID: 1, modelLevel: 1, modelStatus: 1, published: 1, modelID: 1, thresholdType: 1, thumbPath: 1,  zipPath: 1, pngPath: 1,  methodFile: 1},  function(err, docs) {
                if (err) {
                    res.json(err);
                    //return res.send();
                } else {
                    res.json(docs);
                    res.json({message: "All the published models"});
            }
        });
    }  
});

//MOD2
//metadata of a specific model
router.get("/models/metadata/:modelID", function (req, res) { 
    if (req.params.modelID) {
        Model.find({"modelID": +req.params.modelID}, {_id: 0, taxID: 1, modelingMethod: 1, modelLevel: 1, modelStatus: 1,  perfStatSD: 1, validationType: 1, thresholdType: 1, modelAuthors: 1, dd: 1 , mm: 1, yyyy: 1, modelID: 1}, function(err, docs) {
            if (err) {
                res.json(err);
            } else {
                res.json(docs);
                res.json({message: "Metadata from a model"});
                }
            });
        }
    });

//MOD3
//extension occurrence statistics for approved model of a specific species 	
router.get("/models/approved/eoo/:taxID", function (req, res) { 
    if (req.params.taxID) {
        Model.find({"taxID": +req.params.taxID, "modelStatus":"Approved"}, {_id: 0, modelID: 1, statRangeSize: 1, statModelEOO: 1, statRecsEOO: 1}, function(err, docs) {
            if (err) {
                res.json(err);
            } else {
                res.json(docs);
                res.json({message: "Extension statistics of the approved model"});
                }
            });
        }
    });

//MOD4
//representation statistics for approved model of a specific species 	
router.get("/models/approved/rpa/:taxID", function (req, res) { 
    if (req.params.taxID) {
        Model.find({"taxID": +req.params.taxID, "modelStatus":"Approved"}, {_id: 0, modelID: 1, statRepPA: 1, statRepPA1: 1, statRepPA2: 1, statRepPA3: 1}, function(err, docs) {
            if (err) {
                res.json(err);
            } else {
                res.json(docs);
                res.json({message: "Representation statistics of the approved model"});
            }
        });
    }
});

//MOD5
//spatial statistics of forest loss for approved model of a specific species
router.get("/models/approved/forest_loss/:taxID", function (req, res) { 
    if (req.params.taxID) {
        Model.find({"taxID": +req.params.taxID, "modelStatus":"Approved"}, {_id: 0, modelID: 1, statForestLoss90: 1, statForestLoss00: 1, statForestLoss05: 1, statForestLoss10: 1, statForestLoss12: 1, statFutureForest30h: 1, statFutureForest30d: 1, statFutureForest30c: 1}, function(err, docs) {
            if (err) {
                res.json(err);
            } else {
                res.json(docs);
                res.json({message: "Spatial forest loss statistics of the approved model"});
            }
        });
    }
});

//MOD6
//spatial statistics of covers for for approved model of a specific species
router.get("/models/approved/covers/:taxID", function (req, res) { 
    if (req.params.taxID) {
        Model.find({"taxID": +req.params.taxID, "modelStatus":"Approved"}, {_id: 0, modelID: 1, statCoverLC2: 1, statCoverLC3: 1, statCoverLC4: 1, statCoverLC5: 1, statCoverLC6: 1, statCoverLC7: 1, statCoverLC8: 1, statCoverLC9: 1, statCoverLC10: 1, statCoverLC11: 1, statCoverLC12: 1, statCoverLC13: 1, statCoverLC14: 1, statCoverLC15: 1, statCoverLC16: 1,statCoverLC17: 1, statCoverLC18: 1, statCoverLC19: 1, statCoverLC20: 1, statCoverLC21: 1, statCoverLC22: 1, statCoverLC23: 1, statCoverLC24: 1, statCoverLC25: 1, statCoverLC26: 1, statCoverLC27: 1, statCoverLC28: 1, statCoverLC29: 1, statCoverLC30: 1, statCoverLC31: 1, statCoverLC32: 1, statCoverLC33: 1, statCoverLC34: 1, statCoverLC35: 1, statCoverLC36: 1, statCoverLC37: 1, statCoverLC38: 1, statCoverLC39: 1, statCoverLC40: 1, statCoverLC41: 1, statCoverLC42: 1, statCoverLC43: 1, statCoverLC44: 1, statCoverLC45: 1, statCoverLC46: 1, statCoverLC47: 1, statCoverLC48: 1, statCoverLC49: 1, statCoverLC50: 1, statCoverLC51: 1, statCoverLC52: 1, statCoverLC53: 1, statCoverLC54: 1, statCoverLC55: 1}, function(err, docs) {
            if (err) {
                res.json(err);
            } else {
                res.json(docs);
                res.json({message: "Spatial cover of the approved model"});
            }
        });
    }
});

//STA1
//Obtener la totalidad de modelos según bmClass, discriminados por modelStatus
router.get("/stats/models/:bmClass", function(req, res) {
    Specie.aggregate([
        {"$match": {"bmClass": +req.params.bmClass}},
        {"$lookup": {from: "models", localField: "taxID", foreignField: "taxID", as: "fromModels"}},
        {"$unwind": "$fromModels"},
        {"$project": {"modelStatus": "$fromModels.modelStatus", "bmClass": "$bmClass"}},
        {"$group": {"_id": {"bmClass":"$bmClass", "modelStatus": "$modelStatus"}, totalModels: {"$sum": 1}}},
        {"$project": {"modelStatus": "$_id.modelStatus", "totalModels": "$totalModels", "_id": 0}},
        {"$sort": {"modelStatus": 1}}
    ], function(err, doc) {
            if (err) {
                res.json(err);
            } else {
                res.send(doc);
                res.json({message: "Models with its modelStatus of a bmClass"});
            }
        });
    });

//STA2	
//unique values for metadata
router.get("/records/metadata/:taxID", function(req, res) {
    if (req.params.taxID && req.query.metadata == "institution"){
        Record.aggregate([
            {"$match": {"taxID": +req.params.taxID}},
            {"$group": {"_id": "$institution", "institution": {"$first": "$institution"}}},
            {"$project": {"institution": "$_id", _id: 0}},
            {"$group": {"_id": null, "institution": {"$push": "$institution"}}},
            {"$project": {"institution": "$institution", _id: 0}},
       ], function(err, doc) {
                if (err) {
                    res.json(err);
                } else {
                    res.send(doc);
                    res.json({message: "Unique values of institutions of a species"});
                }
            });
        } else if (req.params.taxID && req.query.metadata == "collector"){
            Record.aggregate([
                {"$match": {"taxID": +req.params.taxID}},
                {"$group": {"_id": "$collector", "collector": {"$first": "$collector"}}},
                {"$project": {"collector": "$_id", _id: 0}},
                {"$group": {"_id": null, "collector": {"$push": "$collector"}}},
                {"$project": {"collector": "$collector", _id: 0}},
        ], function(err, doc) {
                if (err) {
                    res.json(err);
                } else {
                    res.send(doc);
                    res.json({message: "Unique values of collectors of a species"});
                }
            });
        }
});

app.use("/BioModelos", router);

app.listen(port);
console.log("Escuchando desde el puerto " + port);
