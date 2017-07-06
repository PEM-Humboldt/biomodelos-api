import Model from '../../models/model.model';

/**
 * @swagger
 * /models/{taxID}:
 *   get:
 *     description: "Models of a specific species, with some query body"
 *     operationId: MOD1
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
  if (req.params.taxID && !req.query.type) {
    try {
      const docs = await Model.find(
        { taxID: req.params.taxID, isActive: true },
        {
          _id: 0,
          taxID: 1,
          modelLevel: 1,
          modelStatus: 1,
          published: 1,
          modelID: 1,
          thresholdType: 1,
          thumb: 1,
          zip: 1,
          png: 1,
          methodFile: 1,
          customCitation: 1,
          license: 1
        }
      );
      res.json(docs);
    } catch (err) {
      res.json(err);
    }
  } else if (req.params.taxID && req.query.type == 'Continuous') {
    try {
      const doc = await Model.find(
        {
          taxID: req.params.taxID,
          modelStatus: 'Developing',
          thresholdType: 'Continuous',
          isActive: true
        },
        {
          _id: 0,
          taxID: 1,
          modelLevel: 1,
          modelStatus: 1,
          published: 1,
          modelID: 1,
          thresholdType: 1,
          thumb: 1,
          zip: 1,
          png: 1,
          methodFile: 1,
          modelStatus: 1,
          customCitation: 1,
          license: 1
        }
      );
      res.json(doc);
    } catch (err) {
      res.json(err);
    }
  } else if (req.params.taxID && req.query.type == 'Thresholds') {
    try {
      const doc = await Model.find(
        {
          taxID: req.params.taxID,
          modelStatus: 'Developing',
          thresholdType: { $nin: ['Continuous'] },
          isActive: true
        },
        {
          _id: 0,
          taxID: 1,
          modelLevel: 1,
          modelStatus: 1,
          published: 1,
          modelID: 1,
          thresholdType: 1,
          thumb: 1,
          zip: 1,
          png: 1,
          methodFile: 1,
          customCitation: 1,
          license: 1
        }
      );
      res.json(doc);
    } catch (err) {
      res.json(err);
    }
  } else if (req.params.taxID && req.query.type == 'Hypothesis') {
    try {
      const doc = await Model.find(
        {
          taxID: req.params.taxID,
          modelStatus: { $in: ['pendingValidation'] },
          isActive: true
        },
        {
          _id: 0,
          taxID: 1,
          modelLevel: 1,
          modelStatus: 1,
          published: 1,
          modelID: 1,
          thresholdType: 1,
          thumb: 1,
          zip: 1,
          png: 1,
          methodFile: 1,
          customCitation: 1,
          license: 1
        }
      );
      res.json(doc);
    } catch (err) {
      res.json(err);
    }
  } else if (req.params.taxID && req.query.type == 'Valid') {
    try {
      const doc = await Model.find(
        {
          taxID: req.params.taxID,
          modelStatus: { $in: ['Valid'] },
          isActive: true
        },
        {
          _id: 0,
          taxID: 1,
          modelLevel: 1,
          modelStatus: 1,
          published: 1,
          modelID: 1,
          thresholdType: 1,
          thumb: 1,
          zip: 1,
          png: 1,
          methodFile: 1,
          customCitation: 1,
          license: 1
        }
      );
      res.json(doc);
    } catch (err) {
      res.json(err);
    }
  } else if (req.params.taxID && req.query.type == 'Published') {
    try {
      const doc = await Model.find(
        {
          taxID: req.params.taxID,
          isActive: true,
          published: true,
          isActive: true
        },
        {
          _id: 0,
          taxID: 1,
          modelLevel: 1,
          modelStatus: 1,
          published: 1,
          modelID: 1,
          thresholdType: 1,
          thumb: 1,
          zip: 1,
          png: 1,
          methodFile: 1,
          customCitation: 1,
          license: 1
        }
      );
      res.json(doc);
    } catch (err) {
      res.json(err);
    }
  }
}

/**
 * @swagger
 * /models/metadata/{modelID}:
 *   get:
 *     description: "Metadata of a specific model"
 *     operationId: MOD2
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
          dd: 1,
          mm: 1,
          yyyy: 1,
          modelID: 1,
          methodFile: 1
        }
      );
      res.json(docs);
    } catch (err) {
      res.json(err);
    }
  }
}

/**
 * @swagger
 * /models/approved/eoo/{taxID}:
 *   get:
 *     description: "Extension occurrence statistics for approved model of a specific species"
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
export async function ocurrenceEooStatsModel(req, res) {
  if (req.params.taxID) {
    try {
      const docs = await Model.find(
        { taxID: +req.params.taxID, modelStatus: 'Valid', isActive: true },
        {
          _id: 0,
          modelID: 1,
          statRangeSize: 1,
          statModelEOO: 1,
          statRecsEOO: 1
        }
      );
      res.json(docs);
    } catch (err) {
      res.json(err);
    }
  }
}

/**
 * @swagger
 * /models/approved/rpa/{taxID}:
 *   get:
 *     description: "Representation statistics for approved model of a specific species"
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
export async function ocurrenceRepStatsModel(req, res) {
  if (req.params.taxID) {
    try {
      const docs = await Model.find(
        { taxID: +req.params.taxID, modelStatus: 'Valid', isActive: true },
        {
          _id: 0,
          modelID: 1,
          statRepPA: 1,
          statRepPA1: 1,
          statRepPA2: 1,
          statRepPA3: 1
        }
      );
      res.json(docs);
    } catch (err) {
      res.json(err);
    }
  }
}

/**
 * @swagger
 * /models/approved/forest_loss/{taxID}:
 *   get:
 *     description: "Spatial statistics of forest loss for approved model of a specific species"
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
export async function ocurrenceForestLossStatsModel(req, res) {
  if (req.params.taxID) {
    try {
      const docs = await Model.find(
        { taxID: +req.params.taxID, modelStatus: 'Valid', isActive: true },
        {
          _id: 0,
          modelID: 1,
          statForestLoss90: 1,
          statForestLoss00: 1,
          statForestLoss05: 1,
          statForestLoss10: 1,
          statForestLoss12: 1,
          statFutureForest30h: 1,
          statFutureForest30d: 1,
          statFutureForest30c: 1
        }
      );
      res.json(docs);
    } catch (err) {
      res.json(err);
    }
  }
}

/**
 * @swagger
 * /models/approved/covers/{taxID}:
 *   get:
 *     description: "Spatial statistics of covers for for approved model of a specific species"
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
export async function ocurrenceCoversStatsModel(req, res) {
  if (req.params.taxID) {
    try {
      const docs = await Model.find(
        { taxID: +req.params.taxID, modelStatus: 'Valid', isActive: true },
        {
          _id: 0,
          modelID: 1,
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
      res.json(err);
    }
  }
}
