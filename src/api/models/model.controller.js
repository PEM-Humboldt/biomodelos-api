import Model from '../../models/model.model';
import Specie from '../../models/specie.model';
const log = require('../../config/log').logger();

/**
 * @swagger
 * /models/{taxID}:
 *   get:
 *     description: Models for an specific species. They can be filtered according to type query parameter
 *     operationId: MOD1
 *     parameters:
 *       - name: taxID
 *         in: path
 *         description: The taxon ID of the species
 *         required: true
 *         type: string
 *       - name: type
 *         in: query
 *         description: Type of the models to retrieve
 *         schema:
 *           type: string
 *           enum:
 *             - Continuous
 *             - Thresholds
 *             - Hypothesis
 *             - Valid
 *             - Published
 *     responses:
 *       "200":
 *         description: Success
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               published:
 *                 type: string
 *               customCitation:
 *                 type: string
 *               modelID:
 *                 type: string
 *               taxID:
 *                 type: number
 *               thresholdType:
 *                 type: string
 *               methodFile:
 *                 type: string
 *               modelLevel:
 *                 type: number
 *               modelStatus:
 *                 type: string
 *               thumb:
 *                 type: string
 *               zip:
 *                 type: string
 *               png:
 *                 type: string
 *               license:
 *                 type: string
 *     default:
 *       description: Error
 *       schema:
 *         $ref: "#/definitions/ErrorResponse"
 */
export async function read(req, res) {
  if (req.params.taxID) {
    let queryForQueryType = new Map([
      ['', { taxID: req.params.taxID, isActive: true }],
      [
        'Continuous',
        {
          taxID: req.params.taxID,
          modelStatus: 'Developing',
          thresholdType: 'Continuous',
          isActive: true
        }
      ],
      [
        'Thresholds',
        {
          taxID: req.params.taxID,
          modelStatus: 'Developing',
          thresholdType: { $nin: ['Continuous'] },
          isActive: true
        }
      ],
      [
        'Hypothesis',
        {
          taxID: req.params.taxID,
          modelStatus: { $in: ['pendingValidation'] },
          isActive: true
        }
      ],
      [
        'Valid',
        {
          taxID: req.params.taxID,
          modelStatus: { $in: ['Valid'] },
          isActive: true
        }
      ],
      [
        'Published',
        {
          taxID: req.params.taxID,
          published: true,
          isActive: true
        }
      ],
      [
        'Statistic',
        {
          taxID: req.params.taxID,
          modelStatus: { $in: ['Statistic'] },
          isActive: true
        }
      ]
    ]);
    try {
      let typeQuery = queryForQueryType.get(req.query.type);
      if (!typeQuery) typeQuery = queryForQueryType.get('');
      const docs = await Model.find(typeQuery, {
        _id: 0,
        taxID: 1,
        modelLevel: 1,
        modelStatus: 1,
        published: 1,
        modelSeason: 1,
        modelOrigin: 1,
        modelGeoExtent: 1,
        modelEpoch: 1,
        modelID: 1,
        thresholdType: 1,
        thumb: 1,
        zip: 1,
        png: 1,
        methodFile: 1,
        customCitation: 1,
        license: 1,
        gsLayer: 1,
        extentSize: 1
      });
      res.json(docs);
    } catch (err) {
      log.error(err);
      res.send('There was an error getting the models');
    }
  }
}

/**
 * @swagger
 * /models/metadata/{modelID}:
 *   get:
 *     description: Metadata of an specific model
 *     operationId: MOD2
 *     parameters:
 *       - name: modelID
 *         in: path
 *         description: The model ID to request
 *         required: true
 *         type: string
 *     responses:
 *       "200":
 *         description: Success
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               modelID:
 *                 type: string
 *               taxID:
 *                 type: number
 *               modelingMethod:
 *                 type: string
 *               thresholdType:
 *                 type: string
 *               validationType:
 *                 type: string
 *               perfStatType:
 *                 type: string
 *               perfStatValue:
 *                 type: number
 *               recsUsed:
 *                 type: number
 *               methodFile:
 *                 type: string
 *               modelLevel:
 *                 type: number
 *               modelStatus:
 *                 type: string
 *               modelAuthors:
 *                 type: string
 *               yyyy:
 *                 type: number
 *               mm:
 *                 type: number
 *               dd:
 *                 type: number
 *     default:
 *       description: Error
 *       schema:
 *         $ref: "#/definitions/ErrorResponse"
 */
