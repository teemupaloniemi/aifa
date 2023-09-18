import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header';
import ResearchIdeaInput from './ResearchIdeaInput';
import Loading from './Loading';
import DetailedView from './DetailedView';
import FrameworkList from './FrameworkList';


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
  deadlineDate: string[];
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
    setSelectedItem(item); 
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
      if (response.data.results.length === 0) alert("No Results Found :(")
    } catch (error) {
      console.error('Error fetching tenders:', error);
    }
    setIsLoading(false);
  };


  const groupedTenders = groupByFramework(tenderData);

  
  return (
    <div>
      <Header />
      <ResearchIdeaInput inputValue={inputValue} onInputChange={setInputValue} onSearch={fetchTenders} />
      {isLoading ? (
        <Loading/>
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
  );
};

export default App;
