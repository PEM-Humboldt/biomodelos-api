import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// esquema para la corrección de registros biológicos
const UpdatedSchema = new Schema({
  verbatimLocality: { type: String, default: null },
  decimalLatitude: { type: Number, min: -90, max: 90 },
  decimalLongitude: { type: Number, min: -180, max: 180 },
  speciesOriginal: { type: String },
  day: { type: Number, min: 1, max: 31, default: null },
  month: { type: Number, min: 1, max: 12, default: null },
  year: { type: Number, min: 1800, max: 2100, default: null },
  updatedDate: { type: Date, default: Date.now },
  userIdBm: { type: Number }
});

const RecordSchema = new Schema(
  {
    _id: { type: Schema.ObjectId, required: true },
    occurrenceID: { type: String, required: true },
    taxID: { type: Number, required: true },
    acceptedNameUsage: { type: String, required: true },
    species: { type: String, default: null },
    speciesOriginal: { type: String, default: null },
    continent: { type: String, default: null },
    country: { type: String, default: null },
    stateProvince: { type: String, default: null },
    county: { type: String, default: null },
    verbatimLocality: { type: String, default: null },
    decimalLatitude: { type: Number, required: true, min: -90, max: 90 },
    decimalLongitude: { type: Number, required: true, min: -180, max: 180 },
    verbatimElevation: { type: String, default: null },
    demAltitude: { type: Number, min: 0, max: 8000, default: null },
    interpretedElevation: { type: Number, min: 0, max: 8000, default: null },
    cellID: { type: Number, min: 0, default: null },
    basisOfRecord: { type: String, default: null },
    catalogNumber: { type: String, default: null },
    colection: { type: String, default: null },
    recordedBy: { type: String, default: null },
    institutionCode: { type: String, default: null },
    url: { type: String, default: null },
    earliestDateCollected: { type: String, default: null },
    day: { type: Number, min: 1, max: 31, default: null },
    month: { type: Number, min: 1, max: 12, default: null },
    year: { type: Number, min: 1800, max: 2100, default: null },
    correctCountry: { type: Boolean, default: null },
    correctStateProvince: { type: Boolean, default: null },
    correctCounty: { type: Boolean, default: null },
    hasLocality: { type: Boolean, default: null },
    inUrbanArea: { type: Boolean, default: null },
    suggestedCountry: { type: String, default: null },
    suggestedCounty: { type: String, default: null },
    suggestedMunicipality: { type: String, default: null },
    suggestedStateProvince: { type: String, default: null },
    sourceLayer: { type: String, default: null },
    coordinateUncertaintyInMeters: { type: Number, default: null },
    lowUncertainty: { type: Boolean, default: null },
    altitudinalOutlier: { type: Boolean, default: null },
    consistentAltitude: { type: Boolean, default: null },
    diferenceInAltitude: { type: Number, min: 0, max: 8000, default: null },
    environmentalOutlier: { type: Boolean, default: null },
    insideKnownDistribution: { type: Boolean, default: false },
    dist2KnowRange: { type: Number, default: null },
    dbDuplicate: { type: Boolean, default: false },
    spatialDuplicated: { type: Boolean, default: false },
    updated: [UpdatedSchema],
    downloadDate: { type: String, default: null },
    resourceFolder: { type: String, default: null, required: true },
    resourceIncorporationDate: { type: String, default: null, required: true },
    resourceName: { type: String, default: null, required: true },
    source: { type: String, default: null },
    contributedRecord: { type: String, default: null },
    privateData: { type: Number, in: [0, 1, 2], default: 0 },
    use: { type: Boolean, default: true },
    visualizationPrivileges: { type: Number, in: [0, 1, 2], default: 0 },
    collectionCode: { type: String, default: null },
    userIdBm: { type: Number },
    maximumElevationInMeters: { type: Number, default: null },
    minimumElevationInMeters: { type: Number, default: null },
    origin: {
      type: String,
      default: 'native',
      in: ['native', 'introduced', 'vagrant']
    },
    presence: {
      type: String,
      default: 'extant',
      in: ['extant', 'probablyExtant', 'possiblyExtinct', 'extinct']
    },
    recordStatus: { type: Boolean, default: null },
    season: {
      type: String,
      default: 'resident',
      in: ['resident', 'breeding season', 'non-breeding season', 'passage']
    },
    // Created fields
    externallyCreated: { type: Boolean, default: false },
    createdCommentsBm: { type: String },
    createdCitationBm: { type: String },
    createdDate: { type: Date, default: Date.now },
    // Reported fields
    reportedUserIdBm: { type: Number },
    reportedOriginVagrant: { type: Boolean },
    reportedOldTaxonomyBm: { type: Boolean },
    reportedOriginIntroduced: { type: Boolean },
    reportedOtherIssuesBm: { type: Boolean },
    reportedCommentsBm: { type: String },
    reportedDate: { type: Date, default: Date.now },
    reportedGeoIssueBm: { type: Boolean },
    reportedIdIssueBm: { type: Boolean }
  },
  { collection: 'records' }
);

export const Record = mongoose.model('Record', RecordSchema, 'records');
export const Updated = mongoose.model('UpdatedSchema', UpdatedSchema);
