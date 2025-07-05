.scoreboard-value {
          font-family: 'Orbitron', monospace !important;
          font-size: 2rem !important;
          font-weight: 900 !important;
          line-height: 1 !important;
          color: #FF8C00 !important;
          text-shadow: 
            0 0 10px rgba(255, 140, 0, 0.8),
            0 0 20px rgba(255, 140, 0, 0.4) !important;
          height: 36px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          flex-shrink: 0 !important;
        }

        .scoreboard-timer {
          font-family: 'Orbitron', monospace !important;
          font-size: 2rem !important;
          font-weight: 900 !important;
          line-height: 1 !important;
          color: #FF0000 !important;
          text-shadow: 
            0 0 10px rgba(255, 0, 0, 0.8),
            0 0 20px rgba(255, 0, 0, 0.4) !important;
          height: 36px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          width: 100% !important;
          flex-shrink: 0 !important;
        }

        .scoreboard-timer.warning {
          color: #FF3333 !important;
          text-shadow: 
            0 0 15px rgba(255, 50, 50, 1),
            0 0 30px rgba(255, 50, 50, 0.6) !important;
          animation: pulse-red 1s infinite alternate !important;
        }

        @keyframes pulse-red {
          from { 
            filter: brightness(1.2);
            transform: scale(1);
          }
          to { 
            filter: brightness(1.5);
            transform: scale(1.02);
          }
        }

        /* MOBILE-OPTIMIZED QUESTION SECTION */
        .question-section {
          width: 98% !important;
          max-width: 380px !important;
          margin: 0 auto 1rem !important;
          text-align: center !important;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(147, 51, 234, 0.15)) !important;
          border-radius: 15px !important;
          padding: 1rem !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          backdrop-filter: blur(10px) !important;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2) !important;
        }

        .question-text {
          font-family: 'Outfit', sans-serif !important;
          font-size: 1.1rem !important;
          font-weight: 700 !important;
          color: ${isDarkMode ? '#FFF' : '#333'} !important;
          text-shadow: 0 0 8px rgba(${isDarkMode ? '255,255,255' : '0,0,0'},0.5) !important;
          text-transform: uppercase !important;
          letter-spacing: 0.5px !important;
          margin: 0 !important;
          line-height: 1.3 !important;
        }

        /* MOBILE-OPTIMIZED GAME AREA */
        .game-area {
          flex: 1 !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          justify-content: flex-start !important;
          position: relative !important;
          padding: 0.5rem !important;
          max-width: 100% !important;
          margin: 0 auto !important;
          width: 100% !important;
          overflow: hidden !important;
        }

        .court-background {
          position: absolute !important;
          top: 50% !important;
          left: 50% !important;
          transform: translate(-50%, -50%) scale(0.3) !important;
          z-index: 0 !important;
          opacity: 0.1 !important;
          pointer-events: none !important;
          width: 1000px !important;
          height: 500px !important;
        }

        /* MOBILE-OPTIMIZED PLAYER COMPARISON */
        .players-comparison {
          position: relative !important;
          display: flex !important;
          justify-content: center !important;
          align-items: center !important;
          gap: 0.5rem !important;
          z-index: 10 !important;
          width: 100% !important;
          max-width: 380px !important;
          margin: 0.5rem 0 !important;
        }

        .player-card-wrapper {
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          gap: 0.5rem !important;
          z-index: 20 !important;
          flex: 1 !important;
        }

        /* MOBILE-OPTIMIZED PLAYER CARDS */
        .player-card {
          position: relative !important;
          width: 100% !important;
          max-width: 140px !important;
          height: 180px !important;
          border-radius: 12px !important;
          padding: 0.75rem !important;
          cursor: pointer !important;
          transition: all 0.3s ease !important;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3) !important;
          border: 3px solid rgba(255, 255, 255, 0.2) !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          justify-content: space-between !important;
          background: none !important;
          font-family: inherit !important;
          z-index: 20 !important;
          overflow: hidden !important;
        }

        .player-card:hover:not(.disabled) {
          transform: translateY(-4px) scale(1.02) !important;
          box-shadow: 0 12px 25px rgba(0, 0, 0, 0.4) !important;
          z-index: 30 !important;
        }

        .player-card.selected {
          border-color: #3B82F6 !important;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.4), 0 8px 20px rgba(0, 0, 0, 0.3) !important;
          animation: pop-on-select 0.15s ease-out !important;
        }

        .player-card.correct {
          border-color: #10B981 !important;
          box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.5), 0 8px 20px rgba(0, 0, 0, 0.3) !important;
          animation: pop-in 0.3s ease-out !important;
        }

        .player-card.incorrect {
          border-color: #EF4444 !important;
          box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.5), 0 8px 20px rgba(0, 0, 0, 0.3) !important;
          animation: shake 0.5s ease-out !important;
        }

        .player-card.disabled {
          opacity: 0.8 !important;
          cursor: not-allowed !important;
        }

        @keyframes pop-on-select {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1.02); }
        }

        @keyframes pop-in {
          0% { transform: scale(0.8); opacity: 0; }
          70% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); }
        }

        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
          40%, 60% { transform: translate3d(4px, 0, 0); }
        }

        /* MOBILE-OPTIMIZED PLAYER CARD CONTENT */
        .player-image {
          width: 5rem !important;
          height: 6rem !important;
          border-radius: 50% !important;
          object-fit: cover !important;
          margin-bottom: 0.5rem !important;
          border: 2px solid rgba(255, 255, 255, 0.3) !important;
          transition: transform 0.3s ease !important;
          flex-shrink: 0 !important;
        }

        .player-card:hover .player-image {
          transform: scale(1.05) !important;
        }

        .player-name {
          font-family: 'DM Sans', sans-serif !important;
          font-size: 0.9rem !important;
          font-weight: 800 !important;
          text-align: center !important;
          margin-bottom: 0.25rem !important;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.4) !important;
          letter-spacing: 0.3px !important;
          line-height: 1.2 !important;
          overflow: hidden !important;
          text-overflow: ellipsis !important;
          white-space: nowrap !important;
          width: 100% !important;
        }

        .player-team {
          font-family: 'DM Sans', sans-serif !important;
          font-size: 0.7rem !important;
          text-align: center !important;
          font-weight: 500 !important;
          margin: 0 !important;
          opacity: 0.9 !important;
          line-height: 1.1 !important;
          overflow: hidden !important;
          text-overflow: ellipsis !important;
          white-space: nowrap !important;
          width: 100% !important;
        }

        /* MOBILE-OPTIMIZED REVEAL SECTION */
        .reveal-section {
          background: linear-gradient(135deg, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.8)) !important;
          color: #ffffff !important;
          padding: 0.5rem 0.75rem !important;
          border-radius: 8px !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4) !important;
          text-align: center !important;
          animation: fade-in-up 0.5s ease-out !important;
          min-width: 120px !important;
          z-index: 25 !important;
          width: 100% !important;
        }

        .pick-number {
          font-size: 1rem !important;
          font-weight: 700 !important;
          color: #FBBF24 !important;
          margin-bottom: 0.25rem !important;
          line-height: 1.2 !important;
        }

        .nba-team {
          font-size: 0.75rem !important;
          opacity: 0.9 !important;
          margin: 0 !important;
          line-height: 1.1 !important;
          overflow: hidden !important;
          text-overflow: ellipsis !important;
          white-space: nowrap !important;
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* MOBILE-OPTIMIZED VS TEXT */
        .vs-text {
          font-size: 2rem !important;
          font-weight: 800 !important;
          background: linear-gradient(to top, #FFD700 30%, #FF4500 100%) !important;
          -webkit-background-clip: text !important;
          -webkit-text-fill-color: transparent !important;
          background-clip: text !important;
          filter: drop-shadow(0 0 6px rgba(255, 165, 0, 0.8)) drop-shadow(0 0 12px rgba(255, 69, 0, 0.6)) !important;
          animation: flicker 1.5s infinite alternate !important;
          z-index: 15 !important;
          margin: 0 0.5rem !important;
          flex-shrink: 0 !important;
        }

        /* MOBILE-OPTIMIZED FEEDBACK AREA */
        .feedback-area {
          height: 60px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          margin-top: 0.5rem !important;
          flex-shrink: 0 !important;
          width: 100% !important;
          max-width: 380px !important;
        }

        .feedback-message {
          font-size: 1.1rem !important;
          font-weight: 600 !important;
          text-align: center !important;
          padding: 0.5rem 1rem !important;
          border-radius: 8px !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2) !important;
          animation: fade-in-up 0.5s ease-out !important;
          max-width: 280px !important;
          z-index: 10 !important;
          margin: 0 !important;
          line-height: 1.3 !important;
        }

        .feedback-message.correct {
          background: #10B981 !important;
          color: white !important;
        }

        .feedback-message.incorrect {
          background: #EF4444 !important;
          color: white !important;
        }

        .feedback-message.timeout {
          background: #3B82F6 !important;
          color: white !important;
        }

        /* MOBILE-OPTIMIZED ACTION BUTTONS */
        .action-buttons {
          display: flex !important;
          gap: 0.75rem !important;
          justify-content: center !important;
          flex-wrap: wrap !important;
          margin-top: 1rem !important;
          z-index: 10 !important;
          width: 100% !important;
          max-width: 380px !important;
          padding: 0 1rem !important;
        }

        .action-button {
          width: 140px !important;
          height: 45px !important;
          min-width: 140px !important;
          max-width: 140px !important;
          min-height: 45px !important;
          max-height: 45px !important;
          padding: 0 !important;
          margin: 0 !important;
          border: none !important;
          border-radius: 20px !important;
          font-size: 0.9rem !important;
          font-weight: 600 !important;
          cursor: pointer !important;
          transition: all 0.3s ease !important;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1) !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          text-align: center !important;
          white-space: nowrap !important;
          overflow: hidden !important;
          text-overflow: ellipsis !important;
          box-sizing: border-box !important;
        }

        .action-button:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15) !important;
        }

        .action-button:active {
          transform: translateY(0) !important;
        }

        .continue-button {
          background: linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%) !important;
          color: white !important;
        }

        .play-again-button {
          background: linear-gradient(135deg, #10B981 0%, #059669 100%) !important;
          color: white !important;
        }

        .share-button {
          background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%) !important;
          color: white !important;
        }

        /* MOBILE-OPTIMIZED SHARE MODAL */
        .share-modal-overlay {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          bottom: 0 !important;
          background: rgba(0, 0, 0, 0.75) !important;
          display: flex !important;
          justify-content: center !important;
          align-items: center !important;
          z-index: 1000 !important;
          padding: 1rem !important;
          animation: fade-in-up 0.3s ease-out !important;
        }

        .share-modal {
          background: ${isDarkMode ? '#2D3748' : '#FFFFFF'} !important;
          color: ${isDarkMode ? '#FFFFFF' : '#2D3748'} !important;
          padding: 1.5rem !important;
          border-radius: 1rem !important;
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3) !important;
          max-width: 320px !important;
          width: 100% !important;
          text-align: center !important;
        }

        .share-modal h2 {
          font-size: 1.5rem !important;
          font-weight: 800 !important;
          margin-bottom: 0.75rem !important;
          color: ${isDarkMode ? '#FFFFFF' : '#2D3748'} !important;
        }

        .share-modal p {
          font-size: 1rem !important;
          margin-bottom: 0.75rem !important;
          color: ${isDarkMode ? '#A0AEC0' : '#4A5568'} !important;
        }

        .share-textarea {
          width: 100% !important;
          padding: 0.75rem !important;
          border: 2px solid ${isDarkMode ? '#4A5568' : '#E2E8F0'} !important;
          border-radius: 0.5rem !important;
          font-family: 'Courier New', monospace !important;
          font-size: 0.85rem !important;
          resize: none !important;
          height: 5rem !important;
          margin-bottom: 0.75rem !important;
          background: ${isDarkMode ? '#1A202C' : '#F7FAFC'} !important;
          color: ${isDarkMode ? '#FFFFFF' : '#2D3748'} !important;
        }

        .share-textarea:focus {
          outline: none !important;
          border-color: #3B82F6 !important;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
        }

        .share-buttons {
          display: flex !important;
          gap: 0.5rem !important;
          justify-content: center !important;
        }

        .copy-button {
          background: linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%) !important;
          color: white !important;
          width: 100px !important;
          height: 40px !important;
          font-size: 0.85rem !important;
        }

        .back-button {
          background: ${isDarkMode ? '#4A5568' : '#E2E8F0'} !important;
          color: ${isDarkMode ? '#FFFFFF' : '#2D3748'} !important;
          width: 100px !important;
          height: 40px !important;
          font-size: 0.85rem !important;
        }

        .back-button:hover {
          background: ${isDarkMode ? '#2D3748' : '#CBD5E0'} !important;
        }

        /* DESKTOP STYLES (768px and above) */
        @media (min-width: 768px) {
          .game-title {
            font-size: 4rem !important;
            margin: 1.5rem 0 1rem 0 !important;
          }

          .theme-toggle {
            top: 1rem !important;
            right: 1rem !important;
            width: 3rem !important;
            height: 3rem !important;
            font-size: 1.5rem !important;
          }
          
          .scoreboard {
            width: 95% !important;
            max-width: 900px !important;
            height: 120px !important;
            min-height: 120px !important;
            max-height: 120px !important;
            border: 6px solid #333 !important;
            border-radius: 20px !important;
            padding: 8px !important;
          }
          
          .scoreboard-box {
            padding: 8px !important;
            margin: 0 6px !important;
            height: calc(100% - 16px) !important;
            min-height: 88px !important;
            max-height: 88px !important;
            border: 3px solid #444 !important;
            border-radius: 12px !important;
          }

          .scoreboard-label {
            font-size: 1rem !important;
            height: 20px !important;
            line-height: 20px !important;
            margin-bottom: 8px !important;
            letter-spacing: 1px !important;
          }
          
          .scoreboard-value, .scoreboard-timer {
            font-size: 3.5rem !important;
            height: 50px !important;
            text-shadow: 
              0 0 20px rgba(255, 140, 0, 1),
              0 0 40px rgba(255, 140, 0, 0.6),
              0 0 60px rgba(255, 140, 0, 0.3) !important;
          }

          .scoreboard-timer {
            text-shadow: 
              0 0 20px rgba(255, 0, 0, 1),
              0 0 40px rgba(255, 0, 0, 0.6),
              0 0 60px rgba(255, 0, 0, 0.3) !important;
          }

          .scoreboard-timer.warning {
            text-shadow: 
              0 0 25px rgba(255, 50, 50, 1),
              0 0 50px rgba(255, 50, 50, 0.8),
              0 0 75px rgba(255, 50, 50, 0.5) !important;
          }
          
          .question-section {
            width: 95% !important;
            max-width: 900px !important;
            margin: 0 auto 2rem !important;
            padding: 1.5rem 2rem !important;
            border-radius: 20px !important;
          }
          
          .question-text {
            font-size: 1.8rem !important;
            letter-spacing: 1px !important;
          }

          .game-area {
            padding: 1rem !important;
            max-width: 1400px !important;
            justify-content: center !important;
          }

          .court-background {
            transform: translate(-50%, -50%) scale(0.6) !important;
            opacity: 0.15 !important;
          }
          
          .players-comparison {
            gap: 3rem !important;
            margin: 2rem 0 !important;
            max-width: 1200px !important;
          }
          
          .player-card {
            width: 18rem !important;
            max-width: none !important;
            height: 22rem !important;
            border-radius: 1rem !important;
            padding: 1.5rem !important;
            border: 4px solid rgba(255, 255, 255, 0.2) !important;
          }

          .player-card:hover:not(.disabled) {
            transform: translateY(-8px) scale(1.05) !important;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5) !important;
          }

          .player-card.selected {
            box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.4), 0 15px 35px rgba(0, 0, 0, 0.4) !important;
          }

          .player-card.correct {
            box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.5), 0 15px 35px rgba(0, 0, 0, 0.4) !important;
          }

          .player-card.incorrect {
            box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.5), 0 15px 35px rgba(0, 0, 0, 0.4) !important;
          }
          
          .player-image {
            width: 10rem !important;
            height: 12rem !important;
            margin-bottom: 1rem !important;
            border: 4px solid rgba(255, 255, 255, 0.3) !important;
          }
          
          .player-name {
            font-size: 1.8rem !important;
            margin-bottom: 0.5rem !important;
            letter-spacing: 0.5px !important;
            white-space: normal !important;
          }
          
          .player-team {
            font-size: 1.2rem !important;
            white-space: normal !important;
          }

          .reveal-section {
            padding: 1rem 1.5rem !important;
            border-radius: 0.75rem !important;
            min-width: 220px !important;
          }

          .pick-number {
            font-size: 1.6rem !important;
            margin-bottom: 0.5rem !important;
          }

          .nba-team {
            font-size: 1.1rem !important;
            white-space: normal !important;
          }
          
          .vs-text {
            font-size: 5rem !important;
            margin: 0 2rem !important;
          }

          .feedback-area {
            height: 80px !important;
            margin-top: 1rem !important;
            max-width: none !important;
          }
          
          .feedback-message {
            font-size: 1.5rem !important;
            padding: 0.75rem 1.5rem !important;
            border-radius: 0.5rem !important;
            max-width: 300px !important;
          }
          
          .action-buttons {
            margin-top: 2rem !important;
            max-width: none !important;
            padding: 0 !important;
          }
          
          .action-button {
            width: 180px !important;
            height: 50px !important;
            min-width: 180px !important;
            max-width: 180px !important;
            min-height: 50px !important;
            max-height: 50px !important;
            font-size: 1rem !important;
            border-radius: 25px !important;
          }

          .share-modal {
            max-width: 28rem !important;
            padding: 2rem !important;
            border-radius: 1.5rem !important;
          }

          .share-modal h2 {
            font-size: 2rem !important;
            margin-bottom: 1rem !important;
          }

          .share-modal p {
            font-size: 1.125rem !important;
            margin-bottom: 1rem !important;
          }

          .share-textarea {
            height: 7rem !important;
            padding: 1rem !important;
            font-size: 1rem !important;
            margin-bottom: 1rem !important;
          }

          .copy-button, .back-button {
            width: 120px !important;
            height: 45px !important;
            font-size: 1rem !important;
          }

          .share-buttons {
            gap: 1rem !important;
          }
        }
      `}</style>

      {/* Theme Toggle */}
      <button 
        className="theme-toggle"
        onClick={toggleDarkMode}
        aria-label="Toggle theme"
      >
        {isDarkMode ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h1M4 12H3m15.354 5.354l-.707.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9 9 0 008.354-5.646z" />
          </svg>
        )}
      </button>

      {/* Game Title */}
      <div className="game-title">DRAFT DUEL</div>

      {/* MOBILE-OPTIMIZED Scoreboard */}
      <div className="scoreboard">
        <div className="scoreboard-box">
          <div className="scoreboard-label">STREAK</div>
          <div className="scoreboard-value">{currentStreak}</div>
        </div>

        <div className="scoreboard-box">
          <div className="scoreboard-label">SHOT CLOCK</div>
          <div className={`scoreboard-timer ${shotClockTime <= 3 ? 'warning' : ''}`}>
            {shotClockTime}
          </div>
        </div>

        <div className="scoreboard-box">
          <div className="scoreboard-label">HIGH SCORE</div>
          <div className="scoreboard-value">{highScore}</div>import React, { useState, useEffect, useCallback, useRef } from 'react';

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

// PlayerCard component
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
      </button>

      {showPick && (
        <div className="reveal-section">
          <p className="pick-number">Pick #{player.draftPick}</p>
          <p className="nba-team">{player.team}</p>
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
      setFeedbackMessage('Correct!');
    } else {
      setIsCorrectGuess(false);
      setFeedbackMessage('Incorrect!');
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
      className="draft-duel-fullscreen"
      style={{
        backgroundColor: isDarkMode ? '#1A202C' : '#F8F8F0',
        backgroundImage: `url("data:image/svg+xml;utf8,${encodedBasketballPattern}")`,
        backgroundRepeat: 'repeat',
        backgroundSize: '200px 200px',
      }}
    >
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono:wght@400&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        
        /* Full screen takeover */
        .draft-duel-fullscreen {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          font-family: 'Outfit', sans-serif !important;
          z-index: 9999 !important;
          display: flex !important;
          flex-direction: column !important;
          overflow-x: hidden !important;
          overflow-y: auto !important;
        }

        /* Game Title */
        .game-title {
          text-align: center !important;
          margin: 1rem 0 0.5rem 0 !important;
          font-size: 3rem !important;
          font-weight: 800 !important;
          background: linear-gradient(to top, #FFD700 30%, #FF4500 100%) !important;
          -webkit-background-clip: text !important;
          -webkit-text-fill-color: transparent !important;
          background-clip: text !important;
          filter: drop-shadow(0 0 8px rgba(255, 165, 0, 0.8)) drop-shadow(0 0 15px rgba(255, 69, 0, 0.6)) !important;
          animation: flicker 1.5s infinite alternate !important;
          z-index: 20 !important;
        }

        @keyframes flicker {
          0%, 100% { opacity: 1; transform: scale(1); }
          25% { opacity: 0.9; transform: scale(1.02); }
          50% { opacity: 1; transform: scale(1); }
          75% { opacity: 0.95; transform: scale(1.01); }
        }

        /* Dark Mode Toggle */
        .theme-toggle {
          position: absolute !important;
          top: 0.5rem !important;
          right: 0.5rem !important;
          background: rgba(255, 255, 255, 0.1) !important;
          border: none !important;
          border-radius: 50% !important;
          width: 2.5rem !important;
          height: 2.5rem !important;
          font-size: 1.2rem !important;
          cursor: pointer !important;
          backdrop-filter: blur(10px) !important;
          transition: all 0.3s ease !important;
          z-index: 100 !important;
        }

        .theme-toggle:hover {
          background: rgba(255, 255, 255, 0.2) !important;
          transform: scale(1.1) !important;
        }

        /* MOBILE-OPTIMIZED SCOREBOARD */
        .scoreboard {
          background: linear-gradient(145deg, #000000, #1a1a1a) !important;
          border: 3px solid #333 !important;
          border-radius: 12px !important;
          display: flex !important;
          position: relative !important;
          width: 98% !important;
          max-width: 380px !important;
          height: 80px !important;
          min-height: 80px !important;
          max-height: 80px !important;
          box-shadow: 
            inset 0 0 15px rgba(0,0,0,0.8), 
            0 8px 20px rgba(0,0,0,0.4),
            0 0 15px rgba(255, 140, 0, 0.2) !important;
          font-family: 'Share Tech Mono', monospace !important;
          color: #FF8C00 !important;
          text-shadow: 0 0 10px rgba(255, 140, 0, 0.8) !important;
          padding: 4px !important;
          margin: 0 auto 1rem !important;
          flex-shrink: 0 !important;
          overflow: hidden !important;
        }

        .scoreboard-box {
          background: linear-gradient(145deg, #0a0a0a, #000000) !important;
          border: 2px solid #444 !important;
          border-radius: 8px !important;
          box-shadow: 
            inset 0 0 10px rgba(0,0,0,0.8), 
            0 2px 4px rgba(0,0,0,0.4) !important;
          flex: 1 !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          justify-content: center !important;
          padding: 2px !important;
          margin: 0 2px !important;
          position: relative !important;
          height: calc(100% - 8px) !important;
          min-height: 64px !important;
          max-height: 64px !important;
          flex-shrink: 0 !important;
          overflow: hidden !important;
        }

        .scoreboard-label {
          font-family: 'Outfit', sans-serif !important;
          font-size: 0.6rem !important;
          font-weight: 700 !important;
          color: #FFD700 !important;
          margin-bottom: 2px !important;
          text-transform: uppercase !important;
          letter-spacing: 0.5px !important;
          text-shadow: 0 0 5px rgba(255, 215, 0, 0.6) !important;
          height: 12px !important;
          line-height: 12px !important;
          flex-shrink: 0 !important;
        }

        .scoreboard-value {
          font-family: 'Orbitron', monospace !important;
          font-size: 2rem !important;
          font-weight: 900 !important;
          line-height: 1 !important;
          color: #FF8C00 !important;
          text-shadow: 
            0 0
