import { Record, Updated, ObjectId } from '../../models/record.model';

/**
 * @swagger
 * /records/{record_id}:
 *   get:
 *     description: Get a record by its ID
 *     operationId: REC2
 *     parameters:
 *       - name: record_id
 *         in: path
 *         description: The record ID
 *         required: true
 *         type: string
 *     responses:
 *       "200":
 *         description: Success
 *         schema:
 *           $ref: "#/definitions/Record"
 *     default:
 *       description: Error
 *       schema:
 *         $ref: "#/definitions/ErrorResponse"
 */
export async function read(req, res) {
  if (req.params.record_id) {
    try {
      const record = await Record.aggregate([
        { $match: { _id: ObjectId(req.params.record_id) } },
        {
          $lookup: {
            from: 'species',
            let: { recordTax: '$taxID' },
            pipeline: [
              { $match: { $expr: { $eq: ['$$recordTax', '$taxID'] } } },
              {
                $project: {
                  family: 1,
                  order: 1,
                  class: 1,
                  kingdom: 1
                }
              }
            ],
            as: 'speciesInfo'
          }
        },
        {
          $project: {
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
        }
      ]);
      res.json(record[0]);
    } catch (e) {
      res.json(e);
    }
  }
}

/**
 * @swagger
 * /records/{record_id}:
 *   put:
 *     description: Update main attributes of a record
 *     operationId: REC2
 *     parameters:
 *       - name: record_id
 *         in: path
 *         description: The record ID
 *         required: true
 *         type: string
 *       - name: acceptedNameUsage
 *         in: body
 *         description: the accepted name for the species
 *         required: false
 *         type: string
 *       - name: verbatimLocality
 *         in: body
 *         description: the original textual description of the place
 *         required: false
 *         type: string
 *       - name: decimalLongitude
 *         in: body
 *         description: the decimal longitude of the record
 *         required: false
 *         type: number
 *       - name: decimalLatitude
 *         in: body
 *         description: the decimal latitude of the record
 *         required: false
 *         type: number
 *       - name: day
 *         in: body
 *         description: the integer day of the month on which the Event occurred
 *         required: false
 *         type: number
 *       - name: month
 *         in: body
 *         description: the ordinal month in which the Event occurred
 *         required: false
 *         type: number
 *       - name: year
 *         in: body
 *         description: the four-digit year in which the Event occurred
 *         required: false
 *         type: number
 *     responses:
 *       "200":
 *         description: Success
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               default: "The record {record_id} was successfully updated!"
 *     default:
 *       description: Error
 *       schema:
 *         $ref: "#/definitions/ErrorResponse"
 */
export async function update(req, res) {
  let record = null;
  try {
    record = await Record.findById(req.params.record_id);
    if (!record) throw new Error("Record doesn't exist");
  } catch (err) {
    res.send(400, err.toString());
    return;
  }

  let updated = new Updated();
  let wereChanges = false;
  if (req.body.taxID && req.body.taxID !== record.taxID) {
    updated.taxID = record.taxID;
    record.taxID = req.body.taxID;
    wereChanges = true;
  }
  if (
    req.body.acceptedNameUsage &&
    req.body.acceptedNameUsage !== record.acceptedNameUsage
  ) {
    updated.acceptedNameUsage = record.acceptedNameUsage;
    record.acceptedNameUsage = req.body.acceptedNameUsage;
    wereChanges = true;
  }
  if (
    req.body.verbatimLocality &&
    req.body.verbatimLocality !== record.verbatimLocality
  ) {
    updated.verbatimLocality = record.verbatimLocality;
    record.verbatimLocality = req.body.verbatimLocality;
    wereChanges = true;
  }
  if (
    req.body.decimalLatitude &&
    req.body.decimalLatitude !== record.decimalLatitude
  ) {
    updated.decimalLatitude = record.decimalLatitude;
    record.decimalLatitude = req.body.decimalLatitude;
    wereChanges = true;
  }
  if (
    req.body.decimalLongitude &&
    req.body.decimalLongitude !== record.decimalLongitude
  ) {
    updated.decimalLongitude = record.decimalLongitude;
    record.decimalLongitude = req.body.decimalLongitude;
    wereChanges = true;
  }
  if (req.body.day && req.body.day !== record.day) {
    updated.day = record.day;
    record.day = req.body.day;
    wereChanges = true;
  }
  if (req.body.month && req.body.month !== record.month) {
    updated.month = record.month;
    record.month = req.body.month;
    wereChanges = true;
  }
  if (req.body.year && req.body.year !== record.year) {
    updated.year = record.year;
    record.year = req.body.year;
    wereChanges = true;
  }
  if (req.body.userIdBm && req.body.userIdBm !== record.userIdBm) {
    updated.userIdBm = record.userIdBm;
    record.userIdBm = req.body.userIdBm;
    wereChanges = true;
  }

  if (!wereChanges) {
    res.json({
      message: `The record ${record._id} didn't have any changes!`
    });
    return;
  }

  updated.updatedDate = Date.now;
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
}

/**
 * @swagger
 * /records/{record_id}:
 *   post:
 *     description: Report a record with probable errors
 *     operationId: REC3
 *     parameters:
 *       - name: record_id
 *         in: path
 *         description: The record Id to report
 *         required: true
 *         type: string
 *     responses:
 *       "200":
 *         description: Success
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               default: "The record {record_id} was reported!"
 *     default:
 *       description: Error
 *       schema:
 *         $ref: "#/definitions/ErrorResponse"
 */
export async function report(req, res) {
  let record = null;
  try {
    record = await Record.findById(req.params.record_id);
    if (!record) throw new Error("Record doesn't exist");
  } catch (err) {
    res.send(400, err.toString());
    return;
  }

  if (req.body.reportedUserIdBm) {
    record.reportedUserIdBm = req.body.reportedUserIdBm;
  }
  if (req.body.reportedOriginVagrant) {
    record.reportedOriginVagrant = req.body.reportedOriginVagrant;
  }
  if (req.body.reportedGeoIssueBm) {
    record.reportedGeoIssueBm = req.body.reportedGeoIssueBm;
  }
  if (req.body.reportedIdIssueBm) {
    record.reportedIdIssueBm = req.body.reportedIdIssueBm;
  }
  if (req.body.reportedOldTaxonomyBm) {
    record.reportedOldTaxonomyBm = req.body.reportedOldTaxonomyBm;
  }
  if (req.body.reportedOriginIntroduced) {
    record.reportedOriginIntroduced = req.body.reportedOriginIntroduced;
  }
  if (req.body.reportedOtherIssuesBm) {
    record.reportedOtherIssuesBm = req.body.reportedOtherIssuesBm;
  }
  if (req.body.reportedCommentsBm) {
    record.reportedCommentsBm = req.body.reportedCommentsBm;
  }

  if (
    req.body.reportedUserIdBm &&
    (req.body.reportedOriginVagrant ||
      req.body.reportedOldTaxonomyBm ||
      req.body.reportedOriginIntroduced ||
      req.body.reportedOtherIssuesBm ||
      req.body.reportedCommentsBm ||
      req.body.reportedGeoIssueBm ||
      req.body.reportedIdIssueBm)
  ) {
    record.reportedDate = Date.now();
    try {
      await record.save();
      res.json({
        message: `The record ${record._id} was reported!`
      });
    } catch (err) {
      res.send(err.toString());
    }
  } else {
    res.json({
      message: 'There is nothing to report'
    });
  }
}

/**
 * @swagger
 * /records:
 *   post:
 *     description: Insert a new (and just one) record that belongs to a specific species
 *     operationId: REC4
 *     responses:
 *       "200":
 *         description: Success
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               default: "Record created! {record_id}"
 *     default:
 *       description: Error
 *       schema:
 *         $ref: "#/definitions/ErrorResponse"
 */
export async function createWithoutId(req, res) {
  const record = new Record();
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
  if (!req.body.month || req.body.month === '') {
    record.month = null;
  } else {
    record.month = +req.body.month;
  }
  if (!req.body.day || req.body.day === '') {
    record.day = null;
  } else {
    record.day = +req.body.day;
  }
  if (!req.body.year || req.body.year === '') {
    record.year = null;
  } else {
    record.year = +req.body.year;
  }
  if (!req.body.createdCommentsBm || req.body.createdCommentsBm === '') {
    record.createdCommentsBm = null;
  } else {
    record.createdCommentsBm = req.body.createdCommentsBm;
  }
  if (!req.body.userIdBm || req.body.userIdBm === '') {
    record.userIdBm = null;
  } else {
    record.userIdBm = req.body.userIdBm;
  }
  record.reportedUserIdBm = null;
  record.source = 'BioModelos';
  record.createdDate = Date.now();
  if (!req.body.createdCitationBm || req.body.createdCitationBm === '') {
    record.createdCitationBm = null;
  } else {
    record.createdCitationBm = req.body.createdCitationBm;
  }
  record.contributedRecord = true;
  record.updated = [];
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
 *     description: Get unique values for institutions that belong to the given taxID
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
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               institution:
 *                 type: array
 *                 items:
 *                   type: string
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
 *     description: Get unique values for collectors that belong to the given taxID
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
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               collector:
 *                 type: array
 *                 items:
 *                   type: string
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
 *     description: Get unique values for sources that belong to the given taxID
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
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               source:
 *                 type: array
 *                 items:
 *                   type: string
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
 *     description: Get the users than have created, reported or updated records on the given taxID
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
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               userId_bm:
 *                 type: array
 *                 items:
 *                   type: number
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
            _id: '$userIdBm',
            userId_bm: { $first: '$userIdBm' }
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
        let doc = await Record.aggregate([
          { $match: { taxID: +req.params.taxID } },
          {
            $group: {
              _id: '$reportedUserIdBm',
              userId_bm: { $first: '$reportedUserIdBm' }
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
                _id: '$updated.userIdBm',
                userId_bm: { $first: '$updated.userIdBm' }
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
 *     description: Returns last modified date (can be created, reported or updated date)
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
 *           properties:
 *             maxDate:
 *               type: string
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
            _id: '$reportedDate',
            reportedDate: {
              $max: '$reportedDate'
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
              _id: '$createdDate',
              createdDate: {
                $max: '$createdDate'
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
 *     description: Get unique values for attribute collection that belongs to the given taxID
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
 *           properties:
 *             collection_code:
 *               type: string
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