export async function readModelMetadata(req, res) {
  if (req.params.modelID) {
    try {
      const docs = await Model.find(
        { modelID: req.params.modelID },
        {
          _id: 0,
          taxID: 1,
          modelingMethod: 1,
          modelLevel: 1,
          modelStatus: 1,
          perfStatType: 1,
          perfStatValue: 1,
          validationType: 1,
          thresholdType: 1,
          modelAuthors: 1,
          citation: 1,
          dd: 1,
          mm: 1,
          yyyy: 1,
          modelID: 1,
          methodFile: 1,
          recsUsed: 1
        }
      );
      res.json(docs);
    } catch (err) {
      log.error(err);
      res.send('There was an error getting the metadata');
    }
  }
}

/**
 * @swagger
 * /models/approved/eoo/{taxID}:
 *   get:
 *     description: Get the extension occurrence statistics for approved model of an specific species
 *     operationId: MOD3
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
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               modelID:
 *                 type: string
 *               recsUsed:
 *                 type: number
 *               modelLevel:
 *                 type: number
 *               statModelEOO:
 *                 type: number
 *               statRecsEOO:
 *                 type: number
 *               statRangeSize:
 *                 type: number
 *     default:
 *       description: Error
 *       schema:
 *         $ref: "#/definitions/ErrorResponse"
 */
export async function occurrenceEooStatsModel(req, res) {
  if (req.params.taxID) {
    try {
      const docs = await Model.find(
        { taxID: +req.params.taxID, modelStatus: 'Valid', isActive: true },
        {
          _id: 0,
          modelID: 1,
          modelLevel: 1,
          statRangeSize: 1,
          statModelEOO: 1,
          statRecsEOO: 1,
          recsUsed: 1
        }
      );
      res.json(docs);
    } catch (err) {
      log.error(err);
      res.send('There was an error getting the statistics');
    }
  }
}

/**
 * @swagger
 * /models/approved/rpa/{taxID}:
 *   get:
 *     description: Get the Representation statistics for approved model of an specific species
 *     operationId: MOD4
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
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               modelID:
 *                 type: string
 *               modelLevel:
 *                 type: number
 *               statRepPA:
 *                 type: number
 *               statRepPA1:
 *                 type: number
 *               statRepPA2:
 *                 type: number
 *               statRepPA3:
 *                 type: number
 *     default:
 *       description: Error
 *       schema:
 *         $ref: "#/definitions/ErrorResponse"
 */
export async function occurrenceRepStatsModel(req, res) {
  if (req.params.taxID) {
    try {
      const docs = await Model.find(
        { taxID: +req.params.taxID, modelStatus: 'Valid', isActive: true },
        {
          _id: 0,
          modelID: 1,
          modelLevel: 1,
          statRepPA: 1,
          statRepPA1: 1,
          statRepPA2: 1,
          statRepPA3: 1
        }
      );
      res.json(docs);
    } catch (err) {
      log.error(err);
      res.send('There was an error getting the statistics');
    }
  }
}

/**
 * @swagger
 * /models/approved/forest_loss/{taxID}:
 *   get:
 *     description: Get the spatial statistics of forest loss for approved model of a specific species
 *     operationId: MOD5
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
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               modelID:
 *                 type: string
 *               modelLevel:
 *                 type: number
 *               statForestLoss90:
 *                 type: number
 *               statForestLoss00:
 *                 type: number
 *               statForestLoss05:
 *                 type: number
 *               statForestLoss10:
 *                 type: number
 *               statForestLoss12:
 *                 type: number
 *               statForestLoss14:
 *                 type: number
 *               statForestLoss16:
 *                 type: number
 *               statFutureForest30c:
 *                 type: number
 *               statFutureForest30d:
 *                 type: number
 *               statFutureForest30h:
 *                 type: number
 *     default:
 *       description: Error
 *       schema:
 *         $ref: "#/definitions/ErrorResponse"
 */
export async function occurrenceForestLossStatsModel(req, res) {
  if (req.params.taxID) {
    try {
      const docs = (await Model.find({
        taxID: +req.params.taxID,
        modelStatus: 'Valid',
        isActive: true
      })).map(doc => {
        const keys = Object.keys(doc.toObject()).filter(key =>
          /statForestLoss[0-9]+$/.test(key)
        );
        const newDoc = {
          modelID: doc.modelID,
          modelLevel: doc.modelLevel,
          statFutureForest30h: doc.statFutureForest30h,
          statFutureForest30d: doc.statFutureForest30d,
          statFutureForest30c: doc.statFutureForest30c
        };
        keys.forEach(key => {
          if (doc[`${key}`] !== null) {
            newDoc[`${key}`] = doc[`${key}`];
          }
        });
        return newDoc;
      });
      res.json(docs);
    } catch (err) {
      log.error(err);
      res.send('There was an error getting the statistics');
    }
  }
}

