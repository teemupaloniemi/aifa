/**
 * 
 * ScrapeHeaders
 * 
 * This component is used to fetch information of the company based on user-given links.
 * Url is validated and passed to the fetching engine. After that the result is passed back to the userProfileView to handle.
 * 
 */
import React, { useState } from 'react';
import axios from 'axios';


const Scrape: React.FC = () => {
  const [url, setUrl] = useState<string>('');
  const [scrapeResultContent, setScrapeResult] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const isValidHttpsUrl = (string: string): boolean => {
    let url;

    try {
      url = new URL(string);
    } catch (_) {
      return false;
    }

    return url.protocol === "https:";
  };

  const toggleMode = () => {
    setIsDarkMode(!isDarkMode);
    if (isDarkMode) {  // Note that `isDarkMode` hasn't updated yet; it will on the next render
      document.body.classList.remove('dark-mode');
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
      document.body.classList.add('dark-mode');
    }
  };

  const fetchparams = async (): Promise<void> => {
    if (!isValidHttpsUrl(url)) {
      alert("Please enter a valid HTTPS URL.");
      return;
    }

    try {
      setLoading(true);
      console.log(url);
      const response = await axios.post<{ scrapeResult: string }>(`http://localhost:5000/api/scrape/`, { url: url });
      const scrapeResult = response.data.scrapeResult;
      setScrapeResult(scrapeResult);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  const modeClass = isDarkMode ? 'dark-mode' : 'light-mode';

  return (
    <div className={`App ${modeClass}`}>
      <button className="modeButton" onClick={toggleMode}>Change Color Mode</button>
      <div>
        <input className={`linkInputField ${modeClass}`} type="text" value={url} onChange={e => setUrl(e.target.value)} placeholder="Enter URL" />
        <button className={`linkInputFieldButton ${modeClass}`} onClick={fetchparams}>Fetch</button>
      </div>
      {loading ?
        <div>loading...</div>
        : (scrapeResultContent) ?
            <div className="resultContainer">
              <textarea
                className={`content ${modeClass}`}
                readOnly
                value={scrapeResultContent}
              />
            </div> :  <div></div>
      }
    </div>
  );
}

export default Scrape;