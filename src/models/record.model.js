import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// esquema para la corrección de registros biológicos
const UpdatedSchema = new Schema(
  {
    verbatimLocality: { type: String, default: null },
    decimalLatitude: { type: Number, min: -90, max: 90 },
    decimalLongitude: { type: Number, min: -180, max: 180 },
    speciesOriginal: { type: String },
    day: { type: Number, min: 1, max: 31, default: null },
    month: { type: Number, min: 1, max: 12, default: null },
    year: { type: Number, min: 1800, max: 2100, default: null },
    updatedDate: { type: Date, default: Date.now },
    userIdBm: { type: Number }
  },
  { versionKey: false }
);

const RecordSchema = new Schema(
  {
    occurrenceID: { type: String, default: `Biomodelos-${Date.now()}` }, // TODO: Is mandatory according to calc file
    taxID: { type: Number, required: true },
    acceptedNameUsage: { type: String, required: true },
    species: { type: String, default: '' },
    speciesOriginal: { type: String, default: '' },
    stateProvince: { type: String, default: '' },
    county: { type: String, default: '' },
    verbatimLocality: { type: String, default: null },
    decimalLatitude: { type: Number, required: true, min: -90, max: 90 },
    decimalLongitude: { type: Number, required: true, min: -180, max: 180 },
    verbatimElevation: { type: String, default: null },
    cellID: { type: Number, min: 0, default: null },
    basisOfRecord: { type: String, default: null },
    catalogNumber: { type: String, default: null },
    recordedBy: { type: String, default: null },
    institutionCode: { type: String, default: null },
    url: { type: String, default: null },
    day: { type: Number, min: 1, max: 31, default: null },
    month: { type: Number, min: 1, max: 12, default: null },
    year: { type: Number, min: 1800, max: 2100, default: null },
    inUrbanArea: { type: Boolean, default: null },
    suggestedCounty: { type: String, default: null },
    suggestedStateProvince: { type: String, default: null },
    sourceLayer: { type: String, default: null },
    environmentalOutlier: { type: Boolean, default: null },
    dbDuplicate: { type: Boolean, default: false },
    spatialDuplicated: { type: Boolean, default: false },
    updated: [UpdatedSchema],
    downloadDate: { type: String, default: null },
    resourceFolder: { type: String, default: 'Biomodelos' }, // TODO: Is mandatory according to calc file
    resourceIncorporationDate: {
      type: String,
      default: Date.now()
    }, // TODO: Is mandatory according to calc file
    resourceName: { type: String, default: 'Biomodelos' }, // TODO: Is mandatory according to calc file
    source: { type: String, default: null },
    contributedRecord: { type: String, default: null },
    use: { type: Boolean, default: true },
    visualizationPrivileges: { type: Number, in: [0, 1, 2], default: 0 },
    collectionCode: { type: String, default: null },
    userIdBm: { type: Number },
    // Created fields
    createdCommentsBm: { type: String },
    createdCitationBm: { type: String },
    createdDate: { type: Date },
    // Reported fields
    reportedUserIdBm: { type: Number },
    reportedOriginVagrant: { type: Boolean },
    reportedOldTaxonomyBm: { type: Boolean },
    reportedOriginIntroduced: { type: Boolean },
    reportedOtherIssuesBm: { type: Boolean },
    reportedCommentsBm: { type: String },
    reportedDate: { type: Date },
    reportedGeoIssueBm: { type: Boolean },
    reportedIdIssueBm: { type: Boolean }
  },
  {
    collection: 'records',
    versionKey: false
  }
);

export const Record = mongoose.model('Record', RecordSchema, 'records');
export const Updated = mongoose.model('UpdatedSchema', UpdatedSchema);
export const ObjectId = mongoose.Types.ObjectId;
