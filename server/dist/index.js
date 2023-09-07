"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const FundingRoutes_1 = __importDefault(require("./routes/FundingRoutes"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const PORT = 5000;
const app = (0, express_1.default)();
// CORS configuration
const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use('/api/fundingTenders', FundingRoutes_1.default);
app.get('/', (req, res) => {
    res.send('Server is running');
});
app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
