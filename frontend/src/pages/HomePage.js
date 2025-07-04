import React from 'react';
import { useNavigate } from 'react-router-dom';
import BasketballLogo from '../components/basketballlogo';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();

  const handlePlayStatleNBA = () => {
    navigate('/StatleNBA');
  };

  return (
    <div className="home-page">
      <div className="home-container">
        <div className="home-card">
          <div className="home-header">
            <BasketballLogo />
            <h1 className="home-title">HooprApp</h1>
            <p className="home-subtitle">NBA Games Collection</p>
          </div>
          
          <div className="home-content">
            <p className="home-description">
              Test your NBA knowledge with our collection of basketball games. 
              Challenge yourself with player statistics, team trivia, and more!
            </p>
            
            <div className="games-grid">
              <div className="game-card">
                <h3 className="game-title">StatleNBA</h3>
                <p className="game-description">
                  Guess the NBA player based on their career statistics. 
                  You have 5 guesses and hints to help you along the way.
                </p>
                <button 
                  className="play-button"
                  onClick={handlePlayStatleNBA}
                >
                  Play StatleNBA
                </button>
              </div>
              
              <div className="game-card coming-soon">
                <h3 className="game-title">Coming Soon</h3>
                <p className="game-description">
                  More exciting NBA games are on the way! 
                  Stay tuned for updates.
                </p>
                <button className="play-button disabled" disabled>
                  Coming Soon
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
