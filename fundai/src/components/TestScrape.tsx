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

const frameworks = [
  { id: "43108390", name: "Horizon Europe (HORIZON)" },
  { id: "44181033", name: "European Defence Fund (EDF)" },
  { id: "111111", name: "EU External Action (RELEX)" },
  { id: "43152860", name: "Digital Europe Programme (DIGITAL)" },
  { id: "43252405", name: "Programme for the Environment and Climate Action (LIFE)" },
  { id: "43332642", name: "EU4Health Programme (EU4H)" },
  { id: "43298916", name: "Euratom Research and Training Programme (EURATOM)" },
  { id: "43251567", name: "Connecting Europe Facility (CEF)" },
  { id: "43252449", name: "Research Fund for Coal & Steel (RFCS)" },
  { id: "45532249", name: "EU Bodies and Agencies (EUBA)" },
  { id: "43353764", name: "Erasmus+ (ERASMUS+)" },
  { id: "43637601", name: "Pilot Projects & Preparation Actions (PPPA)" },
  { id: "43252476", name: "Single Market Programme (SMP)" },
  { id: "43697167", name: "European Parliament (EP)" },
  { id: "44416173", name: "Interregional Innovation Investments Instrument (I3)" },
  { id: "44773066", name: "Just Transition Mechanism (JTM)" },
  { id: "43089234", name: "Innovation Fund (INNOVFUND)" },
  { id: "43251589", name: "Citizens, Equality, Rights and Values Programme (CERV)" },
  { id: "43252386", name: "Justice Programme (JUST)" },
  { id: "43252433", name: "Programme for the Protection of the Euro against Counterfeiting (PERICLES IV)" },
  { id: "43253967", name: "Renewable Energy Financing Mechanism (RENEWFM)" },
  { id: "43254037", name: "European Solidarity Corps (ESC)" },
  { id: "43392145", name: "European Maritime, Fisheries and Aquaculture Fund (EMFAF)" }
];


const App: React.FC = () => {
  const [tenderData, setTenderData] = useState<TenderData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<DetailedData | null>(null);
  const [selectedFramework, setSelectedFramework] = useState<string>("");

  const handleItemClick = (item: TenderData) => {
    // Here, you can fetch the detailed data for the clicked item if needed
    // For demonstration purposes, I'm just setting the selectedItem directly
    setSelectedItem(item as unknown as DetailedData); // Typecasting for demonstration
  };


  const handleFrameworkChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFramework(event.target.value);
  };

  const handleCloseClick = () => {
    setSelectedItem(null);
  };


  const fetchTenders = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/fundingTenders/searchTenders?framework=${selectedFramework}`);
      setTenderData(response.data.results);
    } catch (error) {
      console.error('Error fetching tenders:', error);
    }
    setIsLoading(false);
  };

  return (
    <div>
      <div className="text-lg text-center">Artificial Intelligence Funding Assistant</div>
      {/* Dropdown for selecting a framework */}
      <div className="mb-4">
        <select
          id="frameworkSelect"
          name="framework"
          value={selectedFramework}
          onChange={handleFrameworkChange}
          className="mt-1 block w-60 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="">Select a framework</option>
          {frameworks.map(framework => (
            <option key={framework.id} value={framework.id}>
              {framework.name}
            </option>
          ))}
        </select>
      </div>

      <button className='border-2 py-2 px-4 border-black rounded-md sm:hover:shadow-lg sm:hover:bg-primary-100' onClick={fetchTenders}>Fetch Funding Opportunities</button>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          {selectedItem ? (
            <div className='flex flex-col items-start border-2 m-2 py-2 px-4 border-black rounded-md'>
              <button className='border-2 my-4 py-2 px-4 border-black rounded-md sm:hover:shadow-lg sm:hover:bg-primary-100' onClick={handleCloseClick}>Close</button>
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
