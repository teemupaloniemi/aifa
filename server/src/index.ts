import scrapeRoutes from './routes/ScrapeRoutes'; 
import fundingTenderRoutes from './routes/FundingRoutes';
import express, { Request, Response } from 'express';
import cors from 'cors';

const PORT = 5000;

const app = express();

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:3000', 
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));   
app.use(express.json());

app.use("/api", scrapeRoutes);
app.use('/api/fundingTenders', fundingTenderRoutes);
app.get('/', (req: Request, res: Response) => {
  res.send('Server is running');
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
