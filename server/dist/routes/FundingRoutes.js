"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const FundingController_1 = require("../controllers/FundingController"); // Make sure the path is correct
const ParameterController_1 = require("../controllers/ParameterController");
const router = express_1.default.Router();
router.post('/searchTenders', FundingController_1.FundingController.searchTenders);
router.post('/summarize', ParameterController_1.params);
exports.default = router;
