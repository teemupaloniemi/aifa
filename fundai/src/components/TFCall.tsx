import React, { useState } from 'react';
import axios from 'axios';
import FormData from 'form-data';

const SearchTendersComponent = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const searchTenders = async () => {
    try {
      const formData = new FormData();
      
      // Append data with headers
      formData.append('query', new Blob([JSON.stringify({
        "bool": {
          "must": [
            { "terms": { "type": ["1", "2", "8"] } },
            { "terms": { "status": ["31094501", "31094502", "31094503"] } },
            { "terms": { "frameworkProgramme": ["44181033"] } }
          ]
        }
      })], { type: 'application/json' }));
      
      formData.append('languages', new Blob([JSON.stringify(["en"])], { type: 'application/json' }));
      formData.append('sort', new Blob([JSON.stringify({ "field": "sortStatus", "order": "ASC" })], { type: 'application/json' }));

      const response = await axios.post(
        'https://api.tech.ec.europa.eu/search-api/prod/rest/search?apiKey=SEDIA&text=***&pageSize=50&pageNumber=1',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setData(response.data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div>
      <button onClick={searchTenders}>Search Tenders</button>

      {data && (
        <div>
          <h2>Results</h2>
          {/* Display the data as needed */}
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}

      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default SearchTendersComponent;
