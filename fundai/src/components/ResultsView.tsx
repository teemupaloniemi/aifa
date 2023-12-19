import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header';
import ResearchIdeaInput from './ResearchIdeaInput';
import Loading from './Loading';
import DetailedView from './DetailedView';
import FrameworkList from './FrameworkList';


interface Metadata {
  identifier: string;
  caName: string;
  es_ContentType: string;
  keywords: string;
  programmePeriod: string;
  esDA_IngestDate: string;
  type: string;
  title: string;
  esST_URL: string;
  esDA_QueueDate: string;
  esST_FileName: string;
  callIdentifier: string;
  frameworkProgramme: string;
  startDate: string;
  deadlineDate: string;
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
  { id: "43254019", name: "European Social Fund + (ESF)", keywords: "Employment, Social Inclusion, Education" },
  { id: "43298664", name: "Promotion of Agricultural Products (AGRIP)", keywords: "Agriculture, Farming, Production, Sustainability, Agri-tech" },
  { id: "43251814", name: "Creative Europe Programme (CREA)", keywords: "Culture, Arts, Media, Audiovisual" },
  { id: "43251842", name: "Union Anti-fraud Programme (EUAF)", keywords: "Anti-fraud, Security, Integrity, Governance" },
  { id: "43252368", name: "Internal Security Fund (ISF)", keywords: "Security, Law Enforcement, Border Control" },
  { id: "43298203", name: "Union Civil Protection Mechanism (UCPM)", keywords: "Civil Protection, Disaster Response, Emergency Management" },
  { id: "43252517", name: "Social Prerogative and Specific Competencies Lines (SOCPL)", keywords: "Social Rights, Competencies, Governance" },
  { id: "43251447", name: "Asylum, Migration and Integration Fund (AMIF)", keywords: "Asylum, Migration, Integration, Refugees" },
  { id: "43251530", name: "Border Management and Visa Policy Instrument (BMVI)", keywords: "Borders, Visa Policy, Immigration, Security" },
  { id: "43251882", name: "Support for information measures relating to the common agricultural policy (IMCAP)", keywords: "Agriculture, Information, Policy, Farming" },
  { id: "44773133", name: "Information Measures for the EU Cohesion policy (IMREG)", keywords: "EU Cohesion, Information, Regional Development" },
  { id: "45876777", name: "Neighbourhood, Development and International Cooperation Instrument Global Europe (NDICI)", keywords: "Neighbourhood, Development, International Cooperation, Global Relations" }
];

const App: React.FC<AppProps> = ({ inputString }) => {
  const [tenderData, setTenderData] = useState<DetailedData[]>([]);
  const [tenderDataOpenAI, setTenderDataOpenAI] = useState<DetailedData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingOpenAI, setIsLoadingOpenAI] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<DetailedData | null>(null);
  const [inputValue, setInputValue] = useState<string>(inputString);
  const [fetchLocalData, setFetchLocalData] = useState(true);
  const [fetchOpenAIData, setFetchOpenAIData] = useState(true);
  const [bigModel, setBigModel] = useState(false);


  const handleItemClick = (item: DetailedData) => {
    setSelectedItem(item);
  };


  const handleCloseClick = () => {
    setSelectedItem(null);
  };


  const groupByFramework = (tenders: DetailedData[]): Record<string, DetailedData[]> => {
    return tenders.reduce((acc, tender) => {
      const match = tender.metadata.frameworkProgramme.match(/\d+/);
      let frameworkId = match ? match[0] : tender.metadata.frameworkProgramme;

      // Check if frameworkId is a string and looks like "{43108390}"
      if (typeof frameworkId === 'string' && frameworkId.startsWith('{') && frameworkId.endsWith('}')) {
        frameworkId = frameworkId.slice(1, -1);  // Remove the curly braces
      }

      if (!acc[frameworkId]) {
        acc[frameworkId] = [];
      }
      acc[frameworkId].push(tender);
      return acc;
    }, {} as Record<string, DetailedData[]>);
  };

  const fetchTenders = async () => {
    if (inputValue.length == 0) { 
      alert("No input")
      return
    }
    if (fetchLocalData) {
      await fetchTendersLocal();
    }

    if (fetchOpenAIData) {
      await fetchTendersOpenAI();
    }
  }

  const fetchTendersLocal = async () => {
    setIsLoading(true);
    try {
      let domain: string = "http://localhost:5001/api/fundingTenders/searchTenders"
      const response = await axios.post(`${domain}`, { researchIdea: inputValue, model: "Local", useFalcon: bigModel});
      setTenderData(response.data.results);
      if (response.data.results.length === 0) alert("No Results Found (Local) :(")
    } catch (error) {
      console.error('Error fetching tenders:', error);
    }
    setIsLoading(false);
  };


  const fetchTendersOpenAI = async () => {
    setIsLoadingOpenAI(true);
    try {
      const response = await axios.post(`http://localhost:5001/api/fundingTenders/searchTenders`, { researchIdea: inputValue, model: "GPT", useFalcon: false });
      setTenderDataOpenAI(response.data.results);
      if (response.data.results.length === 0) alert("No Results Found (GPT) :(")
    } catch (error) {
      console.error('Error fetching tenders:', error);
    }
    setIsLoadingOpenAI(false);
  };


  const groupedTenders = groupByFramework(tenderData);
  const groupedTendersOpenAI = groupByFramework(tenderDataOpenAI);

  return (
    <>
      <Header />
      <ResearchIdeaInput inputValue={inputValue} onInputChange={setInputValue} onSearch={fetchTenders} />
      <div className="app-container">
      {/* Local Tenders Column */}
      <div className="column">
        <div>Local LLM</div>
        <label>
          Fetch With Local LLM
          <input type="checkbox" checked={fetchLocalData} onChange={() => setFetchLocalData(!fetchLocalData)} />
          
        </label>
        <label>
          Use Falcon?
          <input type="checkbox" checked={bigModel} onChange={() => setBigModel(!bigModel)} />
        </label>
        {isLoading ? (
          <Loading />
        ) : (
          <>
            {selectedItem ? (
              <DetailedView selectedItem={selectedItem} onClose={handleCloseClick} />
            ) : (
              <FrameworkList groupedTenders={groupedTenders} frameworks={frameworks} onItemSelect={handleItemClick} />
            )}
          </>
        )}
      </div>

      {/* OpenAI Tenders Column */}
      <div className="column">
      <div>OpenAI</div>
      <label>
          Fetch With OpenAI
          <input type="checkbox" checked={fetchOpenAIData} onChange={() => setFetchOpenAIData(!fetchOpenAIData)} />
        </label>
        
        {isLoadingOpenAI ? (
          <Loading />
        ) : (
          <>
            {selectedItem ? (
              <DetailedView selectedItem={selectedItem} onClose={handleCloseClick} />
            ) : (
              <FrameworkList groupedTenders={groupedTendersOpenAI} frameworks={frameworks} onItemSelect={handleItemClick} />
            )}
          </>
        )}
      </div>
      </div>
    </>
  );
};

export default App;
