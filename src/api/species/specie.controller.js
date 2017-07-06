import GeoJSON from 'geojson';
import { Record } from '../../models/record.model';
import Specie from '../../models/specie.model';

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
  try {
    const docs = await Specie.find({}, { species: 1, taxID: 1, _id: 0 });
    res.json(docs);
  } catch (err) {
    res.json(err);
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
  if (
    req.params.species &&
    (!req.query.bmClass1 &&
      !req.query.bmClass2 &&
      !req.query.bmClass3 &&
      !req.query.bmClass4 &&
      !req.query.bmClass5 &&
      !req.query.bmClass6 &&
      !req.query.bmClass7)
  ) {
    const regEx = new RegExp(req.params.species, 'ig');
    if (!req.query.endangered && !req.query.endemic && !req.query.invasive) {
      try {
        const docs = await Specie.find(
          { species: { $regex: regEx } },
          {
            _id: 0,
            species: 1,
            taxID: 1,
            taxonomicStatus: 1,
            iucn: 1,
            bmClass: 1,
            endemic: 1,
            invasive: 1
          }
        );
        res.json(docs);
      } catch (err) {
        res.json(err);
      }
    } else if (
      req.query.endangered == 1 &&
      (!req.query.endemic && !req.query.invasive)
    ) {
      try {
        const docs = await Specie.find(
          {
            $and: [
              { species: { $regex: regEx } },
              {
                $or: [
                  {
                    iucn: {
                      $in: ['EN', 'LC', 'VU', 'CR', 'NT']
                    }
                  }
                ]
              }
            ]
          },
          {
            _id: 0,
            species: 1,
            taxID: 1,
            taxonomicStatus: 1,
            iucn: 1,
            bmClass: 1,
            endemic: 1,
            invasive: 1
          }
        );
        res.json(docs);
      } catch (err) {
        res.json(err);
      }
    } else if (
      req.query.endangered == 1 &&
      req.query.endemic == 1 &&
      !req.query.invasive
    ) {
      try {
        const docs = await Specie.find(
          {
            $and: [
              { $or: [{ species: { $regex: regEx } }] },
              {
                $or: [
                  {
                    iucn: {
                      $in: ['EN', 'LC', 'VU', 'CR', 'NT']
                    }
                  }
                ]
              },
              { $or: [{ endemic: { $in: [true] } }] }
            ]
          },
          {
            _id: 0,
            species: 1,
            taxID: 1,
            taxonomicStatus: 1,
            iucn: 1,
            bmClass: 1,
            endemic: 1,
            invasive: 1
          }
        );
        res.json(docs);
      } catch (err) {
        res.json(err);
      }
    } else if (
      req.query.endangered == 1 &&
      req.query.endemic == 1 &&
      req.query.invasive == 1
    ) {
      try {
        const docs = await Specie.find(
          {
            $and: [
              { $or: [{ species: { $regex: regEx } }] },
              {
                $or: [
                  {
                    iucn: {
                      $in: ['EN', 'LC', 'VU', 'CR', 'NT']
                    }
                  }
                ]
              },
              { $or: [{ endemic: { $in: [true] } }] },
              { $or: [{ invasive: { $in: [true] } }] }
            ]
          },
          {
            _id: 0,
            species: 1,
            taxID: 1,
            taxonomicStatus: 1,
            iucn: 1,
            bmClass: 1,
            endemic: 1,
            invasive: 1
          }
        );
        res.json(docs);
      } catch (err) {
        res.json(err);
      }
    } else if (
      !req.query.endangered &&
      req.query.endemic == 1 &&
      !req.query.invasive
    ) {
      try {
        const docs = await Specie.find(
          {
            $and: [
              { $or: [{ species: { $regex: regEx } }] },
              { $or: [{ endemic: { $in: [true] } }] }
            ]
          },
          {
            _id: 0,
            species: 1,
            taxID: 1,
            taxonomicStatus: 1,
            iucn: 1,
            bmClass: 1,
            endemic: 1,
            invasive: 1
          }
        );
        res.json(docs);
      } catch (err) {
        res.json(err);
      }
    } else if (
      !req.query.endangered &&
      req.query.endemic == 1 &&
      req.query.invasive == 1
    ) {
      try {
        const docs = await Specie.find(
          {
            $and: [
              { $or: [{ species: { $regex: regEx } }] },
              { $or: [{ endemic: { $in: [true] } }] },
              { $or: [{ invasive: { $in: [true] } }] }
            ]
          },
          {
            _id: 0,
            species: 1,
            taxID: 1,
            taxonomicStatus: 1,
            iucn: 1,
            bmClass: 1,
            endemic: 1,
            invasive: 1
          }
        );
        res.json(docs);
      } catch (err) {
        res.json(err);
      }
    } else if (
      !req.query.endangered &&
      !req.query.endemic &&
      req.query.invasive == 1
    ) {
      try {
        const docs = await Specie.find(
          {
            $and: [
              { $or: [{ species: { $regex: regEx } }] },
              { $or: [{ invasive: { $in: [true] } }] }
            ]
          },
          {
            _id: 0,
            species: 1,
            taxID: 1,
            taxonomicStatus: 1,
            iucn: 1,
            bmClass: 1,
            endemic: 1,
            invasive: 1
          }
        );
        res.json(docs);
      } catch (err) {
        res.json(err);
      }
    } else if (
      req.query.endangered &&
      !req.query.endemic &&
      req.query.invasive == 1
    ) {
      try {
        const docs = await Specie.find(
          {
            $and: [
              { $or: [{ species: { $regex: regEx } }] },
              {
                $or: [
                  {
                    iucn: {
                      $in: ['EN', 'LC', 'VU', 'CR', 'NT']
                    }
                  }
                ]
              },
              { $or: [{ invasive: { $in: [true] } }] }
            ]
          },
          {
            _id: 0,
            species: 1,
            taxID: 1,
            taxonomicStatus: 1,
            iucn: 1,
            bmClass: 1,
            endemic: 1,
            invasive: 1
          }
        );
        res.json(docs);
      } catch (err) {
        res.json(err);
      }
    }
  } else if (
    req.params.species &&
    (req.query.bmClass1 ||
      req.query.bmClass2 ||
      req.query.bmClass3 ||
      req.query.bmClass4 ||
      req.query.bmClass5 ||
      req.query.bmClass6 ||
      req.query.bmClass7)
  ) {
    const regEx = new RegExp(req.params.species, 'ig');
    if (!req.query.endangered && !req.query.endemic && !req.query.invasive) {
      try {
        const docs = await Specie.find(
          {
            $and: [
              { species: { $regex: regEx } },
              {
                $or: [
                  {
                    bmClass: {
                      $in: [
                        req.query.bmClass1,
                        req.query.bmClass2,
                        req.query.bmClass3,
                        req.query.bmClass4,
                        req.query.bmClass5,
                        req.query.bmClass6,
                        req.query.bmClass7
                      ]
                    }
                  }
                ]
              }
            ]
          },
          {
            _id: 0,
            species: 1,
            taxID: 1,
            taxonomicStatus: 1,
            iucn: 1,
            bmClass: 1,
            endemic: 1,
            invasive: 1
          }
        );
        res.json(docs);
      } catch (err) {
        res.json(err);
      }
    } else if (
      req.query.endangered == 1 &&
      (!req.query.endemic && !req.query.invasive)
    ) {
      try {
        const docs = await Specie.find(
          {
            $and: [
              { species: { $regex: regEx } },
              {
                $or: [
                  {
                    iucn: {
                      $in: ['EN', 'LC', 'VU', 'CR', 'NT']
                    }
                  }
                ]
              },
              {
                $or: [
                  {
                    bmClass: {
                      $in: [
                        req.query.bmClass1,
                        req.query.bmClass2,
                        req.query.bmClass3,
                        req.query.bmClass4,
                        req.query.bmClass5,
                        req.query.bmClass6,
                        req.query.bmClass7
                      ]
                    }
                  }
                ]
              }
            ]
          },
          {
            _id: 0,
            species: 1,
            taxID: 1,
            taxonomicStatus: 1,
            iucn: 1,
            bmClass: 1,
            endemic: 1,
            invasive: 1
          }
        );
        res.json(docs);
      } catch (err) {
        res.json(err);
      }
    } else if (
      req.query.endangered == 1 &&
      req.query.endemic == 1 &&
      !req.query.invasive
    ) {
      try {
        const docs = await Specie.find(
          {
            $and: [
              { $or: [{ species: { $regex: regEx } }] },
              {
                $or: [
                  {
                    iucn: {
                      $in: ['EN', 'LC', 'VU', 'CR', 'NT']
                    }
                  }
                ]
              },
              { $or: [{ endemic: { $in: [true] } }] },
              {
                $or: [
                  {
                    bmClass: {
                      $in: [
                        req.query.bmClass1,
                        req.query.bmClass2,
                        req.query.bmClass3,
                        req.query.bmClass4,
                        req.query.bmClass5,
                        req.query.bmClass6,
                        req.query.bmClass7
                      ]
                    }
                  }
                ]
              }
            ]
          },
          {
            _id: 0,
            species: 1,
            taxID: 1,
            taxonomicStatus: 1,
            iucn: 1,
            bmClass: 1,
            endemic: 1,
            invasive: 1
          }
        );
        res.json(docs);
      } catch (err) {
        res.json(err);
      }
    } else if (
      req.query.endangered == 1 &&
      req.query.endemic == 1 &&
      req.query.invasive == 1
    ) {
      try {
        const docs = await Specie.find(
          {
            $and: [
              { $or: [{ species: { $regex: regEx } }] },
              {
                $or: [
                  {
                    iucn: {
                      $in: ['EN', 'LC', 'VU', 'CR', 'NT']
                    }
                  }
                ]
              },
              { $or: [{ endemic: { $in: [true] } }] },
              { $or: [{ invasive: { $in: [true] } }] },
              {
                $or: [
                  {
                    bmClass: {
                      $in: [
                        req.query.bmClass1,
                        req.query.bmClass2,
                        req.query.bmClass3,
                        req.query.bmClass4,
                        req.query.bmClass5,
                        req.query.bmClass6,
                        req.query.bmClass7
                      ]
                    }
                  }
                ]
              }
            ]
          },
          {
            _id: 0,
            species: 1,
            taxID: 1,
            taxonomicStatus: 1,
            iucn: 1,
            bmClass: 1,
            endemic: 1,
            invasive: 1
          }
        );
        res.json(docs);
      } catch (err) {
        res.json(err);
      }
    } else if (
      !req.query.endangered &&
      req.query.endemic == 1 &&
      !req.query.invasive
    ) {
      try {
        const docs = await Specie.find(
          {
            $and: [
              { $or: [{ species: { $regex: regEx } }] },
              { $or: [{ endemic: { $in: [true] } }] },
              {
                $or: [
                  {
                    bmClass: {
                      $in: [
                        req.query.bmClass1,
                        req.query.bmClass2,
                        req.query.bmClass3,
                        req.query.bmClass4,
                        req.query.bmClass5,
                        req.query.bmClass6,
                        req.query.bmClass7
                      ]
                    }
                  }
                ]
              }
            ]
          },
          {
            _id: 0,
            species: 1,
            taxID: 1,
            taxonomicStatus: 1,
            iucn: 1,
            bmClass: 1,
            endemic: 1,
            invasive: 1
          }
        );
        res.json(docs);
      } catch (err) {
        res.json(err);
      }
    } else if (
      !req.query.endangered &&
      req.query.endemic == 1 &&
      req.query.invasive == 1
    ) {
      try {
        const docs = await Specie.find(
          {
            $and: [
              { $or: [{ species: { $regex: regEx } }] },
              { $or: [{ endemic: { $in: [true] } }] },
              { $or: [{ invasive: { $in: [true] } }] },
              {
                $or: [
                  {
                    bmClass: {
                      $in: [
                        req.query.bmClass1,
                        req.query.bmClass2,
                        req.query.bmClass3,
                        req.query.bmClass4,
                        req.query.bmClass5,
                        req.query.bmClass6,
                        req.query.bmClass7
                      ]
                    }
                  }
                ]
              }
            ]
          },
          {
            _id: 0,
            species: 1,
            taxID: 1,
            taxonomicStatus: 1,
            iucn: 1,
            bmClass: 1,
            endemic: 1,
            invasive: 1
          }
        );
        res.json(docs);
      } catch (err) {
        res.json(err);
      }
    } else if (
      !req.query.endangered &&
      !req.query.endemic &&
      req.query.invasive == 1
    ) {
      try {
        const docs = await Specie.find(
          {
            $and: [
              { $or: [{ species: { $regex: regEx } }] },
              { $or: [{ invasive: { $in: [true] } }] },
              {
                $or: [
                  {
                    bmClass: {
                      $in: [
                        req.query.bmClass1,
                        req.query.bmClass2,
                        req.query.bmClass3,
                        req.query.bmClass4,
                        req.query.bmClass5,
                        req.query.bmClass6,
                        req.query.bmClass7
                      ]
                    }
                  }
                ]
              }
            ]
          },
          {
            _id: 0,
            species: 1,
            taxID: 1,
            taxonomicStatus: 1,
            iucn: 1,
            bmClass: 1,
            endemic: 1,
            invasive: 1
          }
        );
        res.json(docs);
      } catch (err) {
        res.json(err);
      }
    } else if (
      req.query.endangered &&
      !req.query.endemic &&
      req.query.invasive == 1
    ) {
      try {
        const docs = await Specie.find(
          {
            $and: [
              { $or: [{ species: { $regex: regEx } }] },
              {
                $or: [
                  {
                    iucn: {
                      $in: ['EN', 'LC', 'VU', 'CR', 'NT']
                    }
                  }
                ]
              },
              { $or: [{ invasive: { $in: [true] } }] },
              {
                $or: [
                  {
                    bmClass: {
                      $in: [
                        req.query.bmClass1,
                        req.query.bmClass2,
                        req.query.bmClass3,
                        req.query.bmClass4,
                        req.query.bmClass5,
                        req.query.bmClass6,
                        req.query.bmClass7
                      ]
                    }
                  }
                ]
              }
            ]
          },
          {
            _id: 0,
            species: 1,
            taxID: 1,
            taxonomicStatus: 1,
            iucn: 1,
            bmClass: 1,
            endemic: 1,
            invasive: 1
          }
        );
        res.json(docs);
      } catch (err) {
        res.json(err);
      }
    }
  }
}
