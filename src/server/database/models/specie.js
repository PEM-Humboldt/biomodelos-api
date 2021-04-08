import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const SpecieSchema = new mongoose.Schema(
  {
    _id: { type: Schema.ObjectId },
    taxID: { type: Number, required: true },
    acceptedNameUsage: { type: String, required: true },
    species: { type: String, default: null },
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
    endemic: { type: Boolean, default: false },
    invasive: { type: Boolean, default: false },
    iucn: {
      type: String,
      in: ['EX', 'EW', 'CR', 'EN', 'VU', 'NT', 'LC', 'DD', 'NE'],
      default: null
    },
    taxonomicStatus: { type: String, default: null },
  },
  { collection: 'species' }
);

// module.exports = mongoose.model("Specie", SpecieSchema, "species");

export default { SpecieSchema };
