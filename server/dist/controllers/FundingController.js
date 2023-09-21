"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FundingController = void 0;
const searchDatabase_1 = require("../utils/searchDatabase");
const translate_1 = require("../utils/translate");
const keywords_1 = require("../utils/keywords");
const selectFramework_1 = require("../utils/selectFramework");
const analyse_1 = require("../utils/analyse");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const frameworks = [
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
    static async searchTenders(req, res) {
        let researchIdea = req.body.researchIdea;
        try {
            console.log('searchTenders: Preparing query data');
            // AI
            const translatedResearchIdea = await (0, translate_1.translateText)(researchIdea);
            // AI
            const fittingFrameworks = await (0, selectFramework_1.selectFramework)(translatedResearchIdea, frameworks);
            // DB
            const allItems = await (0, searchDatabase_1.searchFromDatabase)(fittingFrameworks);
            // AI
            const keywords = await (0, keywords_1.getKeywords)(translatedResearchIdea);
            // LOCAL
            const analysed_results = await (0, analyse_1.analyse)(allItems, keywords);
            console.log("Ready, sending results back!");
            res.json({ results: analysed_results });
        }
        catch (error) {
            console.log('searchTenders: Error occurred', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}
exports.FundingController = FundingController;
