import express from 'express';
import * as controller from './record.controller';

const router = express.Router();

router.get('/:record_id', controller.read); // REC1
router.put('/:record_id', controller.update); // REC2
router.post('/:record_id', controller.report); // REC3
router.post('/', controller.createWithoutId); // REC4
router.get(
  '/metadata/institutions/:taxID',
  controller.uniqueValuesInstitutions
); // STA2
router.get('/metadata/collectors/:taxID', controller.uniqueValuesCollectors); // STA3
router.get('/metadata/sources/:taxID', controller.uniqueValuesSources); // STA4
router.get('/metadata/collaborators/:taxID', controller.collaboratorsOfSpecie); // STA5
router.get('/metadata/latest_date/:taxID', controller.latestChange); // STA6
router.get('/metadata/collection/:taxID', controller.uniqueValuesCollection); // STA7

router.get('/validate/:record_id', controller.validate);

export default router;
