const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// In-memory user storage (we'll use a database later)
let users = {};
let userStats = {};

app.get('/', (req, res) => {
  res.json({ message: 'StatleNBA API is running!' });
});

// Extended players data with 20 NBA stars
const players = [
  {
    name: 'LeBron James',
    team: 'Los Angeles Lakers',
    position: 'SF',
    ppg: 25.7,
    rpg: 7.3,
    apg: 7.3,
    age: 39,
    height: "6'9\"",
    championships: 4
  },
  {
    name: 'Stephen Curry',
    team: 'Golden State Warriors', 
    position: 'PG',
    ppg: 26.4,
    rpg: 4.5,
    apg: 5.1,
    age: 36,
    height: "6'2\"",
    championships: 4
  },
  {
    name: 'Kevin Durant',
    team: 'Phoenix Suns',
    position: 'SF',
    ppg: 27.1,
    rpg: 6.6,
    apg: 5.0,
    age: 35,
    height: "6'10\"",
    championships: 2
  },
  {
    name: 'Giannis Antetokounmpo',
    team: 'Milwaukee Bucks',
    position: 'PF',
    ppg: 30.4,
    rpg: 11.5,
    apg: 6.5,
    age: 29,
    height: "6'11\"",
    championships: 1
  },
  {
    name: 'Luka Dončić',
    team: 'Dallas Mavericks',
    position: 'PG',
    ppg: 32.4,
    rpg: 8.6,
    apg: 9.1,
    age: 25,
    height: "6'7\"",
    championships: 0
  },
  {
    name: 'Jayson Tatum',
    team: 'Boston Celtics',
    position: 'SF',
    ppg: 26.9,
    rpg: 8.1,
    apg: 4.9,
    age: 26,
    height: "6'8\"",
    championships: 1
  },
  {
    name: 'Nikola Jokić',
    team: 'Denver Nuggets',
    position: 'C',
    ppg: 26.4,
    rpg: 12.4,
    apg: 9.0,
    age: 29,
    height: "6'11\"",
    championships: 1
  },
  {
    name: 'Joel Embiid',
    team: 'Philadelphia 76ers',
    position: 'C',
    ppg: 34.7,
    rpg: 11.0,
    apg: 5.6,
    age: 30,
    height: "7'0\"",
    championships: 0
  },
  {
    name: 'Kawhi Leonard',
    team: 'LA Clippers',
    position: 'SF',
    ppg: 23.7,
    rpg: 6.1,
    apg: 3.6,
    age: 33,
    height: "6'7\"",
    championships: 2
  },
  {
    name: 'Damian Lillard',
    team: 'Milwaukee Bucks',
    position: 'PG',
    ppg: 24.3,
    rpg: 4.4,
    apg: 7.0,
    age: 34,
    height: "6'2\"",
    championships: 0
  },
  {
    name: 'Jimmy Butler',
    team: 'Miami Heat',
    position: 'SF',
    ppg: 20.8,
    rpg: 5.3,
    apg: 5.0,
    age: 35,
    height: "6'7\"",
    championships: 0
  },
  {
    name: 'Anthony Davis',
    team: 'Los Angeles Lakers',
    position: 'PF',
    ppg: 24.7,
    rpg: 12.6,
    apg: 3.5,
    age: 31,
    height: "6'10\"",
    championships: 1
  },
  {
    name: 'Kobe Bryant',
    team: 'Los Angeles Lakers',
    position: 'SG',
    ppg: 25.0,
    rpg: 5.2,
    apg: 4.7,
    age: 41,
    height: "6'6\"",
    championships: 5
  },
  {
    name: 'Tim Duncan',
    team: 'San Antonio Spurs',
    position: 'PF',
    ppg: 19.0,
    rpg: 10.8,
    apg: 3.0,
    age: 40,
    height: "6'11\"",
    championships: 5
  },
  {
    name: 'Shaquille ONeal',
    team: 'Los Angeles Lakers',
    position: 'C',
    ppg: 23.7,
    rpg: 10.9,
    apg: 2.5,
    age: 39,
    height: "7'1\"",
    championships: 4
  },
  {
    name: 'Magic Johnson',
    team: 'Los Angeles Lakers',
    position: 'PG',
    ppg: 19.5,
    rpg: 7.2,
    apg: 11.2,
    age: 32,
    height: "6'9\"",
    championships: 5
  },
  {
    name: 'Larry Bird',
    team: 'Boston Celtics',
    position: 'SF',
    ppg: 24.3,
    rpg: 10.0,
    apg: 6.3,
    age: 35,
    height: "6'9\"",
    championships: 3
  },
  {
    name: 'Michael Jordan',
    team: 'Chicago Bulls',
    position: 'SG',
    ppg: 30.1,
    rpg: 6.2,
    apg: 5.3,
    age: 35,
    height: "6'6\"",
    championships: 6
  },
  {
    name: 'Kyrie Irving',
    team: 'Dallas Mavericks',
    position: 'PG',
    ppg: 25.6,
    rpg: 5.0,
    apg: 5.2,
    age: 32,
    height: "6'2\"",
    championships: 1
  },
  {
    name: 'Paul George',
    team: 'LA Clippers',
    position: 'SF',
    ppg: 22.6,
    rpg: 5.2,
    apg: 3.5,
    age: 34,
    height: "6'8\"",
    championships: 0
  }
];

app.get('/api/players', (req, res) => {
  res.json({ players: players });
});

// Daily player endpoint with date-based selection
app.get('/api/daily-player', (req, res) => {
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