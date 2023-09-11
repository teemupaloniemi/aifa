import React, { useState } from 'react';
import logo from '../images/aifalogo.png';

interface Props {
    handleSubmit: (data: string) => void;
}

const App: React.FC<Props> = ({ handleSubmit }) => {

    // State to manage the input text
    const [inputString, setInputString] = useState('');

    // Handle the input change
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setInputString(event.target.value);
    };

    return (
        <div className='p-4'>
            <div className="text-lg text-center">
                <span className="flex justify-center items-center">
                    <img src={logo} alt="AIPA Logo" style={{ width: "3em", height: '3em' }} />
                </span>
                Artificial Intelligence Funding Assistant
            </div>
            <div className="flex flex-col m-4">
                <textarea
                    value={inputString}
                    onChange={handleInputChange}
                    placeholder="Enter text here..."
                    className="border-2 w-full border-primary-500 rounded-md h-80 p-2"
                ></textarea>
                <button
                    onClick={() => handleSubmit(inputString)}
                    className="border-2 border-primary-500 rounded-md p-4 m-4 sm:hover:shadow-lg sm:hover:bg-primary-100"
                >
                    Submit
                </button>
            </div>
        </div>
    );
};

export default App;
