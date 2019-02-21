import { Record, Updated, Reported, Created } from '../../models/record.model';

export async function read(req, res) {
  if(req.params.record_id){
    try {
      const record = await Record.findById(req.params.record_id,
        {
          _id: 0,
          cellID: 0,
          dbDuplicate: 0,
          downloadDate: 0,
          resourceFolder: 0,
          resourceIncorporationDate: 0,
          resourceName: 0,
          sourceLayer: 0,
          spatialDuplicate: 0
        }
      );
      res.json(record);
    } catch (e) {
      res.json(e);
    }
  }
}

/**
 * @swagger
 * /records/{record_id}:
 *   put:
 *     description: "Updating main keys of a record of a species"
 *     operationId: REC2
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
export async function update(req, res) {
  try {
    const record = await Record.findById(req.params.record_id);
    let updated = new Updated();
    if (!req.body.taxID || req.body.taxID === record.taxID) {
      !updated.taxID;
    } else {
      updated.taxID = record.taxID;
      record.taxID = req.body.taxID;
    }
    if (
      !req.body.speciesOriginal ||
      req.body.speciesOriginal === record.speciesOriginal
    ) {
      !updated.speciesOriginal;
    } else {
      updated.speciesOriginal = record.speciesOriginal;
      record.speciesOriginal = req.body.speciesOriginal;
    }
    if (
      req.body.verbatimLocality &&
      req.body.verbatimLocality !== record.verbatimLocality
    ) {
      updated.verbatimLocality = record.verbatimLocality;
      record.verbatimLocality = req.body.verbatimLocality;
    }
    if (
      req.body.decimalLatitude &&
      req.body.decimalLatitude !== record.decimalLatitude
    ) {
      updated.decimalLatitude = record.decimalLatitude;
      record.decimalLatitude = req.body.decimalLatitude;
    }
    if (
      req.body.decimalLongitude &&
      req.body.decimalLongitude !== record.decimalLongitude
    ) {
      updated.decimalLongitude = record.decimalLongitude;
      record.decimalLongitude = req.body.decimalLongitude;
    }
    if (!req.body.dd || req.body.dd === record.dd) {
      !updated.dd;
    } else {
      updated.dd = record.dd;
      record.dd = req.body.dd;
    }
    if (!req.body.mm || req.body.mm === record.mm) {
      !updated.mm;
    } else {
      updated.mm = record.mm;
      record.mm = req.body.mm;
    }
    if (!req.body.yyyy || req.body.yyyy === record.yyyy) {
      !updated.yyyy;
    } else {
      updated.yyyy = record.yyyy;
      record.yyyy = req.body.yyyy;
    }

    if (
      req.body.verbatimLocality ||
      req.body.decimalLatitude ||
      req.body.decimalLongitude
    ) {
      updated.updatedDate = Date.now;
      updated.userId_bm = req.body.userId_bm;
    }

    if (!record.updated) {
      record.updated = [];
    }
    record.updated.push(updated);

    try {
      await record.save();
      res.json({
        message: `The record ${record._id} was successfully updated!`
      });
    } catch (err) {
      res.send(err);
    }
  } catch (err) {
    res.send(err);
  }
}

/**
 * @swagger
 * /records/{record_id}:
 *   post:
 *     description: "Reporting probable errors of a record"
 *     operationId: REC3
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
export async function create(req, res) {
  try {
    const record = await Record.findById(req.params.record_id);
    let reported = new Reported();
    reported.userId_bm = req.body.userId_bm;
    if (!req.body.isOutlier_bm) {
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
      !reported.idIssue_bm;
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
    if (
      !req.body.isOutlier_bm &&
      !req.body.geoIssue_bm &&
      !req.body.idIssue_bm &&
      !req.body.oldTaxonomy_bm &&
      !req.body.inCaptivity_bm &&
      !req.body.otherIssues_bm &&
      !req.body.comments_bm
    ) {
      reported = [];
    } else {
      reported.userId_bm = req.body.userId_bm;
      reported.reportedDate = Date.now;
      if (!record.reported) {
        record.reported = [];
      }
      record.reported.push(reported);
    }
    try {
      await record.save();
      res.json({
        message: `The record ${record._id} was reported!`
      });
    } catch (err) {
      res.send(err);
    }
  } catch (err) {
    res.send(err);
  }
}

/**
 * @swagger
 * /records:
 *   post:
 *     description: "Inserting a new (and just one) record that belongs to a specific species"
 *     operationId: REC4
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
export async function createWithoutId(req, res) {
  const record = new Record();
  const created = new Created();
  record.taxID = +req.body.taxID;
  record.acceptedNameUsage = req.body.acceptedNameUsage;
  record.collectionCode =
    !req.body.collectionCode || req.body.collectionCode === ''
      ? null
      : req.body.collectionCode;
  record.catalogNumber =
    !req.body.catalogNumber || req.body.catalogNumber === ''
      ? null
      : req.body.catalogNumber;
  record.institutionCode =
    !req.body.institutionCode || req.body.institutionCode === ''
      ? null
      : req.body.institutionCode;
  if (!req.body.stateProvince || req.body.stateProvince === '') {
    record.stateProvince = null;
  } else {
    record.stateProvince = req.body.stateProvince;
  }
  if (!req.body.county || req.body.county === '') {
    record.county = null;
  } else {
    record.county = req.body.county;
  }

  if (!req.body.verbatimLocality || req.body.verbatimLocality === '') {
    record.verbatimLocality = null;
  } else {
    record.verbatimLocality = req.body.verbatimLocality;
  }
  record.decimalLatitude = +req.body.decimalLatitude;
  record.decimalLongitude = +req.body.decimalLongitude;
  if (!req.body.verbatimElevation || req.body.verbatimElevation === '') {
    record.verbatimElevation = null;
  } else {
    record.verbatimElevation = +req.body.verbatimElevation;
  }
  if (!req.body.basisOfRecord || req.body.basisOfRecord === '') {
    record.basisOfRecord = null;
  } else {
    record.basisOfRecord = req.body.basisOfRecord;
  }
  if (!req.body.recordedBy || req.body.recordedBy === '') {
    record.recordedBy = null;
  } else {
    record.recordedBy = req.body.recordedBy;
  }
  if (!req.body.source || req.body.source === '') {
    record.source = null;
  } else {
    record.source = req.body.source;
  }
  if (!req.body.mm || req.body.mm === '') {
    record.mm = null;
  } else {
    record.mm = +req.body.mm;
  }
  if (!req.body.dd || req.body.dd === '') {
    record.dd = null;
  } else {
    record.dd = +req.body.dd;
  }
  if (!req.body.yyyy || req.body.yyyy === '') {
    record.yyyy = null;
  } else {
    record.yyyy = +req.body.yyyy;
  }
  if (!req.body.comments_bm || req.body.comments_bm === '') {
    created.comments_bm = null;
  } else {
    created.comments_bm = req.body.comments_bm;
  }
  created.userId_bm = req.body.userId_bm;
  record.source = 'BioModelos';
  created.createdDate = Date.now;
  if (!req.body.citation_bm || req.body.citation_bm === '') {
    created.citation_bm = null;
  } else {
    created.citation_bm = req.body.citation_bm;
  }
  record.contributedRecord = true;
  record.updated = [];
  record.reported = [];
  record.created = [];
  record.created.push(created);
  try {
    await record.save();
    res.json({ message: `Record created! ${record._id}` });
  } catch (err) {
    res.send(err);
  }
}

/**
 * @swagger
 * /records/metadata/institutions/{taxID}:
 *   get:
 *     description: "Obtener los unique values de instituciones que corresponde al taxID ingresado"
 *     operationId: STA2
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
export async function uniqueValuesInstitutions(req, res) {
  if (req.params.taxID) {
    try {
      const doc = await Record.aggregate([
        { $match: { taxID: +req.params.taxID } },
        {
          $group: {
            _id: '$institutionCode',
            institution: { $first: '$institutionCode' }
          }
        },
        { $project: { institution: '$_id', _id: 0 } },
        {
          $group: {
            _id: null,
            institution: { $push: '$institution' }
          }
        },
        { $project: { institution: '$institution', _id: 0 } }
      ]);
      res.send(doc);
    } catch (err) {
      res.json(err);
    }
  }
}

/**
 * @swagger
 * /records/metadata/collectors/{taxID}:
 *   get:
 *     description: "Obtener los unique values de colectores que corresponde al taxID ingresado"
 *     operationId: STA3
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
export async function uniqueValuesCollectors(req, res) {
  if (req.params.taxID) {
    try {
      const doc = await Record.aggregate([
        { $match: { taxID: +req.params.taxID } },
        {
          $group: { _id: '$recordedBy', collector: { $first: '$recordedBy' } }
        },
        { $project: { collector: '$_id', _id: 0 } },
        { $group: { _id: null, collector: { $push: '$collector' } } },
        { $project: { collector: '$collector', _id: 0 } }
      ]);
      res.send(doc);
    } catch (err) {
      res.json(err);
    }
  }
}

/**
 * @swagger
 * /records/metadata/sources/{taxID}:
 *   get:
 *     description: "Obtener los unique values del campo source que corresponde al taxID ingresado"
 *     operationId: STA4
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
export async function uniqueValuesSources(req, res) {
  if (req.params.taxID) {
    try {
      const doc = await Record.aggregate([
        { $match: { taxID: +req.params.taxID } },
        { $group: { _id: '$source', source: { $first: '$source' } } },
        { $project: { source: '$_id', _id: 0 } },
        { $group: { _id: null, source: { $push: '$source' } } },
        { $project: { source: '$source', _id: 0 } }
      ]);
      res.send(doc);
    } catch (err) {
      res.json(err);
    }
  }
}

/**
 * @swagger
 * /records/metadata/collaborators/{taxID}:
 *   get:
 *     description: "Retorna el identifcador de los colaboradores que han reportado creado o actualizado los registros de la especie consultada"
 *     operationId: STA5
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
export async function collaboratorsOfSpecie(req, res) {
  const temp = [];
  if (req.params.taxID) {
    try {
      let doc = await Record.aggregate([
        { $match: { taxID: +req.params.taxID } },
        {
          $group: {
            _id: '$reported.userId_bm',
            userId_bm: { $first: '$reported.userId_bm' }
          }
        },
        { $project: { userId_bm: '$_id', _id: 0 } },
        { $unwind: '$userId_bm' },
        {
          $group: {
            _id: '$userId_bm',
            userId_bm: { $first: '$userId_bm' }
          }
        },
        { $project: { userId_bm: '$userId_bm', _id: 0 } }
      ]);
      for (let i = 0; i < doc.length; i++) {
        temp.push(doc[i].userId_bm);
      }
      try {
        doc = await Record.aggregate([
          { $match: { taxID: +req.params.taxID } },
          {
            $group: {
              _id: '$created.userId_bm',
              userId_bm: { $first: '$created.userId_bm' }
            }
          },
          { $project: { userId_bm: '$_id', _id: 0 } },
          { $unwind: '$userId_bm' },
          {
            $group: {
              _id: '$userId_bm',
              userId_bm: { $first: '$userId_bm' }
            }
          },
          { $project: { userId_bm: '$userId_bm', _id: 0 } }
        ]);
        for (let i = 0; i < doc.length; i++) {
          temp.push(doc[i].userId_bm);
        }
        try {
          doc = await Record.aggregate([
            { $match: { taxID: +req.params.taxID } },
            {
              $group: {
                _id: '$updated.userId_bm',
                userId_bm: { $first: '$updated.userId_bm' }
              }
            },
            { $project: { userId_bm: '$_id', _id: 0 } },
            { $unwind: '$userId_bm' },
            {
              $group: {
                _id: '$userId_bm',
                userId_bm: { $first: '$userId_bm' }
              }
            },
            { $project: { userId_bm: '$userId_bm', _id: 0 } }
          ]);
          for (let i = 0; i < doc.length; i++) {
            temp.push(doc[i].userId_bm);
          }
          const uniqueArray = temp.filter(
            (elem, pos) =>
              //removing duplicates in Temp
              temp.indexOf(elem) == pos
          );
          const arrayJSON = {};
          arrayJSON.collaborators = uniqueArray;
          res.json(arrayJSON);
        } catch (err) {
          res.json(err);
        }
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
 * /records/metadata/latest_date/{taxID}:
 *   get:
 *     description: "Retorna la ultima fecha de modificación (reported, created, updated)"
 *     operationId: STA6
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
export async function latestChange(req, res) {
  let maxdate = '';
  if (req.params.taxID) {
    try {
      let doc = await Record.aggregate([
        { $match: { taxID: +req.params.taxID } },
        {
          $group: {
            _id: '$reported.reportedDate',
            reportedDate: {
              $max: '$reported.reportedDate'
            }
          }
        },
        { $project: { reportedDate: '$_id', _id: 0 } },
        { $unwind: '$reportedDate' },
        {
          $group: {
            _id: 'null',
            reportedDateMax: { $max: '$reportedDate' }
          }
        },
        {
          $project: {
            DateMax: '$reportedDateMax',
            _id: 0
          }
        }
      ]);
      for (let i = 0; i < doc.length; i++) {
        if (doc[i].DateMax > maxdate) maxdate = doc[i].DateMax;
      }
      try {
        doc = await Record.aggregate([
          { $match: { taxID: +req.params.taxID } },
          {
            $group: {
              _id: '$created.createdDate',
              createdDate: {
                $max: '$created.createdDate'
              }
            }
          },
          { $project: { createdDate: '$_id', _id: 0 } },
          { $unwind: '$createdDate' },
          {
            $group: {
              _id: 'null',
              createdDateMax: { $max: '$createdDate' }
            }
          },
          { $project: { DateMax: '$createdDateMax', _id: 0 } }
        ]);
        for (let i = 0; i < doc.length; i++) {
          if (doc[i].DateMax > maxdate) maxdate = doc[i].DateMax;
        }
        try {
          doc = await Record.aggregate([
            { $match: { taxID: +req.params.taxID } },
            {
              $group: {
                _id: '$updated.updatedDate',
                updatedDate: {
                  $max: '$updated.updatedDate'
                }
              }
            },
            { $project: { updatedDate: '$_id', _id: 0 } },
            { $unwind: '$updatedDate' },
            {
              $group: {
                _id: 'null',
                updatedDateMax: { $max: '$updatedDate' }
              }
            },
            { $project: { DateMax: '$updatedDateMax', _id: 0 } }
          ]);
          for (let i = 0; i < doc.length; i++) {
            if (doc[i].DateMax > maxdate) maxdate = doc[i].DateMax;
          }
          const arrayJSON = {};
          arrayJSON.maxDate = maxdate;
          res.json(arrayJSON);
        } catch (err) {
          res.json(err);
        }
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
 * /records/metadata/collection/{taxID}:
 *   get:
 *     description: "Obtener los unique values del campo collection que corresponde al taxID ingresado"
 *     operationId: STA7
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
export async function uniqueValuesCollection(req, res) {
  if (req.params.taxID) {
    try {
      const doc = await Record.aggregate([
        { $match: { taxID: +req.params.taxID } },
        {
          $group: {
            _id: '$collectionCode',
            collection_code: { $first: '$collectionCode' }
          }
        },
        { $project: { collection_code: '$_id', _id: 0 } },
        {
          $group: { _id: null, collection_code: { $push: '$collection_code' } }
        },
        { $project: { collection_code: '$collection_code', _id: 0 } }
      ]);
      res.send(doc);
    } catch (err) {
      res.json(err);
    }
  }
}
