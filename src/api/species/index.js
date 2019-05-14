import express from 'express';
import * as controller from './specie.controller';

const router = express.Router();

router.get('/records/:taxID', controller.getSpeciesRecords); // REC1
router.get('/records/group/:taxID', controller.getSpeciesRecordsWithPrivileges); // RECVALIDFORGROUP this is a temporal solution
router.get('/', controller.getAllSpecies); // SPE1
router.get('/:taxID', controller.getTaxonomyAndTotalRecords); // SPE2
router.get('/search/:species', controller.searchSpecies); // SPE3

export default router;
