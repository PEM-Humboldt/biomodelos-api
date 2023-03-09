import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// esquema para la corrección de registros biológicos
const UpdatedSchema = new Schema(
  {
    verbatimLocality: { type: String, default: null },
    decimalLatitude: { type: Number, min: -90, max: 90 },
    decimalLongitude: { type: Number, min: -180, max: 180 },
    speciesOriginal: { type: String },
    day: {
      type: Number,
      min: 1,
      max: 31,
      default: null,
      validate: {
        validator: Number.isInteger,
        message: '{VALUE} is not an integer value'
      }
    },
    month: {
      type: Number,
      min: 1,
      max: 12,
      default: null,
      validate: {
        validator: Number.isInteger,
        message: '{VALUE} is not an integer value'
      }
    },
    year: {
      type: Number,
      min: 1800,
      max: 2100,
      default: null,
      validate: {
        validator: Number.isInteger,
        message: '{VALUE} is not an integer value'
      }
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
      default: null,
      validate: {
        validator: val => {
          if (val.toLowerCase().trim() == 'null') return false;
        },
        message: 'validation of `{PATH}` failed with value "{VALUE}" (string)'
      }
    },
    speciesOriginal: {
      type: String,
      default: null,
      validate: {
        validator: val => {
          if (val.toLowerCase().trim() == 'null') return false;
        },
        message: 'validation of `{PATH}` failed with value "{VALUE}" (string)'
      }
    },
    stateProvince: {
      type: String,
      default: null,
      validate: {
        validator: val => {
          if (val.toLowerCase().trim() == 'null') return false;
        },
        message: 'validation of `{PATH}` failed with value "{VALUE}" (string)'
      }
    },
    country: {
      type: String,
      default: null,
      validate: {
        validator: val => {
          if (val.toLowerCase().trim() == 'null') return false;
        },
        message: 'validation of `{PATH}` failed with value "{VALUE}" (string)'
      }
    },
    county: {
      type: String,
      default: null,
      validate: {
        validator: val => {
          if (val.toLowerCase().trim() == 'null') return false;
        },
        message: 'validation of `{PATH}` failed with value "{VALUE}" (string)'
      }
    },
    eventDate: {
      type: String,
      default: new Date().toISOString().slice(0, 10),
      validate: {
        validator: val => {
          if (val.toLowerCase().trim() == 'null') return false;
        },
        message: 'validation of `{PATH}` failed with value "{VALUE}" (string)'
      }
    },
    verbatimLocality: {
      type: String,
      default: null,
      validate: {
        validator: val => {
          if (val.toLowerCase().trim() == 'null') return false;
        },
        message: 'validation of `{PATH}` failed with value "{VALUE}" (string)'
      }
    },
    decimalLatitude: { type: Number, required: true, min: -90, max: 90 },
    decimalLongitude: { type: Number, required: true, min: -180, max: 180 },
    verbatimElevation: {
      type: String,
      default: null,
      validate: {
        validator: val => {
          if (val.toLowerCase().trim() == 'null') return false;
        },
        message: 'validation of `{PATH}` failed with value "{VALUE}" (string)'
      }
    },
    cellID: { type: Number, min: 0, default: null },
    basisOfRecord: {
      type: String,
      default: null,
      validate: {
        validator: val => {
          if (val.toLowerCase().trim() == 'null') return false;
        },
        message: 'validation of `{PATH}` failed with value "{VALUE}" (string)'
      }
    },
    catalogNumber: {
      type: String,
      default: null,
      validate: {
        validator: val => {
          if (val.toLowerCase().trim() == 'null') return false;
        },
        message: 'validation of `{PATH}` failed with value "{VALUE}" (string)'
      }
    },
    recordedBy: {
      type: String,
      default: null,
      validate: {
        validator: val => {
          if (val.toLowerCase().trim() == 'null') return false;
        },
        message: 'validation of `{PATH}` failed with value "{VALUE}" (string)'
      }
    },
    institutionCode: {
      type: String,
      default: null,
      validate: {
        validator: val => {
          if (val.toLowerCase().trim() == 'null') return false;
        },
        message: 'validation of `{PATH}` failed with value "{VALUE}" (string)'
      }
    },
    url: {
      type: String,
      default: null,
      validate: {
        validator: val => {
          if (val.toLowerCase().trim() == 'null') return false;
        },
        message: 'validation of `{PATH}` failed with value "{VALUE}" (string)'
      }
    },
    day: {
      type: Number,
      min: 1,
      max: 31,
      default: null,
      validate: {
        validator: Number.isInteger,
        message: '{VALUE} is not an integer value'
      }
    },
    month: {
      type: Number,
      min: 1,
      max: 12,
      default: null,
      validate: {
        validator: Number.isInteger,
        message: '{VALUE} is not an integer value'
      }
    },
    year: {
      type: Number,
      min: 1800,
      max: 2100,
      default: null,
      validate: {
        validator: Number.isInteger,
        message: '{VALUE} is not an integer value'
      }
    },
    inUrbanArea: { type: Boolean, default: null },
    suggestedCounty: {
      type: String,
      default: null,
      validate: {
        validator: val => {
          if (val.toLowerCase().trim() == 'null') return false;
        },
        message: 'validation of `{PATH}` failed with value "{VALUE}" (string)'
      }
    },
    suggestedStateProvince: {
      type: String,
      default: null,
      validate: {
        validator: val => {
          if (val.toLowerCase().trim() == 'null') return false;
        },
        message: 'validation of `{PATH}` failed with value "{VALUE}" (string)'
      }
    },
    sourceLayer: {
      type: String,
      default: null,
      validate: {
        validator: val => {
          if (val.toLowerCase().trim() == 'null') return false;
        },
        message: 'validation of `{PATH}` failed with value "{VALUE}" (string)'
      }
    },
    environmentalOutlier: { type: Boolean, default: null },
    dbDuplicate: { type: Boolean, default: false },
    spatialDuplicated: { type: Boolean, default: false },
    updated: [UpdatedSchema],
    downloadDate: {
      type: String,
      default: new Date().toISOString().slice(0, 10),
      validate: {
        validator: val => {
          if (val.toLowerCase().trim() == 'null') return false;
        },
        message: 'validation of `{PATH}` failed with value "{VALUE}" (string)'
      }
    },
    resourceFolder: {
      type: String,
      default: 'Biomodelos',
      validate: {
        validator: val => {
          if (val.toLowerCase().trim() == 'null') return false;
        },
        message: 'validation of `{PATH}` failed with value "{VALUE}" (string)'
      }
    },
    resourceIncorporationDate: {
      type: String,
      default: Date.now(),
      validate: {
        validator: val => {
          if (val.toLowerCase().trim() == 'null') return false;
        },
        message: 'validation of `{PATH}` failed with value "{VALUE}" (string)'
      }
    },
    resourceName: {
      type: String,
      default: 'Biomodelos',
      validate: {
        validator: val => {
          if (val.toLowerCase().trim() == 'null') return false;
        },
        message: 'validation of `{PATH}` failed with value "{VALUE}" (string)'
      }
    },
    source: {
      type: String,
      default: null,
      validate: {
        validator: val => {
          if (val.toLowerCase().trim() == 'null') return false;
        },
        message: 'validation of `{PATH}` failed with value "{VALUE}" (string)'
      }
    },
    contributedRecord: {
      type: String,
      default: null,
      validate: {
        validator: val => {
          if (val.toLowerCase().trim() == 'null') return false;
        },
        message: 'validation of `{PATH}` failed with value "{VALUE}" (string)'
      }
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
      validate: {
        validator: val => {
          if (val.toLowerCase().trim() == 'null') return false;
        },
        message: 'validation of `{PATH}` failed with value "{VALUE}" (string)'
      }
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
