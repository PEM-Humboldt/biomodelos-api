db.runCommand({collMod: "models", validator: { $and:
                 [
                     {taxID: {"$type": "number", "$exists": true}},
                     {acceptedNameUsage: {"$type": "string","$exists": true}},
                     {consensusMethod: {"$type": "string", "$in": ["all", "mean", "median"]}},
                     {$or: [
                         {modelingMethod: {"$type": "string"}}, 
                         {modelingMethod: {"$type": "null"}}
                         ]},
                     {$or: [
                         {modelLevel: {"$type": "number"}}, 
                         {modelLevel: {"$type": "null"}}
                         ]},
                     {modelStatus: {"$type": "string", "$in": ["Developing", "pendingValidation", "Valid"]}},
                     {published: {"$type": "bool"}},
                     {$or: [
                         {customCitation: {"$type": "string"}}, 
                         {customCitation: {"$type": "null"}}
                         ]},
                     {$or: [
                         {isActive: {"$type": "bool"}}, 
                         {isActive: {"$type": "null"}}
                         ]},
                     {modelID:{"$type": "number","$exists": true}},
                     {recsUsed:{"$type": "number","$exists": true}},
                     {$or: [
                         {omission: {"$type": "number"}}, 
                         {omission: {"$type": "null"}}
                         ]},
                     {$or: [
                         {perfStatSD: {"$type": "number"}}, 
                         {perfStatSD: {"$type": "null"}}
                         ]},
                     {$or: [
                         {perfStatType: {"$type": "string"}}, 
                         {perfStatType: {"$type": "null"}}
                         ]},
                     {$or: [
                         {perfStatValue: {"$type": "number"}}, 
                         {perfStatValue: {"$type": "null"}}
                         ]},
                     {$or: [
                         {pValue: {"$type": "number"}}, 
                         {pValue: {"$type": "null"}}
                         ]},
                     {$or: [
                         {validationType: {"$type": "string"}}, 
                         {validationType: {"$type": "null"}}
                         ]},
                     {$or: [
                         {thresholdType: {"$type": "string", "$in": ["Continuous"]}},
                         {thresholdType: {"$type": "number" , "$in": [0, 10, 20, 30]}},
                         {thresholdType: {"$type": "null"}}
                         ]},
                     {$or: [
                         {thresholdValue: {"$type": "number"}}, 
                         {thresholdValue: {"$type": "null"}}
                         ]},
                     {$or: [
                         {modelAuthors: {"$type": "string"}}, 
                         {modelAuthors: {"$type": "null"}}
                         ]},
                     {dd: {"$type": "number", "$gte": 1, "$lte": 31}},
                     {mm: {"$type": "number", "$gte": 1, "$lte": 12}},
                     {yyyy: {"$type": "number", "$gte": 1800, "$lte": 2100}},
                    {$or: [
                        {statCoverLC2: {"$type": "number"}}, 
                        {statCoverLC2: {"$type": "null"}}
                        ]},
                    {$or: [
                        {statCoverLC3: {"$type": "number"}}, 
                        {statCoverLC3: {"$type": "null"}}
                        ]},
                    {$or: [
                        {statCoverLC4: {"$type": "number"}}, 
                        {statCoverLC4: {"$type": "null"}}
                        ]},
                    {$or: [{statCoverLC5: {"$type": "number"}}, {statCoverLC5: {"$type": "null"}}]},
                    {$or: [{statCoverLC6: {"$type": "number"}}, {statCoverLC6: {"$type": "null"}}]},
                    {$or: [{statCoverLC7: {"$type": "number"}}, {statCoverLC7: {"$type": "null"}}]},
                    {$or: [{statCoverLC8: {"$type": "number"}}, {statCoverLC8: {"$type": "null"}}]},
                    {$or: [{statCoverLC9: {"$type": "number"}}, {statCoverLC9: {"$type": "null"}}]},
                    {$or: [{statCoverLC10: {"$type": "number"}}, {statCoverLC10: {"$type": "null"}}]},
                    {$or: [{statCoverLC11: {"$type": "number"}}, {statCoverLC11: {"$type": "null"}}]},
                    {$or: [{statCoverLC12: {"$type": "number"}}, {statCoverLC12: {"$type": "null"}}]},
                    {$or: [{statCoverLC13: {"$type": "number"}}, {statCoverLC13: {"$type": "null"}}]},
                    {$or: [{statCoverLC14: {"$type": "number"}}, {statCoverLC14: {"$type": "null"}}]},
                    {$or: [{statCoverLC15: {"$type": "number"}}, {statCoverLC15: {"$type": "null"}}]},
                    {$or: [{statCoverLC16: {"$type": "number"}}, {statCoverLC16: {"$type": "null"}}]},
                    {$or: [{statCoverLC17: {"$type": "number"}}, {statCoverLC17: {"$type": "null"}}]},
                    {$or: [{statCoverLC18: {"$type": "number"}}, {statCoverLC18: {"$type": "null"}}]},
                    {$or: [{statCoverLC19: {"$type": "number"}}, {statCoverLC19: {"$type": "null"}}]},
                    {$or: [{statCoverLC20: {"$type": "number"}}, {statCoverLC20: {"$type": "null"}}]},
                    {$or: [{statCoverLC21: {"$type": "number"}}, {statCoverLC21: {"$type": "null"}}]},
                    {$or: [{statCoverLC22: {"$type": "number"}}, {statCoverLC22: {"$type": "null"}}]},
                    {$or: [{statCoverLC23: {"$type": "number"}}, {statCoverLC23: {"$type": "null"}}]},
                    {$or: [{statCoverLC24: {"$type": "number"}}, {statCoverLC24: {"$type": "null"}}]},
                    {$or: [{statCoverLC25: {"$type": "number"}}, {statCoverLC25: {"$type": "null"}}]},
                    {$or: [{statCoverLC26: {"$type": "number"}}, {statCoverLC26: {"$type": "null"}}]},
                    {$or: [{statCoverLC27: {"$type": "number"}}, {statCoverLC27: {"$type": "null"}}]},
                    {$or: [{statCoverLC28: {"$type": "number"}}, {statCoverLC28: {"$type": "null"}}]},
                    {$or: [{statCoverLC29: {"$type": "number"}}, {statCoverLC29: {"$type": "null"}}]},
                    {$or: [{statCoverLC30: {"$type": "number"}}, {statCoverLC30: {"$type": "null"}}]},
                    {$or: [{statCoverLC31: {"$type": "number"}}, {statCoverLC31: {"$type": "null"}}]},
                    {$or: [{statCoverLC32: {"$type": "number"}}, {statCoverLC32: {"$type": "null"}}]},
                    {$or: [{statCoverLC33: {"$type": "number"}}, {statCoverLC33: {"$type": "null"}}]},
                    {$or: [{statCoverLC34: {"$type": "number"}}, {statCoverLC34: {"$type": "null"}}]},
                    {$or: [{statCoverLC35: {"$type": "number"}}, {statCoverLC35: {"$type": "null"}}]},
                    {$or: [{statCoverLC36: {"$type": "number"}}, {statCoverLC36: {"$type": "null"}}]},
                    {$or: [{statCoverLC37: {"$type": "number"}}, {statCoverLC37: {"$type": "null"}}]},
                    {$or: [{statCoverLC38: {"$type": "number"}}, {statCoverLC38: {"$type": "null"}}]},
                    {$or: [{statCoverLC39: {"$type": "number"}}, {statCoverLC39: {"$type": "null"}}]},
                    {$or: [{statCoverLC40: {"$type": "number"}}, {statCoverLC40: {"$type": "null"}}]},
                    {$or: [{statCoverLC41: {"$type": "number"}}, {statCoverLC41: {"$type": "null"}}]},
                    {$or: [{statCoverLC42: {"$type": "number"}}, {statCoverLC42: {"$type": "null"}}]},
                    {$or: [{statCoverLC43: {"$type": "number"}}, {statCoverLC43: {"$type": "null"}}]},
                    {$or: [{statCoverLC44: {"$type": "number"}}, {statCoverLC44: {"$type": "null"}}]},
                    {$or: [{statCoverLC45: {"$type": "number"}}, {statCoverLC45: {"$type": "null"}}]},
                    {$or: [{statCoverLC46: {"$type": "number"}}, {statCoverLC46: {"$type": "null"}}]},
                    {$or: [{statCoverLC47: {"$type": "number"}}, {statCoverLC47: {"$type": "null"}}]},
                    {$or: [{statCoverLC48: {"$type": "number"}}, {statCoverLC48: {"$type": "null"}}]},
                    {$or: [{statCoverLC49: {"$type": "number"}}, {statCoverLC49: {"$type": "null"}}]},
                    {$or: [{statCoverLC50: {"$type": "number"}}, {statCoverLC50: {"$type": "null"}}]},
                    {$or: [{statCoverLC51: {"$type": "number"}}, {statCoverLC51: {"$type": "null"}}]},
                    {$or: [{statCoverLC52: {"$type": "number"}}, {statCoverLC52: {"$type": "null"}}]},
                    {$or: [{statCoverLC53: {"$type": "number"}}, {statCoverLC53: {"$type": "null"}}]},
                    {$or: [{statCoverLC54: {"$type": "number"}}, {statCoverLC54: {"$type": "null"}}]},
                    {$or: [{statCoverLC55: {"$type": "number"}}, {statCoverLC55: {"$type": "null"}}]},
                    {$or: [{statForestLoss00: {"$type": "number"}}, {statForestLoss00: {"$type": "null"}}]},
                    {$or: [{statForestLoss05: {"$type": "number"}}, {statForestLoss05: {"$type": "null"}}]},
                    {$or: [{statForestLoss10: {"$type": "number"}}, {statForestLoss10: {"$type": "null"}}]},
                    {$or: [{statForestLoss12: {"$type": "number"}}, {statForestLoss12: {"$type": "null"}}]},
                    {$or: [{statForestLoss90: {"$type": "number"}}, {statForestLoss90: {"$type": "null"}}]},
                    {$or: [{statFutureForest30c: {"$type": "number"}}, {statFutureForest30c: {"$type": "null"}}]},
                    {$or: [{statFutureForest30d: {"$type": "number"}}, {statFutureForest30d: {"$type": "null"}}]},
                    {$or: [{statFutureForest30h: {"$type": "number"}}, {statFutureForest30h: {"$type": "null"}}]},
                    {$or: [{statRangeSize: {"$type": "number"}}, {statRangeSize: {"$type": "null"}}]},
                    {$or: [{statModelEOO: {"$type": "number"}}, {statModelEOO: {"$type": "null"}}]},
                    {$or: [{statRecsEOO: {"$type": "number"}}, {statRecsEOO: {"$type": "null"}}]},
                    {$or: [{statRepPA: {"$type": "number"}}, {statRepPA: {"$type": "null"}}]},
                    {$or: [{statRepPA1: {"$type": "number"}}, {statRepPA1: {"$type": "null"}}]},
                    {$or: [{statRepPA2: {"$type": "number"}}, {statRepPA2: {"$type": "null"}}]},
                    {$or: [{statRepPA3: {"$type": "number"}}, {statRepPA3: {"$type": "null"}}]},
                    {$or: [{thumbPath: {"$type": "string"}}, {thumbPath: {"$type": "null"}}]},
                    {$or: [{zipPath: {"$type": "string"}}, {zipPath: {"$type": "null"}}]},
                    {$or: [{pngPath: {"$type": "string"}}, {pngPath: {"$type": "null"}}]},
                    {$or: [{methodFile: {"$type": "string"}}, {methodFile: {"$type": "null"}}]}
                    ]
             },
         validationLevel: "strict",
         validationAction: "error"
} )
