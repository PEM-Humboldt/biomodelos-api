db.runCommand({
  collMod: 'species',
  validator: {
    $and: [
      { taxID: { $type: 'number', $exists: true } },
      { acceptedNameUsage: { $type: 'string', $exists: true } },
      { species: { $type: 'string', $exists: true } },
      { genus: { $type: 'string', $exists: true } },
      { family: { $type: 'string', $exists: true } },
      { order: { $type: 'string', $exists: true } },
      { class: { $type: 'string', $exists: true } },
      { phylum: { $type: 'string', $exists: true } },
      { kingdom: { $type: 'string', $exists: true } },
      {
        $or: [
          {
            $and: [
              { bmClass: { $type: 'string' } },
              {
                bmClass: {
                  $in: [
                    'Plantas',
                    'Invertebrados',
                    'Aves',
                    'Peces',
                    'Reptiles',
                    'Mamiferos',
                    'Anfibios'
                  ]
                }
              }
            ]
          },
          { bmClass: { $type: 'null' } }
        ]
      },
      {
        $or: [
          {
            $and: [
              { cites: { $type: 'string' } },
              {
                cites: {
                  $in: [
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
                  ]
                }
              }
            ]
          },
          { cites: { $type: 'null' } }
        ]
      },
      {
        $or: [
          { taxonomicStatus: { $type: 'string' } },
          { taxonomicStatus: { $type: 'null' } }
        ]
      },
      {
        $or: [
          { scientificNameAuthorship: { $type: 'string' } },
          { scientificNameAuthorship: { $type: 'null' } }
        ]
      },
      {
        $or: [
          { specificEpithet: { $type: 'string' } },
          { specificEpithet: { $type: 'null' } }
        ]
      },
      {
        $or: [
          { nameAccordingTo: { $type: 'string' } },
          { nameAccordingTo: { $type: 'null' } }
        ]
      },
      {
        $or: [
          { TaxVerifSource: { $type: 'string' } },
          { TaxVerifSource: { $type: 'null' } }
        ]
      },
      {
        $or: [
          { nameAccordingTo: { $type: 'string' } },
          { nameAccordingTo: { $type: 'null' } }
        ]
      },
      { endemic: { $type: 'bool', $exists: true } },
      { invasive: { $type: 'bool', $exists: true } },
      {
        $or: [
          {
            $and: [
              { migratoryType: { $type: 'string' } },
              { migratoryType: { $in: ['Altitudinal', 'Boreal', 'Austral'] } }
            ]
          },
          { migratoryType: { $type: 'null' } }
        ]
      },
      {
        $or: [
          {
            $and: [
              { iucn: { $type: 'string' } },
              {
                iucn: {
                  $in: ['EX', 'EW', 'CR', 'EN', 'VU', 'NT', 'LC', 'DD', 'NE']
                }
              }
            ]
          },
          { iucn: { $type: 'null' } }
        ]
      },
      { validName: { $type: 'bool', $exists: true } },
      { speciesInCountry: { $type: 'bool', $exists: true } },
      { sppInCol: { $type: 'bool', $exists: true } }
    ]
  },
  validationLevel: 'strict',
  validationAction: 'error'
});
