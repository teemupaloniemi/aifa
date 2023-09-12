import React, { useState } from 'react';
import axios from 'axios';
import logo from '../images/aifalogo.png';


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
  title: string;
  language: string;
  content: string;
  score: number;
}

interface AppProps {
  inputString: string;
}

interface Framework {
  id: string;
  name: string;
  keywords?: string;
}

const frameworks: Framework[] = [
  { id: "43108390", name: "Horizon Europe (HORIZON)", keywords: "Research, Innovation, Science, Technology" },
  { id: "44181033", name: "European Defence Fund (EDF)", keywords: "Defense, Security, Military, Technology" },
  { id: "111111", name: "EU External Action (RELEX)", keywords: "Foreign Policy, Diplomacy, International Relations" },
  { id: "43152860", name: "Digital Europe Programme (DIGITAL)", keywords: "Digitalization, Technology, Internet, Cybersecurity" },
  { id: "43252405", name: "Programme for the Environment and Climate Action (LIFE)", keywords: "Environment, Climate Change, Sustainability" },
  { id: "43332642", name: "EU4Health Programme (EU4H)", keywords: "Healthcare, Public Health, Medical Research" },
  { id: "43298916", name: "Euratom Research and Training Programme (EURATOM)", keywords: "Nuclear Energy, Research, Safety" },
  { id: "43251567", name: "Connecting Europe Facility (CEF)", keywords: "Infrastructure, Transport, Energy, Digital" },
  { id: "43252449", name: "Research Fund for Coal & Steel (RFCS)", keywords: "Coal, Steel, Industrial Research" },
  { id: "45532249", name: "EU Bodies and Agencies (EUBA)", keywords: "EU Institutions, Governance, Regulatory Bodies" },
  { id: "43353764", name: "Erasmus+ (ERASMUS+)", keywords: "Education, Student Exchange, Training" },
  { id: "43637601", name: "Pilot Projects & Preparation Actions (PPPA)", keywords: "Pilot Projects, Innovation, Development" },
  { id: "43252476", name: "Single Market Programme (SMP)", keywords: "Economic Integration, Trade, Single Market" },
  { id: "43697167", name: "European Parliament (EP)", keywords: "Legislation, Governance, Democracy" },
  { id: "44416173", name: "Interregional Innovation Investments Instrument (I3)", keywords: "Regional Development, Innovation, Investment" },
  { id: "44773066", name: "Just Transition Mechanism (JTM)", keywords: "Social Justice, Economic Transition, Sustainability" },
  { id: "43089234", name: "Innovation Fund (INNOVFUND)", keywords: "Innovation, Technology, Startups" },
  { id: "43251589", name: "Citizens, Equality, Rights and Values Programme (CERV)", keywords: "Human Rights, Equality, Citizenship" },
  { id: "43252386", name: "Justice Programme (JUST)", keywords: "Legal Systems, Justice, Rule of Law" },
  { id: "43252433", name: "Programme for the Protection of the Euro against Counterfeiting (PERICLES IV)", keywords: "Currency, Counterfeiting, Security" },
  { id: "43253967", name: "Renewable Energy Financing Mechanism (RENEWFM)", keywords: "Renewable Energy, Finance, Sustainability" },
  { id: "43254037", name: "European Solidarity Corps (ESC)", keywords: "Volunteering, Solidarity, Community Service" },
  { id: "43392145", name: "European Maritime, Fisheries and Aquaculture Fund (EMFAF)", keywords: "Maritime, Fisheries, Aquaculture, Sustainability" },
  { id: "43254019", name: "European Social Fund + (ESF)", keywords: "Employment, Social Inclusion, Education" }
];

const App: React.FC<AppProps> = ({ inputString }) => {
  const [tenderData, setTenderData] = useState<DetailedData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<DetailedData | null>(null);
  const [inputValue, setInputValue] = useState<string>(inputString);


  const handleItemClick = (item: DetailedData) => {
    // Here, you can fetch the detailed data for the clicked item if needed
    // For demonstration purposes, I'm just setting the selectedItem directly
    setSelectedItem(item); // Typecasting for demonstration
  };

  const handleCloseClick = () => {
    setSelectedItem(null);
  };


  const groupByFramework = (tenders: DetailedData[]): Record<string, DetailedData[]> => {
    return tenders.reduce((acc, tender) => {
      const frameworkId = tender.metadata.frameworkProgramme[0];
      if (!acc[frameworkId]) {
        acc[frameworkId] = [];
      }
      acc[frameworkId].push(tender);
      return acc;
    }, {} as Record<string, DetailedData[]>);
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

  const groupedTenders = groupByFramework(tenderData);

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
          Object.keys(groupedTenders).map((frameworkId: string) => {
            const framework = frameworks.find((f) => f.id === frameworkId);
            return (
              <div key={frameworkId}>
                <h2 className="text-xl mb-2">
                  {framework?.name} - {framework?.keywords}
                </h2>
                <ul>
                  {groupedTenders[frameworkId].sort((a,b) => b.score - a.score).map((item, index) => (
                    <li
                      className='border-2 m-2 py-2 px-4 border-primary-500 rounded-md sm:hover:bg-primary-100 sm:hover:shadow-lg'
                      key={index}
                      onClick={() => handleItemClick(item)}
                    >
                      <p>{item.content} <b>{Math.round(item.score)}%</b></p>
                    </li>
                  ))}
                </ul>
              </div>
            );
          }))}
        </>
      )}
    </div>
  );
};

export default App;
