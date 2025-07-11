import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import StatleNBAPage from './pages/StatleNBAPage.js';
import DraftDuelPage from './pages/DraftDuelPage.js'; 
import './styles/index.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Redirect root directly to Draft Duel */}
          <Route path="/" element={<Navigate to="/DraftDuel" replace />} />
          
          {/* Keep your existing game routes */}
          <Route path="/StatleNBA" element={<StatleNBAPage />} />
          <Route path="/DraftDuel" element={<DraftDuelPage />} /> 
          
          {/* Optional: Keep home page accessible at /home */}
          <Route path="/home" element={<HomePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
