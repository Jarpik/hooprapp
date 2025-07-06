import React, { useState, useEffect, useCallback, useRef } from 'react';

// Team colors mapping exactly as specified
const TEAM_COLORS = {
  "Duke": "#001A57", "Rutgers": "#CC0033", "Baylor": "#154734", "UCLA": "#2D68C4",
  "Texas": "#BF5700", "Oklahoma": "#841617", "BYU": "#002255", "South Carolina": "#73000A",
  "Washington State": "#990000", "Ratiopharm Ulm": "#FF6600", "Maryland": "#E03A3E",
  "Arizona": "#003366", "Georgetown": "#041E42", "Qingdao Eagles": "#008080",
  "Cedevita Olimpija": "#005691", "Florida": "#0021A5", "Saint-Quentin": "#000080",
  "Illinois": "#13294B", "North Carolina": "#7BAFD4", "Georgia": "#BA0C0F",
  "Colorado State": "#004B40", "Michigan State": "#18453B", "Real Madrid": "#00529F",
  "Penn State": "#041E42", "Saint Joseph's": "#800000", "Le Mans Sarthe": "#2C3E50",
  "Creighton": "#003366", "Auburn": "#0C2340", "Arkansas": "#9D2235",
  "Tennessee": "#FF8200", "Marquette": "#002D62", "VCU": "#2C3E50",
  "Liberty": "#800000", "Wisconsin": "#C5050C", "Northwestern": "#4E2A84",
  "Brisbane Bullets": "#002D62", "Mega Basket": "#FF0000", "West Virginia": "#EAAA00",
  "Nevada": "#003366", "Cholet Basket": "#CC0000", "Sydney Kings": "#522D80",
  "Illawarra Hawks": "#CC0000", "Trento": "#2C3E50", "DEFAULT": "#34495E",
};

const getContrastTextColor = (hexcolor) => {
  if (!hexcolor || hexcolor === TEAM_COLORS.DEFAULT) return '#FFFFFF';
  const r = parseInt(hexcolor.substr(1, 2), 16);
  const g = parseInt(hexcolor.substr(3, 2), 16);
  const b = parseInt(hexcolor.substr(5, 2), 16);
  const y = (r * 299 + g * 587 + b * 114) / 1000;
  return (y >= 128) ? '#333333' : '#FFFFFF';
};

