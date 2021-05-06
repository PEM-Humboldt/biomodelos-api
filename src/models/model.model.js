import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const ModelSchema = new Schema(
  {
    _id: { type: Schema.ObjectId, required: true },
    taxID: { type: Number, required: true },
    acceptedNameUsage: { type: String, required: true },
    consensusMethod: {
      type: String,
      in: ['all', 'mean', 'median'],
      required: true
    },
    modelingMethod: {
      type: String,
      required: true,
      in: [
        'Maxent',
        'Bioclim',
        'Convex hull',
        'Expert map',
        'Hybrid (Maxent + Expert opinion)',
        'Hybrid (Bioclim + Expert opinion)',
        'Hybrid (Maxent + Bioclim)'
      ]
    },
    modelLevel: { type: Number, in: [0, 1, 2, 3, 4] },
    modelStatus: {
      type: String,
      in: ['Developing', 'pendingValidation', 'Valid'],
      required: true
    },
    published: { type: Boolean, default: false },
    customCitation: { type: String, default: null },
    isActive: { type: Boolean, default: true },
    modelID: { type: String, default: null, required: true },
    recsUsed: { type: Number },
    perfStatType: { type: String },
    perfStatValue: { type: Number },
    validationType: { type: String },
    thresholdType: {
      type: String,
      in: [0, 10, 20, 30, 'Continuous'],
      required: function() {
        return this.modelStatus === 'Developing';
      }
    },
    modelAuthors: { type: String },
    dd: { type: Number, min: 1, max: 31 },
    mm: { type: Number, min: 1, max: 12 },
    yyyy: { type: Number, min: 1800, max: 2100 },
    statCoverLC2: { type: Number },
    statCoverLC3: { type: Number },
    statCoverLC4: { type: Number },
    statCoverLC5: { type: Number },
    statCoverLC6: { type: Number },
    statCoverLC7: { type: Number },
    statCoverLC8: { type: Number },
    statCoverLC9: { type: Number },
    statCoverLC10: { type: Number },
    statCoverLC11: { type: Number },
    statCoverLC12: { type: Number },
    statCoverLC13: { type: Number },
    statCoverLC14: { type: Number },
    statCoverLC15: { type: Number },
    statCoverLC16: { type: Number },
    statCoverLC17: { type: Number },
    statCoverLC18: { type: Number },
    statCoverLC19: { type: Number },
    statCoverLC20: { type: Number },
    statCoverLC21: { type: Number },
    statCoverLC22: { type: Number },
    statCoverLC23: { type: Number },
    statCoverLC24: { type: Number },
    statCoverLC25: { type: Number },
    statCoverLC26: { type: Number },
    statCoverLC27: { type: Number },
    statCoverLC28: { type: Number },
    statCoverLC29: { type: Number },
    statCoverLC30: { type: Number },
    statCoverLC31: { type: Number },
    statCoverLC32: { type: Number },
    statCoverLC33: { type: Number },
    statCoverLC34: { type: Number },
    statCoverLC35: { type: Number },
    statCoverLC36: { type: Number },
    statCoverLC37: { type: Number },
    statCoverLC38: { type: Number },
    statCoverLC39: { type: Number },
    statCoverLC40: { type: Number },
    statCoverLC41: { type: Number },
    statCoverLC42: { type: Number },
    statCoverLC43: { type: Number },
    statCoverLC44: { type: Number },
    statCoverLC45: { type: Number },
    statCoverLC46: { type: Number },
    statCoverLC47: { type: Number },
    statCoverLC48: { type: Number },
    statCoverLC49: { type: Number },
    statCoverLC50: { type: Number },
    statCoverLC51: { type: Number },
    statCoverLC52: { type: Number },
    statCoverLC53: { type: Number },
    statCoverLC54: { type: Number },
    statCoverLC55: { type: Number },
    statForestLoss00: { type: Number },
    statForestLoss05: { type: Number },
    statForestLoss10: { type: Number },
    statForestLoss12: { type: Number },
    statForestLoss90: { type: Number },
    statFutureForest30c: { type: Number },
    statFutureForest30d: { type: Number },
    statFutureForest30h: { type: Number },
    statRangeSize: { type: Number },
    statModelEOO: { type: Number },
    statRecsEOO: { type: Number },
    statRepPA: { type: Number },
    statRepPA1: { type: Number },
    statRepPA2: { type: Number },
    statRepPA3: { type: Number },
    thumb: { type: String },
    zip: { type: String },
    png: { type: String },
    methodFile: { type: String },
    license: {
      type: String,
      in: ['by', 'by-sa', 'by-nc', 'by-nc-sa', 'cc-zero']
    },
    statForestLoss13: { type: Number },
    statForestLoss14: { type: Number },
    statForestLoss16: { type: Number },
    modelSeason: {
      type: String,
      default: 'resident',
      in: [
        'resident',
        'breeding season',
        'non-breeding season',
        'passage',
        'seasonal occurrence uncertain'
      ]
    },
    modelOrigin: {
      type: String,
      default: 'native',
      in: [
        'resident',
        'breeding season',
        'non-breeding season',
        'passage',
        'seasonal occurrence uncertain'
      ]
    },
    modelGeoExtent: {
      type: String,
      default: 'national',
      in: ['national', 'regional']
    },
    modelEpoch: {
      type: String,
      default: 'present',
      in: ['present', 'past', 'future']
    },
    gsLayer: { type: String }
  },
  {
    collection: 'models',
    versionKey: false
  }
);

export default mongoose.model('Model', ModelSchema, 'models');
