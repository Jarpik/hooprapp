import React, { useState, useEffect, useCallback, useRef } from 'react';

// Define a mapping of preDraftTeam names to specific colors.
const TEAM_COLORS = {
  "Duke": "#001A57", // Dark Blue
  "Rutgers": "#CC0033", // Scarlet
  "Baylor": "#154734", // Dark Green
  "UCLA": "#2D68C4", // Blue
  "Texas": "#BF5700", // Burnt Orange
  "Oklahoma": "#841617", // Crimson
  "BYU": "#002255", // Navy Blue
  "South Carolina": "#73000A", // Garnet
  "Washington State": "#990000", // Crimson
  "Ratiopharm Ulm": "#FF6600", // Orange
  "Maryland": "#E03A3E", // Red
  "Arizona": "#003366", // Navy Blue
  "Georgetown": "#041E42", // Dark Blue
  "Qingdao Eagles": "#008080", // Teal
  "Cedevita Olimpija": "#005691", // Blue
  "Florida": "#0021A5", // Blue
  "Saint-Quentin": "#000080", // Navy
  "Illinois": "#13294B", // Dark Blue
  "North Carolina": "#7BAFD4", // Light Blue
  "Georgia": "#BA0C0F", // Red
  "Colorado State": "#004B40", // Dark Green
  "Michigan State": "#18453B", // Dark Green
  "Real Madrid": "#00529F", // Blue
  "Penn State": "#041E42", // Navy Blue
  "Saint Joseph's": "#800000", // Maroon
  "Le Mans Sarthe": "#2C3E50", // Dark Grey
  "Creighton": "#003366", // Blue
  "Auburn": "#0C2340", // Navy Blue
  "Arkansas": "#9D2235", // Cardinal
  "Tennessee": "#FF8200", // Orange
  "Marquette": "#002D62", // Blue
  "VCU": "#2C3E50", // Dark Grey
  "Liberty": "#800000", // Red
  "Wisconsin": "#C5050C", // Red
  "Northwestern": "#4E2A84", // Purple
  "Brisbane Bullets": "#002D62", // Blue
  "Mega Basket": "#FF0000", // Red
  "West Virginia": "#EAAA00", // Gold
  "Nevada": "#003366", // Blue
  "Cholet Basket": "#CC0000", // Red
  "Sydney Kings": "#522D80", // Purple
  "Illawarra Hawks": "#CC0000", // Red
  "Trento": "#2C3E50", // Dark Grey
  "DEFAULT": "#34495E", // Dark Slate Gray
};

// Function to determine text color based on background luminance
const getContrastTextColor = (hexcolor) => {
  if (!hexcolor || hexcolor === TEAM_COLORS.DEFAULT) return '#FFFFFF';
  const r = parseInt(hexcolor.substr(1, 2), 16);
  const g = parseInt(hexcolor.substr(3, 2), 16);
  const b = parseInt(hexcolor.substr(5, 2), 16);
  const y = (r * 299 + g * 587 + b * 114) / 1000;
  return (y >= 128) ? '#333333' : '#FFFFFF';
};

