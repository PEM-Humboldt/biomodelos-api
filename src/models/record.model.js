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
      validate: stringValidateObj
    },
    decimalLatitude: { type: Number, min: -90, max: 90 },
    decimalLongitude: { type: Number, min: -180, max: 180 },
    speciesOriginal: {
      type: String,
      validate: stringValidateObj
    },
    day: {
      type: Number,
      min: 1,
      max: 31,
      validate: integerValidateObj
    },
    month: {
      type: Number,
      min: 1,
      max: 12,
      validate: integerValidateObj
    },
    year: {
      type: Number,
      min: 1800,
      max: 2100,
      validate: integerValidateObj
    },
    updatedDate: { type: Date },
    userIdBm: { type: Number }
  },
  { versionKey: false }
);

const RecordSchema = new Schema(
  {
    occurrenceID: { type: String }, // TODO: Is mandatory according to calc file
    taxID: { type: Number, required: true },
    acceptedNameUsage: { type: String, required: true },
    species: {
      type: String,
      validate: stringValidateObj
    },
    speciesOriginal: {
      type: String,
      validate: stringValidateObj
    },
    stateProvince: {
      type: String,
      validate: stringValidateObj
    },
    continent: {
      type: String,
      validate: stringValidateObj
    },
    country: {
      type: String,
      validate: stringValidateObj
    },
    county: {
      type: String,
      validate: stringValidateObj
    },
    eventDate: {
      type: String,
      validate: stringValidateObj
    },
    verbatimLocality: {
      type: String,
      validate: stringValidateObj
    },
    decimalLatitude: { type: Number, required: true, min: -90, max: 90 },
    decimalLongitude: { type: Number, required: true, min: -180, max: 180 },
    verbatimElevation: {
      type: String,
      validate: stringValidateObj
    },
    cellID: { type: Number, min: 0 },
    basisOfRecord: {
      type: String,
      validate: stringValidateObj
    },
    catalogNumber: {
      type: String,
      validate: stringValidateObj
    },
    recordedBy: {
      type: String,
      validate: stringValidateObj
    },
    institutionCode: {
      type: String,
      validate: stringValidateObj
    },
    url: {
      type: String,
      validate: stringValidateObj
    },
    day: {
      type: Number,
      min: 1,
      max: 31,
      validate: integerValidateObj
    },
    month: {
      type: Number,
      min: 1,
      max: 12,
      validate: integerValidateObj
    },
    year: {
      type: Number,
      min: 1800,
      max: 2100,
      validate: integerValidateObj
    },
    inUrbanArea: { type: Boolean },
    suggestedCounty: {
      type: String,
      validate: stringValidateObj
    },
    suggestedStateProvince: {
      type: String,
      validate: stringValidateObj
    },
    sourceLayer: {
      type: String,
      validate: stringValidateObj
    },
    environmentalOutlier: { type: Boolean },
    dbDuplicate: { type: Boolean },
    spatialDuplicated: { type: Boolean },
    updated: [UpdatedSchema],
    downloadDate: {
      type: String,
      validate: stringValidateObj
    },
    resourceFolder: {
      type: String,
      validate: stringValidateObj
    },
    resourceIncorporationDate: {
      type: String,
      validate: stringValidateObj
    },
    resourceName: {
      type: String,
      validate: stringValidateObj
    },
    source: {
      type: String,
      validate: stringValidateObj
    },
    contributedRecord: {
      type: String,
      validate: stringValidateObj
    },
    privateData: { type: Number, required: true, in: [0, 1, 2] },
    use: { type: Boolean },
    visualizationPrivileges: {
      type: Number,
      required: true,
      in: [0, 1, 2]
    },
    collectionCode: {
      type: String,
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
