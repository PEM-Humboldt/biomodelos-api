import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// esquema para la corrección de registros biológicos
const UpdatedSchema = new Schema({
  lat: { type: Number },
  lon: { type: Number },
  locality: { type: String },
  yyyy: { type: Number },
  mm: { type: Number },
  dd: { type: Number },
  userId_bm: { type: Number },
  updatedDate: { type: Date, default: Date.now },
  speciesOriginal: { type: String }
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
    acceptedNameUsage: { type: String, required: true },
    adm1: { type: String, default: null },
    adm2: { type: String, default: null },
    alt: { type: Number, default: null }, //Validar este dato en el futuro porque hay datos string BD
    altitudinalOutlier: { type: Boolean, default: null },
    basisOfRecord: { type: String, default: null },
    catalogNumber: { type: String, default: null }, //Validar siga siendo string porque hay datos numéricos en BD
    cellID: { type: Number, min: 0, default: null }, //BD tiene datos tipo string y arreglos
    collection_code: { type: String, default: null },
    collector: { type: String, default: null }, //Hay datos numéricos en BD
    consistentAltitude: { type: Boolean, default: null },
    continent: { type: String, default: null },
    contributedRecord: { type: String, default: null }, //Hay datos booleanos en BD, este campo deberá ser convertido en arreglo
    coordUncertaintyM: { type: Number, default: null }, // Hay datos string en BD
    correctCountry: { type: Boolean, default: null },
    correctCounty: { type: Boolean, default: null },
    correctStateProvince: { type: Boolean, default: null },
    country: { type: String, default: null },
    dbDuplicate: { type: Boolean, default: false },
    dd: { type: Number, min: 1, max: 31, default: null }, //Existen string en BD
    demAltitude: { type: Number, min: 0, max: 8000, default: null }, //Existen string en BD
    diferenceInAltitude: { type: Number, min: 0, max: 8000, default: null },
    dist2KnowRange: { type: Number, default: null }, //Existen strings en BD
    downloadDate: { type: String, default: null }, //Considero que este campo debería ser tipo date
    earliestDateCollected: { type: String, default: null }, //Hay datos numéricos en la base de datos, considero que este campo deberia ser tipo date
    environmentalOutlier: { type: Boolean, default: null },
    hasLocality: { type: Boolean, default: null },
    insideKnownDistribution: { type: Boolean, default: false },
    institution: { type: String, default: null },
    inUrbanArea: { type: Boolean, default: null },
    lat: { type: Number, min: -90, max: 90 },
    latestDateCollected: { type: String, default: null }, //Existen datos numéricos en BD, considero este campo debe ser tipo date
    locality: { type: String, default: null },
    lon: { type: Number, min: -180, max: 180 },
    lowUncertainty: { type: Boolean, default: null }, //Existen datos tipo string en BD
    mm: { type: Number, min: 1, max: 12, default: null }, //Existen datos tipo string en BD
    occurrenceID: { type: String, default: null }, //Existen datos numéricos en BD
    privateData: { type: Number, in: [0, 1, 2], default: 0 },
    resourceFolder: { type: String, default: null },
    resourceIncorporationDate: { type: String, default: null }, //Existen datos numéricos en BD, considero este campo deberia ser tipo date
    resourceName: { type: String, default: null },
    source: { type: String, default: null },
    sourceLayer: { type: String, default: null },
    spatialDuplicated: { type: Boolean, default: false },
    species: { type: String, default: null },
    speciesOriginal: { type: String, default: null },
    suggestedCountry: { type: String, default: null },
    suggestedCounty: { type: String, default: null },
    suggestedMunicipality: { type: String, default: null },
    suggestedStateProvince: { type: String, default: null },
    taxID: { type: Number, required: true },
    url: { type: String, default: null },
    use: { type: Boolean, default: true },
    visualizationPrivileges: { type: Number, in: [0, 1, 2], default: 0 },
    yyyy: { type: Number, min: 1800, max: 2100, default: null }, //Existen datos tipo string en BD
    reported: [ReportedSchema],
    updated: [UpdatedSchema],
    created: [CreatedSchema]
  },
  { collection: 'records' }
);

export const Record = mongoose.model('Record', RecordSchema, 'records');
export const Reported = mongoose.model('ReportedSchema', ReportedSchema);
export const Updated = mongoose.model('UpdatedSchema', UpdatedSchema);
export const Created = mongoose.model('CreatedSchema', CreatedSchema);
