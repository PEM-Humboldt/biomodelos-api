import express from 'express';
import * as controller from './stat.controller';

const router = express.Router();

// STA1
router.get('/models/:bmClass', controller.allModelAccordingBmClass);

export default router;
