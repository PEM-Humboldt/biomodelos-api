import GeoJSON from 'geojson';
import { Record } from '../../models/record.model';
import Specie from '../../models/specie.model';

function constructQuery(req) {
  const bmClass = {
    $or: [
      {
        bmClass: {
          $in: req.query.bmClass
            ? req.query.bmClass.constructor === Array
              ? req.query.bmClass
              : [req.query.bmClass]
            : undefined
        }
      }
    ]
  };
  const endemic = { $or: [{ endemic: { $in: [true] } }] };
  const invasive = { $or: [{ invasive: { $in: [true] } }] };
  const endangered = {
    $or: [
      {
        iucn: {
          $in: ['EN', 'VU', 'CR']
        }
      }
    ]
  };
  const query = {};
  if (
    req.params.species ||
    req.query.bmClass ||
    req.query.endangered ||
    req.query.endemic ||
    req.query.invasive
  ) {
    query.$and = [];
    if (req.query.bmClass) query.$and.push(bmClass);
    if (req.query.endangered) query.$and.push(endangered);
    if (req.query.endemic) query.$and.push(endemic);
    if (req.query.invasive) query.$and.push(invasive);
  }
  return query;
}

/**
 * @swagger
 * /species/records/{taxID}:
 *   get:
 *     description: "All the records of an acceptedNameUsage (using internal taxID as key): query (use = true & visualizationPrivileges = 0)"
 *     operationId: REC1
 *     parameters:
 *       - name: taxID
 *         in: path
 *         description: The taxon ID of the specie
 *         required: true
 *         type: string
 *     responses:
 *       "200":
 *         description: Success
 *         schema:
 *           type: object
 *           required:
 *             - type
 *             - features
 *           properties:
 *             type:
 *               type: string
 *               default: "FeatureCollection"
 *             features:
 *               type: array
 *               items:
 *                 $ref: "#/definitions/FeatureSpecieRecord"
 *     default:
 *       description: Error
 *       schema:
 *         $ref: "#/definitions/ErrorResponse"
 */
export async function read(req, res) {
  if (req.params.taxID) {
    try {
      const docs = await Record.aggregate([
        {
          $match: {
            taxID: +req.params.taxID,
            use: true,
            visualizationPrivileges: 0,
            spatialDuplicated: false
          }
        },
        {
          $project: {
            reported: {
              $cond: {
                if: {
                  $and: [{ $isArray: '$reported' }, { $ne: ['$reported', []] }]
                },
                then: { $isArray: '$reported' },
                else: false
              }
            },
            updated: {
              $cond: {
                if: {
                  $and: [{ $isArray: '$updated' }, { $ne: ['$updated', []] }]
                },
                then: { $isArray: '$updated' },
                else: false
              }
            },
            _id: 1,
            taxID: 1,
            acceptedNameUsage: 1,
            species: 1,
            speciesOriginal: 1,
            locality: 1,
            lat: 1,
            lon: 1,
            alt: 1,
            basisOfRecord: 1,
            catalogNumber: 1,
            collector: 1,
            institution: 1,
            url: 1,
            dd: 1,
            mm: 1,
            yyyy: 1,
            suggestedStateProvince: 1,
            suggestedCounty: 1,
            environmentalOutlier: 1,
            source: 1
          }
        }
      ]);
      res.send(GeoJSON.parse(docs, { Point: ['lat', 'lon'] }));
    } catch (err) {
      res.send(err);
    }
  }
}

export async function readValidForGroup(req, res) {
  if (req.params.taxID) {
    try {
      const docs = await Record.aggregate([
        {
          $match: {
            taxID: +req.params.taxID,
            use: true,
            visualizationPrivileges: 1,
            spatialDuplicated: false
          }
        },
        {
          $project: {
            reported: {
              $cond: {
                if: {
                  $and: [{ $isArray: '$reported' }, { $ne: ['$reported', []] }]
                },
                then: { $isArray: '$reported' },
                else: false
              }
            },
            updated: {
              $cond: {
                if: {
                  $and: [{ $isArray: '$updated' }, { $ne: ['$updated', []] }]
                },
                then: { $isArray: '$updated' },
                else: false
              }
            },
            _id: 1,
            taxID: 1,
            acceptedNameUsage: 1,
            species: 1,
            speciesOriginal: 1,
            locality: 1,
            lat: 1,
            lon: 1,
            alt: 1,
            basisOfRecord: 1,
            catalogNumber: 1,
            collector: 1,
            institution: 1,
            url: 1,
            dd: 1,
            mm: 1,
            yyyy: 1,
            suggestedStateProvince: 1,
            suggestedCounty: 1,
            environmentalOutlier: 1,
            source: 1
          }
        }
      ]);
      res.send(GeoJSON.parse(docs, { Point: ['lat', 'lon'] }));
    } catch (err) {
      res.send(err);
    }
  }
}

/**
 * @swagger
 * /species:
 *   get:
 *     description: "Get all the species in BioModelos"
 *     operationId: SPE1
 *     parameters:
 *       - name: taxID
 *         in: path
 *         description: The taxon ID of the specie
 *         required: true
 *         type: string
 *     responses:
 *       "200":
 *         description: Success
 *         schema:
 *           type: object
 *           required:
 *             - type
 *             - features
 *           properties:
 *             type:
 *               type: string
 *               default: "FeatureCollection"
 *             features:
 *               type: array
 *               items:
 *                 $ref: "#/definitions/FeatureSpecieRecord"
 *     default:
 *       description: Error
 *       schema:
 *         $ref: "#/definitions/ErrorResponse"
 */
