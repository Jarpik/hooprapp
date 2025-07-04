import React, { useState, useEffect, useCallback, useRef } from 'react';

// Team colors mapping exactly as specified
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

// NBA Rookies data
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
];

// PlayerCard component matching the original specification
const PlayerCard = ({ player, onClick, isSelected, isCorrect, showPick, disabled, isDarkMode }) => {
  const cardBackgroundColor = TEAM_COLORS[player.preDraftTeam] || TEAM_COLORS.DEFAULT;
  const cardTextColor = getContrastTextColor(cardBackgroundColor);

  let cardClasses = "player-card";
  if (isSelected) cardClasses += " selected";
  if (isCorrect === true) cardClasses += " correct";
  if (isCorrect === false) cardClasses += " incorrect";
  if (disabled) cardClasses += " disabled";

  return (
    <div className="player-card-wrapper">
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
            e.target.src = `https://placehold.co/200x200/666666/FFFFFF?text=${player.name.split(' ').map(n => n[0]).join('')}`; 
          }}
        />
        <h3 className="player-name">{player.name}</h3>
        <p className="player-team">{player.preDraftTeam}</p>
      </button>

      {showPick && (
        <div className="reveal-section">
          <p className="pick-number">Pick #{player.draftPick}</p>
          <p className="nba-team">{player.team}</p>
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

  // Question types
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

  // Generate background SVGs
  const basketballPatternSVG = `
    <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <g opacity="0.055">
        <circle cx="50" cy="50" r="45" fill="#FF8C00" stroke="#000000" stroke-width="2"/>
        <path d="M50 5 C75 5 95 25 95 50 C95 75 75 95 50 95 C25 95 5 75 5 50 C5 25 25 5 50 5Z" fill="none" stroke="#000000" stroke-width="2"/>
        <path d="M5 50 H95 M50 5 V95" fill="none" stroke="#000000" stroke-width="2"/>
        <path d="M15 85 Q25 70 50 70 Q75 70 85 85" fill="none" stroke="#000000" stroke-width="2"/>
        <path d="M15 15 Q25 30 50 30 Q75 30 85 15" fill="none" stroke="#000000" stroke-width="2"/>
      </g>
      <g transform="translate(100 100)" opacity="0.055">
        <circle cx="50" cy="50" r="45" fill="#FF8C00" stroke="#000000" stroke-width="2"/>
        <path d="M50 5 C75 5 95 25 95 50 C95 75 75 95 50 95 C25 95 5 75 5 50 C5 25 25 5 50 5Z" fill="none" stroke="#000000" stroke-width="2"/>
        <path d="M5 50 H95 M50 5 V95" fill="none" stroke="#000000" stroke-width="2"/>
        <path d="M15 85 Q25 70 50 70 Q75 70 85 85" fill="none" stroke="#000000" stroke-width="2"/>
        <path d="M15 15 Q25 30 50 30 Q75 30 85 15" fill="none" stroke="#000000" stroke-width="2"/>
      </g>
    </svg>
  `;

  const basketballCourtSVG = `
    <svg width="100%" height="100%" viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width="1000" height="500" fill="${isDarkMode ? '#332211' : '#F0D8B6'}" fill-opacity="0.25" rx="10" ry="10"/>
      <rect x="0" y="0" width="1000" height="500" fill="none" stroke="${isDarkMode ? '#D4AF37' : '#8B4513'}" stroke-width="6" stroke-opacity="0.45" rx="10" ry="10"/>
      <line x1="500" y1="0" x2="500" y2="500" stroke="${isDarkMode ? '#D4AF37' : '#8B4513'}" stroke-width="6" stroke-opacity="0.45"/>
      <circle cx="500" cy="250" r="60" fill="none" stroke="${isDarkMode ? '#D4AF37' : '#8B4513'}" stroke-width="6" stroke-opacity="0.45"/>
      <circle cx="500" cy="250" r="10" fill="${isDarkMode ? '#D4AF37' : '#8B4513'}" fill-opacity="0.45"/>
      <path d="M 100 50 L 100 450 L 400 450 L 400 50 Z" fill="none" stroke="${isDarkMode ? '#D4AF37' : '#8B4513'}" stroke-width="6" stroke-opacity="0.45"/>
      <path d="M 100 50 A 237.5 237.5 0 0 1 100 450" fill="none" stroke="${isDarkMode ? '#D4AF37' : '#8B4513'}" stroke-width="6" stroke-opacity="0.45"/>
      <rect x="0" y="150" width="190" height="200" fill="none" stroke="${isDarkMode ? '#D4AF37' : '#8B4513'}" stroke-width="6" stroke-opacity="0.45"/>
      <circle cx="190" cy="250" r="60" fill="none" stroke="${isDarkMode ? '#D4AF37' : '#8B4513'}" stroke-width="6" stroke-opacity="0.45"/>
      <line x1="190" y1="150" x2="190" y2="350" stroke="${isDarkMode ? '#D4AF37' : '#8B4513'}" stroke-width="6" stroke-opacity="0.45"/>
      <circle cx="60" cy="250" r="7.5" fill="${isDarkMode ? '#D4AF37' : '#8B4513'}" fill-opacity="0.45"/>
      <line x1="60" y1="230" x2="60" y2="270" stroke="${isDarkMode ? '#D4AF37' : '#8B4513'}" stroke-width="3" stroke-opacity="0.45"/>
      <line x1="40" y1="250" x2="80" y2="250" stroke="${isDarkMode ? '#D4AF37' : '#8B4513'}" stroke-width="3" stroke-opacity="0.45"/>
      <path d="M 900 50 L 900 450 L 600 450 L 600 50 Z" fill="none" stroke="${isDarkMode ? '#D4AF37' : '#8B4513'}" stroke-width="6" stroke-opacity="0.45"/>
      <path d="M 900 50 A 237.5 237.5 0 0 0 900 450" fill="none" stroke="${isDarkMode ? '#D4AF37' : '#8B4513'}" stroke-width="6" stroke-opacity="0.45"/>
      <rect x="810" y="150" width="190" height="200" fill="none" stroke="${isDarkMode ? '#D4AF37' : '#8B4513'}" stroke-width="6" stroke-opacity="0.45"/>
      <circle cx="810" cy="250" r="60" fill="none" stroke="${isDarkMode ? '#D4AF37' : '#8B4513'}" stroke-width="6" stroke-opacity="0.45"/>
      <line x1="810" y1="150" x2="810" y2="350" stroke="${isDarkMode ? '#D4AF37' : '#8B4513'}" stroke-width="6" stroke-opacity="0.45"/>
      <circle cx="940" cy="250" r="7.5" fill="${isDarkMode ? '#D4AF37' : '#8B4513'}" fill-opacity="0.45"/>
      <line x1="940" y1="230" x2="940" y2="270" stroke="${isDarkMode ? '#D4AF37' : '#8B4513'}" stroke-width="3" stroke-opacity="0.45"/>
      <line x1="920" y1="250" x2="960" y2="250" stroke="${isDarkMode ? '#D4AF37' : '#8B4513'}" stroke-width="3" stroke-opacity="0.45"/>
    </svg>
  `;

  const encodedBasketballPattern = encodeURIComponent(basketballPatternSVG).replace(/'/g, '%27').replace(/"/g, '%22');

  // Game logic functions
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
    <div 
      className={`draft-duel-container ${isDarkMode ? 'dark-mode' : ''}`}
      style={{
        backgroundColor: isDarkMode ? '#1A202C' : '#F8F8F0',
        backgroundImage: `url("data:image/svg+xml;utf8,${encodedBasketballPattern}")`,
        backgroundRepeat: 'repeat',
        backgroundSize: '200px 200px',
      }}
    >
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');
        
        .draft-duel-container {
          min-height: 100vh;
          padding: 2rem;
          font-family: 'Outfit', sans-serif;
          position: relative;
        }

        /* Dark Mode Toggle */
        .theme-toggle {
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

        .theme-toggle:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: scale(1.1);
        }

        /* Scoreboard */
        .scoreboard {
          background-color: #000;
          border: 5px solid #333;
          border-radius: 15px;
          display: flex;
          width: 95%;
          max-width: 800px;
          box-shadow: inset 0 0 20px rgba(0,0,0,0.7), 0 8px 20px rgba(0,0,0,0.5);
          font-family: 'VT323', monospace;
          color: #FF8C00;
          text-shadow: 0 0 12px rgba(255, 140, 0, 0.8);
          position: relative;
          padding: 5px;
          min-height: 100px;
          height: auto;
          margin: 0 auto 2rem;
        }

        .scoreboard-box {
          background-color: #000;
          border: 2px solid #333;
          border-radius: 8px;
          box-shadow: inset 0 0 10px rgba(0,0,0,0.5), 0 2px 5px rgba(0,0,0,0.2);
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          padding: 5px;
          margin: 0 5px;
          position: relative;
          min-height: 60px;
        }

        .scoreboard-middle-box {
          flex: 2;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 5px;
        }

        .scoreboard-box:not(.scoreboard-middle-box)::before {
          content: '';
          position: absolute;
          left: 5%;
          right: 5%;
          top: 45%;
          transform: translateY(-50%);
          height: 2px;
          background-color: #333;
          box-shadow: 0 0 5px rgba(255, 140, 0, 0.5);
        }

        .scoreboard-label {
          font-family: 'Outfit', sans-serif;
          font-size: 1.2rem;
          font-weight: 700;
          color: #FFD700;
          margin-bottom: 5px;
          align-self: center;
          padding-top: 5px;
        }

        .scoreboard-value {
          font-family: 'VT323', monospace;
          font-size: 3rem;
          font-weight: 700;
          line-height: 1;
          color: #FF8C00;
          text-shadow: 0 0 15px rgba(255, 140, 0, 0.8);
          align-self: center;
          padding-bottom: 5px;
        }

        .scoreboard-question-text {
          font-family: 'Outfit', sans-serif;
          font-size: 1.2rem;
          font-weight: 700;
          color: ${isDarkMode ? '#FFF' : '#333'};
          text-shadow: 0 0 8px rgba(${isDarkMode ? '255,255,255' : '0,0,0'},0.6);
          text-align: center;
          align-self: flex-start;
          width: 100%;
          padding-top: 5px;
        }

        .scoreboard-timer {
          font-family: 'VT323', monospace;
          font-size: 3rem;
          font-weight: 700;
          line-height: 1;
          color: #FF0000;
          text-shadow: 0 0 15px rgba(255, 0, 0, 0.9);
          min-width: 100px;
          text-align: center;
          align-self: flex-end;
          width: 100%;
          padding-bottom: 5px;
        }

        .scoreboard-timer.warning {
          color: #FF3333;
          text-shadow: 0 0 20px rgba(255, 50, 50, 1);
          animation: pulse-red 1s infinite alternate;
        }

        @keyframes pulse-red {
          from { text-shadow: 0 0 15px rgba(255, 0, 0, 0.9); }
          to { text-shadow: 0 0 25px rgba(255, 0, 0, 1.2); }
        }

        /* Game Area */
        .game-area {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2rem;
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
        }

        /* Basketball Court Background */
        .court-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
          opacity: 0.45;
          transform: scale(0.38) translateY(35px);
          pointer-events: none;
        }

        /* Player Comparison */
        .players-comparison {
          position: relative;
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 4rem;
          flex-wrap: wrap;
        }

        .player-card-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        /* Player Cards */
        .player-card {
          position: relative;
          width: 16rem;
          height: 20rem;
          border-radius: 1rem;
          padding: 1.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
          border: 4px solid rgba(255, 255, 255, 0.2);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          background: none;
          font-family: inherit;
        }

        .player-card:hover:not(.disabled) {
          transform: translateY(-8px) scale(1.03);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
        }

        .player-card.selected {
          border-color: #3B82F6;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.3);
          animation: pop-on-select 0.15s ease-out;
        }

        .player-card.correct {
          border-color: #10B981;
          box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.4);
          animation: pop-in 0.3s ease-out;
        }

        .player-card.incorrect {
          border-color: #EF4444;
          box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.4);
          animation: shake 0.5s ease-out;
        }

        .player-card.disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        @keyframes pop-on-select {
          0% { transform: scale(1); }
          50% { transform: scale(1.03); }
          100% { transform: scale(1.02); }
        }

        @keyframes pop-in {
          0% { transform: scale(0.8); opacity: 0; }
          70% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); }
        }

        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
          40%, 60% { transform: translate3d(4px, 0, 0); }
        }

        /* Player Card Content */
        .player-image {
          width: 9rem;
          height: 11rem;
          border-radius: 50%;
          object-fit: cover;
          margin-bottom: 1rem;
          border: 4px solid rgba(255, 255, 255, 0.2);
          transition: transform 0.3s ease;
        }

        .player-card:hover .player-image {
          transform: scale(1.05);
        }

        .player-name {
          font-size: 1.5rem;
          font-weight: 700;
          text-align: center;
          margin-bottom: 0.5rem;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }

        .player-team {
          font-size: 1.125rem;
          text-align: center;
          font-weight: 500;
          margin: 0;
          opacity: 0.9;
        }

        /* Reveal Section */
        .reveal-section {
          background: linear-gradient(135deg, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.9));
          color: #ffffff;
          padding: 1rem 1.5rem;
          border-radius: 0.75rem;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
          text-align: center;
          animation: fade-in-up 0.5s ease-out;
          min-width: 200px;
        }

        .pick-number {
          font-size: 1.5rem;
          font-weight: 700;
          color: #FBBF24;
          margin-bottom: 0.5rem;
        }

        .nba-team {
          font-size: 1rem;
          opacity: 0.9;
          margin: 0;
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* VS Text */
        .vs-text {
          font-size: 6rem;
          font-weight: 800;
          background: linear-gradient(to top, #FFD700 30%, #FF4500 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: drop-shadow(0 0 8px rgba(255, 165, 0, 0.8)) drop-shadow(0 0 15px rgba(255, 69, 0, 0.6));
          animation: flicker 1.5s infinite alternate;
          position: absolute;
          z-index: 10;
        }

        @keyframes flicker {
          0%, 100% { opacity: 1; transform: scale(1); }
          25% { opacity: 0.9; transform: scale(1.02); }
          50% { opacity: 1; transform: scale(1); }
          75% { opacity: 0.95; transform: scale(1.01); }
        }

        /* Feedback Message */
        .feedback-message {
          font-size: 3rem;
          font-weight: 700;
          text-align: center;
          padding: 1.5rem 2rem;
          border-radius: 0.75rem;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
          animation: fade-in-up 0.5s ease-out;
          margin-top: 2rem;
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

        /* Action Buttons */
        .action-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
          margin-top: 2rem;
        }

        .action-button {
          padding: 1rem 2rem;
          border: none;
          border-radius: 9999px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          min-width: 140px;
        }

        .action-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        }

        .action-button:active {
          transform: translateY(0);
        }

        .continue-button {
          background: linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%);
          color: white;
        }

        .play-again-button {
          background: linear-gradient(135deg, #10B981 0%, #059669 100%);
          color: white;
        }

        .share-button {
          background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%);
          color: white;
        }

        /* Share Modal */
        .share-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.75);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          padding: 1rem;
          animation: fade-in-up 0.3s ease-out;
        }

        .share-modal {
          background: ${isDarkMode ? '#2D3748' : '#FFFFFF'};
          color: ${isDarkMode ? '#FFFFFF' : '#2D3748'};
          padding: 2rem;
          border-radius: 1.5rem;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          max-width: 28rem;
          width: 100%;
          text-align: center;
        }

        .share-modal h2 {
          font-size: 3rem;
          font-weight: 800;
          margin-bottom: 1rem;
          color: ${isDarkMode ? '#FFFFFF' : '#2D3748'};
        }

        .share-modal p {
          font-size: 1.125rem;
          margin-bottom: 1rem;
          color: ${isDarkMode ? '#A0AEC0' : '#4A5568'};
        }

        .share-textarea {
          width: 100%;
          padding: 1rem;
          border: 2px solid ${isDarkMode ? '#4A5568' : '#E2E8F0'};
          border-radius: 0.5rem;
          font-family: 'Courier New', monospace;
          font-size: 1rem;
          resize: none;
          height: 7rem;
          margin-bottom: 1rem;
          background: ${isDarkMode ? '#1A202C' : '#F7FAFC'};
          color: ${isDarkMode ? '#FFFFFF' : '#2D3748'};
        }

        .share-textarea:focus {
          outline: none;
          border-color: #3B82F6;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
        }

        .share-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
        }

        .copy-button {
          background: linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%);
          color: white;
        }

        .back-button {
          background: ${isDarkMode ? '#4A5568' : '#E2E8F0'};
          color: ${isDarkMode ? '#FFFFFF' : '#2D3748'};
        }

        .back-button:hover {
          background: ${isDarkMode ? '#2D3748' : '#CBD5E0'};
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .draft-duel-container {
            padding: 1rem;
          }
          
          .scoreboard {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
            padding: 1rem;
          }
          
          .scoreboard-box, .scoreboard-middle-box {
            min-width: auto;
          }
          
          .players-comparison {
            flex-direction: column;
            gap: 1rem;
          }
          
          .player-card {
            width: 100%;
            max-width: 280px;
          }
          
          .vs-text {
            position: static;
            font-size: 4rem;
            margin: 1rem 0;
          }
          
          .action-buttons {
            flex-direction: column;
            align-items: center;
          }
          
          .action-button {
            width: 100%;
            max-width: 200px;
          }
        }

        @media (max-width: 480px) {
          .player-card {
            width: 100%;
            height: 18rem;
          }
          
          .scoreboard {
            padding: 1rem;
          }
          
          .scoreboard-value, .scoreboard-timer {
            font-size: 2rem;
          }
          
          .scoreboard-question-text {
            font-size: 1rem;
          }
          
          .vs-text {
            font-size: 3rem;
          }
          
          .feedback-message {
            font-size: 2rem;
          }
        }
      `}</style>

      {/* Theme Toggle */}
      <button 
        className="theme-toggle"
        onClick={toggleDarkMode}
        aria-label="Toggle theme"
      >
        {isDarkMode ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h1M4 12H3m15.354 5.354l-.707.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9 9 0 008.354-5.646z" />
          </svg>
        )}
      </button>

      {/* High School Basketball Scoreboard */}
      <div className="scoreboard">
        <div className="scoreboard-box">
          <div className="scoreboard-label">Streak</div>
          <div className="scoreboard-value">{currentStreak}</div>
        </div>

        <div className="scoreboard-box scoreboard-middle-box">
          <div className="scoreboard-question-text">
            {currentQuestion ? currentQuestion.text : "Loading question..."}
          </div>
          <div className={`scoreboard-timer ${shotClockTime <= 3 ? 'warning' : ''}`}>
            {shotClockTime}
          </div>
        </div>

        <div className="scoreboard-box">
          <div className="scoreboard-label">High Score</div>
          <div className="scoreboard-value">{highScore}</div>
        </div>
      </div>

      {/* Game Area */}
      <div className="game-area">
        {/* Basketball Court Background */}
        <div className="court-background" dangerouslySetInnerHTML={{ __html: basketballCourtSVG }} />

        {/* Player Comparison */}
        <div className="players-comparison">
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
          
          {/* VS Text */}
          <div className="vs-text">VS</div>
          
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

        {/* Feedback */}
        {feedbackMessage && (
          <div className={`feedback-message ${
            isCorrectGuess === true ? 'correct' : 
            isCorrectGuess === false ? 'incorrect' : 'timeout'
          }`}>
            {feedbackMessage}
          </div>
        )}

        {/* Action Buttons */}
        {selectedPlayerId !== null && (
          <div className="action-buttons">
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
                  Share Streak
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="share-modal-overlay">
          <div className="share-modal">
            <h2>Share Your Streak!</h2>
            <p>Copy the text below to share your amazing streak!</p>
            <textarea
              ref={shareTextRef}
              className="share-textarea"
              readOnly
              value={`I just scored a streak of ${currentStreak} in the NBA Rookie Draft Pick game! Think you can beat it? #NBADraftGame`}
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

export default DraftDuelMain;
