// App.tsx

import React, { useState } from 'react';
import axios from 'axios';

interface LinkSummary {
  link: string;
  summary: string;
}

const App: React.FC = () => {
  const [maxPages, setMaxPages] = useState<number>(10);
  const [data, setData] = useState<LinkSummary[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/scrape?maxPages=${maxPages}`);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setIsLoading(false);
  };

  return (
    <div>
      <h1>Web Scraper</h1>
      <label>
        Max Pages:
        <input
          type="number"
          value={maxPages}
          onChange={(e) => setMaxPages(parseInt(e.target.value))}
        />
      </label>
      <button onClick={fetchData}>Start Scraping</button>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {data.map((item, index) => (
            <li key={index}>
              <a href={item.link} target="_blank" rel="noopener noreferrer">
                {item.summary}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default App;
