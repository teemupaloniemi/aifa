import React, { useState } from 'react';
import axios from 'axios';


interface TenderData {
  title: string;
  language: string;
  content: string;
}

interface Metadata {
  identifier: string[];
  caName: string[];
  es_ContentType: string[];
  keywords: string[];
  programmePeriod: string[];
  esDA_IngestDate: string[];
  type: string[];
  title: string[];
  esST_URL: string[];
  esDA_QueueDate: string[];
  esST_FileName: string[];
  callIdentifier: string[];
  frameworkProgramme: string[];
  startDate: string[];
}

interface DetailedData {
  metadata: Metadata;
}



const App: React.FC = () => {
  const [tenderData, setTenderData] = useState<TenderData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<DetailedData | null>(null);


  const handleItemClick = (item: TenderData) => {
    // Here, you can fetch the detailed data for the clicked item if needed
    // For demonstration purposes, I'm just setting the selectedItem directly
    setSelectedItem(item as unknown as DetailedData); // Typecasting for demonstration
  };

  const handleCloseClick = () => {
    setSelectedItem(null);
  };


  const fetchTenders = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/fundingTenders/searchTenders');
      setTenderData(response.data.results);
    } catch (error) {
      console.error('Error fetching tenders:', error);
    }
    setIsLoading(false);
  };

  return (
    <div>
      <h1>Funding AI</h1>
      <button className='border-2 py-2 px-4 border-black rounded-md sm:hover:shadow-lg sm:hover:bg-primary-100' onClick={fetchTenders}>Fetch Tenders</button>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          {selectedItem ? (
            <div className='flex flex-col items-start border-2 m-2 py-2 px-4 border-black rounded-md'>
              <h2 className="text-xl mb-4">{selectedItem.metadata.title[0]}</h2>
              {Object.entries(selectedItem.metadata).map(([key, value]) => {
                if (key !== 'keywords' && key !== 'title') {
                  return (
                    <div key={key}>
                      <p><strong>{key}:</strong></p>
                      <p className="pl-4">{value[0]}</p>
                    </div>
                  );
                }
                return null;  // Return null if the key is 'keywords'
              })}
              <button className='border-2 py-2 px-4 border-black rounded-md sm:hover:shadow-lg sm:hover:bg-primary-100' onClick={handleCloseClick}>Close</button>
            </div>

          ) : (
            <ul>
              {tenderData.map((item, index) => (
                item.content.length > 0 &&
                <div
                  className='border-2 m-2 py-2 px-4 border-black rounded-md sm:hover:bg-primary-100 sm:hover:shadow-lg'
                  key={index}
                  onClick={() => handleItemClick(item)}
                >
                  <p>{item.content}</p>
                </div>
              ))}
            </ul>
          )}

        </>
      )}
    </div>
  );
};

export default App;