/**
 * @swagger
 * /models/approved/covers/{taxID}:
 *   get:
 *     description: Get the spatial statistics of covers for for approved model of an specific species
 *     operationId: MOD6
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
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               modelID:
 *                 type: string
 *               modelLevel:
 *                 type: number
 *               statCoverLC2:
 *                 type: number
 *               statCoverLC3:
 *                 type: number
 *               statCoverLC4:
 *                 type: number
 *               statCoverLC5:
 *                 type: number
 *               statCoverLC6:
 *                 type: number
 *               statCoverLC7:
 *                 type: number
 *               statCoverLC8:
 *                 type: number
 *               statCoverLC9:
 *                 type: number
 *               statCoverLC10:
 *                 type: number
 *               statCoverLC11:
 *                 type: number
 *               statCoverLC12:
 *                 type: number
 *               statCoverLC13:
 *                 type: number
 *               statCoverLC14:
 *                 type: number
 *               statCoverLC15:
 *                 type: number
 *               statCoverLC16:
 *                 type: number
 *               statCoverLC17:
 *                 type: number
 *               statCoverLC18:
 *                 type: number
 *               statCoverLC19:
 *                 type: number
 *               statCoverLC20:
 *                 type: number
 *               statCoverLC21:
 *                 type: number
 *               statCoverLC22:
 *                 type: number
 *               statCoverLC23:
 *                 type: number
 *               statCoverLC24:
 *                 type: number
 *               statCoverLC25:
 *                 type: number
 *               statCoverLC26:
 *                 type: number
 *               statCoverLC27:
 *                 type: number
 *               statCoverLC28:
 *                 type: number
 *               statCoverLC29:
 *                 type: number
 *               statCoverLC30:
 *                 type: number
 *               statCoverLC31:
 *                 type: number
 *               statCoverLC32:
 *                 type: number
 *               statCoverLC33:
 *                 type: number
 *               statCoverLC34:
 *                 type: number
 *               statCoverLC35:
 *                 type: number
 *               statCoverLC36:
 *                 type: number
 *               statCoverLC37:
 *                 type: number
 *               statCoverLC38:
 *                 type: number
 *               statCoverLC39:
 *                 type: number
 *               statCoverLC40:
 *                 type: number
 *               statCoverLC41:
 *                 type: number
 *               statCoverLC42:
 *                 type: number
 *               statCoverLC43:
 *                 type: number
 *               statCoverLC44:
 *                 type: number
 *               statCoverLC45:
 *                 type: number
 *               statCoverLC46:
 *                 type: number
 *               statCoverLC47:
 *                 type: number
 *               statCoverLC48:
 *                 type: number
 *               statCoverLC49:
 *                 type: number
 *               statCoverLC50:
 *                 type: number
 *               statCoverLC51:
 *                 type: number
 *               statCoverLC52:
 *                 type: number
 *               statCoverLC53:
 *                 type: number
 *               statCoverLC54:
 *                 type: number
 *               statCoverLC55:
 *                 type: number
 *     default:
 *       description: Error
 *       schema:
 *         $ref: "#/definitions/ErrorResponse"
 */
export async function occurrenceCoversStatsModel(req, res) {
  if (req.params.taxID) {
    try {
      const docs = await Model.find(
        { taxID: +req.params.taxID, modelStatus: 'Valid', isActive: true },
        {
          _id: 0,
          modelID: 1,
          modelLevel: 1,
          statCoverLC2: 1,
          statCoverLC3: 1,
          statCoverLC4: 1,
          statCoverLC5: 1,
          statCoverLC6: 1,
          statCoverLC7: 1,
          statCoverLC8: 1,
          statCoverLC9: 1,
          statCoverLC10: 1,
          statCoverLC11: 1,
          statCoverLC12: 1,
          statCoverLC13: 1,
          statCoverLC14: 1,
          statCoverLC15: 1,
          statCoverLC16: 1,
          statCoverLC17: 1,
          statCoverLC18: 1,
          statCoverLC19: 1,
          statCoverLC20: 1,
          statCoverLC21: 1,
          statCoverLC22: 1,
          statCoverLC23: 1,
          statCoverLC24: 1,
          statCoverLC25: 1,
          statCoverLC26: 1,
          statCoverLC27: 1,
          statCoverLC28: 1,
          statCoverLC29: 1,
          statCoverLC30: 1,
          statCoverLC31: 1,
          statCoverLC32: 1,
          statCoverLC33: 1,
          statCoverLC34: 1,
          statCoverLC35: 1,
          statCoverLC36: 1,
          statCoverLC37: 1,
          statCoverLC38: 1,
          statCoverLC39: 1,
          statCoverLC40: 1,
          statCoverLC41: 1,
          statCoverLC42: 1,
          statCoverLC43: 1,
          statCoverLC44: 1,
          statCoverLC45: 1,
          statCoverLC46: 1,
          statCoverLC47: 1,
          statCoverLC48: 1,
          statCoverLC49: 1,
          statCoverLC50: 1,
          statCoverLC51: 1,
          statCoverLC52: 1,
          statCoverLC53: 1,
          statCoverLC54: 1,
          statCoverLC55: 1
        }
      );
      res.json(docs);
    } catch (err) {
      log.error(err);
      res.send('There was an error getting the statistics');
    }
  }
}

