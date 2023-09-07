import express from 'express';
import { FundingController } from '../controllers/FundingController';  // Make sure the path is correct

const router = express.Router();

router.get('/searchTenders', FundingController.searchTenders);

export default router;
