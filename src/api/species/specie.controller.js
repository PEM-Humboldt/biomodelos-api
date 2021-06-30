import GeoJSON from 'geojson';
import { Record } from '../../models/record.model';
import Model from '../../models/model.model';
import Specie from '../../models/specie.model';
const log = require('../../config/log').logger();

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
  // TODO: Remove first level if
  if (
    req.params.species ||
    req.query.bmClass ||
    req.query.endangered ||
    req.query.endemic ||
    req.query.invasive
  ) {
    query.$and = [];
    if (req.query.bmClass) query.$and.push(bmClass);
    if (req.query.endangered) {
      query.$and.push(endangered);
      query.$and.push({ $or: [{ iucn: { $ne: null } }] });
    }
    if (req.query.endemic) query.$and.push(endemic);
    if (req.query.invasive) query.$and.push(invasive);
  }
  return query;
}

/**
 * @swagger
 * /species/records/{taxID}:
 *   get:
 *     description: "Get all records of an species acceptedNameUsage."
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
 *                 $ref: "#/definitions/FeatureSpeciesRecord"
 *     default:
 *       description: Error
 *       schema:
 *         $ref: "#/definitions/ErrorResponse"
 */
export async function getSpeciesRecords(req, res) {
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
                if: { $ifNull: ['$reportedDate', false] },
                then: true,
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
            verbatimLocality: 1,
            decimalLatitude: 1,
            decimalLongitude: 1,
            verbatimElevation: 1,
            basisOfRecord: 1,
            catalogNumber: 1,
            collectionCode: 1,
            recordedBy: 1,
            institutionCode: 1,
            url: 1,
            day: 1,
            month: 1,
            year: 1,
            suggestedStateProvince: 1,
            suggestedCounty: 1,
            environmentalOutlier: 1,
            source: 1,
            stateProvince: 1,
            county: 1
          }
        }
      ]);
      res.send(
        GeoJSON.parse(docs, { Point: ['decimalLatitude', 'decimalLongitude'] })
      );
    } catch (err) {
      log.error(err);
      res.send('There was an error getting the records');
    }
  }
}

/**
 * @swagger
 * /species/records/group/{taxID}:
 *   get:
 *     description: "Get all records of an species acceptedNameUsage, with privileges for group."
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
 *                 $ref: "#/definitions/FeatureSpeciesRecord"
 *     default:
 *       description: Error
 *       schema:
 *         $ref: "#/definitions/ErrorResponse"
 */
