import express from 'express';
import * as ModelsController from '../models//model.controller';

const router = express.Router();
router.put('/models/:modelID/layer', ModelsController.updateModelLayer);

export default router;