/**
 * @swagger
 * /models/stats/:
 *   get:
 *     description: "Estadísticas generales de modelos por grupo taxonómico"
 *     operationId: STA8
 *     responses:
 *       "200":
 *         description: Success
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             required:
 *               - taxonomicGroup
 *               - totalSpecies
 *             properties:
 *               taxonomicGroup:
 *                 type: string
 *               totalSpecies:
 *                 type: number
 *               validModels:
 *                 type: number
 *               publishedModels:
 *                 type: number
 *               developingModels:
 *                 type: number
 *               statisticModels:
 *                 type: number
 *             features:
 *               type: array
 *               items:
 *                 $ref: "#/definitions/FeatureSpeciesRecord"
 *     default:
 *       description: Error
 *       schema:
 *         $ref: "#/definitions/ErrorResponse"
 */
export async function generalModelStats(req, res) {
  let groups = [];
  try {
    groups = await Specie.aggregate([
      {
        $group: {
          _id: {
            taxonomyClass: '$bmClass'
          },
          taxes: { $push: '$taxID' },
          total: { $sum: 1 }
        }
      }
    ]);
  } catch (err) {
    log.error(err);
    res.send('There was an error getting the statistics');
  }

  const stats = groups.map(group =>
    Model.aggregate([
      {
        $match: {
          taxID: { $in: group.taxes },
          isActive: true
        }
      },
      {
        $project: {
          taxID: 1,
          status: {
            $switch: {
              branches: [
                {
                  case: { $eq: ['$modelStatus', 'Valid'] },
                  then: '0-Valid'
                },
                {
                  case: {
                    $and: [
                      { $eq: ['$modelStatus', 'pendingValidation'] },
                      { $eq: ['$published', true] }
                    ]
                  },
                  then: '1-Published'
                },
                {
                  case: { $eq: ['$modelStatus', 'pendingValidation'] },
                  then: '2-Developing'
                },
                {
                  case: { $eq: ['$modelStatus', 'Statistic'] },
                  then: '3-Statistic'
                }
              ],
              default: '4-no-model'
            }
          }
        }
      },
      { $sort: { status: 1 } },
      {
        $group: {
          _id: {
            taxID: '$taxID'
          },
          modelStatus: { $first: '$status' }
        }
      },
      {
        $group: {
          _id: {
            modelStatus: '$modelStatus'
          },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          modelStatus: '$_id.modelStatus',
          count: 1,
          _id: 0
        }
      }
    ])
  );

  return Promise.all(stats)
    .then(response => {
      const result = groups.map((group, index) => {
        /* eslint-disable security/detect-object-injection */
        const validModels = response[index].find(
          e => e.modelStatus === '0-Valid'
        );
        const publishedModels = response[index].find(
          e => e.modelStatus === '1-Published'
        );
        const developingModels = response[index].find(
          e => e.modelStatus === '2-Developing'
        );
        const statisticModels = response[index].find(
          e => e.modelStatus === '3-Statistic'
        );
        /* eslint-enable security/detect-object-injection */
        return {
          taxonomicGroup: group._id.taxonomyClass,
          totalSpecies: group.total,
          validModels: validModels ? validModels.count : 0,
          publishedModels: publishedModels ? publishedModels.count : 0,
          developingModels: developingModels ? developingModels.count : 0,
          statisticModels: statisticModels ? statisticModels.count : 0
        };
      });
      res.json(result);
    })
    .catch(err => {
      log.error(err);
      res.send('There was an error getting the statistics');
    });
}

/**
 * @swagger
 * /tools/models/{modelID}/layer:
 *   put:
 *     description: Update the layer name for an specific model
 *     parameters:
 *       - name: modelID
 *         in: path
 *         description: The model id to update
 *         required: true
 *         type: string
 *       - name: layer_name
 *         in: body
 *         description: the layer name to associate to the model
 *         required: true
 *         type: string
 *     responses:
 *       "204":
 *         description: Successful update
 *     default:
 *       description: Error
 *       schema:
 *         $ref: "#/definitions/ErrorResponse"
 */
export async function updateModelLayer(req, res) {
  if (!req.params.modelID || !req.body.layer_name) {
    res.send(400, 'modelID and layer_name are required');
  }

  try {
    const update = await Model.updateOne(
      { modelID: req.params.modelID },
      {
        $set: {
          gsLayer: req.body.layer_name
        }
      }
    );
    res.send({ message: 'Model updated successfully' });
  } catch (err) {
    log.error(err);
    res.json({ message: 'Error updating the model' });
  }
}
