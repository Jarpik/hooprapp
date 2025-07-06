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

// PROPERLY Mobile-optimized PlayerCard component
const PlayerCard = ({ player, onClick, isSelected, isCorrect, showPick, disabled, isDarkMode }) => {
  const cardBackgroundColor = TEAM_COLORS[player.preDraftTeam] || TEAM_COLORS.DEFAULT;
  const cardTextColor = getContrastTextColor(cardBackgroundColor);

  let cardClasses = "mobile-player-card";
  if (isSelected) cardClasses += " selected";
  if (isCorrect === true) cardClasses += " correct";
  if (isCorrect === false) cardClasses += " incorrect";
  if (disabled) cardClasses += " disabled";

  return (
    <div className="mobile-player-wrapper">
      <button
        className={cardClasses}
        onClick={() => onClick(player.id)}
        disabled={disabled}
        style={{ backgroundColor: cardBackgroundColor, color: cardTextColor }}
      >
        <div className="mobile-player-content">
          <img
            src={player.imageUrl}
            alt={player.name}
            className="mobile-player-image"
            onError={(e) => { 
              e.target.onerror = null; 
              e.target.src = `https://placehold.co/80x100/666666/FFFFFF?text=${player.name.split(' ').map(n => n[0]).join('')}`; 
            }}
          />
          <div className="mobile-player-info">
            <h3 className="mobile-player-name">{player.name}</h3>
            <p className="mobile-player-team">{player.preDraftTeam}</p>
            <div className="mobile-player-stats">
              <span className="mobile-stat-badge position">{player.position}</span>
              <span className="mobile-stat-badge height">{Math.floor(player.height/12)}'{player.height%12}"</span>
            </div>
          </div>
        </div>
      </button>

      {showPick && (
        <div className="mobile-reveal-section">
          <div className="mobile-pick-number">Pick #{player.draftPick}</div>
          <div className="mobile-nba-team">{player.team}</div>
          <div className="mobile-summer-league">{player.summerLeague}</div>
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
    <div className="draft-duel-mobile">
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&display=swap');
        
        /* MOBILE-FIRST: Full viewport container */
        .draft-duel-mobile {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: ${isDarkMode ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 50%, #dee2e6 100%)'};
          font-family: 'Outfit', sans-serif;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          color: ${isDarkMode ? '#ffffff' : '#333333'};
          -webkit-text-size-adjust: 100%;
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          user-select: none;
          overscroll-behavior: none;
        }

        /* Header with title and theme toggle */
        .mobile-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          padding-top: calc(1rem + env(safe-area-inset-top));
          position: relative;
          z-index: 100;
        }

        .mobile-title {
          font-size: 2.5rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
        }

        .mobile-action-button:active {
          transform: scale(0.95);
        }

        .mobile-continue-button {
          background: linear-gradient(135deg, #3B82F6, #1D4ED8);
          color: white;
        }

        .mobile-play-again-button {
          background: linear-gradient(135deg, #10B981, #059669);
          color: white;
        }

        .mobile-share-button {
          background: linear-gradient(135deg, #8B5CF6, #7C3AED);
          color: white;
        }

        /* Share modal */
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

        .mobile-share-title {
          font-size: 1.5rem;
          font-weight: 800;
          margin-bottom: 1rem;
          color: ${isDarkMode ? '#FFD700' : '#FF6B35'};
        }

        .mobile-share-description {
          font-size: 1rem;
          margin-bottom: 1.5rem;
          color: ${isDarkMode ? '#A0AEC0' : '#4A5568'};
        }

        .mobile-share-textarea {
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

        .mobile-share-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
        }

        .mobile-copy-button {
          background: linear-gradient(135deg, #3B82F6, #1D4ED8);
          color: white;
        }

        .mobile-back-button {
          background: ${isDarkMode ? '#4A5568' : '#E2E8F0'};
          color: ${isDarkMode ? '#FFFFFF' : '#2D3748'};
        }
      `}</style>

      {/* Header */}
      <div className="mobile-header">
        <div className="mobile-title">DRAFT DUEL</div>
        <button 
          className="mobile-theme-toggle"
          onClick={toggleDarkMode}
          aria-label="Toggle theme"
        >
          {isDarkMode ? '☀️' : '🌙'}
        </button>
      </div>

      {/* Scoreboard */}
      <div className="mobile-scoreboard">
        <div className="mobile-score-item">
          <div className="mobile-score-label">Streak</div>
          <div className="mobile-score-value">{currentStreak}</div>
        </div>
        <div className="mobile-score-item">
          <div className="mobile-score-label">Timer</div>
          <div className="mobile-timer-value">{shotClockTime}</div>
        </div>
        <div className="mobile-score-item">
          <div className="mobile-score-label">Best</div>
          <div className="mobile-score-value">{highScore}</div>
        </div>
      </div>

      {/* Question */}
      <div className="mobile-question">
        <div className="mobile-question-text">
          {currentQuestion ? currentQuestion.text : "Loading question..."}
        </div>
      </div>

      {/* Players Container */}
      <div className="mobile-players-container">
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
        
        <div className="mobile-vs-divider">VS</div>
        
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

      {/* Feedback Overlay */}
      {feedbackMessage && (
        <div className="mobile-feedback-overlay">
          <div className={`mobile-feedback-message ${
            isCorrectGuess === true ? 'correct' : 
            isCorrectGuess === false ? 'incorrect' : 'timeout'
          }`}>
            {feedbackMessage}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {selectedPlayerId !== null && (
        <div className="mobile-actions">
          {!gameOver ? (
            <button onClick={handleContinue} className="mobile-action-button mobile-continue-button">
              Continue
            </button>
          ) : (
            <>
              <button onClick={handleContinue} className="mobile-action-button mobile-play-again-button">
                Play Again
              </button>
              <button onClick={shareStreak} className="mobile-action-button mobile-share-button">
                Share
              </button>
            </>
          )}
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="mobile-share-overlay">
          <div className="mobile-share-modal">
            <h2 className="mobile-share-title">🏀 Share Your Streak!</h2>
            <p className="mobile-share-description">Show everyone your Draft knowledge!</p>
            <textarea
              ref={shareTextRef}
              className="mobile-share-textarea"
              readOnly
              value={`🏀 Just scored ${currentStreak} in a row on Draft Duel! Think you know the 2025 NBA Draft better? Play at hooprapp.com! #DraftDuel #NBADraft2025 #SummerLeague`}
            />
            <div className="mobile-share-buttons">
              <button onClick={handleCopyShareText} className="mobile-action-button mobile-copy-button">
                Copy
              </button>
              <button onClick={handleCloseShareModal} className="mobile-action-button mobile-back-button">
                Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DraftDuelMain; 800;
          background: linear-gradient(45deg, #FFD700, #FF8C00, #FF4500);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: drop-shadow(0 0 8px rgba(255, 165, 0, 0.6));
          flex: 1;
          text-align: center;
        }

        .mobile-theme-toggle {
          background: rgba(255, 255, 255, 0.1);
          border: none;
          border-radius: 50%;
          width: 2.5rem;
          height: 2.5rem;
          font-size: 1.2rem;
          cursor: pointer;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
          color: ${isDarkMode ? '#FFD700' : '#FF6B35'};
          touch-action: manipulation;
        }

        .mobile-theme-toggle:active {
          transform: scale(0.95);
        }

        /* Compact scoreboard */
        .mobile-scoreboard {
          display: flex;
          justify-content: space-around;
          background: rgba(0, 0, 0, 0.8);
          margin: 0 1rem;
          padding: 0.75rem;
          border-radius: 15px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .mobile-score-item {
          text-align: center;
          flex: 1;
        }

        .mobile-score-label {
          font-size: 0.75rem;
          color: #FFD700;
          font-weight: 600;
          text-transform: uppercase;
          margin-bottom: 0.25rem;
          letter-spacing: 0.5px;
        }

        .mobile-score-value {
          font-family: 'Orbitron', monospace;
          font-size: 1.5rem;
          font-weight: 900;
          color: #FF8C00;
          text-shadow: 0 0 10px rgba(255, 140, 0, 0.8);
        }

        .mobile-timer-value {
          font-family: 'Orbitron', monospace;
          font-size: 1.5rem;
          font-weight: 900;
          color: ${shotClockTime <= 3 ? '#FF3333' : '#00FF41'};
          text-shadow: 0 0 10px rgba(${shotClockTime <= 3 ? '255, 51, 51' : '0, 255, 65'}, 0.8);
        }

        /* Question section */
        .mobile-question {
          margin: 1rem;
          padding: 1rem;
          background: rgba(59, 130, 246, 0.15);
          border-radius: 15px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
        }

        .mobile-question-text {
          font-size: 1.2rem;
          font-weight: 700;
          text-align: center;
          color: ${isDarkMode ? '#ffffff' : '#333333'};
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        /* MAIN PLAYERS SECTION - Vertical Stack */
        .mobile-players-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          padding: 1rem;
          gap: 1rem;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
        }

        .mobile-player-wrapper {
          width: 100%;
        }

        .mobile-player-card {
          width: 100%;
          background: none;
          border: 3px solid rgba(255, 255, 255, 0.2);
          border-radius: 15px;
          padding: 0;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
          min-height: 120px;
        }

        .mobile-player-card:active {
          transform: scale(0.98);
        }

        .mobile-player-card.selected {
          border-color: #3B82F6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.4), 0 8px 20px rgba(0, 0, 0, 0.3);
        }

        .mobile-player-card.correct {
          border-color: #10B981;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.5), 0 8px 20px rgba(0, 0, 0, 0.3);
        }

        .mobile-player-card.incorrect {
          border-color: #EF4444;
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.5), 0 8px 20px rgba(0, 0, 0, 0.3);
        }

        .mobile-player-card.disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .mobile-player-content {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          width: 100%;
          height: 100%;
        }

        .mobile-player-image {
          width: 80px;
          height: 100px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid rgba(255, 255, 255, 0.3);
          flex-shrink: 0;
        }

        .mobile-player-info {
          flex: 1;
          text-align: left;
        }

        .mobile-player-name {
          font-size: 1.3rem;
          font-weight: 800;
          margin: 0 0 0.25rem 0;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
          line-height: 1.2;
        }

        .mobile-player-team {
          font-size: 1rem;
          margin: 0 0 0.5rem 0;
          opacity: 0.9;
        }

        .mobile-player-stats {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .mobile-stat-badge {
          padding: 0.2rem 0.5rem;
          border-radius: 8px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .mobile-stat-badge.position {
          background: rgba(255, 165, 0, 0.2);
          color: #FFD700;
          border: 1px solid rgba(255, 215, 0, 0.3);
        }

        .mobile-stat-badge.height {
          background: rgba(59, 130, 246, 0.2);
          color: #60A5FA;
          border: 1px solid rgba(96, 165, 250, 0.3);
        }

        /* VS divider */
        .mobile-vs-divider {
          font-size: 2.5rem;
          font-weight: 800;
          color: #FFD700;
          text-align: center;
          margin: 0.5rem 0;
          text-shadow: 0 0 10px rgba(255, 215, 0, 0.8);
        }

        /* Reveal section */
        .mobile-reveal-section {
          margin-top: 1rem;
          padding: 0.75rem;
          background: rgba(0, 0, 0, 0.8);
          border-radius: 10px;
          text-align: center;
          animation: mobileSlideUp 0.3s ease-out;
        }

        .mobile-pick-number {
          font-size: 1.2rem;
          font-weight: 700;
          color: #FBBF24;
          margin-bottom: 0.25rem;
        }

        .mobile-nba-team {
          font-size: 1rem;
          font-weight: 600;
          color: #60A5FA;
          margin-bottom: 0.25rem;
        }

        .mobile-summer-league {
          font-size: 0.9rem;
          color: #FBD38D;
          font-style: italic;
        }

        @keyframes mobileSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Feedback section - overlay style */
        .mobile-feedback-overlay {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 200;
          pointer-events: none;
        }

        .mobile-feedback-message {
          padding: 1rem 2rem;
          border-radius: 25px;
          font-size: 1.2rem;
          font-weight: 700;
          text-align: center;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
          animation: mobileBounceIn 0.5s ease-out;
          max-width: 80vw;
        }

        .mobile-feedback-message.correct {
          background: #10B981;
          color: white;
        }

        .mobile-feedback-message.incorrect {
          background: #EF4444;
          color: white;
        }

        .mobile-feedback-message.timeout {
          background: #3B82F6;
          color: white;
        }

        @keyframes mobileBounceIn {
          0% { opacity: 0; transform: scale(0.3); }
          50% { opacity: 1; transform: scale(1.1); }
          100% { opacity: 1; transform: scale(1); }
        }

        /* Bottom action buttons */
        .mobile-actions {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: ${isDarkMode ? 'rgba(0, 0, 0, 0.95)' : 'rgba(255, 255, 255, 0.95)'};
          backdrop-filter: blur(10px);
          padding: 1rem;
          display: flex;
          gap: 0.75rem;
          justify-content: center;
          z-index: 150;
          padding-bottom: calc(1rem + env(safe-area-inset-bottom));
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .mobile-action-button {
          flex: 1;
          max-width: 150px;
          height: 50px;
          border: none;
          border-radius: 25px;
          font-size: 1rem;
          font-weight:
