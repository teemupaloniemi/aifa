import React from 'react';

interface Props {
  inputValue: string;
  onInputChange: (value: string) => void;
  onSearch: () => void;
}

const ResearchIdeaInput: React.FC<Props> = ({ inputValue, onInputChange, onSearch }) => (
  <div className="mb-4 pb-4 border-b-2">
    <div className="mb-4">
      <label htmlFor="inputString" className="block text-sm font-medium text-gray-700">Your Research or Development Idea</label>
      <textarea
        id="inputString"
        name="inputString"
        value={inputValue}
        onChange={(e) => onInputChange(e.target.value)}
        className="w-full h-40 p-4 border-2 border-primary-500 rounded-md"
      />
    </div>
    <div className="flex justify-center">
      <button className='border-2 py-2 px-4 border-primary-500 rounded-md sm:hover:shadow-lg sm:hover:bg-primary-100' onClick={onSearch}>Search Funding Opportunities</button>
    </div>
  </div>
);

export default ResearchIdeaInput;
