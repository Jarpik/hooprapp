import React from 'react';
import './ProgressVisualization.css';

const ProgressVisualization = ({ 
  guessCount, 
  maxGuesses = 5, 
  hintsRevealed, 
  maxHints = 12,
  currentScore,
  gameWon,
  gameFailed 
}) => {
  // Calculate progress percentages
  const guessProgress = (guessCount / maxGuesses) * 100;
  const hintProgress = (hintsRevealed / maxHints) * 100;
  
  // Determine status colors
  const getGuessStatusColor = () => {
    if (gameWon) return '#10b981'; // Green for win
    if (gameFailed) return '#ef4444'; // Red for failure
    if (guessCount >= 4) return '#f59e0b'; // Orange for danger
    if (guessCount >= 2) return '#3b82f6'; // Blue for caution
    return '#8b5cf6'; // Purple for early game
  };

  const getScoreColor = () => {
    if (currentScore >= 80) return '#10b981';
    if (currentScore >= 60) return '#3b82f6';
    if (currentScore >= 40) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="progress-visualization">
      {/* Main Progress Header */}
      <div className="progress-header">
        <div className="progress-section">
          <div className="progress-label">
            <span className="progress-icon">🎯</span>
            <span className="progress-text">Guesses</span>
          </div>
          <div className="progress-counter">
            <span className="current-count">{guessCount}</span>
            <span className="max-count">/{maxGuesses}</span>
          </div>
        </div>

        <div className="progress-section">
          <div className="progress-label">
            <span className="progress-icon">🔍</span>
            <span className="progress-text">Hints</span>
          </div>
          <div className="progress-counter">
            <span className="current-count">{hintsRevealed}</span>
            <span className="max-count">/{maxHints}</span>
          </div>
        </div>

        <div className="progress-section">
          <div className="progress-label">
            <span className="progress-icon">⭐</span>
            <span className="progress-text">Score</span>
          </div>
          <div className="progress-counter">
            <span 
              className="current-score"
              style={{ color: getScoreColor() }}
            >
              {currentScore}
            </span>
            <span className="max-count">/100</span>
          </div>
        </div>
      </div>

      {/* Guess Progress Bar */}
      <div className="progress-bar-container">
        <div className="progress-bar-label">
          <span>Guess Progress</span>
          <span className="progress-percentage">{Math.round(guessProgress)}%</span>
        </div>
        <div className="progress-bar-track">
          <div 
            className="progress-bar-fill"
            style={{ 
              width: `${guessProgress}%`,
              backgroundColor: getGuessStatusColor()
            }}
          />
          {/* Progress dots for each guess */}
          <div className="progress-dots">
            {Array.from({ length: maxGuesses }, (_, index) => (
              <div
                key={index}
                className={`progress-dot ${index < guessCount ? 'filled' : ''} ${
                  index === guessCount - 1 && !gameWon && !gameFailed ? 'current' : ''
                }`}
                style={{
                  left: `${(index / (maxGuesses - 1)) * 100}%`,
                  backgroundColor: index < guessCount ? getGuessStatusColor() : '#374151'
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Hint Progress Indicator */}
      <div className="hint-progress-container">
        <div className="hint-progress-label">
          <span>Hints Revealed</span>
          <span className="hint-progress-count">{hintsRevealed} of {maxHints}</span>
        </div>
        <div className="hint-progress-grid">
          {Array.from({ length: maxHints }, (_, index) => (
            <div
              key={index}
              className={`hint-progress-cell ${index < hintsRevealed ? 'revealed' : 'hidden'}`}
            />
          ))}
        </div>
      </div>

      {/* Circular Progress Ring (for dramatic effect) */}
      <div className="circular-progress">
        <svg className="circular-progress-svg" viewBox="0 0 120 120">
          {/* Background circle */}
          <circle
            className="circular-progress-bg"
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="4"
          />
          {/* Progress circle */}
          <circle
            className="circular-progress-fill"
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke={getGuessStatusColor()}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 54}`}
            strokeDashoffset={`${2 * Math.PI * 54 * (1 - guessProgress / 100)}`}
          />
        </svg>
        <div className="circular-progress-content">
          <div className="circular-progress-number">{guessCount}</div>
          <div className="circular-progress-label">of {maxGuesses}</div>
        </div>
      </div>

      {/* Status Messages */}
      <div className="progress-status">
        {gameWon && (
          <div className="status-message success">
            <span className="status-icon">🎉</span>
            <span>Congratulations! You won!</span>
          </div>
        )}
        {gameFailed && (
          <div className="status-message failure">
            <span className="status-icon">💔</span>
            <span>Game Over! Better luck next time!</span>
          </div>
        )}
        {!gameWon && !gameFailed && guessCount >= 4 && (
          <div className="status-message warning">
            <span className="status-icon">⚠️</span>
            <span>Last chance! Make it count!</span>
          </div>
        )}
        {!gameWon && !gameFailed && guessCount >= 2 && guessCount < 4 && (
          <div className="status-message caution">
            <span className="status-icon">🤔</span>
            <span>You're getting there! Keep trying!</span>
          </div>
        )}
        {!gameWon && !gameFailed && guessCount === 0 && (
          <div className="status-message start">
            <span className="status-icon">🚀</span>
            <span>Ready to start? Make your first guess!</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressVisualization;
