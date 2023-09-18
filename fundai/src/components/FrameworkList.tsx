import React from 'react';
import FrameworkItem from './FrameworkItem';

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

interface Framework {
  id: string;
  name: string;
  keywords?: string;
}

interface DetailedData {
    metadata: Metadata;
    scrapedContent: string;
    title: string;
    language: string;
    content: string;
    score: number;
}

interface Props {
    groupedTenders: Record<string, DetailedData[]>;
    frameworks: Framework[];
    onItemSelect: (item: DetailedData) => void;
}

const FrameworkList: React.FC<Props> = ({ groupedTenders, frameworks, onItemSelect }) => {

    const maxScoreOfGroup = (tenders: DetailedData[]): number => {
        return Math.max(...tenders.map(tender => tender.score));
    };

    return (<>
        {Object.keys(groupedTenders)
            .sort((a, b) => maxScoreOfGroup(groupedTenders[b]) - maxScoreOfGroup(groupedTenders[a])) // This sorts the frameworks by max score in descending order
            .map((frameworkId: string) => {
                const framework = frameworks.find((f) => f.id === frameworkId);
                return (
                    <FrameworkItem
                        key={frameworkId}
                        framework={framework as Framework}
                        tenders={groupedTenders[frameworkId]}
                        onItemSelect={onItemSelect}
                    />
                );
            })}
    </>)
};

export default FrameworkList;
