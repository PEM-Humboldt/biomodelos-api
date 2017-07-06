import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const SpecieSchema = new Schema(
  {
    _id: { type: Schema.ObjectId },
    taxID: { type: Number, required: true },
    acceptedNameUsage: { type: String, required: true },
    species: { type: String, default: null },
    genus: { type: String, default: null },
    family: { type: String, default: null },
    order: { type: String, default: null },
    class: { type: String, default: null },
    phylum: { type: String, default: null },
    kingdom: { type: String, default: null },
    bmClass: {
      type: String,
      in: [
        'Plantas',
        'Invertebrados',
        'Aves',
        'Peces',
        'Reptiles',
        'Mamiferos',
        'Anfibios'
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
      default: null
    },
    endemic: { type: Boolean, default: false },
    invasive: { type: Boolean, default: false },
    migratoryType: {
      type: String,
      in: ['Altitudinal', 'Boreal', 'Austral'],
      default: null
    },
    iucn: {
      type: String,
      in: ['EX', 'EW', 'CR', 'EN', 'VU', 'NT', 'LC', 'DD', 'NE'],
      default: null
    },
    taxVerifSource: { type: String, default: null },
    nameAccordingTo: { type: String, default: null },
    scientificNameAuthorship: { type: String, default: null },
    specificEpithet: { type: String, default: null },
    taxonomicStatus: { type: String, default: null },
    validName: { type: Boolean, default: true },
    speciesInCountry: { type: Boolean, default: null },
    sppInCol: { type: Boolean, default: true }
  },
  { collection: 'species' }
);

export default mongoose.model('Specie', SpecieSchema, 'species');
