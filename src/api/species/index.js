import express from 'express';
import * as controller from './specie.controller';

const router = express.Router();

router.get('/records/:taxID', controller.read); // REC1
router.get('/records/group/:taxID', controller.readValidForGroup); // RECVALIDFORGROUP this is a temporal solution
router.get('/', controller.getAllSpecies); // SPE1
router.get('/:taxID', controller.getTaxonomyAndRecords); // SPE2
router.get('/search/:species', controller.searchSpecie); // SPE3
//router.get('/records', controller.list);
//router.post('records', controller.create);
//router.put('/records/:taxID', controller.update);
//router.delete('/records/:taxID', controller.remove);

export default router;
