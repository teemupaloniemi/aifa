import React, { useState } from 'react';
import './App.css';
import TestScrape from "./components/TestScrape";
import TFCall from "./components/TFCall";

function App() {
  // State to manage the input text
  const [inputString, setInputString] = useState('');

  // State to manage the display of the scrape view
  const [showScrapeView, setShowScrapeView] = useState(false);

  // Handle the input change
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInputString(event.target.value);
  };

  // Handle the submit button click
  const handleSubmit = () => {
    setShowScrapeView(true);
  };

  return (
    <div className="App">
      {!showScrapeView ? (
        <div className='border-2 border-black rounded-md p-4'>
          <textarea
            value={inputString}
            onChange={handleInputChange}
            placeholder="Enter text here..."
            className="border-2 border-black rounded-md w-3/4 h-80 p-2"
          ></textarea>
          <button
            onClick={handleSubmit}
            className="border-2 border-black rounded-md p-4 ml-4"
          >
            Submit
          </button>
        </div>
      ) : (
        <TestScrape inputString={inputString} />
      )}
    </div>
  );
}

export default App;
