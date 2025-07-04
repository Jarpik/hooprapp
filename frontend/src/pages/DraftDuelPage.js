import React from 'react';
import { useNavigate } from 'react-router-dom';
import BasketballLogo from '../components/basketballlogo.js'; // Ensure this file exists in src/components/
import DraftDuelMain from '../games/draft-duel/DraftDuelMain.js'; // Ensure this file exists in src/games/draft-duel/
import './../styles/app.css'; // Adjusted CSS import path: Ensure this file exists in src/styles/

const DraftDuelPage = () => {
  const navigate = useNavigate();

  const handleTitleClick = () => {
    navigate('/');
  };

  return (
    <div className="App">
      <div className="App-header">
        <div className="header-top">
          <div className="title-section">
            <h1>
              <BasketballLogo size="large" />
              <span onClick={handleTitleClick} style={{ cursor: 'pointer' }}>
                Draft Duel
              </span>
            </h1>
            <p className="subtitle">Guess the NBA Rookie!</p>
          </div>
        </div>
        <div className="game-content">
          <DraftDuelMain />
        </div>
      </div>
    </div>
  );
};

export default DraftDuelPage;
