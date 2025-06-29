import React, { useState, useEffect } from 'react';
import './App.css';
import AutocompleteInput from './AutocompleteInput';
import AuthModal from './AuthModal';
import UserStats from './UserStats';

function App() {
  const [dailyPlayer, setDailyPlayer] = useState(null);
  const [guesses, setGuesses] = useState([]);
  const [gameWon, setGameWon] = useState(false);
  const [hintsRevealed, setHintsRevealed] = useState(0);
  const [gameStats, setGameStats] = useState(null);
  const [shareText, setShareText] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  
  // User authentication states
  const [user, setUser] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Fetch daily player from backend
  useEffect(() => {
    fetch('http://localhost:3001/api/daily-player')
      .then(response => response.json())
      .then(data => {
        setDailyPlayer(data.player);
      })
      .catch(error => {
        console.error('Error fetching player:', error);
      });
  }, []);

  // Check for saved user in localStorage on app load
  useEffect(() => {
    const savedUser = localStorage.getItem('statlnba_user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      // Fetch fresh user stats
      fetchUserStats(userData.email);
    }
  }, []);

  const fetchUserStats = async (email) => {
    try {
      const response = await fetch(`http://localhost:3001/api/user/${email}/stats`);
      const data = await response.json();
      setUserStats(data.stats);
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  // Calculate score based on performance
  const calculateScore = (guessCount, hintsUsed) => {
    let score = 100;
    
    // Deduct points for each guess (first guess is free)
    if (guessCount > 1) {
      score -= (guessCount - 1) * 15;
    }
    
    // Deduct points for each hint used
    score -= hintsUsed * 10;
    
    // Ensure score doesn't go below 10
    score = Math.max(score, 10);
    
    return score;
  };

  // Get performance rating
  const getPerformanceRating = (score, guessCount) => {
    if (guessCount === 1 && score >= 100) return { text: "🎯 PERFECT!", color: "#10b981" };
    if (score >= 80) return { text: "🔥 AMAZING!", color: "#3b82f6" };
    if (score >= 60) return { text: "⭐ GREAT!", color: "#8b5cf6" };
    if (score >= 40) return { text: "👏 GOOD!", color: "#f59e0b" };
    return { text: "💪 NICE TRY!", color: "#ef4444" };
  };

  // Generate shareable result text
  const generateShareText = (guessCount, hintsUsed, score, playerName) => {
    // Calculate challenge number (days since epoch)
    const today = new Date();
    const startDate = new Date('2025-01-01'); // StatleNBA launch date
    const daysSinceStart = Math.floor((today - startDate) / (1000 * 60 * 60 * 24)) + 1;
    
    // Create visual representation
    let visual = '';
    
    // Add incorrect guesses (red squares)
    for (let i = 0; i < guessCount - 1; i++) {
      visual += '🟥';
    }
    
    // Add correct guess (green square)
    visual += '🟩';
    
    // Add hint indicators (yellow squares for hints used)
    if (hintsUsed > 0) {
      visual += ' ';
      for (let i = 0; i < hintsUsed; i++) {
        visual += '🟨';
      }
    }
    
    const shareText = `🏀 StatleNBA #${daysSinceStart}

${visual}

Score: ${score}/100
Guesses: ${guessCount}
Hints: ${hintsUsed}

Can you guess today's NBA player?
Play at: hooprapp.com`;

    return shareText;
  };

  // Copy to clipboard function
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = shareText;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  // Submit game result to backend (if user is logged in)
  const submitGameResult = async (finalScore, finalGuessCount, finalHintsUsed, won) => {
    if (!user) return;

    try {
      const response = await fetch('http://localhost:3001/api/submit-game', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          score: finalScore,
          guesses: finalGuessCount,
          hintsUsed: finalHintsUsed,
          won: won,
          date: new Date().toISOString().split('T')[0]
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setUserStats(data.stats);
        // Show streak badge if earned
        if (data.streakBadge) {
          console.log('Streak badge earned:', data.streakBadge);
        }
      }
    } catch (error) {
      console.error('Error submitting game result:', error);
    }
  };

  // Updated to handle autocomplete selections with score tracking
  const handlePlayerSelect = (playerName) => {
    if (!playerName.trim()) return;
    
    const newGuesses = [...guesses, playerName];
    setGuesses(newGuesses);
    
    if (playerName.toLowerCase() === dailyPlayer.name.toLowerCase()) {
      // Calculate final stats
      const finalGuessCount = newGuesses.length;
      const finalHintsUsed = hintsRevealed;
      const finalScore = calculateScore(finalGuessCount, finalHintsUsed);
      const rating = getPerformanceRating(finalScore, finalGuessCount);
      
      // Generate share text
      const share = generateShareText(finalGuessCount, finalHintsUsed, finalScore, dailyPlayer.name);
      setShareText(share);
      
      setGameStats({
        guessCount: finalGuessCount,
        hintsUsed: finalHintsUsed,
        score: finalScore,
        rating: rating,
        playerName: dailyPlayer.name
      });
      
      setGameWon(true);
      
      // Submit to backend if user is logged in
      submitGameResult(finalScore, finalGuessCount, finalHintsUsed, true);
    } else {
      setHintsRevealed(hintsRevealed + 1);
    }
  };

  // Handle user login
  const handleLogin = (userData, stats) => {
    setUser(userData);
    if (stats) {
      setUserStats(stats);
    }
    // Save to localStorage
    localStorage.setItem('statlnba_user', JSON.stringify(userData));
    setShowAuthModal(false);
  };

  // Handle user logout
  const handleLogout = () => {
    setUser(null);
    setUserStats(null);
    localStorage.removeItem('statlnba_user');
  };

  // Reset game function
  const resetGame = () => {
    setGuesses([]);
    setGameWon(false);
    setHintsRevealed(0);
    setGameStats(null);
    setShareText('');
    setCopySuccess(false);
    // Fetch a new daily player
    fetch('http://localhost:3001/api/daily-player')
      .then(response => response.json())
      .then(data => {
        setDailyPlayer(data.player);
      });
  };

  const getHints = () => {
    if (!dailyPlayer) return [];
    
    const allHints = [
      `Team: ${dailyPlayer.team}`,
      `Position: ${dailyPlayer.position}`,
      `Height: ${dailyPlayer.height}`,
      `Age: ${dailyPlayer.age}`,
      `Points Per Game: ${dailyPlayer.ppg}`,
      `Rebounds Per Game: ${dailyPlayer.rpg}`,
      `Assists Per Game: ${dailyPlayer.apg}`,
      `Championships: ${dailyPlayer.championships}`
    ];
    
    return allHints.slice(0, hintsRevealed);
  };

  if (!dailyPlayer) {
    return (
      <div className="App">
        <div className="App-header">
          <div className="loading">
            🏀 Loading today's player...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <div className="App-header">
        <div className="header-top">
          <div className="title-section">
            <h1>🏀 StatleNBA</h1>
            <p className="subtitle">Guess today's NBA player!</p>
          </div>
          <div className="auth-section">
            {user ? (
              <button onClick={handleLogout} className="logout-button">
                Logout
              </button>
            ) : (
              <button onClick={() => setShowAuthModal(true)} className="login-button">
                Login / Sign Up
              </button>
            )}
          </div>
        </div>

        {/* User Stats Display */}
        {user && userStats && (
          <UserStats 
            user={user} 
            stats={userStats} 
            onLogout={handleLogout}
          />
        )}
        
        {!gameWon ? (
          <div className="game-container">
            <div className="hints-section">
              <h3 className="hints-title">
                🔍 Hints
                {hintsRevealed > 0 && (
                  <span className="guess-counter">{hintsRevealed}/8</span>
                )}
              </h3>
              <div className="hints-grid">
                {getHints().map((hint, index) => (
                  <div key={index} className="hint-item">
                    {hint}
                  </div>
                ))}
              </div>
              {hintsRevealed === 0 && (
                <div className="no-hints">
                  Make your first guess to reveal hints about the mystery player!
                </div>
              )}
            </div>
            
            <div className="input-section">
              <div className="input-wrapper">
                <AutocompleteInput 
                  onPlayerSelect={handlePlayerSelect}
                  placeholder="Enter NBA player name..."
                />
              </div>
            </div>
            
            {guesses.length > 0 && (
              <div className="guesses-section">
                <h3 className="guesses-title">
                  ❌ Incorrect Guesses
                  <span className="guess-counter">{guesses.length}</span>
                </h3>
                {guesses.map((g, index) => (
                  <div key={index} className="guess-item">
                    {g}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="win-container">
            {/* Score Summary Section */}
            <div className="score-summary">
              <h2 className="win-title" style={{ color: gameStats.rating.color }}>
                {gameStats.rating.text}
              </h2>
              <p className="win-subtitle">
                You guessed <strong>{gameStats.playerName}</strong>!
              </p>
              
              <div className="score-stats">
                <div className="score-item">
                  <div className="score-number">{gameStats.score}</div>
                  <div className="score-label">Score</div>
                </div>
                <div className="score-item">
                  <div className="score-number">{gameStats.guessCount}</div>
                  <div className="score-label">Guess{gameStats.guessCount !== 1 ? 'es' : ''}</div>
                </div>
                <div className="score-item">
                  <div className="score-number">{gameStats.hintsUsed}</div>
                  <div className="score-label">Hint{gameStats.hintsUsed !== 1 ? 's' : ''}</div>
                </div>
              </div>
            </div>

            {/* Share Results Section */}
            <div className="share-section">
              <h3 className="share-title">📱 Share Your Result</h3>
              <div className="share-preview">
                <pre className="share-text">{shareText}</pre>
              </div>
              <button 
                onClick={copyToClipboard} 
                className={`copy-button ${copySuccess ? 'copied' : ''}`}
              >
                {copySuccess ? '✅ Copied!' : '📋 Copy Result'}
              </button>
            </div>

            {/* Player Stats Section */}
            <div className="win-stats">
              <h3 className="stats-title">📊 Player Stats</h3>
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-label">Team</div>
                  <div className="stat-value">{dailyPlayer.team}</div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">Position</div>
                  <div className="stat-value">{dailyPlayer.position}</div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">Height</div>
                  <div className="stat-value">{dailyPlayer.height}</div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">Age</div>
                  <div className="stat-value">{dailyPlayer.age}</div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">Points Per Game</div>
                  <div className="stat-value">{dailyPlayer.ppg}</div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">Rebounds Per Game</div>
                  <div className="stat-value">{dailyPlayer.rpg}</div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">Assists Per Game</div>
                  <div className="stat-value">{dailyPlayer.apg}</div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">Championships</div>
                  <div className="stat-value">{dailyPlayer.championships}</div>
                </div>
              </div>
            </div>

            {/* Play Again Button */}
            <button onClick={resetGame} className="play-again-button">
              🎯 Play Again
            </button>
          </div>
        )}

        {/* Auth Modal */}
        <AuthModal 
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onLogin={handleLogin}
        />
      </div>
    </div>
  );
}

export default App;