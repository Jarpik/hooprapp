import React, { useState, useEffect } from 'react';
import './App.css';
import AutocompleteInput from './AutocompleteInput';
import AuthModal from './AuthModal';
import UserStats from './UserStats';
import PlayerHeadshot from './PlayerHeadshot';
import ConfettiAnimation from './ConfettiAnimation';
import ProgressVisualization from './ProgressVisualization';
import BasketballLogo from './BasketballLogo'; // Basketball logo component

function App() {
  const [dailyPlayer, setDailyPlayer] = useState(null);
  const [guesses, setGuesses] = useState([]);
  const [gameWon, setGameWon] = useState(false);
  const [hintsRevealed, setHintsRevealed] = useState(1); // Start with 1 hint revealed
  const [gameStats, setGameStats] = useState(null);
  const [shareText, setShareText] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  
  // User authentication states
  const [user, setUser] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Fetch daily player from backend
  useEffect(() => {
    fetch('https://hooprapp.onrender.com/api/daily-player')
      .then(response => response.json())
      .then(data => {
        console.log('Daily player data:', data.player); // Debug log
        console.log('Daily player photo URL:', data.player.headshot_url); // Debug log
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
      const response = await fetch(`https://hooprapp.onrender.com/api/user/${email}/stats`);
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
    
    // Deduct points for each hint used (subtract 1 since first hint is free)
    const paidHints = Math.max(hintsUsed - 1, 0);
    score -= paidHints * 10;
    
    // Ensure score doesn't go below 10
    score = Math.max(score, 10);
    
    return score;
  };

  // NEW: Calculate current score preview for progress visualization
  const calculateCurrentScore = () => {
    if (gameWon) {
      return gameStats?.score || 0;
    }
    // Calculate preview score based on current state
    const currentGuessCount = guesses.length > 0 ? guesses.length + 1 : 1; // +1 for the guess they're about to make
    return calculateScore(currentGuessCount, hintsRevealed);
  };

  // NEW: Get maximum hints available for this player
  const getMaxHints = () => {
    if (!dailyPlayer) return 12;
    
    // Count all valid hints (same logic as getHints())
    const allPossibleHints = [
      hasValue(dailyPlayer.team) ? `Team: ${dailyPlayer.team}` : null,
      hasValue(dailyPlayer.position) ? `Position: ${dailyPlayer.position}` : null,
      hasValue(dailyPlayer.height) ? `Height: ${dailyPlayer.height}` : null,
      hasValue(dailyPlayer.age) ? `Age: ${dailyPlayer.age}` : null,
      hasValue(dailyPlayer.ppg) ? `Points Per Game: ${dailyPlayer.ppg}` : null,
      hasValue(dailyPlayer.rpg) ? `Rebounds Per Game: ${dailyPlayer.rpg}` : null,
      hasValue(dailyPlayer.apg) ? `Assists Per Game: ${dailyPlayer.apg}` : null,
      formatDraftYear(dailyPlayer.draft_year),
      hasValue(dailyPlayer.college) ? `College: ${dailyPlayer.college}` : null,
      hasValue(dailyPlayer.country) ? `Country: ${dailyPlayer.country}` : null,
      hasValue(dailyPlayer.weight) ? `Weight: ${dailyPlayer.weight} lbs` : null,
      hasValue(dailyPlayer.draft_round) ? `Draft Round: ${dailyPlayer.draft_round}` : null
    ];
    
    return allPossibleHints.filter(hint => hint !== null).length;
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
    
    // Add hint indicators (yellow squares for hints used, subtract 1 for free first hint)
    const paidHints = Math.max(hintsUsed - 1, 0);
    if (paidHints > 0) {
      visual += ' ';
      for (let i = 0; i < paidHints; i++) {
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
      const response = await fetch('https://hooprapp.onrender.com/api/submit-game', {
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
        playerName: dailyPlayer.name,
        playerPhotoUrl: dailyPlayer.headshot_url
      });
      
      setGameWon(true);
      setShowConfetti(true);
      
      // Submit to backend if user is logged in
      submitGameResult(finalScore, finalGuessCount, finalHintsUsed, true);
    } else {
      // Check if maximum guesses reached
      if (newGuesses.length >= 5) {
        // Game over - player failed
        setGameStats({
          guessCount: newGuesses.length,
          hintsUsed: hintsRevealed,
          score: 0,
          rating: { text: "💔 GAME OVER!", color: "#ef4444" },
          playerName: dailyPlayer.name,
          playerPhotoUrl: dailyPlayer.headshot_url
        });
        setGameWon(true); // Use same win state to show results
        
        // No confetti for game over (only for wins)
        
        // Submit failed game to backend if user is logged in
        submitGameResult(0, newGuesses.length, hintsRevealed, false);
      } else {
        setHintsRevealed(hintsRevealed + 1);
      }
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
    setHintsRevealed(1); // Reset to 1 to show first hint
    setGameStats(null);
    setShareText('');
    setCopySuccess(false);
    setShowConfetti(false);
    
    // Fetch a new daily player
    fetch('https://hooprapp.onrender.com/api/daily-player')
      .then(response => response.json())
      .then(data => {
        console.log('New daily player data:', data.player); // Debug log
        setDailyPlayer(data.player);
      });
  };

  // Helper function to check if a value exists and is not null/undefined/empty
  const hasValue = (value) => {
    return value !== null && value !== undefined && value !== '' && value !== 'null';
  };

  // Helper function to format draft year display
  const formatDraftYear = (draftYear) => {
    if (!hasValue(draftYear)) return null;
    return `Draft Year: ${draftYear}`;
  };

  const getHints = () => {
    if (!dailyPlayer) return [];
    
    // Define all possible hints with null checking
    const allPossibleHints = [
      hasValue(dailyPlayer.team) ? `Team: ${dailyPlayer.team}` : null,
      hasValue(dailyPlayer.position) ? `Position: ${dailyPlayer.position}` : null,
      hasValue(dailyPlayer.height) ? `Height: ${dailyPlayer.height}` : null,
      hasValue(dailyPlayer.age) ? `Age: ${dailyPlayer.age}` : null,
      hasValue(dailyPlayer.ppg) ? `Points Per Game: ${dailyPlayer.ppg}` : null,
      hasValue(dailyPlayer.rpg) ? `Rebounds Per Game: ${dailyPlayer.rpg}` : null,
      hasValue(dailyPlayer.apg) ? `Assists Per Game: ${dailyPlayer.apg}` : null,
      formatDraftYear(dailyPlayer.draft_year),
      hasValue(dailyPlayer.college) ? `College: ${dailyPlayer.college}` : null,
      hasValue(dailyPlayer.country) ? `Country: ${dailyPlayer.country}` : null,
      hasValue(dailyPlayer.weight) ? `Weight: ${dailyPlayer.weight} lbs` : null,
      hasValue(dailyPlayer.draft_round) ? `Draft Round: ${dailyPlayer.draft_round}` : null
    ];
    
    // Filter out null values to get only valid hints
    const validHints = allPossibleHints.filter(hint => hint !== null);
    
    // Return the number of hints that should be revealed
    return validHints.slice(0, hintsRevealed);
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
            <h1>
              <BasketballLogo 
                size="large" 
                className={`title-logo ${gameWon && gameStats?.score > 0 ? 'celebration' : ''}`}
              />
              StatleNBA
            </h1>
            <p className="subtitle">Guess today's NBA player from the 2024-2025 season!</p>
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
            {/* Progress Visualization Component */}
            <ProgressVisualization 
              guessCount={guesses.length}
              maxGuesses={5}
              hintsRevealed={hintsRevealed}
              maxHints={5}
              currentScore={calculateCurrentScore()}
              gameWon={gameWon}
              gameFailed={guesses.length >= 5 && !gameWon}
            />
            
            <div className="hints-section">
              <h3 className="hints-title">
                🔍 Hints
              </h3>
              <div className="hints-grid">
                {getHints().map((hint, index) => (
                  <div key={index} className="hint-item">
                    {hint}
                  </div>
                ))}
              </div>
              
              {/* Input section moved into hints box */}
              <div className="input-section-embedded">
                <div className="input-wrapper">
                  <AutocompleteInput 
                    onPlayerSelect={handlePlayerSelect}
                    placeholder="Enter NBA player name..."
                  />
                </div>
              </div>
            </div>
            
            {guesses.length > 0 && (
              <div className="guesses-section">
                <h3 className="guesses-title">
                  ❌ Incorrect Guesses
                  <span className="guess-counter">{guesses.length}/5</span>
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
            {/* Player Headshot */}
            <div className="player-headshot-container" style={{ textAlign: 'center', marginBottom: '24px' }}>
              <PlayerHeadshot 
                playerName={gameStats.playerName}
                photoUrl={gameStats.playerPhotoUrl}
                size="xlarge"
                className="player-headshot-win"
              />
              {/* DEBUG: Show if player has photo URL (only in development) */}
              {process.env.NODE_ENV === 'development' && (
                <div style={{ fontSize: '12px', color: '#888', marginTop: '8px' }}>
                  Photo URL: {gameStats.playerPhotoUrl ? '✅ Available' : '❌ Missing'}
                </div>
              )}
            </div>

            {/* Score Summary Section */}
            <div className="score-summary">
              <h2 className="win-title" style={{ color: gameStats.rating.color }}>
                {gameStats.rating.text}
              </h2>
              <p className="win-subtitle">
                {gameStats.score > 0 ? (
                  <>You guessed <strong>{gameStats.playerName}</strong>!</>
                ) : (
                  <>The answer was <strong>{gameStats.playerName}</strong>!</>
                )}
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
                {hasValue(dailyPlayer.team) && (
                  <div className="stat-item">
                    <div className="stat-label">Team</div>
                    <div className="stat-value">{dailyPlayer.team}</div>
                  </div>
                )}
                {hasValue(dailyPlayer.position) && (
                  <div className="stat-item">
                    <div className="stat-label">Position</div>
                    <div className="stat-value">{dailyPlayer.position}</div>
                  </div>
                )}
                {hasValue(dailyPlayer.height) && (
                  <div className="stat-item">
                    <div className="stat-label">Height</div>
                    <div className="stat-value">{dailyPlayer.height}</div>
                  </div>
                )}
                {hasValue(dailyPlayer.age) && (
                  <div className="stat-item">
                    <div className="stat-label">Age</div>
                    <div className="stat-value">{dailyPlayer.age}</div>
                  </div>
                )}
                {hasValue(dailyPlayer.ppg) && (
                  <div className="stat-item">
                    <div className="stat-label">Points Per Game</div>
                    <div className="stat-value">{dailyPlayer.ppg}</div>
                  </div>
                )}
                {hasValue(dailyPlayer.rpg) && (
                  <div className="stat-item">
                    <div className="stat-label">Rebounds Per Game</div>
                    <div className="stat-value">{dailyPlayer.rpg}</div>
                  </div>
                )}
                {hasValue(dailyPlayer.apg) && (
                  <div className="stat-item">
                    <div className="stat-label">Assists Per Game</div>
                    <div className="stat-value">{dailyPlayer.apg}</div>
                  </div>
                )}
                {hasValue(dailyPlayer.draft_year) && (
                  <div className="stat-item">
                    <div className="stat-label">Draft Year</div>
                    <div className="stat-value">{dailyPlayer.draft_year}</div>
                  </div>
                )}
                {hasValue(dailyPlayer.college) && (
                  <div className="stat-item">
                    <div className="stat-label">College</div>
                    <div className="stat-value">{dailyPlayer.college}</div>
                  </div>
                )}
                {hasValue(dailyPlayer.country) && (
                  <div className="stat-item">
                    <div className="stat-label">Country</div>
                    <div className="stat-value">{dailyPlayer.country}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Play Again Button */}
            <button onClick={resetGame} className="play-again-button">
              🎯 Play Again
            </button>
          </div>
        )}

        {/* Confetti Animation Component */}
        <ConfettiAnimation 
          isActive={showConfetti}
          intensity={gameStats?.score >= 100 ? 'intense' : gameStats?.score >= 80 ? 'normal' : 'light'}
          duration={4000}
          colors={['#f97316', '#ea580c', '#dc2626', '#3b82f6', '#10b981', '#8b5cf6', '#f59e0b']}
        />

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
