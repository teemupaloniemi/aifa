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
    selectedItem: DetailedData;
    onClose: () => void;
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


const DetailedView: React.FC<Props> = ({ selectedItem, onClose }) => (
    <div className='flex flex-col items-start border-2 m-2 py-2 px-4 border-primary-500 rounded-md'>
        <button className='border-2 my-4 py-2 px-4 border-primary-500 rounded-md sm:hover:shadow-lg sm:hover:bg-primary-100' onClick={onClose}>Close</button>
        <div className="text-xl mb-4">{selectedItem.metadata.title} --- <strong>Score: {Math.round(selectedItem.score)}</strong></div>
        <div>
            <p><strong>Description:</strong></p>
            <textarea readOnly className="w-full h-96 p-4 border-2 rounded-md border-primary-500">{selectedItem.scrapedContent}</textarea>
            <p><a href={`https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/opportunities/topic-details/${selectedItem.metadata.identifier.toLowerCase()}`} className="pl-4 md:hover:underline text-primary-500">https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/opportunities/topic-details/{selectedItem.metadata.identifier.toLowerCase()}</a></p>
        </div>
        <div>
            <p><strong>Deadline:</strong></p>
            <p>{formatDateToYearMonth(selectedItem.metadata.deadlineDate)}</p>
        </div>
    </div>
);

export default DetailedView;
