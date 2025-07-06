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

// Simple PlayerCard component
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
        <div className="player-stats">
          <span className="stat-badge">{player.position}</span>
          <span className="stat-badge">{Math.floor(player.height/12)}'{player.height%12}"</span>
        </div>
      </button>

      {showPick && (
        <div className="reveal-section">
          <p className="pick-number">Pick #{player.draftPick}</p>
          <p className="nba-team">{player.team}</p>
          <p className="summer-league">{player.summerLeague}</p>
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

  // Inline styles for mobile
  const mobileStyles = {
    container: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: isDarkMode ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' : 'linear-gradient(135deg, #f8f9fa 0%, #dee2e6 100%)',
      fontFamily: "'Outfit', sans-serif",
      color: isDarkMode ? '#ffffff' : '#333333',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      WebkitTextSizeAdjust: '100%',
      userSelect: 'none'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem',
      paddingTop: 'calc(1rem + env(safe-area-inset-top))'
    },
    title: {
      fontSize: '2rem',
      fontWeight: '800',
      background: 'linear-gradient(45deg, #FFD700, #FF8C00, #FF4500)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      textAlign: 'center',
      flex: 1
    },
    themeToggle: {
      background: 'rgba(255, 255, 255, 0.1)',
      border: 'none',
      borderRadius: '50%',
      width: '2.5rem',
      height: '2.5rem',
      fontSize: '1.2rem',
      cursor: 'pointer',
      color: isDarkMode ? '#FFD700' : '#FF6B35'
    },
    scoreboard: {
      display: 'flex',
      justifyContent: 'space-around',
      background: 'rgba(0, 0, 0, 0.8)',
      margin: '0 1rem 1rem',
      padding: '0.75rem',
      borderRadius: '15px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
    },
    scoreItem: {
      textAlign: 'center',
      flex: 1
    },
    scoreLabel: {
      fontSize: '0.75rem',
      color: '#FFD700',
      fontWeight: '600',
      textTransform: 'uppercase',
      marginBottom: '0.25rem'
    },
    scoreValue: {
      fontSize: '1.5rem',
      fontWeight: '900',
      color: shotClockTime <= 3 ? '#FF3333' : '#FF8C00',
      textShadow: '0 0 10px rgba(255, 140, 0, 0.8)'
    },
    question: {
      margin: '0 1rem 1rem',
      padding: '1rem',
      background: 'rgba(59, 130, 246, 0.15)',
      borderRadius: '15px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)'
    },
    questionText: {
      fontSize: '1.1rem',
      fontWeight: '700',
      textAlign: 'center',
      margin: 0,
      textTransform: 'uppercase'
    },
    playersContainer: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      padding: '0 1rem',
      gap: '1rem',
      overflowY: 'auto'
    },
    playerWrapper: {
      width: '100%'
    },
    playerCard: {
      width: '100%',
      background: 'none',
      border: '3px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '15px',
      padding: '1rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '0.5rem',
      minHeight: '140px'
    },
    playerImage: {
      width: '60px',
      height: '75px',
      borderRadius: '50%',
      objectFit: 'cover',
      border: '2px solid rgba(255, 255, 255, 0.3)'
    },
    playerName: {
      fontSize: '1.1rem',
      fontWeight: '800',
      margin: 0,
      textAlign: 'center',
      textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)'
    },
    playerTeam: {
      fontSize: '0.9rem',
      margin: 0,
      opacity: 0.9,
      textAlign: 'center'
    },
    playerStats: {
      display: 'flex',
      gap: '0.5rem',
      flexWrap: 'wrap',
      justifyContent: 'center'
    },
    statBadge: {
      padding: '0.2rem 0.5rem',
      borderRadius: '8px',
      fontSize: '0.7rem',
      fontWeight: '600',
      textTransform: 'uppercase',
      background: 'rgba(255, 165, 0, 0.2)',
      color: '#FFD700',
      border: '1px solid rgba(255, 215, 0, 0.3)'
    },
    vsText: {
      fontSize: '2rem',
      fontWeight: '800',
      color: '#FFD700',
      textAlign: 'center',
      margin: '0.5rem 0',
      textShadow: '0 0 10px rgba(255, 215, 0, 0.8)'
    },
    revealSection: {
      marginTop: '0.75rem',
      padding: '0.75rem',
      background: 'rgba(0, 0, 0, 0.8)',
      borderRadius: '10px',
      textAlign: 'center'
    },
    pickNumber: {
      fontSize: '1rem',
      fontWeight: '700',
      color: '#FBBF24',
      margin: '0 0 0.25rem 0'
    },
    nbaTeam: {
      fontSize: '0.9rem',
      fontWeight: '600',
      color: '#60A5FA',
      margin: '0 0 0.25rem 0'
    },
    summerLeague: {
      fontSize: '0.8rem',
      color: '#FBD38D',
      fontStyle: 'italic',
      margin: 0
    },
    feedbackOverlay: {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 200,
      pointerEvents: 'none'
    },
    feedbackMessage: {
      padding: '1rem 2rem',
      borderRadius: '25px',
      fontSize: '1.1rem',
      fontWeight: '700',
      textAlign: 'center',
      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.4)',
      maxWidth: '80vw',
      background: isCorrectGuess === true ? '#10B981' : isCorrectGuess === false ? '#EF4444' : '#3B82F6',
      color: 'white'
    },
    actions: {
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: isDarkMode ? 'rgba(0, 0, 0, 0.95)' : 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      padding: '1rem',
      display: 'flex',
      gap: '0.75rem',
      justifyContent: 'center',
      zIndex: 150,
      paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)'
    },
    actionButton: {
      flex: 1,
      maxWidth: '150px',
      height: '50px',
      border: 'none',
      borderRadius: '25px',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
      color: 'white'
    }
  };

  return (
    <div style={mobileStyles.container}>
      {/* Header */}
      <div style={mobileStyles.header}>
        <div style={mobileStyles.title}>DRAFT DUEL</div>
        <button 
          style={mobileStyles.themeToggle}
          onClick={toggleDarkMode}
        >
          {isDarkMode ? '☀️' : '🌙'}
        </button>
      </div>

      {/* Scoreboard */}
      <div style={mobileStyles.scoreboard}>
        <div style={mobileStyles.scoreItem}>
          <div style={mobileStyles.scoreLabel}>Streak</div>
          <div style={mobileStyles.scoreValue}>{currentStreak}</div>
        </div>
        <div style={mobileStyles.scoreItem}>
          <div style={mobileStyles.scoreLabel}>Timer</div>
          <div style={mobileStyles.scoreValue}>{shotClockTime}</div>
        </div>
        <div style={mobileStyles.scoreItem}>
          <div style={mobileStyles.scoreLabel}>Best</div>
          <div style={mobileStyles.scoreValue}>{highScore}</div>
        </div>
      </div>

      {/* Question */}
      <div style={mobileStyles.question}>
        <div style={mobileStyles.questionText}>
          {currentQuestion ? currentQuestion.text : "Loading question..."}
        </div>
      </div>

      {/* Players */}
      <div style={mobileStyles.playersContainer}>
        {player1 && (
          <div style={mobileStyles.playerWrapper}>
            <button
              style={{
                ...mobileStyles.playerCard,
                backgroundColor: TEAM_COLORS[player1.preDraftTeam] || TEAM_COLORS.DEFAULT,
                color: getContrastTextColor(TEAM_COLORS[player1.preDraftTeam] || TEAM_COLORS.DEFAULT),
                borderColor: selectedPlayerId === player1.id ? '#3B82F6' : 
                           (selectedPlayerId !== null && currentQuestion?.getCorrectPlayerId(player1, player2) === player1.id) ? '#10B981' :
                           (selectedPlayerId !== null && currentQuestion?.getCorrectPlayerId(player1, player2) !== player1.id) ? '#EF4444' :
                           'rgba(255, 255, 255, 0.2)'
              }}
              onClick={() => handleGuess(player1.id)}
              disabled={selectedPlayerId !== null || gameOver}
            >
              <img
                style={mobileStyles.playerImage}
                src={player1.imageUrl}
                alt={player1.name}
                onError={(e) => { 
                  e.target.onerror = null; 
                  e.target.src = `https://placehold.co/120x150/666666/FFFFFF?text=${player1.name.split(' ').map(n => n[0]).join('')}`; 
                }}
              />
              <h3 style={mobileStyles.playerName}>{player1.name}</h3>
              <p style={mobileStyles.playerTeam}>{player1.preDraftTeam}</p>
              <div style={mobileStyles.playerStats}>
                <span style={mobileStyles.statBadge}>{player1.position}</span>
                <span style={mobileStyles.statBadge}>{Math.floor(player1.height/12)}'{player1.height%12}"</span>
              </div>
            </button>

            {selectedPlayerId !== null && (
              <div style={mobileStyles.revealSection}>
                <p style={mobileStyles.pickNumber}>Pick #{player1.draftPick}</p>
                <p style={mobileStyles.nbaTeam}>{player1.team}</p>
                <p style={mobileStyles.summerLeague}>{player1.summerLeague}</p>
              </div>
            )}
          </div>
        )}

        <div style={mobileStyles.vsText}>VS</div>

        {player2 && (
          <div style={mobileStyles.playerWrapper}>
            <button
              style={{
                ...mobileStyles.playerCard,
                backgroundColor: TEAM_COLORS[player2.preDraftTeam] || TEAM_COLORS.DEFAULT,
                borderColor: selectedPlayerId === player2.id ? '#3B82F6' : 
                           (selectedPlayerId !== null && currentQuestion?.getCorrectPlayerId(player1, player2) === player2.id) ? '#10B981' :
                           (selectedPlayerId !== null && currentQuestion?.getCorrectPlayerId(player1, player2) !== player2.id) ? '#EF4444' :
                           'rgba(255, 255, 255, 0.2)'
              }}
              onClick={() => handleGuess(player2.id)}
              disabled={selectedPlayerId !== null || gameOver}
            >
              <img
                style={mobileStyles.playerImage}
                src={player2.imageUrl}
                alt={player2.name}
                onError={(e) => { 
                  e.target.onerror = null; 
                  e.target.src = `https://placehold.co/120x150/666666/FFFFFF?text=${player2.name.split(' ').map(n => n[0]).join('')}`; 
                }}
              />
              <h3 style={mobileStyles.playerName}>{player2.name}</h3>
              <p style={mobileStyles.playerTeam}>{player2.preDraftTeam}</p>
              <div style={mobileStyles.playerStats}>
                <span style={mobileStyles.statBadge}>{player2.position}</span>
                <span style={mobileStyles.statBadge}>{Math.floor(player2.height/12)}'{player2.height%12}"</span>
              </div>
            </button>

            {selectedPlayerId !== null && (
              <div style={mobileStyles.revealSection}>
                <p style={mobileStyles.pickNumber}>Pick #{player2.draftPick}</p>
                <p style={mobileStyles.nbaTeam}>{player2.team}</p>
                <p style={mobileStyles.summerLeague}>{player2.summerLeague}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Feedback */}
      {feedbackMessage && (
        <div style={mobileStyles.feedbackOverlay}>
          <div style={mobileStyles.feedbackMessage}>
            {feedbackMessage}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {selectedPlayerId !== null && (
        <div style={mobileStyles.actions}>
          {!gameOver ? (
            <button 
              style={{
                ...mobileStyles.actionButton,
                background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)'
              }}
              onClick={handleContinue}
            >
              Continue
            </button>
          ) : (
            <>
              <button 
                style={{
                  ...mobileStyles.actionButton,
                  background: 'linear-gradient(135deg, #10B981, #059669)'
                }}
                onClick={handleContinue}
              >
                Play Again
              </button>
              <button 
                style={{
                  ...mobileStyles.actionButton,
                  background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)'
                }}
                onClick={shareStreak}
              >
                Share
              </button>
            </>
          )}
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{
            background: isDarkMode ? '#2D3748' : '#FFFFFF',
            color: isDarkMode ? '#FFFFFF' : '#2D3748',
            padding: '2rem',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '350px',
            maxHeight: '90vh',
            overflowY: 'auto',
            textAlign: 'center'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '800',
              marginBottom: '1rem',
              color: isDarkMode ? '#FFD700' : '#FF6B35'
            }}>
              🏀 Share Your Streak!
            </h2>
            <p style={{
              fontSize: '1rem',
              marginBottom: '1.5rem',
              color: isDarkMode ? '#A0AEC0' : '#4A5568'
            }}>
              Show everyone your Draft knowledge!
            </p>
            <textarea
              ref={shareTextRef}
              style={{
                width: '100%',
                padding: '1rem',
                border: `2px solid ${isDarkMode ? '#4A5568' : '#E2E8F0'}`,
                borderRadius: '10px',
                fontFamily: "'Outfit', sans-serif",
                fontSize: '0.9rem',
                resize: 'none',
                height: '6rem',
                marginBottom: '1.5rem',
                background: isDarkMode ? '#1A202C' : '#F7FAFC',
                color: isDarkMode ? '#FFFFFF' : '#2D3748',
                boxSizing: 'border-box'
              }}
              readOnly
              value={`🏀 Just scored ${currentStreak} in a row on Draft Duel! Think you know the 2025 NBA Draft better? Play at hooprapp.com! #DraftDuel #NBADraft2025 #SummerLeague`}
            />
            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center'
            }}>
              <button 
                style={{
                  ...mobileStyles.actionButton,
                  background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)'
                }}
                onClick={handleCopyShareText}
              >
                Copy
              </button>
              <button 
                style={{
                  ...mobileStyles.actionButton,
                  background: isDarkMode ? '#4A5568' : '#E2E8F0',
                  color: isDarkMode ? '#FFFFFF' : '#2D3748'
                }}
                onClick={handleCloseShareModal}
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
