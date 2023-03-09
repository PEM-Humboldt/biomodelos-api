import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const stringValidateObj = {
  validator: val => {
    if (val === null) return true;
    if (val.toLowerCase().trim() == 'null') return false;
  },
  message: 'validation of `{PATH}` failed with value "{VALUE}" (string)'
};

const integerValidateObj = {
  validator: val => {
    if (val === null) return true;
    return Number.isInteger(val);
  },
  message: '{VALUE} is not an integer value'
};

// esquema para la corrección de registros biológicos
const UpdatedSchema = new Schema(
  {
    verbatimLocality: {
      type: String,
      default: null,
      validate: stringValidateObj
    },
    decimalLatitude: { type: Number, min: -90, max: 90 },
    decimalLongitude: { type: Number, min: -180, max: 180 },
    speciesOriginal: {
      type: String,
      default: null,
      validate: stringValidateObj
    },
    day: {
      type: Number,
      min: 1,
      max: 31,
      default: null,
      validate: integerValidateObj
    },
    month: {
      type: Number,
      min: 1,
      max: 12,
      default: null,
      validate: integerValidateObj
    },
    year: {
      type: Number,
      min: 1800,
      max: 2100,
      default: null,
      validate: integerValidateObj
    },
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
    species: {
      type: String,
      default: '',
      validate: stringValidateObj
    },
    speciesOriginal: {
      type: String,
      default: '',
      validate: stringValidateObj
    },
    stateProvince: {
      type: String,
      default: '',
      validate: stringValidateObj
    },
    continent: {
      type: String,
      default: '',
      validate: stringValidateObj
    },
    country: {
      type: String,
      default: '',
      validate: stringValidateObj
    },
    county: {
      type: String,
      default: null,
      validate: stringValidateObj
    },
    eventDate: {
      type: String,
      default: new Date().toISOString().slice(0, 10),
      validate: stringValidateObj
    },
    verbatimLocality: {
      type: String,
      default: null,
      validate: stringValidateObj
    },
    decimalLatitude: { type: Number, required: true, min: -90, max: 90 },
    decimalLongitude: { type: Number, required: true, min: -180, max: 180 },
    verbatimElevation: {
      type: String,
      default: null,
      validate: stringValidateObj
    },
    cellID: { type: Number, min: 0, default: null },
    basisOfRecord: {
      type: String,
      default: null,
      validate: stringValidateObj
    },
    catalogNumber: {
      type: String,
      default: null,
      validate: stringValidateObj
    },
    recordedBy: {
      type: String,
      default: null,
      validate: stringValidateObj
    },
    institutionCode: {
      type: String,
      default: null,
      validate: stringValidateObj
    },
    url: {
      type: String,
      default: null,
      validate: stringValidateObj
    },
    day: {
      type: Number,
      min: 1,
      max: 31,
      default: null,
      validate: integerValidateObj
    },
    month: {
      type: Number,
      min: 1,
      max: 12,
      default: null,
      validate: integerValidateObj
    },
    year: {
      type: Number,
      min: 1800,
      max: 2100,
      default: null,
      validate: integerValidateObj
    },
    inUrbanArea: { type: Boolean, default: null },
    suggestedCounty: {
      type: String,
      default: null,
      validate: stringValidateObj
    },
    suggestedStateProvince: {
      type: String,
      default: null,
      validate: stringValidateObj
    },
    sourceLayer: {
      type: String,
      default: null,
      validate: stringValidateObj
    },
    environmentalOutlier: { type: Boolean, default: null },
    dbDuplicate: { type: Boolean, default: false },
    spatialDuplicated: { type: Boolean, default: false },
    updated: [UpdatedSchema],
    downloadDate: {
      type: String,
      default: new Date().toISOString().slice(0, 10),
      validate: stringValidateObj
    },
    resourceFolder: {
      type: String,
      default: 'Biomodelos',
      validate: stringValidateObj
    },
    resourceIncorporationDate: {
      type: String,
      default: Date.now(),
      validate: stringValidateObj
    },
    resourceName: {
      type: String,
      default: 'Biomodelos',
      validate: stringValidateObj
    },
    source: {
      type: String,
      default: null,
      validate: stringValidateObj
    },
    contributedRecord: {
      type: String,
      default: null,
      validate: stringValidateObj
    },
    privateData: { type: Number, required: true, in: [0, 1, 2], default: 0 },
    use: { type: Boolean, default: true },
    visualizationPrivileges: {
      type: Number,
      required: true,
      in: [0, 1, 2],
      default: 0
    },
    collectionCode: {
      type: String,
      default: null,
      validate: stringValidateObj
    },
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
