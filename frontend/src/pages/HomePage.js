import React from 'react';
import { useNavigate } from 'react-router-dom';
import BasketballLogo from '../components/basketballlogo.js'; // Added .js extension for explicit resolution
import './HomePage.css'; // Adjusted path to match your current code and explicit relative path

const HomePage = () => {
  const navigate = useNavigate();

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
              {/* Existing StatleNBA Game Card */}
              <div className="game-card">
                <h3 className="game-title">StatleNBA</h3>
                <p className="game-description">
                  Guess the NBA player based on their career statistics.
                  You have 5 guesses and hints to help you along the way.
                </p>
                <button
                  className="play-button"
                  onClick={() => navigate('/StatleNBA')}
                >
                  Play StatleNBA
                </button>
              </div>

              {/* New Draft Duel Game Card - replaces "Coming Soon" */}
              <div className="game-card">
                <h3 className="game-title">Draft Duel</h3>
                <p className="game-description">
                  Compare NBA rookies and test your draft knowledge in a head-to-head challenge!
                </p>
                <button
                  className="play-button"
                  onClick={() => navigate('/DraftDuel')}
                >
                  Play Draft Duel
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
