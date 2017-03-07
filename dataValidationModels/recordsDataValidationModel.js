db.runCommand({collMod: "records",
                 validator: {$and:
                 [
                    {"$or": [{occurrenceID: {"$type": "string"}}, {occurrenceID: {"$type": "null"}}]},
                    {taxID: {"$type": "number", "$exists": true}},
                    {acceptedNameUsage: {"$type": "string", "$exists": true}},
                    {"$or": [{species: {"$type": "string"}}, {species: {"$type": "null"}}]},
                    {"$or": [{speciesOriginal: {"$type": "string"}},{speciesOriginal: {"$type": "null"}}]},
                    {"$or": [{continent: {"$type": "string"}}, {continent: {"$type": "null"}}]},
                    {"$or": [{country: {"$type": "string"}}, {country: {"$type": "null"}}]},
                    {"$or": [{adm1: {"$type": "string"}}, {adm1: {"$type": "null"}}]},
                    {"$or": [{adm2: {"$type": "string"}}, {adm2: {"$type": "null"}}]},
                    {"$or": [{locality: {"$type": "string"}}, {locality: {"$type": "null"}}]},
                    {lat: {"$type": "number", "$gte": -90, "$lte": 90}},
                    {lon: {"$type": "number", "$gte": -180, "$lte": 180}},
                    {"$or": [
                          {alt: {"$type": "string"}},
                          {alt: {"$type": "number"}},
                          {alt: {"$type": "null"}},
                          ]},
                    {"$or": [
                          {demAltitude: {"$type": "number", "$gte": 0, "$lte": 8000}},
                          {demAltitude: {"$type": "null"}},
                          ]}, 
                    {"$or": [
                          {interpretedElevation: {"$type": "number", "$gte": 0, "$lte": 8000}},
                          {interpretedElevation: {"$type": "null"}},
                          ]}, 
                    {"$or": [
                          {cellID: {"$type": "number", "$gte": 0}},
                          {cellID: {"$type": "null"}},
                          ]},
                    {"$or": [
                          {basisOfRecord: {"$type": "string"}},
                          {basisOfRecord: {"$type": "null"}},
                          ]},
                    {"$or": [
                          {catalogNumber: {"$type": "string"}},
                          {catalogNumber: {"$type": "null"}},
                          ]},
                    {"$or": [
                          {colection: {"$type": "string"}},
                          {colection: {"$type": "null"}},
                          ]},
                     {"$or": [
                          {collector: {"$type": "string"}},
                          {collector: {"$type": "null"}},
                          ]},
                     {"$or": [
                          {institution: {"$type": "string"}},
                          {institution: {"$type": "null"}},
                          ]},
                     {"$or": [
                          {url: {"$type": "string"}},
                          {url: {"$type": "null"}},
                          ]},
                     {"$or": [
                          {earliestDateCollected: {"$type": "string"}},
                          {earliestDateCollected: {"$type": "number"}},
                          {earliestDateCollected: {"$type": "null"}},
                          ]},
                     {"$or": [
                          {latestDateCollected: {"$type": "string"}},
                          {latestDateCollected: {"$type": "number"}},
                          {latestDateCollected: {"$type": "null"}},
                          ]},
                     {"$or": [
                          {dd: {"$type": "number", "$gte": 1, "$lte": 31}},
                          {dd: {"$type": "null"}},
                          ]},
                     {"$or": [
                          {mm: {"$type": "number", "$gte": 1, "$lte": 12}},
                          {mm: {"$type": "null"}},
                          ]},
                     {"$or": [
                          {yyyy: {"$type": "number", "$gte": 1800, "$lte": 2100}},
                          {yyyy: {"$type": "null"}},
                          ]},
                      {"$or": [
                          {correctCountry: {"$type": "bool"}},
                          {correctCountry: {"$type": "null"}},
                          ]},
                     {"$or": [
                          {correctStateProvince: {"$type": "bool"}},
                          {correctStateProvince: {"$type": "null"}},
                          ]},
                     {"$or": [
                          {correctCounty: {"$type": "bool"}},
                          {correctCounty: {"$type": "null"}},
                          ]},
                     {"$or": [
                          {hasLocality: {"$type": "bool"}},
                          {hasLocality: {"$type": "null"}},
                          ]},
                     {"$or": [
                          {inUrbanArea: {"$type": "bool"}},
                          {inUrbanArea: {"$type": "null"}},
                          ]},
                     {"$or": [
                          {suggestedCountry: {"$type": "string"}},
                          {suggestedCountry: {"$type": "null"}},
                          ]},
                     {"$or": [
                          {suggestedCounty: {"$type": "string"}},
                          {suggestedCounty: {"$type": "null"}},
                          ]},
                     {"$or": [
                          {suggestedMunicipality: {"$type": "string"}},
                          {suggestedMunicipality: {"$type": "null"}},
                          ]},
                     {"$or": [
                          {suggestedStateProvince: {"$type": "string"}},
                          {suggestedStateProvince: {"$type": "null"}},
                          ]},
                     {"$or": [
                          {sourceLayer: {"$type": "string"}},
                          {sourceLayer: {"$type": "null"}},
                          ]},
                     {"$or": [
                          {coordUncertaintyM: {"$type": "number"}},
                          {coordUncertaintyM: {"$type": "null"}},
                          ]},
                     {"$or": [
                          {lowUncertainty: {"$type": "bool"}},
                          {lowUncertainty: {"$type": "null"}},
                          ]},
                     {"$or": [
                          {altitudinalOutlier: {"$type": "bool"}},
                          {altitudinalOutlier: {"$type": "null"}},
                          ]},
                     {"$or": [
                          {consistentAltitude: {"$type": "bool"}},
                          {consistentAltitude: {"$type": "null"}},
                          ]},
                     {"$or": [
                          {diferenceInAltitude: {"$type": "number", "$gte": 0, "$lte": 8000}},
                          {diferenceInAltitude: {"$type": "null"}},
                          ]}, 
                     {"$or": [
                          {environmentalOutlier: {"$type": "bool"}},
                          {environmentalOutlier: {"$type": "null"}},
                          ]},
                     {"$or": [
                          {insideKnownDistribution: {"$type": "bool"}},
                          {insideKnownDistribution: {"$type": "null"}},
                          ]},
                     {"$or": [
                          {dist2KnowRange: {"$type": "number"}},
                          {dist2KnowRange: {"$type": "null"}},
                          ]},
                     {"$or": [
                          {dbDuplicate: {"$type": "bool"}},
                          {dbDuplicate: {"$type": "null"}},
                          ]},
                     {"$or": [
                          {spatialDuplicated: {"$type": "bool"}},
                          {spatialDuplicated: {"$type": "null"}},
                          ]},
                     {"$or": [
                          {created: {"$type": "object"}},
                          {created: {"$type": "null"}},
                          ]},
                     {"$or": [
                          {updated: {"$type": "object"}},
                          {updated: {"$type": "null"}},
                          ]},
                     {"$or": [
                          {reported: {"$type": "object"}},
                          {reported: {"$type": "null"}},
                          ]},
                     {"$or": [
                          {downloadDate: {"$type": "string"}},
                          {downloadDate: {"$type": "null"}},
                          ]},
                     {"$or": [
                          {resourceFolder: {"$type": "string"}},
                          {resourceFolder: {"$type": "null"}},
                          ]},
                     {"$or": [
                          {resourceIncorporationDate: {"$type": "string"}},
                          {resourceIncorporationDate: {"$type": "null"}},
                          ]},
                     {"$or": [
                          {resourceName: {"$type": "string"}},
                          {resourceName: {"$type": "null"}},
                          ]},
                     {"$or": [
                          {source: {"$type": "string"}},
                          {source: {"$type": "null"}},
                          ]},
                     {"$or": [
                          {contributedRecord: {"$type": "bool"}},
                          {contributedRecord: {"$type": "null"}},
                          ]},
                     {"$or": [
                          {override: {"$type": "bool"}},
                          {override: {"$type": "null"}},
                          ]},
                     {"$or": [
                          {privateData: {"$type": "number", "$in": [0, 1, 2]}},
                          {privateData: {"$type": "null"}},
                          ]},
                     {"$or": [
                          {use: {"$type": "bool"}},
                          {use: {"$type": "null"}},
                          ]},
                     {visualizationPrivileges: {"$type": "number", "$in": [0, 1, 2]}}
                   ]
             },
         validationLevel: "strict",
         validationAction: "error"
} )