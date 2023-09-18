import React from 'react';
import logo from '../images/aifalogo.png';

const Header: React.FC = () => (
  <div className="text-lg text-center mb-8">
    <span className="flex justify-center items-center">
      <img src={logo} alt="AIPA Logo" style={{ width: "4em", height: '4em' }} />
    </span>
    Artificial Intelligence Funding Assistant
  </div>
);

export default Header;
