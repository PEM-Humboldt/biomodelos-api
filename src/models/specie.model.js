import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const SpecieSchema = new Schema(
  {
    _id: { type: Schema.ObjectId, required: true },
    taxID: { type: Number, required: true },
    acceptedNameUsage: { type: String, required: true },
    species: { type: String, default: null, required: true },
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
    endemic: { type: Boolean, default: false, required: true },
    invasive: { type: Boolean, default: false, required: true },
    iucn: {
      type: String,
      required: true,
      in: ['EX', 'EW', 'CR', 'EN', 'VU', 'NT', 'LC', 'DD', 'NE'],
      default: 'NE',
      required: true
    },
    taxonomicStatus: {
      type: String,
      in: [
        'accepted',
        'valid',
        'synonym',
        'homotypic synonym',
        'heterotypic synonym',
        'proParteSynonym',
        'misapplied',
        'pending',
        'provisionally accepted name',
        ''
      ],
      default: ''
    },
    amenazaNacional: {
      type: String,
      in: ['EX', 'EW', 'CR', 'EN', 'VU', 'NT', 'LC', 'DD', 'NE'],
      required: true,
      default: 'NE'
    }
  },
  {
    collection: 'species',
    versionKey: false
  }
);

export default mongoose.model('Specie', SpecieSchema, 'species');
