import React from 'react';

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

interface Props {
  item: DetailedData;
  onSelect: (item: DetailedData) => void;
}

const OpportunityItem: React.FC<Props> = ({ item, onSelect }) => (
  <li
    className='border-2 m-2 py-2 px-4 border-primary-500 rounded-md sm:hover:bg-primary-100 sm:hover:shadow-lg'
    onClick={() => onSelect(item)}
  >
    <p>{item.content} <b>{Math.round(item.score)}%</b></p>
  </li>
);

export default OpportunityItem;
