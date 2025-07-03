import React, { useState, useEffect } from 'react';
import './App.css';
import AutocompleteInput from './AutocompleteInput';
import AuthModal from './AuthModal';
import UserStats from './UserStats';
import PlayerHeadshot from './PlayerHeadshot';

function App() {
  const [dailyPlayer, setDailyPlayer] = useState(null);
  const [guesses, setGuesses] = useState([]);
  const [gameWon, setGameWon] = useState(false);
  const [hintsRevealed, setHintsRevealed] = useState(1);
  const [gameStats, setGameStats] = useState(null);
  const [shareText, setShareText] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  
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

  // ... (keep all your existing functions: fetchUserStats, calculateScore, etc.)
  
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
        playerPhotoUrl: dailyPlayer.headshot_url // ADDED: Store photo URL
      });
      
      setGameWon(true);
      submitGameResult(finalScore, finalGuessCount, finalHintsUsed, true);
    } else {
      // Check if maximum guesses reached
      if (newGuesses.length >= 5) {
        setGameStats({
          guessCount: newGuesses.length,
          hintsUsed: hintsRevealed,
          score: 0,
          rating: { text: "💔 GAME OVER!", color: "#ef4444" },
          playerName: dailyPlayer.name,
          playerPhotoUrl: dailyPlayer.headshot_url // ADDED: Store photo URL for game over too
        });
        setGameWon(true);
        submitGameResult(0, newGuesses.length, hintsRevealed, false);
      } else {
        setHintsRevealed(hintsRevealed + 1);
      }
    }
  };

  // ... (keep all your other existing functions)

  // In the win screen section, update the PlayerHeadshot component:
  return (
    <div className="App">
      <div className="App-header">
        {/* ... (keep all your existing JSX until the win screen) */}
        
        {!gameWon ? (
          // ... (keep all your game UI)
        ) : (
          <div className="win-container">
            {/* UPDATED: Player Headshot - Now uses database photo URL */}
            <div className="player-headshot-container" style={{ textAlign: 'center', marginBottom: '24px' }}>
              <PlayerHeadshot 
                playerName={gameStats.playerName}
                photoUrl={gameStats.playerPhotoUrl} // ADDED: Pass database photo URL
                size="xlarge"
                className="player-headshot-win"
              />
              {/* DEBUG: Show if player has photo URL */}
              {process.env.NODE_ENV === 'development' && (
                <div style={{ fontSize: '12px', color: '#888', marginTop: '8px' }}>
                  Photo URL: {gameStats.playerPhotoUrl ? '✅ Available' : '❌ Missing'}
                </div>
              )}
            </div>

            {/* ... (keep all your existing win screen JSX) */}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
