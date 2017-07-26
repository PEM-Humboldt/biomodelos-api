import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// esquema para la corrección de registros biológicos
const UpdatedSchema = new Schema({
  speciesOriginal: { type: String },
  locality: { type: String },
  lat: { type: Number },
  lon: { type: Number },
  dd: { type: Number },
  mm: { type: Number },
  yyyy: { type: Number },
  updatedDate: { type: Date, default: Date.now },
  userId_bm: { type: Number }
});

// esquema para el reporte de errores en registros biológicos
const ReportedSchema = new Schema({
  // id: Schema.ObjectId,
  isOutlier_bm: { type: Boolean },
  geoIssue_bm: { type: Boolean },
  idIssue_bm: { type: Boolean },
  oldTaxonomy_bm: { type: Boolean },
  inCaptivity_bm: { type: Boolean },
  otherIssues_bm: { type: Boolean },
  comments_bm: { type: String },
  reportedDate: { type: Date, default: Date.now },
  userId_bm: { type: Number }
});

// esquema para la creación de registros biológicos
const CreatedSchema = new Schema({
  _id: { type: Schema.ObjectId },
  taxID: { type: Number },
  acceptedNameUsage: String,
  locality: { type: String },
  lat: { type: Number },
  lon: { type: Number },
  alt: { type: Number },
  basisOfRecord: { type: String },
  collector: { type: String },
  source: { type: String },
  comments_bm: { type: String },
  citation_bm: { type: String },
  createdDate: { type: Date, default: Date.now },
  userId_bm: { type: Number }
});

const RecordSchema = new Schema(
  {
    occurrenceID: { type: String, default: null },
    taxID: { type: Number, required: true },
    acceptedNameUsage: { type: String, required: true },
    species: { type: String, default: null },
    speciesOriginal: { type: String, default: null },
    continent: { type: String, default: null },
    country: { type: String, default: null },
    adm1: { type: String, default: null },
    adm2: { type: String, default: null },
    locality: { type: String, default: null },
    lat: { type: Number, min: -90, max: 90 },
    lon: { type: Number, min: -180, max: 180 },
    alt: { type: Number, default: null },
    demAltitude: { type: Number, min: 0, max: 8000, default: null },
    interpretedElevation: { type: Number, min: 0, max: 8000, default: null },
    cellID: { type: Number, min: 0, default: null },
    basisOfRecord: { type: String, default: null },
    catalogNumber: { type: String, default: null },
    colection: { type: String, default: null },
    collector: { type: String, default: null },
    institution: { type: String, default: null },
    url: { type: String, default: null },
    earliestDateCollected: { type: String, default: null },
    latestDateCollected: { type: String, default: null },
    dd: { type: Number, min: 1, max: 31, default: null },
    mm: { type: Number, min: 1, max: 12, default: null },
    yyyy: { type: Number, min: 1800, max: 2100, default: null },
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
    coordUncertaintyM: { type: Number, default: null },
    lowUncertainty: { type: Boolean, default: null },
    altitudinalOutlier: { type: Boolean, default: null },
    consistentAltitude: { type: Boolean, default: null },
    diferenceInAltitude: { type: Number, min: 0, max: 8000, default: null },
    environmentalOutlier: { type: Boolean, default: null },
    insideKnownDistribution: { type: Boolean, default: false },
    dist2KnowRange: { type: Number, default: null },
    dbDuplicate: { type: Boolean, default: false },
    spatialDuplicated: { type: Boolean, default: false },
    reported: [ReportedSchema],
    updated: [UpdatedSchema],
    created: [CreatedSchema],
    downloadDate: { type: String, default: null },
    resourceFolder: { type: String, default: null },
    resourceIncorporationDate: { type: String, default: null },
    resourceName: { type: String, default: null },
    source: { type: String, default: null },
    contributedRecord: { type: String, default: null },
    override: { type: Boolean, default: false },
    privateData: { type: Number, in: [0, 1, 2], default: 0 },
    use: { type: Boolean, default: true },
    visualizationPrivileges: { type: Number, in: [0, 1, 2], default: 0 }
  },
  { collection: 'records' }
);

export const Record = mongoose.model('Record', RecordSchema, 'records');
