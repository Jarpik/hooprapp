import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BasketballLogo from '../components/basketballlogo';
import AuthModal from '../components/authmodal';
import UserStats from '../components/userstats';
import AutocompleteInput from '../games/statle-nba/autocompleteinput';
import PlayerHeadshot from '../games/statle-nba/playerheadshot';
import ProgressVisualization from '../games/statle-nba/progressvisualization';
import ConfettiAnimation from '../games/statle-nba/confettianimation';
import '../styles/app.css';

const StatleNBAPage = () => {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState('playing');
  const [guessCount, setGuessCount] = useState(0);
  const [hintsRevealed, setHintsRevealed] = useState(0);
  const [targetPlayer, setTargetPlayer] = useState(null);
  const [guesses, setGuesses] = useState([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState(null);
  const [gameId, setGameId] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiIntensity, setConfettiIntensity] = useState(0.5);
  const [allPlayers, setAllPlayers] = useState([]);
  const [currentHints, setCurrentHints] = useState([]);

  // API base URL
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://hooprapp-api.onrender.com';

  useEffect(() => {
    fetchTargetPlayer();
    fetchAllPlayers();
    
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const fetchTargetPlayer = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/target-player`);
      const data = await response.json();
      setTargetPlayer(data);
      setGameId(data.gameId);
    } catch (error) {
      console.error('Error fetching target player:', error);
    }
  };

  const fetchAllPlayers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/players`);
      const data = await response.json();
      setAllPlayers(data);
    } catch (error) {
      console.error('Error fetching players:', error);
    }
  };

  const handleGuess = async (playerName) => {
    if (gameState !== 'playing') return;

    const newGuessCount = guessCount + 1;
    setGuessCount(newGuessCount);

    const guessedPlayer = allPlayers.find(p => p.name === playerName);
    if (guessedPlayer) {
      setGuesses(prev => [...prev, guessedPlayer]);
    }

    if (playerName === targetPlayer?.name) {
      setGameState('won');
      const score = Math.max(0, 100 - (newGuessCount - 1) * 20);
      
      // Set confetti intensity based on score
      if (score >= 80) setConfettiIntensity(1.0);
      else if (score >= 60) setConfettiIntensity(0.8);
      else if (score >= 40) setConfettiIntensity(0.6);
      else setConfettiIntensity(0.4);
      
      setShowConfetti(true);
      
      // Submit game result if user is logged in
      if (user && gameId) {
        try {
          await fetch(`${API_BASE_URL}/api/game-result`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: user.id,
              gameId: gameId,
              won: true,
              guessCount: newGuessCount,
              hintsUsed: hintsRevealed,
              score: score,
              targetPlayerId: targetPlayer.id
            }),
          });
        } catch (error) {
          console.error('Error submitting game result:', error);
        }
      }
    } else if (newGuessCount >= 5) {
      setGameState('lost');
      
      // Submit game result if user is logged in
      if (user && gameId) {
        try {
          await fetch(`${API_BASE_URL}/api/game-result`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: user.id,
              gameId: gameId,
              won: false,
              guessCount: newGuessCount,
              hintsUsed: hintsRevealed,
              score: 0,
              targetPlayerId: targetPlayer.id
            }),
          });
        } catch (error) {
          console.error('Error submitting game result:', error);
        }
      }
    }
  };

  const handleHintRequest = () => {
    if (hintsRevealed < 5 && gameState === 'playing') {
      setHintsRevealed(prev => prev + 1);
    }
  };

  const handleNewGame = () => {
    setGameState('playing');
    setGuessCount(0);
    setHintsRevealed(0);
    setGuesses([]);
    setShowConfetti(false);
    setCurrentHints([]);
    fetchTargetPlayer();
  };

  const handleTitleClick = () => {
    navigate('/');
  };

  const handleLogin = async (username, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        setShowAuthModal(false);
        return { success: true };
      } else {
        const error = await response.json();
        return { success: false, error: error.message };
      }
    } catch (error) {
      return { success: false, error: 'Connection error' };
    }
  };

  const handleRegister = async (username, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        setShowAuthModal(false);
        return { success: true };
      } else {
        const error = await response.json();
        return { success: false, error: error.message };
      }
    } catch (error) {
      return { success: false, error: 'Connection error' };
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Generate hints based on target player and current hint count
  useEffect(() => {
    if (targetPlayer && hintsRevealed > 0) {
      const hints = [];
      
      if (hintsRevealed >= 1) {
        hints.push(`Position: ${targetPlayer.position}`);
      }
      if (hintsRevealed >= 2) {
        hints.push(`Team: ${targetPlayer.team}`);
      }
      if (hintsRevealed >= 3) {
        hints.push(`Points Per Game: ${targetPlayer.ppg}`);
      }
      if (hintsRevealed >= 4) {
        hints.push(`Rebounds Per Game: ${targetPlayer.rpg}`);
      }
      if (hintsRevealed >= 5) {
        hints.push(`Assists Per Game: ${targetPlayer.apg}`);
      }
      
      setCurrentHints(hints);
    } else {
      setCurrentHints([]);
    }
  }, [targetPlayer, hintsRevealed]);

  if (!targetPlayer) {
    return (
      <div className="game-page">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="game-page">
      {showConfetti && (
        <ConfettiAnimation 
          intensity={confettiIntensity}
          onComplete={() => setShowConfetti(false)}
        />
      )}
      
      <div className="game-container">
        <div className="game-header">
          <BasketballLogo />
          <h1 className="game-title" onClick={handleTitleClick} style={{ cursor: 'pointer' }}>
            StatleNBA
          </h1>
          <div className="auth-section">
            {user ? (
              <div className="user-info">
                <UserStats user={user} />
                <button onClick={handleLogout} className="logout-button">
                  Logout
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setShowAuthModal(true)}
                className="login-button"
              >
                Login / Register
              </button>
            )}
          </div>
        </div>

        <div className="game-content">
          <ProgressVisualization 
            guessCount={guessCount}
            hintsRevealed={hintsRevealed}
          />

          <div className="game-area">
            {gameState === 'playing' && (
              <div className="playing-state">
                <div className="hints-section">
                  <div className="hints-header">
                    <h3>Hints</h3>
                    {hintsRevealed < 5 && (
                      <button 
                        onClick={handleHintRequest}
                        className="hint-button"
                        disabled={gameState !== 'playing'}
                      >
                        Get Hint ({hintsRevealed + 1}/5)
                      </button>
                    )}
                  </div>
                  
                  <div className="hints-list">
                    {currentHints.map((hint, index) => (
                      <div key={index} className="hint-item">
                        {hint}
                      </div>
                    ))}
                  </div>

                  <div className="input-section">
                    <AutocompleteInput
                      players={allPlayers}
                      onGuess={handleGuess}
                      disabled={gameState !== 'playing'}
                      placeholder="Enter player name..."
                    />
                  </div>
                </div>

                <div className="guesses-section">
                  <h3>Your Guesses ({guessCount}/5)</h3>
                  <div className="guesses-list">
                    {guesses.map((guess, index) => (
                      <div key={index} className="guess-item">
                        <PlayerHeadshot player={guess} />
                        <span className="guess-name">{guess.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {gameState === 'won' && (
              <div className="game-result won">
                <h2>🎉 Congratulations! 🎉</h2>
                <PlayerHeadshot player={targetPlayer} />
                <p>You guessed <strong>{targetPlayer.name}</strong> correctly!</p>
                <p>Score: {Math.max(0, 100 - (guessCount - 1) * 20)} points</p>
                <p>Guesses used: {guessCount}/5</p>
                <p>Hints used: {hintsRevealed}/5</p>
                <button onClick={handleNewGame} className="new-game-button">
                  Play Again
                </button>
              </div>
            )}

            {gameState === 'lost' && (
              <div className="game-result lost">
                <h2>😞 Game Over</h2>
                <PlayerHeadshot player={targetPlayer} />
                <p>The correct answer was <strong>{targetPlayer.name}</strong></p>
                <p>Better luck next time!</p>
                <button onClick={handleNewGame} className="new-game-button">
                  Try Again
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onLogin={handleLogin}
          onRegister={handleRegister}
        />
      )}
    </div>
  );
};

export default StatleNBAPage;
