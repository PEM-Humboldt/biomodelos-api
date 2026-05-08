import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// esquema para la corrección de registros biológicos
const UpdatedSchema = new Schema(
  {
    locality: { type: String, default: '' },
    acceptedNameUsage: { type: String },
    decimalLatitude: { type: Number, min: -90, max: 90 },
    decimalLongitude: { type: Number, min: -180, max: 180 },
    updatedDate: { type: Date, default: Date.now },
    userIdBm: { type: Number }
  },
  { versionKey: false }
);

const ReportedSchema = new Schema(
  {
    geoIssueBm: { type: Boolean, default: false },
    originVagrant: { type: Boolean, default: false },
    oldTaxonomyBm: { type: Boolean, default: false },
    originIntroduced: { type: Boolean, default: false },
    otherIssuesBm: { type: Boolean, default: false },
    commentsBm: { type: String, default: '' },
    userIdBm: { type: Number, default: null },
    idIssueBm: { type: Boolean, default: false },
    reportedDate: { type: Date, default: Date.now }
  },
  { versionKey: false }
);

const RecordSchema = new Schema(
  {
    altitudinalOutlier: { type: Boolean, default: null },
    occurrenceID: { type: String, required: true },
    taxID: { type: Number, required: true },
    acceptedNameUsage: { type: String, required: true },
    speciesOriginal: { type: String, required: true },
    stateProvince: { type: String, default: '' },
    country: { type: String, default: '' },
    county: { type: String, default: '' },
    locality: { type: String, default: null },
    decimalLatitude: { type: Number, required: true, min: -90, max: 90 },
    decimalLongitude: { type: Number, required: true, min: -180, max: 180 },
    minimumElevationInMeters: { type: Number, default: 0, min: 0, max: 8000 },
    basisOfRecord: {
      type: String,
      default: '',
      Enumerator: [
        'FossilSpecimen',
        'HumanObservation',
        'MachineObservation',
        'MaterialSample',
        'PreservedSpecimen',
        'LivingSpecimen',
        'Occurrence',
        'MaterialCitation'
      ]
    },
    catalogNumber: { type: String, default: '' },
    recordedBy: { type: String, default: '' },
    institutionCode: { type: String, default: '' },
    url: { type: String, default: null },
    day: { type: Number, min: 1, max: 31, default: null },
    month: { type: Number, min: 1, max: 12, default: null },
    year: { type: Number, min: 1800, max: 2100, default: null },
    inUrbanArea: { type: Boolean, default: null },
    environmentalOutlier: { type: Boolean, default: null },
    spatialDuplicated: { type: Boolean, default: false },
    updated: [UpdatedSchema],
    downloadDate: { type: String },
    source: { type: String, default: null },
    contributedRecord: { type: Boolean, default: null },
    visualizationPrivileges: {
      type: Number,
      required: true,
      in: [0, 1],
      default: 0
    },
    collectionCode: { type: String, default: '' },
    userIdBm: { type: Number },
    // Created fields
    createdCommentsBm: { type: String, default: '' },
    createdCitationBm: { type: String },
    createdDate: { type: Date, default: Date.now },
    // Reported fields
    reported: [ReportedSchema],
    reportedDate: { type: Date },
    // Identified By
    identifiedBy: { type: String, default: '' },
    dateIdentified: { type: Date }
  },
  {
    collection: 'records',
    versionKey: false,
    // Conditional validation for days in month
    allOf: [
      {
        if: {
          properties: { month: { const: 2 } },
          required: ["month"]
        },
        then: {
          properties: {
          day: { maximum: 29 }
          }
        }
      },
      {
      if: {
          properties: { month: { enum: [4, 6, 9, 11] } },
          required: ['month']
        },
        then: {
          properties: {
            day: { maximum: 30 }
          }
        }
      }
    ],

    additionalProperties: false
  },
);

RecordSchema.pre('validate', function (next) {
  if (!this.occurrenceID) {
    const userIdPart = this.userIdBm ?? 'notUser';
    this.occurrenceID = `BioModelos-${userIdPart}-${Date.now()}`;
  }
  next();
});

export const Record = mongoose.model('Record', RecordSchema, 'records');
export const Reported = mongoose.model('ReportedSchema', ReportedSchema);
export const Updated = mongoose.model('UpdatedSchema', UpdatedSchema);
export const ObjectId = (id) => new mongoose.Types.ObjectId(id);