export async function getSpeciesRecordsWithPrivileges(req, res) {
  if (req.params.taxID) {
    try {
      const docs = await Record.aggregate([
        {
          $match: {
            taxID: +req.params.taxID,
            use: true,
            visualizationPrivileges: { $in: [1, 0] },
            spatialDuplicated: false
          }
        },
        {
          $project: {
            reported: {
              $cond: {
                if: { $ifNull: ['$reportedDate', false] },
                then: true,
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
            verbatimLocality: 1,
            decimalLatitude: 1,
            decimalLongitude: 1,
            verbatimElevation: 1,
            basisOfRecord: 1,
            catalogNumber: 1,
            collectionCode: 1,
            recordedBy: 1,
            institutionCode: 1,
            url: 1,
            day: 1,
            month: 1,
            year: 1,
            suggestedStateProvince: 1,
            suggestedCounty: 1,
            environmentalOutlier: 1,
            source: 1,
            stateProvince: 1,
            county: 1
          }
        }
      ]);
      res.send(
        GeoJSON.parse(docs, { Point: ['decimalLatitude', 'decimalLongitude'] })
      );
    } catch (err) {
      log.error(err);
      res.send('There was an error getting the records');
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
 *       - name: bmClass
 *         in: query
 *         description: // TODO Describe parameter
 *         required: false
 *         type: string
 *       - name: endangered
 *         in: query
 *         description: true to filter endangered species
 *         required: false
 *         type: boolean
 *       - name: endemic
 *         in: query
 *         description: true to filter endemic species
 *         required: false
 *         type: boolean
 *       - name: invasive
 *         in: query
 *         description: true to filter invasive species
 *         required: false
 *         type: boolean
 *       - name: modelStatus
 *         in: query
 *         description: Filter species by model status
 *         required: false
 *         type: string
 *       - name: speciesIn
 *         in: query
 *         description: Filter species by taxID
 *         required: false
 *         schema:
 *           type: array
 *           items:
 *             type: number
 *     responses:
 *       "200":
 *         description: Success
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             required:
 *               - taxID
 *             properties:
 *               species:
 *                 type: string
 *               taxID:
 *                 type: number
 *               acceptedNameUsage:
 *                 type: string
 *         examples:
 *           AllSpecies:
 *             taxID: 1
 *             species: Abarema barbouriana
 *           FilterSpecies:
 *             taxID: 1
 *             acceptedNameUsage: Abarema barbouriana
 *     default:
 *       description: Error
 *       schema:
 *         $ref: "#/definitions/ErrorResponse"
 */
export async function getAllSpecies(req, res) {
  const query = constructQuery(req);
  try {
    let docs = [];
    if (req.query.speciesIn) {
      docs = await Specie.aggregate([
        {
          $match: {
            taxID: {
              $in: req.query.speciesIn.split(',').map(e => parseInt(e.trim()))
            }
          }
        },
        {
          $group: {
            _id: {
              acceptedNameUsage: '$acceptedNameUsage',
              taxID: '$taxID'
            },
            acceptedNameUsage: { $first: '$acceptedNameUsage' },
            taxID: { $first: '$taxID' }
          }
        },
        { $project: { _id: 0 } },
        { $sort: { acceptedNameUsage: 1 } }
      ]);
    } else {
      let modelsFilter = {};
      if (req.query.modelStatus) {
        const taxIds = await Model.find(
          { modelStatus: req.query.modelStatus },
          { taxID: 1, _id: 0 }
        );
        modelsFilter = {
          taxID: {
            $in: taxIds.map(e => e.taxID)
          }
        };
      } else if (!!req.query.withModel) {
        const taxIds = await Model.distinct('taxID');
        modelsFilter = {
          taxID: {
            $in: taxIds
          }
        };
      }
      docs = await Specie.find(Object.assign(query, modelsFilter), {
        species: 1,
        taxID: 1,
        _id: 0
      }).sort({ species: 1 });
    }
    res.json(docs);
  } catch (err) {
    log.error(err);
    res.send('There was an error getting the species');
  }
}

/**
 * @swagger
 * /species/{taxID}:
 *   get:
 *     description: "Get superior taxonomy and the total records of a species"
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
 *           properties:
 *             species:
 *               type: string
 *             family:
 *               type: string
 *             order:
 *               type: string
 *             class:
 *               type: string
 *             phylum:
 *               type: string
 *             kingdom:
 *               type: string
 *             acceptedNameUsage:
 *               type: string
 *             totalRecords:
 *               type: number
 *     default:
 *       description: Error
 *       schema:
 *         $ref: "#/definitions/ErrorResponse"
 */
export async function getTaxonomyAndTotalRecords(req, res) {
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
        log.error(err);
        res.send('There was an error getting the total records');
      }
    } catch (err) {
      log.error(err);
      res.send('There was an error getting the species information');
    }
  }
}

/**
 * @swagger
 * /species/search/{species}:
 *   get:
 *     description: Search species by its attribute "species". If no species is passed, it behaves like /species endpoint
 *     operationId: SPE3
 *     parameters:
 *       - name: species
 *         in: path
 *         description: The scientific name to filter by.
 *         required: true
 *         type: string
 *     responses:
 *       "200":
 *         description: Success
 *         schema:
 *           type: object
 *           properties:
 *             species:
 *               type: string
 *             endemic:
 *               type: boolean
 *             invasive:
 *               type: boolean
 *             iucn:
 *               type: string
 *             taxonomicStatus:
 *               type: string
 *             bmClass:
 *               type: string
 *             taxID:
 *               type: number
 *     default:
 *       description: Error
 *       schema:
 *         $ref: "#/definitions/ErrorResponse"
 */
export async function searchSpecies(req, res) {
  const { consumerscopes: scopesStr } = req.headers;
  let fullAccess = true;
  if (scopesStr) {
    const scopes = scopesStr.split(',').map(scope => scope.trim());
    fullAccess = scopes.includes('all');
  }

  let project = { _id: 0, species: 1, taxID: 1 }
  if (fullAccess) {
    project = {
      _id: 0,
      species: 1,
      taxID: 1,
      taxonomicStatus: 1,
      iucn: 1,
      bmClass: 1,
      endemic: 1,
      invasive: 1
    };
  }
  const query = constructQuery(req);
  if (req.params.species) {
    // eslint-disable-next-line security/detect-non-literal-regexp
    const regEx = new RegExp(
      req.params.species.replace(/[#-.]|[[-^]|[?|{}]/g, '\\$&'),
      'ig'
    );
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
          $project: project
        }
      ]).sort({ species: 1 });
      res.json(docs);
    } catch (err) {
      log.error(err);
      res.send('There was an error getting the species');
    }
  } else {
    try {
      const docs = await Specie.find(query, project).sort({ species: 1 });
      res.json(docs);
    } catch (err) {
      log.error(err);
      res.send('There was an error getting the species');
    }
  }
}
