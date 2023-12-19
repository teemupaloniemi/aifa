import { Request, Response } from 'express';
import { searchFromDatabase } from '../utils/searchDatabase';
import { translateText } from '../utils/translate';
import { getKeywords } from '../utils/keywordsLocal';
import { getKeywordsOpenAI } from '../utils/keywords';
import { selectFramework } from '../utils/selectFrameworkLocal';
import { selectFrameworkOpenAI } from '../utils/selectFramework';
import { analyse } from '../utils/analyse';
import dotenv from 'dotenv';

dotenv.config();

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

class FundingController {
  static async searchTenders(req: Request, res: Response): Promise<void> {
    
    let researchIdea = req.body.researchIdea as string;
    let model = req.body.model as string
    let useFalcon = req.body.useFalcon as boolean
    if (model == "GPT") { 
      console.log("\x1B[32m=============== Model GPT ===================\x1B[0m")
    } else { 
      console.log("\x1B[33m=============== Model Local ===================\x1B[0m")
    }

    console.log("\nModel selected: ", model)
    console.log("Using Falcon: ", useFalcon, "\n")
    
    try {
      console.log('searchTenders: Preparing query data');

      // NOT USED NOW
      const translatedResearchIdea = researchIdea; //await translateText(researchIdea); 
      // LOCAL
      let fittingFrameworks: string[] = []
      if (model == "Local") { fittingFrameworks = await selectFramework(translatedResearchIdea, frameworks, useFalcon); }
      if (model == "GPT") { fittingFrameworks = await selectFrameworkOpenAI(translatedResearchIdea, frameworks); }
      // DB
      const allItems = await searchFromDatabase(fittingFrameworks);
      // LOCAL
      let keywords: string = ""
      if (model == "Local") { keywords = await getKeywords(translatedResearchIdea, useFalcon); }
      if (model == "GPT") { keywords = await getKeywordsOpenAI(translatedResearchIdea); }
      // LOCAL
      
      const analysed_results = await analyse(allItems, keywords);
      
      console.log("Ready, sending results back!");
      if (model == "GPT") { 
        console.log("\x1B[32m=============== End GPT ===================\x1B[0m")
      } else { 
        console.log("\x1B[33m=============== End Local ===================\x1B[0m")
      }

      res.json({ results: analysed_results });

    } catch (error) {
      console.log('searchTenders: Error occurred', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}

export { FundingController };