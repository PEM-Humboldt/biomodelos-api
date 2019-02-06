import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const SpecieSchema = new Schema(
  {
    _id: { type: Schema.ObjectId, required: true },
    taxID: { type: Number, required: true },
    acceptedNameUsage: { type: String, required: true },
    species: { type: String, default: null, required: true },
    genus: { type: String, default: null, required: true },
    family: { type: String, default: null, required: true },
    order: { type: String, default: null, required: true },
    class: { type: String, default: null, required: true },
    phylum: { type: String, default: null, required: true },
    kingdom: { type: String, default: null, required: true },
    bmClass: {
      type: String,
      in: [
        'plantas',
        'invertebrados',
        'aves',
        'peces',
        'reptiles',
        'mamiferos',
        'anfibios'
      ],
      required: true
    },
    cites: {
      type: String,
      in: [
        'I',
        'II',
        'III',
        'NC',
        'III/NC',
        'I/NC',
        'I/II',
        'I/III',
        'II/NC',
        'I/II/III/NC',
        'I/II/NC'
      ],
      default: ''
    },
    endemic: { type: Boolean, default: false, required: true },
    invasive: { type: Boolean, default: false, required: true },
    migratoryType: {
      type: String,
      in: [
        'Boreal',
        'Austral',
        'Intratropical',
        'Latitudinal Transnacional',
        'Boreal e Intratropical',
        'Boreal y Austral',
        ''
      ],
      default: ''
    },
    iucn: {
      type: String,
      required: true,
      in: ['EX', 'EW', 'CR', 'EN', 'VU', 'NT', 'LC', 'DD', 'NE'],
      default: 'NE'
    },
    taxVerifSource: {
      type: String,
      in: ['Catalogue of life 2015 ', 'Record autor', ''],
      default: ''
    },
    nameAccordingTo: { type: String, default: '' },
    scientificNameAuthorship: { type: String, default: '' },
    specificEpithet: { type: String, default: null, required: true },
    taxonomicStatus: { type: String, default: null },
    validName: { type: Boolean, default: true, required: true },
    speciesInCountry: { type: Boolean, default: null, required: true },
    sppInCol: { type: Boolean, default: true, required: true },
    iucnSpeciesID: { type: Number, default: 0 },
    amenazaNacional: {
      type: String,
      required: true,
      in: ['EX', 'EW', 'CR', 'EN', 'VU', 'NT', 'LC', 'DD', 'NE'],
      default: 'NE'
    },
    recordsVisualizationPrivileges: {
      type: Number,
      required: true,
      in: [0, 1, 2],
      default: 0
    },
    uploadUser: { type: String, required: true, default: null },
    uploadDate: { type: Date, required: true, default: null }
  },
  { collection: 'species' }
);

export default mongoose.model('Specie', SpecieSchema, 'species');
