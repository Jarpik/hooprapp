const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Database connection
const pool = new Pool({
  connectionString: 'postgresql://postgres:Legoboy99!!@db.sdpvfaoekjckxbwcxfjj.supabase.co:5432/postgres',
  ssl: {
    rejectUnauthorized: false
  }
});

// Test database connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error acquiring client', err.stack);
  } else {
    console.log('Connected to Supabase database!');
    release();
  }
});

// In-memory user storage (we'll move this to database later)
let users = {};
let userStats = {};

app.get('/', (req, res) => {
  res.json({ message: 'StatleNBA API is running!' });
});

// Get all players from database
app.get('/api/players', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM players WHERE active = true ORDER BY name');
    res.json({ players: result.rows });
  } catch (error) {
    console.error('Error fetching players:', error);
    res.status(500).json({ error: 'Failed to fetch players' });
  }
});

// Daily player endpoint with date-based selection
app.get('/api/daily-player', async (req, res) => {
  try {
    // Get all active players
    const result = await pool.query('SELECT * FROM players WHERE active = true');
    const players = result.rows;
    
    if (players.length === 0) {
      return res.status(500).json({ error: 'No players found' });
    }
    
    // Get today's date in YYYY-MM-DD format
    const today = new Date();
    const dateString = today.toISOString().split('T')[0];
    
    // Create a simple hash from the date string
    let hash = 0;
    for (let i = 0; i < dateString.length; i++) {
      const char = dateString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    // Use absolute value and modulo to get a consistent index
    const playerIndex = Math.abs(hash) % players.length;
    const dailyPlayer = players[playerIndex];
    
    console.log(`Daily player for ${dateString}: ${dailyPlayer.name} (index: ${playerIndex})`);
    
    res.json({ 
      player: dailyPlayer,
      date: dateString 
    });
  } catch (error) {
    console.error('Error fetching daily player:', error);
    res.status(500).json({ error: 'Failed to fetch daily player' });
  }
});

// User registration
app.post('/api/register', (req, res) => {
  const { email, password, username } = req.body;
  
  if (!email || !password || !username) {
    return res.status(400).json({ error: 'Email, username, and password are required' });
  }
  
  if (users[email]) {
    return res.status(400).json({ error: 'User already exists' });
  }
  
  // Create user
  users[email] = {
    email,
    username,
    password, // In production, hash this!
    createdAt: new Date().toISOString()
  };
  
  // Initialize user stats
  userStats[email] = {
    totalGames: 0,
    totalScore: 0,
    bestScore: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastPlayedDate: null,
    averageGuesses: 0,
    totalGuesses: 0,
    perfectGames: 0,
    gamesWon: 0
  };
  
  res.json({ message: 'User created successfully', user: { email, username } });
});

// User login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  
  const user = users[email];
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  res.json({ 
    message: 'Login successful', 
    user: { email: user.email, username: user.username },
    stats: userStats[email]
  });
});

// Get user stats
app.get('/api/user/:email/stats', (req, res) => {
  const { email } = req.params;
  
  if (!users[email]) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.json({ stats: userStats[email] });
});

// Submit game result
app.post('/api/submit-game', (req, res) => {
  const { email, score, guesses, hintsUsed, won, date } = req.body;
  
  if (!users[email]) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  const stats = userStats[email];
  const today = new Date().toISOString().split('T')[0];
  
  // Update stats
  stats.totalGames += 1;
  stats.totalScore += score;
  stats.totalGuesses += guesses;
  
  if (won) {
    stats.gamesWon += 1;
    if (score > stats.bestScore) {
      stats.bestScore = score;
    }
    if (score >= 100) {
      stats.perfectGames += 1;
    }
  }
  
  // Calculate streak
  if (stats.lastPlayedDate) {
    const lastDate = new Date(stats.lastPlayedDate);
    const currentDate = new Date(today);
    const diffTime = currentDate - lastDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      // Consecutive day
      stats.currentStreak += 1;
    } else if (diffDays > 1) {
      // Streak broken
      stats.currentStreak = 1;
    }
    // If diffDays === 0, they already played today (shouldn't happen)
  } else {
    // First game
    stats.currentStreak = 1;
  }
  
  // Update longest streak
  if (stats.currentStreak > stats.longestStreak) {
    stats.longestStreak = stats.currentStreak;
  }
  
  // Calculate average guesses
  stats.averageGuesses = Math.round(stats.totalGuesses / stats.totalGames * 10) / 10;
  
  stats.lastPlayedDate = today;
  
  res.json({ 
    message: 'Game result submitted successfully', 
    stats: stats,
    streakBadge: getStreakBadge(stats.currentStreak)
  });
});

// Helper function for streak badges
function getStreakBadge(streak) {
  if (streak >= 30) return { emoji: '🏆', text: 'Legend!', color: '#ffd700' };
  if (streak >= 14) return { emoji: '🔥', text: 'On Fire!', color: '#ff6b35' };
  if (streak >= 7) return { emoji: '⭐', text: 'Week Warrior!', color: '#4ecdc4' };
  if (streak >= 3) return { emoji: '💪', text: 'Getting Hot!', color: '#45b7d1' };
  return null;
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
