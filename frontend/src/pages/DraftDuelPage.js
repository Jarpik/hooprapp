import React from 'react';
import { useNavigate } from 'react-router-dom';
import BasketballLogo from '../components/basketballlogo.js';
import DraftDuelMain from '../games/draft-duel/DraftDuelMain.js';
import './../styles/app.css';

const DraftDuelPage = () => {
  const navigate = useNavigate();

  const handleTitleClick = () => {
    navigate('/');
  };

  return (
    <div className="App">
      <div className="App-header draft-duel-app-header">
        <div className="header-top">
          <div className="title-section">
            <h1>
              <BasketballLogo size="large" />
              <span onClick={handleTitleClick} style={{ cursor: 'pointer' }}>
                Draft Duel
              </span>
            </h1>
            <p className="subtitle">Test your NBA rookie knowledge!</p>
          </div>
        </div>
        <div className="game-content draft-duel-game-content">
          <DraftDuelMain />
        </div>
      </div>
      
      <style jsx>{`
        .draft-duel-app-header {
          max-width: 1400px;
          padding: 2rem;
          background: rgba(15, 23, 42, 0.7);
        }
        
        .draft-duel-game-content {
          margin-top: 2rem;
        }
        
        /* Override App-header constraints for Draft Duel */
        .draft-duel-app-header .game-content {
          max-width: none;
          width: 100%;
        }
        
        @media (max-width: 768px) {
          .draft-duel-app-header {
            padding: 1rem;
          }
          
          .draft-duel-game-content {
            margin-top: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default DraftDuelPage;
