import React from 'react';

const UserStats = ({ user, stats, onLogout }) => {
  const getStreakBadge = (streak) => {
    if (streak >= 30) return { emoji: '🏆', text: 'Legend!', color: '#ffd700' };
    if (streak >= 14) return { emoji: '🔥', text: 'On Fire!', color: '#ff6b35' };
    if (streak >= 7) return { emoji: '⭐', text: 'Week Warrior!', color: '#4ecdc4' };
    if (streak >= 3) return { emoji: '💪', text: 'Getting Hot!', color: '#45b7d1' };
    return null;
  };

  const streakBadge = getStreakBadge(stats.currentStreak);
  const averageScore = stats.totalGames > 0 ? Math.round(stats.totalScore / stats.totalGames) : 0;
  const winRate = stats.totalGames > 0 ? Math.round((stats.gamesWon / stats.totalGames) * 100) : 0;

  return (
    <div className="user-stats-container">
      <div className="user-header">
        <div className="user-info">
          <h3>👋 Hey, {user.username}!</h3>
          {streakBadge && (
            <div className="streak-badge" style={{ color: streakBadge.color }}>
              {streakBadge.emoji} {streakBadge.text}
            </div>
          )}
        </div>
        <button onClick={onLogout} className="logout-button">
          Logout
        </button>
      </div>

      <div className="stats-grid-container">
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-number">{stats.currentStreak}</div>
            <div className="stat-label">🔥 Current Streak</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.longestStreak}</div>
            <div className="stat-label">🏆 Longest Streak</div>
          </div>
        </div>

        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-number">{averageScore}</div>
            <div className="stat-label">📊 Avg Score</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.bestScore}</div>
            <div className="stat-label">⭐ Best Score</div>
          </div>
        </div>

        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-number">{stats.totalGames}</div>
            <div className="stat-label">🎮 Games Played</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{winRate}%</div>
            <div className="stat-label">🎯 Win Rate</div>
          </div>
        </div>

        {stats.perfectGames > 0 && (
          <div className="stats-row">
            <div className="stat-card highlight">
              <div className="stat-number">{stats.perfectGames}</div>
              <div className="stat-label">💯 Perfect Games</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserStats;