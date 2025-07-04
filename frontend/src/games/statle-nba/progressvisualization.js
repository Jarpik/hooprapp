import React from 'react';
import './progressvisualization.css';

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
  
  // Determine status colors
  const getGuessStatusColor = () => {
    if (gameWon) return '#10b981'; // Green for win
    if (gameFailed) return '#ef4444'; // Red for failure
    if (guessCount >= 4) return '#f59e0b'; // Orange for danger
    if (guessCount >= 2) return '#3b82f6'; // Blue for caution
    return '#8b5cf6'; // Purple for early game
  };

  return (
    <div className="progress-visualization">
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
                  left: `${(index * 20)}%`,
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
