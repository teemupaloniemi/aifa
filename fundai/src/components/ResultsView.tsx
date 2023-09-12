import React, { useState } from 'react';
import axios from 'axios';
import logo from '../images/aifalogo.png';


interface TenderData {
  title: string;
  language: string;
  content: string;
  score: number;
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
  scrapedContent: string;
  score: number;
}

interface AppProps {
  inputString: string;
}

const App: React.FC<AppProps> = ({ inputString }) => {
  const [tenderData, setTenderData] = useState<TenderData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<DetailedData | null>(null);
  const [inputValue, setInputValue] = useState<string>(inputString);


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
      const response = await axios.post(`http://localhost:5000/api/fundingTenders/searchTenders`, { researchIdea: inputValue });
      setTenderData(response.data.results);
    } catch (error) {
      console.error('Error fetching tenders:', error);
    }
    setIsLoading(false);
  };

  return (
    <div>
      <div className="text-lg text-center">
        <span className="flex justify-center items-center">
          <img src={logo} alt="AIPA Logo" style={{ width: "3em", height: '3em' }} />
        </span>
        Artificial Intelligence Funding Assistant
      </div>
      {/* Dropdown for selecting a framework */}
      <div className="mb-4">
        <div className="mb-4">
          <label htmlFor="inputString" className="block text-sm font-medium text-gray-700">Your Research Idea</label>
          <textarea
            id="inputString"
            name="inputString"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full h-40 p-4 border-2 border-primary-500 rounded-md"
          />
        </div>
        <div className="flex justify-center">
          <button className='border-2 py-2 px-4 border-primary-500 rounded-md sm:hover:shadow-lg sm:hover:bg-primary-100' onClick={fetchTenders}>Fetch Funding Opportunities</button>
        </div>
      </div>



      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          {selectedItem ? (
            <div className='flex flex-col items-start border-2 m-2 py-2 px-4 border-primary-500 rounded-md'>
              <button className='border-2 my-4 py-2 px-4 border-primary-500 rounded-md sm:hover:shadow-lg sm:hover:bg-primary-100' onClick={handleCloseClick}>Close</button>
              <h2 className="text-xl mb-4">{selectedItem.metadata.title[0]}</h2>
              <h3 className="text-lg font-semibold">Score: {selectedItem.score}</h3>
              {Object.entries(selectedItem.metadata).map(([key, value]) => {
                if (key !== 'keywords' && key !== 'title') {
                  if (key === 'identifier') {
                    const url = `https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/opportunities/topic-details/${value[0].toLowerCase()}`;
                    return (
                      <div key={key}>
                        <p><strong>Description:</strong></p>
                        <p><a href={url} className="pl-4 md:hover:underline text-primary-500">{url}</a></p>
                        {selectedItem.scrapedContent}
                      </div>
                    );
                  }
                  return (
                    <div key={key}>
                      <p><strong>{key}:</strong></p>
                      <p className="pl-4">{value[0]}</p>
                    </div>
                  );
                }
                return null;  // Return null if the key is 'keywords'
              })}
            </div>

          ) : (
            <ul>
              {tenderData.sort((a, b) => b.score - a.score).map((item, index) => (
                item.content.length > 0 &&
                <div
                  className='border-2 m-2 py-2 px-4 border-primary-500 rounded-md sm:hover:bg-primary-100 sm:hover:shadow-lg'
                  key={index}
                  onClick={() => handleItemClick(item)}
                >
                  <p>{item.content} <b>{Math.round(item.score)}%</b></p>
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
