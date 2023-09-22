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

function formatDateToYearMonth(dateString: string): string {
  const date = new Date(dateString);
  const currentDate = new Date();
  const year = date.getFullYear();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const month = monthNames[date.getMonth()];
  const day = date.getDate();

  // Calculate months left
  let monthsLeft = (date.getFullYear() - currentDate.getFullYear()) * 12 + date.getMonth() - currentDate.getMonth();
  if (currentDate.getDate() > day) monthsLeft--;  // Adjust if the day of the month has passed

  const monthsLeftText = monthsLeft > 0 ? ` (${monthsLeft} month${monthsLeft > 1 ? 's' : ''} left)` : monthsLeft < 0 ? ` (${Math.abs(monthsLeft)} month${Math.abs(monthsLeft) > 1 ? 's' : ''} ago)` : '';

  return `${year} ${month} ${day}${monthsLeftText}`;
}


const OpportunityItem: React.FC<Props> = ({ item, onSelect }) => (
  <li
    className={item.score > 70 ? 'border-2 m-2 py-2 px-4 rounded-md sm:hover:bg-primary-100 sm:hover:shadow-lg border-primary-600' : 'border-2 m-2 py-2 px-4 border-primary-500 rounded-md sm:hover:bg-primary-100 sm:hover:shadow-lg'}
    onClick={() => onSelect(item)}
  >
    <p>
      {item.content} 
      <b>
        {" "+Math.round(item.score)}%{" "}
      </b> 
      -- {formatDateToYearMonth(item.metadata.deadlineDate)}
    </p>
  </li>
);


export default OpportunityItem;
