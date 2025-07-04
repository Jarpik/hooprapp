import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import StatleNBAPage from './pages/StatleNBAPage';
import './styles/index.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/StatleNBA" element={<StatleNBAPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
