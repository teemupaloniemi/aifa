import React, { useState } from 'react';
import OpportunityItem from './OpportunityItem';

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

interface Framework {
    id: string;
    name: string;
    keywords?: string;
}

interface Props {
    framework: Framework;
    tenders: DetailedData[];
    onItemSelect: (item: DetailedData) => void;
}

const FrameworkItem: React.FC<Props> = ({ framework, tenders, onItemSelect }) => {

    const [isExpanded, setIsExpanded] = useState<boolean>(false);

    if (!framework) return null;

    const toggleExpansion = () => {
        setIsExpanded(!isExpanded);
    }

    const displayedTenders = isExpanded ? tenders : tenders.sort((a, b) => b.score - a.score).slice(0, 5);

    return (
        <div key={framework.id} className="my-4 border-b-2">
            <h2 className=" mb-2">
                {framework && (framework.name ? framework.name : "No name found")} - {framework.keywords}
            </h2>
            <ul>
                {displayedTenders.sort((a, b) => b.score - a.score).map((item, index) => (
                    <OpportunityItem
                        key={index}
                        item={item}
                        onSelect={onItemSelect}
                    />
                ))}
            </ul>
            <button className="md:hover:underline mb-4" onClick={toggleExpansion}>
                {isExpanded ? "Show Less" : "Show More"}
            </button>
        </div>
    );
};

export default FrameworkItem;