// Real data for 2025 NBA rookies
const ROOKIES_2025_NBA = [
  { id: 1, name: "Cooper Flagg", draftPick: 1, team: "Dallas Mavericks", preDraftTeam: "Duke", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/5041939.png&w=350&h=254", height: 81, age: 18, position: "Forward", conference: "ACC" },
  { id: 2, name: "Dylan Harper", draftPick: 2, team: "San Antonio Spurs", preDraftTeam: "Rutgers", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/5037871.png&w=350&h=254", height: 76, age: 18, position: "Guard", conference: "Big Ten" },
  { id: 3, name: "VJ Edgecombe", draftPick: 3, team: "Philadelphia 76ers", preDraftTeam: "Baylor", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/5124612.png&w=350&h=254", height: 77, age: 19, position: "Guard", conference: "Big 12" },
  { id: 4, name: "Kon Knueppel", draftPick: 4, team: "Charlotte Hornets", preDraftTeam: "Duke", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/5061575.png&w=350&h=254", height: 79, age: 19, position: "Forward", conference: "ACC" },
  { id: 5, name: "Ace Bailey", draftPick: 5, team: "Utah Jazz", preDraftTeam: "Rutgers", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/4873138.png&w=350&h=254", height: 81, age: 19, position: "Forward", conference: "Big Ten" },
  { id: 6, name: "Tre Johnson", draftPick: 6, team: "Washington Wizards", preDraftTeam: "Texas", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/5238230.png&w=350&h=254", height: 76, age: 19, position: "Guard", conference: "Big 12" },
  { id: 7, name: "Jeremiah Fears", draftPick: 7, team: "New Orleans Pelicans", preDraftTeam: "Oklahoma", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/5144091.png&w=350&h=254", height: 74, age: 18, position: "Guard", conference: "Big 12" },
  { id: 8, name: "Egor Demin", draftPick: 8, team: "Brooklyn Nets", preDraftTeam: "BYU", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/mens-college-basketball/players/full/5243213.png", height: 79, age: 19, position: "Guard", conference: "Big 12" },
  { id: 9, name: "Collin Murray-Boyles", draftPick: 9, team: "Toronto Raptors", preDraftTeam: "South Carolina", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/5093267.png&w=350&h=254", height: 80, age: 20, position: "Forward", conference: "SEC" },
  { id: 10, name: "Khaman Maluach", draftPick: 10, team: "Phoenix Suns", preDraftTeam: "Duke", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/5203685.png&w=350&h=254", height: 85, age: 18, position: "Center", conference: "ACC" },
  // Add more players as needed...
];

// PlayerCard component
const PlayerCard = ({ player, onClick, isSelected, isCorrect, showPick, disabled }) => {
  const cardBackgroundColor = TEAM_COLORS[player.preDraftTeam] || TEAM_COLORS.DEFAULT;
  const cardTextColor = getContrastTextColor(cardBackgroundColor);

  const cardClasses = `
    draft-duel-player-card
    ${isSelected ? 'selected' : ''}
    ${isCorrect === true ? 'correct' : ''}
    ${isCorrect === false ? 'incorrect' : ''}
    ${disabled ? 'disabled' : ''}
  `;

  return (
    <div className="draft-duel-player-wrapper">
      <button
        className={cardClasses}
        onClick={() => onClick(player.id)}
        disabled={disabled}
        style={{ backgroundColor: cardBackgroundColor, color: cardTextColor }}
      >
        <img
          src={player.imageUrl}
          alt={player.name}
          className="draft-duel-player-image"
          onError={(e) => { 
            e.target.onerror = null; 
            e.target.src = `https://placehold.co/200x200/666666/FFFFFF?text=${player.name.split(' ').map(n => n[0]).join('')}`; 
          }}
        />
        <h3 className="draft-duel-player-name">{player.name}</h3>
        <p className="draft-duel-player-team">{player.preDraftTeam}</p>
      </button>

      {showPick && (
        <div className="draft-duel-answer-reveal">
          <p className="draft-duel-pick-number">Pick #{player.draftPick}</p>
          <p className="draft-duel-nba-team">{player.team}</p>
        </div>
      )}
    </div>
  );
};

const DraftDuelMain = () => {
  const [player1, setPlayer1] = useState(null);
  const [player2, setPlayer2] = useState(null);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [highScore, setHighScore] = useState(0);
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

  // Define all possible question types
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
      filter: (p1, p2) => (p1.position === "Forward" && p2.position === "Guard") || (p2.position === "Forward" && p1.position === "Guard"),
    },
  ];

  // Handle time out
  const handleTimeOut = useCallback(() => {
    setIsCorrectGuess(false);
    setFeedbackMessage('Time ran out! You need to make a pick within 10 seconds.');
    setGameOver(true);
    if (currentStreak > highScore) {
      setHighScore(currentStreak);
      localStorage.setItem('draftDuelHighScore', currentStreak.toString());
    }
    if (player1) {
      setSelectedPlayerId(player1.id);
    }
  }, [currentStreak, highScore, player1]);

  // Select random rookies and question
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
    const savedHighScore = localStorage.getItem('draftDuelHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }
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
      setFeedbackMessage('Correct! Click "Continue" to play the next round.');
    } else {
      setIsCorrectGuess(false);
      setFeedbackMessage('Incorrect! Click "Play Again" to try again.');
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
    <div className={`draft-duel-game ${isDarkMode ? 'dark-mode' : ''}`}>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');
          
          .draft-duel-game {
            width: 100%;
            max-width: 1200px;
            margin: 0 auto;
            padding: 1rem;
            font-family: 'Inter', sans-serif;
          }

          /* Dark Mode Toggle */
          .draft-duel-theme-toggle {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: rgba(255, 255, 255, 0.1);
            border: none;
            border-radius: 50%;
            width: 3rem;
            height: 3rem;
            font-size: 1.5rem;
            cursor: pointer;
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
            z-index: 100;
          }

          .draft-duel-theme-toggle:hover {
            background: rgba(255, 255, 255, 0.2);
            transform: scale(1.1);
          }

          /* Scoreboard */
          .draft-duel-scoreboard {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
            padding: 1.5rem 2rem;
            border-radius: 15px;
            margin-bottom: 2rem;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
          }

          .draft-duel-score-section, .draft-duel-timer-section {
            display: flex;
            flex-direction: column;
            align-items: center;
            min-width: 120px;
          }

          .draft-duel-question-section {
            flex: 1;
            text-align: center;
          }

          .draft-duel-score-label, .draft-duel-timer-label {
            font-size: 0.9rem;
            font-weight: bold;
            margin-bottom: 0.5rem;
            opacity: 0.9;
            color: white;
          }

          .draft-duel-score-value, .draft-duel-timer-value {
            font-size: 2rem;
            font-weight: bold;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
            color: white;
          }

          .draft-duel-timer-value.warning {
            color: #ff4444;
            animation: pulse 1s infinite;
          }

          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
          }

          .draft-duel-question-text {
            font-size: 1.25rem;
            font-weight: bold;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
            color: white;
          }

          /* Game Area */
          .draft-duel-game-area {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 2rem;
          }

          .draft-duel-players-comparison {
            position: relative;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 2rem;
          }

          .draft-duel-player-cards-container {
            display: flex;
            gap: 3rem;
            align-items: center;
            justify-content: center;
            flex-wrap: wrap;
          }

          /* Player Cards */
          .draft-duel-player-wrapper {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1rem;
          }

          .draft-duel-player-card {
            position: relative;
            width: 280px;
            height: 350px;
            border-radius: 20px;
            padding: 1.5rem;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            backdrop-filter: blur(10px);
            border: 2px solid rgba(255, 255, 255, 0.1);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-between;
            background: none;
          }

          .draft-duel-player-card:hover:not(.disabled) {
            transform: translateY(-10px) scale(1.05);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
            border-color: rgba(255, 255, 255, 0.3);
          }

          .draft-duel-player-card.selected {
            border-color: #3b82f6;
            box-shadow: 0 0 30px rgba(59, 130, 246, 0.5);
          }

          .draft-duel-player-card.correct {
            border-color: #22c55e;
            box-shadow: 0 0 30px rgba(34, 197, 94, 0.5);
          }

          .draft-duel-player-card.incorrect {
            border-color: #ef4444;
            box-shadow: 0 0 30px rgba(239, 68, 68, 0.5);
          }

          .draft-duel-player-card.disabled {
            opacity: 0.7;
            cursor: not-allowed;
          }

          .draft-duel-player-image {
            width: 120px;
            height: 150px;
            border-radius: 15px;
            object-fit: cover;
            margin-bottom: 1rem;
            border: 3px solid rgba(255, 255, 255, 0.2);
          }

          .draft-duel-player-name {
            font-size: 1.5rem;
            font-weight: bold;
            margin-bottom: 0.5rem;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
            text-align: center;
          }

          .draft-duel-player-team {
            font-size: 1.1rem;
            opacity: 0.9;
            margin: 0;
            text-align: center;
          }

          .draft-duel-answer-reveal {
            background: rgba(0, 0, 0, 0.8);
            color: #ffffff;
            padding: 1rem;
            border-radius: 10px;
            font-weight: bold;
            text-align: center;
            animation: slideUp 0.5s ease;
            min-width: 200px;
          }

          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .draft-duel-pick-number {
            font-size: 1.5rem;
            color: #fbbf24;
            margin-bottom: 0.5rem;
          }

          .draft-duel-nba-team {
            font-size: 1rem;
            opacity: 0.9;
            margin: 0;
          }

          /* VS Text */
          .draft-duel-vs-text {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            font-size: 3rem;
            font-weight: bold;
            color: #f97316;
            text-shadow: 0 0 20px rgba(249, 115, 22, 0.5);
            animation: glow 2s ease-in-out infinite alternate;
            z-index: 10;
          }

          @keyframes glow {
            from {
              text-shadow: 0 0 20px rgba(249, 115, 22, 0.5);
            }
            to {
              text-shadow: 0 0 30px rgba(249, 115, 22, 0.8);
            }
          }

          /* Feedback */
          .draft-duel-feedback {
            font-size: 2rem;
            font-weight: bold;
            text-align: center;
            padding: 1rem 2rem;
            border-radius: 15px;
            backdrop-filter: blur(10px);
            border: 2px solid;
            animation: fadeIn 0.5s ease;
          }

          .draft-duel-feedback.correct {
            background: rgba(34, 197, 94, 0.2);
            border-color: #22c55e;
            color: #22c55e;
          }

          .draft-duel-feedback.incorrect {
            background: rgba(239, 68, 68, 0.2);
            border-color: #ef4444;
            color: #ef4444;
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: scale(0.8);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }

          /* Buttons */
          .draft-duel-buttons {
            display: flex;
            gap: 1rem;
            justify-content: center;
            flex-wrap: wrap;
            margin-top: 2rem;
          }

          .draft-duel-button {
            padding: 1rem 2rem;
            border: none;
            border-radius: 10px;
            font-size: 1.1rem;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
            border: 2px solid;
          }

          .draft-duel-button.continue {
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
            color: #ffffff;
            border-color: #3b82f6;
          }

          .draft-duel-button.play-again {
            background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
            color: #ffffff;
            border-color: #f97316;
          }

          .draft-duel-button.share {
            background: rgba(255, 255, 255, 0.1);
            color: #ffffff;
            border-color: rgba(255, 255, 255, 0.3);
          }

          .draft-duel-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
          }

          /* Share Modal */
          .draft-duel-share-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            backdrop-filter: blur(10px);
          }

          .draft-duel-share-content {
            background: rgba(15, 23, 42, 0.95);
            padding: 2rem;
            border-radius: 20px;
            max-width: 500px;
            width: 90%;
            text-align: center;
            color: white;
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1);
          }

          .draft-duel-share-content h2 {
            margin-bottom: 1rem;
            color: #f97316;
          }

          .draft-duel-share-textarea {
            width: 100%;
            min-height: 100px;
            padding: 1rem;
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 10px;
            background: rgba(0, 0, 0, 0.5);
            color: white;
            font-family: monospace;
            resize: none;
            margin-bottom: 1rem;
          }

          .draft-duel-share-buttons {
            display: flex;
            gap: 1rem;
            justify-content: center;
          }

          /* Responsive Design */
          @media (max-width: 768px) {
            .draft-duel-scoreboard {
              flex-direction: column;
              gap: 1rem;
              text-align: center;
              padding: 1rem;
            }
            
            .draft-duel-score-section, .draft-duel-timer-section {
              min-width: auto;
            }
            
            .draft-duel-players-comparison {
              flex-direction: column;
              gap: 1rem;
            }
            
            .draft-duel-player-cards-container {
              flex-direction: column;
              gap: 2rem;
            }
            
            .draft-duel-player-card {
              width: 100%;
              max-width: 280px;
            }
            
            .draft-duel-vs-text {
              position: static;
              transform: none;
              font-size: 2rem;
              margin: 1rem 0;
            }
            
            .draft-duel-buttons {
              flex-direction: column;
              align-items: center;
            }
            
            .draft-duel-button {
              width: 100%;
              max-width: 200px;
            }
          }

          @media (max-width: 480px) {
            .draft-duel-player-card {
              width: 100%;
              height: 300px;
            }
            
            .draft-duel-scoreboard {
              padding: 1rem;
            }
            
            .draft-duel-score-value, .draft-duel-timer-value {
              font-size: 1.5rem;
            }
            
            .draft-duel-question-text {
              font-size: 1rem;
            }
            
            .draft-duel-vs-text {
              font-size: 1.5rem;
            }
          }
        `}
      </style>

      {/* Theme Toggle */}
      <button 
        className="draft-duel-theme-toggle"
        onClick={toggleDarkMode}
        aria-label="Toggle theme"
      >
        {isDarkMode ? '☀️' : '🌙'}
      </button>

      {/* Scoreboard */}
      <div className="draft-duel-scoreboard">
        <div className="draft-duel-score-section">
          <span className="draft-duel-score-label">STREAK</span>
          <span className="draft-duel-score-value">{currentStreak}</span>
        </div>
        <div className="draft-duel-question-section">
          <span className="draft-duel-question-text">
            {currentQuestion ? currentQuestion.text : "Loading question..."}
          </span>
        </div>
        <div className="draft-duel-timer-section">
          <span className="draft-duel-timer-label">SHOT CLOCK</span>
          <span className={`draft-duel-timer-value ${shotClockTime <= 3 ? 'warning' : ''}`}>
            {shotClockTime}
          </span>
        </div>
      </div>

      {/* Game Area */}
      <div className="draft-duel-game-area">
        {!gameOver && selectedPlayerId === null && (
          <div className="draft-duel-players-comparison">
            <div className="draft-duel-player-cards-container">
              {player1 && (
                <PlayerCard
                  player={player1}
                  onClick={handleGuess}
                  isSelected={selectedPlayerId === player1.id}
                  isCorrect={selectedPlayerId !== null ? (currentQuestion?.getCorrectPlayerId(player1, player2) === player1.id) : null}
                  showPick={selectedPlayerId !== null}
                  disabled={selectedPlayerId !== null || gameOver}
                />
              )}
              {player2 && (
                <PlayerCard
                  player={player2}
                  onClick={handleGuess}
                  isSelected={selectedPlayerId === player2.id}
                  isCorrect={selectedPlayerId !== null ? (currentQuestion?.getCorrectPlayerId(player1, player2) === player2.id) : null}
                  showPick={selectedPlayerId !== null}
                  disabled={selectedPlayerId !== null || gameOver}
                />
              )}
            </div>
            
            {/* VS Text */}
            <div className="draft-duel-vs-text">VS</div>
          </div>
        )}

        {/* Show cards with results after selection */}
        {selectedPlayerId !== null && (
          <div className="draft-duel-players-comparison">
            <div className="draft-duel-player-cards-container">
              {player1 && (
                <PlayerCard
                  player={player1}
                  onClick={() => {}}
                  isSelected={selectedPlayerId === player1.id}
                  isCorrect={currentQuestion?.getCorrectPlayerId(player1, player2) === player1.id}
                  showPick={true}
                  disabled={true}
                />
              )}
              {player2 && (
                <PlayerCard
                  player={player2}
                  onClick={() => {}}
                  isSelected={selectedPlayerId === player2.id}
                  isCorrect={currentQuestion?.getCorrectPlayerId(player1, player2) === player2.id}
                  showPick={true}
                  disabled={true}
                />
              )}
            </div>
            
            <div className="draft-duel-vs-text">VS</div>
          </div>
        )}

        {/* Feedback */}
        {feedbackMessage && (
          <div className={`draft-duel-feedback ${isCorrectGuess === true ? 'correct' : 'incorrect'}`}>
            {feedbackMessage}
          </div>
        )}

        {/* Buttons */}
        {selectedPlayerId !== null && (
          <div className="draft-duel-buttons">
            {!gameOver ? (
              <button
                onClick={handleContinue}
                className="draft-duel-button continue"
              >
                Continue
              </button>
            ) : (
              <>
                <button
                  onClick={handleContinue}
                  className="draft-duel-button play-again"
                >
                  Play Again
                </button>
                <button
                  onClick={shareStreak}
                  className="draft-duel-button share"
                >
                  Share Streak
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="draft-duel-share-modal">
          <div className="draft-duel-share-content">
            <h2>Share Your Streak!</h2>
            <p>Copy the text below to share your streak:</p>
            <textarea
              ref={shareTextRef}
              className="draft-duel-share-textarea"
              readOnly
              value={`I just scored a streak of ${currentStreak} in Draft Duel on HooprApp! 🏀 Think you can beat it?`}
            />
            <div className="draft-duel-share-buttons">
              <button
                onClick={handleCopyShareText}
                className="draft-duel-button continue"
              >
                Copy
              </button>
              <button
                onClick={handleCloseShareModal}
                className="draft-duel-button share"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DraftDuelMain;
