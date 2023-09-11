import React, { useState } from 'react';
import './App.css';
import TestScrape from "./components/ResultsView";
import ProfileView from './components/ProfileView'

function App() {

  // State to manage the display of the scrape view
  const [showScrapeView, setShowScrapeView] = useState(false);
  // State to manage the input text
  const [inputString, setInputString] = useState('');
  // Handle the submit button click
  const handleSubmit = (data: string) => {
    setInputString(data);
    setShowScrapeView(true);
  };

  return (
    <div className="lg:mx-80 md:mx-40 my-10">
      {!showScrapeView ? (
          <ProfileView handleSubmit={handleSubmit}/>
      ): (
          <TestScrape inputString={inputString}/>
      )}
    </div>
  );
}

export default App;