export async function getAllSpecies(req, res) {
  const query = constructQuery(req);
  if (req.query.modelStatus) {
    try {
      const docs = await Specie.aggregate([
        {
          $match: query
        },
        {
          $lookup: {
            localField: 'taxID',
            from: 'models',
            foreignField: 'taxID',
            as: 'models'
          }
        },
        {
          $match: { 'models.modelStatus': req.query.modelStatus }
        },
        {
          $project: {
            species: 1,
            taxID: 1,
            _id: 0
          }
        }
      ]).sort({ species: 1 });
      res.json(docs);
    } catch (err) {
      res.json(err);
    }
  } else {
    try {
      const docs = await Specie.find(query, {
        species: 1,
        taxID: 1,
        _id: 0
      }).sort({ species: 1 });
      res.json(docs);
    } catch (err) {
      res.json(err);
    }
  }
}

/**
 * @swagger
 * /species/{taxID}:
 *   get:
 *     description: "Get superior taxonomy and the total of records of a species"
 *     operationId: SPE2
 *     parameters:
 *       - name: taxID
 *         in: path
 *         description: The taxon ID of the specie
 *         required: true
 *         type: string
 *     responses:
 *       "200":
 *         description: Success
 *         schema:
 *           type: object
 *           required:
 *             - type
 *             - features
 *           properties:
 *             type:
 *               type: string
 *               default: "FeatureCollection"
 *             features:
 *               type: array
 *               items:
 *                 $ref: "#/definitions/FeatureSpecieRecord"
 *     default:
 *       description: Error
 *       schema:
 *         $ref: "#/definitions/ErrorResponse"
 */
export async function getTaxonomyAndRecords(req, res) {
  if (req.params.taxID) {
    try {
      const doc = await Specie.find(
        { taxID: +req.params.taxID },
        {
          _id: 0,
          acceptedNameUsage: 1,
          species: 1,
          kingdom: 1,
          phylum: 1,
          class: 1,
          order: 1,
          family: 1
        }
      );
      try {
        const doc2 = await Record.aggregate([
          {
            $match: {
              taxID: +req.params.taxID,
              use: true,
              spatialDuplicated: false
            }
          },
          {
            $group: {
              _id: {
                characteristics: { taxID: '$taxID' }
              },
              totalRecords: { $sum: 1 }
            }
          },
          {
            $project: {
              _id: 0,
              taxID: '$_id.characteristics.taxID',
              totalRecords: '$totalRecords'
            }
          }
        ]);
        if (doc2[0] && doc2[0].totalRecords) {
          doc[0]['_doc']['totalRecords'] = doc2[0].totalRecords;
        } else {
          doc[0]['_doc']['totalRecords'] = 0;
        }
        res.json(doc);
      } catch (err) {
        res.json(err);
      }
    } catch (err) {
      res.json(err);
    }
  }
}

/**
 * @swagger
 * /species/search/{species}:
 *   get:
 *     description: "Get general query to obtain species with some specific characteristics"
 *     operationId: SPE3
 *     parameters:
 *       - name: taxID
 *         in: path
 *         description: The taxon ID of the specie
 *         required: true
 *         type: string
 *     responses:
 *       "200":
 *         description: Success
 *         schema:
 *           type: object
 *           required:
 *             - type
 *             - features
 *           properties:
 *             type:
 *               type: string
 *               default: "FeatureCollection"
 *             features:
 *               type: array
 *               items:
 *                 $ref: "#/definitions/FeatureSpecieRecord"
 *     default:
 *       description: Error
 *       schema:
 *         $ref: "#/definitions/ErrorResponse"
 */
export async function searchSpecie(req, res) {
  const query = constructQuery(req);
  if (req.params.species) {
    const regEx = new RegExp(req.params.species, 'ig');
    query.$and.push({ species: { $regex: regEx } });
  }
  if (req.query.modelStatus) {
    try {
      const docs = await Specie.aggregate([
        {
          $match: query
        },
        {
          $lookup: {
            localField: 'taxID',
            from: 'models',
            foreignField: 'taxID',
            as: 'models'
          }
        },
        {
          $match: { 'models.modelStatus': req.query.modelStatus }
        },
        {
          $project: {
            _id: 0,
            species: 1,
            taxID: 1,
            taxonomicStatus: 1,
            iucn: 1,
            bmClass: 1,
            endemic: 1,
            invasive: 1
          }
        }
      ]).sort({ species: 1 });
      res.json(docs);
    } catch (err) {
      res.json(err);
    }
  } else {
    try {
      const docs = await Specie.find(query, {
        _id: 0,
        species: 1,
        taxID: 1,
        taxonomicStatus: 1,
        iucn: 1,
        bmClass: 1,
        endemic: 1,
        invasive: 1
      }).sort({ species: 1 });
      res.json(docs);
    } catch (err) {
      res.json(err);
    }
  }
}
