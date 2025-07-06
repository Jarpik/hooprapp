import React from 'react';
import { useNavigate } from 'react-router-dom';
import DraftDuelMain from '../games/draft-duel/DraftDuelMain.js';

const DraftDuelPage = () => {
  const navigate = useNavigate();

  const handleTitleClick = () => {
    navigate('/');
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {/* Minimal HooprApp branding overlay - positioned to not conflict with mode indicator */}
      <div style={{
        position: 'absolute',
        top: '1rem',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1001, // Higher than mode indicator
        background: 'rgba(0, 0, 0, 0.7)',
        padding: '0.5rem 1rem',
        borderRadius: '0.5rem',
        backdropFilter: 'blur(10px)',
        cursor: 'pointer'
      }} onClick={handleTitleClick}>
        <span style={{
          color: '#f97316',
          fontWeight: 'bold',
          fontSize: '1.2rem',
          fontFamily: 'Inter, sans-serif'
        }}>
          ← HooprApp
        </span>
      </div>
      
      {/* Full Draft Duel Game */}
      <DraftDuelMain />
    </div>
  );
};

export default DraftDuelPage;