// NBA Rookies data with Summer League info
const ROOKIES_2025_NBA = [
  { id: 1, name: "Cooper Flagg", draftPick: 1, team: "Dallas Mavericks", preDraftTeam: "Duke", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/5041939.png&w=350&h=254", height: 81, age: 18, position: "Forward", conference: "ACC", summerLeague: "Utah Summer League" },
  { id: 2, name: "Dylan Harper", draftPick: 2, team: "San Antonio Spurs", preDraftTeam: "Rutgers", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/5037871.png&w=350&h=254", height: 76, age: 18, position: "Guard", conference: "Big Ten", summerLeague: "Utah Summer League" },
  { id: 3, name: "VJ Edgecombe", draftPick: 3, team: "Philadelphia 76ers", preDraftTeam: "Baylor", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/5124612.png&w=350&h=254", height: 77, age: 19, position: "Guard", conference: "Big 12", summerLeague: "California Classic" },
  { id: 4, name: "Kon Knueppel", draftPick: 4, team: "Charlotte Hornets", preDraftTeam: "Duke", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/5061575.png&w=350&h=254", height: 79, age: 19, position: "Forward", conference: "ACC", summerLeague: "Utah Summer League" },
  { id: 5, name: "Ace Bailey", draftPick: 5, team: "Utah Jazz", preDraftTeam: "Rutgers", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/4873138.png&w=350&h=254", height: 81, age: 19, position: "Forward", conference: "Big Ten", summerLeague: "Utah Summer League" },
  { id: 6, name: "Tre Johnson", draftPick: 6, team: "Washington Wizards", preDraftTeam: "Texas", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/5238230.png&w=350&h=254", height: 76, age: 19, position: "Guard", conference: "Big 12", summerLeague: "2K25 Summer League" },
  { id: 7, name: "Jeremiah Fears", draftPick: 7, team: "New Orleans Pelicans", preDraftTeam: "Oklahoma", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/5144091.png&w=350&h=254", height: 74, age: 18, position: "Guard", conference: "Big 12", summerLeague: "2K25 Summer League" },
  { id: 8, name: "Egor Demin", draftPick: 8, team: "Brooklyn Nets", preDraftTeam: "BYU", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/mens-college-basketball/players/full/5243213.png", height: 79, age: 19, position: "Guard", conference: "Big 12", summerLeague: "2K25 Summer League" },
  { id: 9, name: "Collin Murray-Boyles", draftPick: 9, team: "Toronto Raptors", preDraftTeam: "South Carolina", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/5093267.png&w=350&h=254", height: 80, age: 20, position: "Forward", conference: "SEC", summerLeague: "California Classic" },
  { id: 10, name: "Khaman Maluach", draftPick: 10, team: "Phoenix Suns", preDraftTeam: "Duke", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/5203685.png&w=350&h=254", height: 85, age: 18, position: "Center", conference: "ACC", summerLeague: "California Classic" },
];

// Mobile-optimized PlayerCard component
const PlayerCard = ({ player, onClick, isSelected, isCorrect, showPick, disabled, isDarkMode }) => {
  const cardBackgroundColor = TEAM_COLORS[player.preDraftTeam] || TEAM_COLORS.DEFAULT;
  const cardTextColor = getContrastTextColor(cardBackgroundColor);

  let cardClasses = "player-card";
  if (isSelected) cardClasses += " selected";
  if (isCorrect === true) cardClasses += " correct";
  if (isCorrect === false) cardClasses += " incorrect";
  if (disabled) cardClasses += " disabled";

  return (
    <div className="player-card-container">
      <button
        className={cardClasses}
        onClick={() => onClick(player.id)}
        disabled={disabled}
        style={{ backgroundColor: cardBackgroundColor, color: cardTextColor }}
      >
        <img
          src={player.imageUrl}
          alt={player.name}
          className="player-image"
          onError={(e) => { 
            e.target.onerror = null; 
            e.target.src = `https://placehold.co/150x180/666666/FFFFFF?text=${player.name.split(' ').map(n => n[0]).join('')}`; 
          }}
        />
        <div className="player-info">
          <h3 className="player-name">{player.name}</h3>
          <p className="player-team">{player.preDraftTeam}</p>
          <div className="player-stats">
            <span className="stat-badge position">{player.position}</span>
            <span className="stat-badge height">{Math.floor(player.height/12)}'{player.height%12}"</span>
          </div>
        </div>
      </button>

      {showPick && (
        <div className="reveal-section">
          <div className="pick-number">Pick #{player.draftPick}</div>
          <div className="nba-team">{player.team}</div>
          <div className="summer-league">{player.summerLeague}</div>
        </div>
      )}
    </div>
  );
};

const DraftDuelMain = () => {
  const [player1, setPlayer1] = useState(null);
  const [player2, setPlayer2] = useState(null);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('draftDuelHighScore');
    return saved ? parseInt(saved) : 0;
  });
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [selectedPlayerId, setSelectedPlayerId] = useState(null);
  const [isCorrectGuess, setIsCorrectGuess] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [shotClockTime, setShotClockTime] = useState(10);
  const shotClockIntervalRef = useRef(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const shareTextRef = useRef(null);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Question types with Summer League addition
  const QUESTIONS = [
    {
      text: "Which player was drafted HIGHER?",
      getCorrectPlayerId: (p1, p2) => (p1.draftPick < p2.draftPick ? p1.id : p2.id),
      filter: (p1, p2) => p1.draftPick !== p2.draftPick,
    },
    {
      text: "Which player was drafted LOWER?",
      getCorrectPlayerId: (p1, p2) => (p1.draftPick > p2.draftPick ? p1.id : p2.id),
      filter: (p1, p2) => p1.draftPick !== p2.draftPick,
    },
    {
      text: "Which player is TALLER?",
      getCorrectPlayerId: (p1, p2) => (p1.height > p2.height ? p1.id : p2.id),
      filter: (p1, p2) => p1.height !== p2.height,
    },
    {
      text: "Which player is SHORTER?",
      getCorrectPlayerId: (p1, p2) => (p1.height < p2.height ? p1.id : p2.id),
      filter: (p1, p2) => p1.height !== p2.height,
    },
    {
      text: "Which player is OLDER?",
      getCorrectPlayerId: (p1, p2) => (p1.age > p2.age ? p1.id : p2.id),
      filter: (p1, p2) => p1.age !== p2.age,
    },
    {
      text: "Which player is YOUNGER?",
      getCorrectPlayerId: (p1, p2) => (p1.age < p2.age ? p1.id : p2.id),
      filter: (p1, p2) => p1.age !== p2.age,
    },
    {
      text: "Which player is a GUARD?",
      getCorrectPlayerId: (p1, p2) => (p1.position === "Guard" ? p1.id : p2.id),
      filter: (p1, p2) => (p1.position === "Guard" && p2.position !== "Guard") || (p2.position === "Guard" && p1.position !== "Guard"),
    },
    {
      text: "Which player is a FORWARD?",
      getCorrectPlayerId: (p1, p2) => (p1.position === "Forward" ? p1.id : p2.id),
      filter: (p1, p2) => (p1.position === "Forward" && p2.position !== "Forward") || (p2.position === "Forward" && p1.position !== "Forward"),
    },
    {
      text: "Which player is in the UTAH SUMMER LEAGUE?",
      getCorrectPlayerId: (p1, p2) => (p1.summerLeague === "Utah Summer League" ? p1.id : p2.id),
      filter: (p1, p2) => (p1.summerLeague === "Utah Summer League") !== (p2.summerLeague === "Utah Summer League"),
    },
  ];

  // Game logic functions
  const handleTimeOut = useCallback(() => {
    setIsCorrectGuess(false);
    setFeedbackMessage('Time ran out!');
    setGameOver(true);
    if (currentStreak > highScore) {
      setHighScore(currentStreak);
      localStorage.setItem('draftDuelHighScore', currentStreak.toString());
    }
    if (player1) {
      setSelectedPlayerId(player1.id);
    }
  }, [currentStreak, highScore, player1]);

  const selectRandomRookiesAndQuestion = useCallback(() => {
    let p1, p2, randomQuestion;
    let attempts = 0;
    const maxAttempts = 100;

    do {
      p1 = ROOKIES_2025_NBA[Math.floor(Math.random() * ROOKIES_2025_NBA.length)];
      p2 = ROOKIES_2025_NBA[Math.floor(Math.random() * ROOKIES_2025_NBA.length)];
      randomQuestion = QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)];
      attempts++;
    } while ((p1.id === p2.id || (randomQuestion.filter && !randomQuestion.filter(p1, p2))) && attempts < maxAttempts);

    setPlayer1(p1);
    setPlayer2(p2);
    setCurrentQuestion(randomQuestion);
    setSelectedPlayerId(null);
    setIsCorrectGuess(null);
    setFeedbackMessage('');
    setGameOver(false);
    setShotClockTime(10);
  }, []);

  // Initialize game
  useEffect(() => {
    selectRandomRookiesAndQuestion();
  }, [selectRandomRookiesAndQuestion]);

  // Shot clock timer
  useEffect(() => {
    if (player1 && player2 && selectedPlayerId === null && !gameOver) {
      shotClockIntervalRef.current = setInterval(() => {
        setShotClockTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(shotClockIntervalRef.current);
            handleTimeOut();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (shotClockIntervalRef.current) {
        clearInterval(shotClockIntervalRef.current);
      }
    };
  }, [player1, player2, selectedPlayerId, gameOver, handleTimeOut]);

  // Handle user's guess
  const handleGuess = (id) => {
    if (selectedPlayerId !== null || !currentQuestion || gameOver) return;

    clearInterval(shotClockIntervalRef.current);
    setSelectedPlayerId(id);

    const correctPlayerId = currentQuestion.getCorrectPlayerId(player1, player2);
    const isGuessCorrect = id === correctPlayerId;

    if (isGuessCorrect) {
      setIsCorrectGuess(true);
      setCurrentStreak(prev => prev + 1);
      setFeedbackMessage('Correct! 🔥');
    } else {
      setIsCorrectGuess(false);
      setFeedbackMessage('Incorrect! 😤');
      setGameOver(true);
      if (currentStreak > highScore) {
        setHighScore(currentStreak);
        localStorage.setItem('draftDuelHighScore', currentStreak.toString());
      }
    }
  };

  // Handle continue/reset
  const handleContinue = () => {
    if (gameOver) {
      setCurrentStreak(0);
      selectRandomRookiesAndQuestion();
    } else {
      selectRandomRookiesAndQuestion();
    }
  };

  // Share functionality
  const shareStreak = () => {
    setShowShareModal(true);
  };

  const handleCopyShareText = () => {
    if (shareTextRef.current) {
      shareTextRef.current.select();
      document.execCommand('copy');
      setFeedbackMessage('Copied to clipboard!');
      setTimeout(() => setFeedbackMessage(''), 2000);
    }
  };

  const handleCloseShareModal = () => {
    setShowShareModal(false);
    setFeedbackMessage('');
  };

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  return (
    <div className="mobile-game-container">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&display=swap');
        
        /* MOBILE-FIRST DESIGN */
        .mobile-game-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: ${isDarkMode ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 50%, #dee2e6 100%)'};
          font-family: 'Outfit', sans-serif;
          overflow-x: hidden;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          color: ${isDarkMode ? '#ffffff' : '#333333'};
          -webkit-overflow-scrolling: touch;
          /* Prevent zoom on iOS */
          -webkit-text-size-adjust: 100%;
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          user-select: none;
        }

        /* Theme Toggle */
        .theme-toggle {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          border-radius: 50%;
          width: 2.5rem;
          height: 2.5rem;
          font-size: 1.2rem;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          /* Better touch targets */
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
        }

        .action-button:active {
          transform: scale(0.95);
        }

        .continue-button {
          background: linear-gradient(135deg, #3B82F6, #1D4ED8);
          color: white;
        }

        .play-again-button {
          background: linear-gradient(135deg, #10B981, #059669);
          color: white;
        }

        .share-button {
          background: linear-gradient(135deg, #8B5CF6, #7C3AED);
          color: white;
        }

        /* MOBILE SHARE MODAL */
        .mobile-share-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
        }

        .mobile-share-modal {
          background: ${isDarkMode ? '#2D3748' : '#FFFFFF'};
          color: ${isDarkMode ? '#FFFFFF' : '#2D3748'};
          padding: 2rem;
          border-radius: 20px;
          width: 100%;
          max-width: 350px;
          max-height: 90vh;
          overflow-y: auto;
          text-align: center;
        }

        .share-title {
          font-size: 1.5rem;
          font-weight: 800;
          margin-bottom: 1rem;
          color: ${isDarkMode ? '#FFD700' : '#FF6B35'};
        }

        .share-description {
          font-size: 1rem;
          margin-bottom: 1.5rem;
          color: ${isDarkMode ? '#A0AEC0' : '#4A5568'};
        }

        .share-textarea {
          width: 100%;
          padding: 1rem;
          border: 2px solid ${isDarkMode ? '#4A5568' : '#E2E8F0'};
          border-radius: 10px;
          font-family: 'Outfit', sans-serif;
          font-size: 0.9rem;
          resize: none;
          height: 6rem;
          margin-bottom: 1.5rem;
          background: ${isDarkMode ? '#1A202C' : '#F7FAFC'};
          color: ${isDarkMode ? '#FFFFFF' : '#2D3748'};
          box-sizing: border-box;
        }

        .share-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
        }

        .copy-button {
          background: linear-gradient(135deg, #3B82F6, #1D4ED8);
          color: white;
        }

        .back-button {
          background: ${isDarkMode ? '#4A5568' : '#E2E8F0'};
          color: ${isDarkMode ? '#FFFFFF' : '#2D3748'};
        }

        /* Prevent overscroll bounce on iOS */
        .mobile-game-container {
          -webkit-overflow-scrolling: touch;
          overscroll-behavior: none;
        }

        /* Landscape orientation adjustments */
        @media (orientation: landscape) and (max-height: 500px) {
          .game-title {
            font-size: 2rem;
            margin: 0.25rem 0;
          }
          
          .mobile-scoreboard {
            padding: 0.5rem;
            margin: 0 1rem 0.5rem;
          }
          
          .mobile-question {
            margin: 0 1rem 1rem;
            padding: 0.75rem;
          }
          
          .question-text {
            font-size: 1rem;
          }
          
          .mobile-players {
            flex-direction: row;
            gap: 1rem;
            margin-bottom: 1rem;
          }
          
          .vs-divider {
            font-size: 1.5rem;
            margin: 0;
            writing-mode: vertical-rl;
            text-orientation: mixed;
          }
          
          .player-card {
            min-height: 80px;
          }
          
          .mobile-actions {
            padding: 0.75rem;
          }
        }

        /* Very small screens */
        @media (max-width: 320px) {
          .game-title {
            font-size: 2rem;
          }
          
          .mobile-scoreboard {
            margin: 0 0.5rem 1rem;
          }
          
          .mobile-question {
            margin: 0 0.5rem 1rem;
          }
          
          .mobile-players {
            padding: 0 0.5rem;
          }
          
          .player-card {
            padding: 0.75rem;
          }
          
          .player-image {
            width: 60px;
            height: 75px;
          }
          
          .player-name {
            font-size: 1rem;
          }
        }

        /* High DPI displays */
        @media (-webkit-min-device-pixel-ratio: 2) {
          .player-image {
            image-rendering: -webkit-optimize-contrast;
          }
        }
      `}</style>

      {/* Theme Toggle */}
      <button 
        className="theme-toggle"
        onClick={toggleDarkMode}
        aria-label="Toggle theme"
      >
        {isDarkMode ? '☀️' : '🌙'}
      </button>

      {/* Game Title */}
      <div className="game-title">DRAFT DUEL</div>
      <div className="summer-subtitle">Summer League Edition</div>

      {/* Mobile Scoreboard */}
      <div className="mobile-scoreboard">
        <div className="score-item">
          <div className="score-label">Streak</div>
          <div className="score-value">{currentStreak}</div>
        </div>
        <div className="score-item">
          <div className="score-label">Timer</div>
          <div className="timer-value">{shotClockTime}s</div>
        </div>
        <div className="score-item">
          <div className="score-label">Best</div>
          <div className="score-value">{highScore}</div>
        </div>
      </div>

      {/* Mobile Question */}
      <div className="mobile-question">
        <div className="question-text">
          {currentQuestion ? currentQuestion.text : "Loading question..."}
        </div>
      </div>

      {/* Mobile Players */}
      <div className="mobile-players">
        {player1 && (
          <PlayerCard
            player={player1}
            onClick={handleGuess}
            isSelected={selectedPlayerId === player1.id}
            isCorrect={selectedPlayerId !== null ? (currentQuestion?.getCorrectPlayerId(player1, player2) === player1.id) : null}
            showPick={selectedPlayerId !== null}
            disabled={selectedPlayerId !== null || gameOver}
            isDarkMode={isDarkMode}
          />
        )}
        
        <div className="vs-divider">VS</div>
        
        {player2 && (
          <PlayerCard
            player={player2}
            onClick={handleGuess}
            isSelected={selectedPlayerId === player2.id}
            isCorrect={selectedPlayerId !== null ? (currentQuestion?.getCorrectPlayerId(player1, player2) === player2.id) : null}
            showPick={selectedPlayerId !== null}
            disabled={selectedPlayerId !== null || gameOver}
            isDarkMode={isDarkMode}
          />
        )}
      </div>

      {/* Mobile Feedback */}
      {feedbackMessage && (
        <div className="mobile-feedback">
          <div className={`feedback-message ${
            isCorrectGuess === true ? 'correct' : 
            isCorrectGuess === false ? 'incorrect' : 'timeout'
          }`}>
            {feedbackMessage}
          </div>
        </div>
      )}

      {/* Mobile Action Buttons */}
      {selectedPlayerId !== null && (
        <div className="mobile-actions">
          {!gameOver ? (
            <button onClick={handleContinue} className="action-button continue-button">
              Continue
            </button>
          ) : (
            <>
              <button onClick={handleContinue} className="action-button play-again-button">
                Play Again
              </button>
              <button onClick={shareStreak} className="action-button share-button">
                Share
              </button>
            </>
          )}
        </div>
      )}

      {/* Mobile Share Modal */}
      {showShareModal && (
        <div className="mobile-share-overlay">
          <div className="mobile-share-modal">
            <h2 className="share-title">🏀 Share Your Streak!</h2>
            <p className="share-description">Show everyone your Draft knowledge!</p>
            <textarea
              ref={shareTextRef}
              className="share-textarea"
              readOnly
              value={`🏀 Just scored ${currentStreak} in a row on Draft Duel! Think you know the 2025 NBA Draft better? Play at hooprapp.com! #DraftDuel #NBADraft2025 #SummerLeague`}
            />
            <div className="share-buttons">
              <button onClick={handleCopyShareText} className="action-button copy-button">
                Copy
              </button>
              <button onClick={handleCloseShareModal} className="action-button back-button">
                Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DraftDuelMain; pointer;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
          z-index: 100;
          color: ${isDarkMode ? '#FFD700' : '#FF6B35'};
        }

        /* Game Title - Mobile Optimized */
        .game-title {
          text-align: center;
          margin: 0.5rem 0;
          font-size: 2.5rem;
          font-weight: 800;
          background: linear-gradient(45deg, #FFD700, #FF8C00, #FF4500);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: drop-shadow(0 0 8px rgba(255, 165, 0, 0.6));
          padding: 0 1rem;
        }

        .summer-subtitle {
          text-align: center;
          font-size: 0.9rem;
          color: ${isDarkMode ? '#FFD700' : '#FF6B35'};
          margin-bottom: 1rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        /* MOBILE SCOREBOARD - Compact */
        .mobile-scoreboard {
          display: flex;
          justify-content: space-around;
          background: rgba(0, 0, 0, 0.8);
          margin: 0 1rem 1rem;
          padding: 0.75rem;
          border-radius: 15px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .score-item {
          text-align: center;
          flex: 1;
        }

        .score-label {
          font-size: 0.7rem;
          color: #FFD700;
          font-weight: 600;
          text-transform: uppercase;
          margin-bottom: 0.25rem;
        }

        .score-value {
          font-family: 'Orbitron', monospace;
          font-size: 1.5rem;
          font-weight: 900;
          color: #FF8C00;
          text-shadow: 0 0 10px rgba(255, 140, 0, 0.8);
        }

        .timer-value {
          font-family: 'Orbitron', monospace;
          font-size: 1.5rem;
          font-weight: 900;
          color: ${shotClockTime <= 3 ? '#FF3333' : '#00FF41'};
          text-shadow: 0 0 10px rgba(${shotClockTime <= 3 ? '255, 51, 51' : '0, 255, 65'}, 0.8);
        }

        /* MOBILE QUESTION - Larger Touch Target */
        .mobile-question {
          margin: 0 1rem 1.5rem;
          padding: 1rem;
          background: rgba(59, 130, 246, 0.15);
          border-radius: 15px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
        }

        .question-text {
          font-size: 1.2rem;
          font-weight: 700;
          text-align: center;
          color: ${isDarkMode ? '#ffffff' : '#333333'};
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        /* MOBILE PLAYERS - Vertical Stack */
        .mobile-players {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          padding: 0 1rem;
          margin-bottom: 2rem;
        }

        .player-card-container {
          width: 100%;
          max-width: 280px;
        }

        .player-card {
          width: 100%;
          background: none;
          border: 3px solid rgba(255, 255, 255, 0.2);
          border-radius: 15px;
          padding: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
          display: flex;
          align-items: center;
          gap: 1rem;
          min-height: 100px;
          /* Better touch targets */
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
        }

        .player-card:active {
          transform: scale(0.98);
        }

        .player-card.selected {
          border-color: #3B82F6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.4), 0 8px 20px rgba(0, 0, 0, 0.3);
        }

        .player-card.correct {
          border-color: #10B981;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.5), 0 8px 20px rgba(0, 0, 0, 0.3);
        }

        .player-card.incorrect {
          border-color: #EF4444;
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.5), 0 8px 20px rgba(0, 0, 0, 0.3);
        }

        .player-card.disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .player-image {
          width: 70px;
          height: 85px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid rgba(255, 255, 255, 0.3);
          flex-shrink: 0;
        }

        .player-info {
          flex: 1;
          text-align: left;
        }

        .player-name {
          font-size: 1.2rem;
          font-weight: 800;
          margin: 0 0 0.25rem 0;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
        }

        .player-team {
          font-size: 0.9rem;
          margin: 0 0 0.5rem 0;
          opacity: 0.9;
        }

        .player-stats {
          display: flex;
          gap: 0.5rem;
        }

        .stat-badge {
          padding: 0.2rem 0.4rem;
          border-radius: 8px;
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .stat-badge.position {
          background: rgba(255, 165, 0, 0.2);
          color: #FFD700;
          border: 1px solid rgba(255, 215, 0, 0.3);
        }

        .stat-badge.height {
          background: rgba(59, 130, 246, 0.2);
          color: #60A5FA;
          border: 1px solid rgba(96, 165, 250, 0.3);
        }

        /* VS Divider */
        .vs-divider {
          font-size: 2rem;
          font-weight: 800;
          color: #FFD700;
          text-align: center;
          margin: 0.5rem 0;
          text-shadow: 0 0 10px rgba(255, 215, 0, 0.8);
        }

        /* Reveal Section - Mobile Optimized */
        .reveal-section {
          margin-top: 1rem;
          padding: 0.75rem;
          background: rgba(0, 0, 0, 0.8);
          border-radius: 10px;
          text-align: center;
          animation: slideUp 0.3s ease-out;
        }

        .pick-number {
          font-size: 1.2rem;
          font-weight: 700;
          color: #FBBF24;
          margin-bottom: 0.25rem;
        }

        .nba-team {
          font-size: 0.9rem;
          font-weight: 600;
          color: #60A5FA;
          margin-bottom: 0.25rem;
        }

        .summer-league {
          font-size: 0.8rem;
          color: #FBD38D;
          font-style: italic;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* MOBILE FEEDBACK - Fixed Position */
        .mobile-feedback {
          position: fixed;
          bottom: 120px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 50;
          width: 90%;
          max-width: 300px;
        }

        .feedback-message {
          padding: 0.75rem 1.5rem;
          border-radius: 25px;
          font-size: 1.1rem;
          font-weight: 600;
          text-align: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          animation: bounceIn 0.4s ease-out;
        }

        .feedback-message.correct {
          background: #10B981;
          color: white;
        }

        .feedback-message.incorrect {
          background: #EF4444;
          color: white;
        }

        .feedback-message.timeout {
          background: #3B82F6;
          color: white;
        }

        @keyframes bounceIn {
          0% { opacity: 0; transform: scale(0.3); }
          50% { opacity: 1; transform: scale(1.05); }
          100% { opacity: 1; transform: scale(1); }
        }

        /* MOBILE ACTION BUTTONS - Fixed Bottom */
        .mobile-actions {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: ${isDarkMode ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.9)'};
          backdrop-filter: blur(10px);
          padding: 1rem;
          display: flex;
          gap: 0.75rem;
          justify-content: center;
          z-index: 100;
          /* Safe area for iPhone notch */
          padding-bottom: calc(1rem + env(safe-area-inset-bottom));
        }

        .action-button {
          flex: 1;
          max-width: 140px;
          height: 50px;
          border: none;
          border-radius: 25px;
          font-size: 1rem;
          font-weight: 600;
          cursor:
