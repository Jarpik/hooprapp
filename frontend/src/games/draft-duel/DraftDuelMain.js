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

  let cardClasses = `relative flex flex-col items-center p-6 m-2 rounded-2xl shadow-xl transform transition-all duration-300 ease-out w-64 h-80 sm:w-72 sm:h-96 border-4`;
  
  if (isDarkMode) {
    cardClasses += ` border-gray-700`;
  } else {
    cardClasses += ` border-gray-300`;
  }

  if (isSelected) {
    cardClasses += ` border-blue-500 ring-4 ring-blue-300 animate-pop-on-select`;
  } else if (isCorrect === true) {
    cardClasses += ` border-green-600 ring-4 ring-green-400 animate-pop-in`;
  } else if (isCorrect === false) {
    cardClasses += ` border-red-600 ring-4 ring-red-400 animate-shake`;
  } else if (!disabled) {
    cardClasses += ` hover:scale-103 hover:shadow-2xl`;
  }

  if (disabled) {
    cardClasses += ` opacity-70 cursor-not-allowed`;
  } else {
    cardClasses += ` cursor-pointer`;
  }

  return (
    <div className="flex flex-col items-center w-full max-w-xs mx-auto">
      <button
        className={cardClasses}
        onClick={() => onClick(player.id)}
        disabled={disabled}
        style={{ backgroundColor: cardBackgroundColor, color: cardTextColor }}
      >
        <img
          src={player.imageUrl}
          alt={player.name}
          className={`w-36 h-36 md:w-44 md:h-44 rounded-full object-cover mb-4 border-4 ${isDarkMode ? 'border-gray-800' : 'border-gray-100'} shadow-md transform transition-transform duration-300 hover:scale-105`}
          onError={(e) => { 
            e.target.onerror = null; 
            e.target.src = `https://placehold.co/200x200/666666/FFFFFF?text=${player.name.split(' ').map(n => n[0]).join('')}`; 
          }}
        />
        <h3 className="text-2xl md:text-3xl font-bold text-center mb-2 leading-tight">{player.name}</h3>
        <p className="text-lg text-center font-medium">{player.preDraftTeam}</p>
      </button>

      {showPick && (
        <div className={`mt-4 bg-gradient-to-r ${isDarkMode ? 'from-gray-800 to-gray-900' : 'from-gray-100 to-gray-200'} ${isDarkMode ? 'text-white' : 'text-gray-900'} text-center px-6 py-3 rounded-xl shadow-lg text-base md:text-lg w-full transform transition-all duration-500 ease-out animate-fade-in-up`}>
          <p className="font-bold text-yellow-300 text-xl md:text-2xl mb-1">Pick #{player.draftPick}</p>
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{player.team}</p>
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
      className="min-h-screen flex flex-col items-center justify-center p-4 relative App"
      style={{
        backgroundColor: isDarkMode ? '#1A202C' : '#F8F8F0',
        fontFamily: "'Outfit', sans-serif",
        backgroundImage: `url("data:image/svg+xml;utf8,${encodedBasketballPattern}")`,
        backgroundRepeat: 'repeat',
        backgroundSize: '200px 200px',
      }}
    >
      <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');

        body { font-family: 'Outfit', sans-serif; }
        .animate-shake {
          animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
          transform: translate3d(0, 0, 0);
          backface-visibility: hidden;
          perspective: 1000px;
        }
        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
          40%, 60% { transform: translate3d(4px, 0, 0); }
        }
        .animate-pop-in {
            animation: pop-in 0.3s ease-out forwards;
        }
        @keyframes pop-in {
            0% { transform: scale(0.8); opacity: 0; }
            70% { transform: scale(1.1); opacity: 1; }
            100% { transform: scale(1); }
        }
        .animate-pop-on-select {
            animation: pop-on-select 0.15s ease-out forwards;
        }
        @keyframes pop-on-select {
            0% { transform: scale(1); }
            50% { transform: scale(1.03); }
            100% { transform: scale(1.02); }
        }
        .animate-fade-in-up {
            animation: fade-in-up 0.5s ease-out forwards;
        }
        @keyframes fade-in-up {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
        }
        .vs-text {
          background: linear-gradient(to top, #FFD700 30%, #FF4500 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          color: transparent;
          filter: drop-shadow(0 0 8px rgba(255, 165, 0, 0.8)) drop-shadow(0 0 15px rgba(255, 69, 0, 0.6));
          animation: flicker 1.5s infinite alternate;
        }

        @keyframes flicker {
          0%, 100% { opacity: 1; transform: scale(1); }
          25% { opacity: 0.9; transform: scale(1.02); }
          50% { opacity: 1; transform: scale(1); }
          75% { opacity: 0.95; transform: scale(1.01); }
        }

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
          padding: 5px 5px;
          margin: 0 5px;
          position: relative;
          min-height: 60px;
        }

        .scoreboard-middle-box {
          flex: 2;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 5px 5px;
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

        .hover\\:scale-103:hover {
          transform: scale(1.03);
        }
        `}
      </style>

      {/* Dark/Light Mode Toggle Button */}
      <button
        onClick={toggleDarkMode}
        className={`absolute top-4 right-4 p-3 rounded-full shadow-lg transition-colors duration-300
          ${isDarkMode ? 'bg-gray-700 text-yellow-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}
        `}
        title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        {isDarkMode ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9 9 0 008.354-5.646z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h1M4 12H3m15.354 5.354l-.707.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        )}
      </button>

      {/* High School Basketball Scoreboard */}
      <div className="scoreboard mb-6 mt-4">
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

      {/* The main game content (player cards and VS) */}
      <div className="relative flex flex-col md:flex-row justify-center items-stretch gap-8 w-full max-w-5xl mt-6">
        {/* Basketball court SVG as background for the VS section */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-full h-full max-w-5xl max-h-96 relative overflow-hidden">
            <div
              className="absolute inset-0"
              dangerouslySetInnerHTML={{ __html: basketballCourtSVG }}
              style={{ transform: 'scale(0.38) translateY(35px)', opacity: 0.45 }}
            />
          </div>
        </div>

        {player1 && (
          <PlayerCard
            player={player1}
            onClick={handleGuess}
            isSelected={selectedPlayerId === player1.id}
            isCorrect={selectedPlayerId !== null ? (currentQuestion.getCorrectPlayerId(player1, player2) === player1.id) : null}
            showPick={selectedPlayerId !== null}
            disabled={selectedPlayerId !== null || gameOver}
            isDarkMode={isDarkMode}
          />
        )}
        
        {/* VS text styling */}
        <div className="relative z-10 flex items-center justify-center text-6xl font-extrabold md:px-4">
          <span className="vs-text">VS</span>
        </div>
        
        {player2 && (
          <PlayerCard
            player={player2}
            onClick={handleGuess}
            isSelected={selectedPlayerId === player2.id}
            isCorrect={selectedPlayerId !== null ? (currentQuestion.getCorrectPlayerId(player1, player2) === player2.id) : null}
            showPick={selectedPlayerId !== null}
            disabled={selectedPlayerId !== null || gameOver}
            isDarkMode={isDarkMode}
          />
        )}
      </div>

      {feedbackMessage && (
        <p className={`mt-10 text-3xl font-bold text-center px-6 py-4 rounded-xl shadow-lg animate-fade-in-up
          ${isCorrectGuess === true ? 'bg-green-700 text-white' : ''}
          ${isCorrectGuess === false ? 'bg-red-700 text-white' : ''}
          ${isCorrectGuess === null ? 'bg-blue-500 text-white' : ''}
        `}>
          {feedbackMessage}
        </p>
      )}

      {selectedPlayerId !== null && (
        <div className="mt-10 flex flex-col sm:flex-row gap-6">
          {!gameOver ? (
            <button
              onClick={handleContinue}
              className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-bold py-4 px-10 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-75 text-xl"
            >
              Continue
            </button>
          ) : (
            <>
              <button
                onClick={handleContinue}
                className="bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-bold py-4 px-10 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-green-400 focus:ring-opacity-75 text-xl"
              >
                Play Again
              </button>
              <button
                onClick={shareStreak}
                className="bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white font-bold py-4 px-10 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-purple-400 focus:ring-opacity-75 text-xl"
              >
                Share Streak
              </button>
            </>
          )}
        </div>
      )}

      {/* Share Streak Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fade-in-up">
          <div className={`p-8 rounded-2xl shadow-2xl max-w-md w-full text-center transform scale-105 transition-transform duration-300 ease-out
            ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}
          `}>
            <h2 className="text-3xl font-extrabold mb-6">Share Your Streak!</h2>
            <p className={`text-lg mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Copy the text below to share your amazing streak!
            </p>
            <textarea
              ref={shareTextRef}
              readOnly
              value={`I just scored a streak of ${currentStreak} in the NBA Rookie Draft Pick game! Think you can beat it? #NBADraftGame`}
              className={`w-full p-4 border-2 rounded-lg font-mono text-base resize-none mb-6 focus:outline-none focus:border-blue-500 h-28
                ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-gray-50 border-gray-300 text-gray-800'}
              `}
            />
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={handleCopyShareText}
                className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-400 text-lg"
              >
                Copy
              </button>
              <button
                onClick={handleCloseShareModal}
                className={`font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 text-lg
                  ${isDarkMode ? 'bg-gray-600 hover:bg-gray-500 text-white focus:ring-gray-400' : 'bg-gray-300 hover:bg-gray-400 text-gray-800 focus:ring-gray-400'}
                `}
              >
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
