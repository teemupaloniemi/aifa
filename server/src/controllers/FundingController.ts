import axios from 'axios';
import { Request, Response } from 'express';

class FundingController {
  static async searchTenders(req: Request, res: Response): Promise<void> {
    try {
      console.log('searchTenders: Preparing query data'); // Logging the start of query preparation
      const queryData = {
          "bool": {
            "must": [
              {
                "terms": {
                  "type": [
                    "1",
                    "2",
                    "8"
                  ]
                }
              },
              {
                "terms": {
                  "status": [
                    "31094501",
                    "31094502",
                    "31094503"
                  ]
                }
              },
              {
                "term": {
                  "programmePeriod": "2021 - 2027"
                }
              },
              {
                "terms": {
                  "frameworkProgramme": [
                    "43298664"
                  ]
                }
              }
            ]
          }
        };

      const sortData = {
        "field": "sortStatus",
        "order": "ASC"
      };

      console.log('searchTenders: Sending request to API'); // Logging before sending the request
      const response = await axios.post(
        'https://api.tech.ec.europa.eu/search-api/prod/rest/search?apiKey=SEDIA&text=***&pageSize=50&pageNumber=1',
        { 
          query: queryData,
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('searchTenders: Received response', response.data.results.length ); // Logging the received data
      console.log('searchTenders: Total found', response.data.totalResults)
      res.json(response.data);
    } catch (error) {
      console.log('searchTenders: Error occurred', error); // Logging the error
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}

export { FundingController };
