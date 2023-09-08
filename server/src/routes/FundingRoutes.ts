import express from 'express';
import { FundingController } from '../controllers/FundingController';  // Make sure the path is correct
import { params } from '../controllers/ParameterController';

const router = express.Router();

router.get('/searchTenders', FundingController.searchTenders);
router.post('/summarize', params);

export default router;
