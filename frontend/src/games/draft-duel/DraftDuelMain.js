}

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
        
        /* Full screen takeover with proper mobile scrolling */
        .draft-duel-fullscreen {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          font-family: 'Outfit', sans-serif;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          overflow-x: hidden;
          overflow-y: auto;
          /* Add bottom padding for mobile browser UI */
          padding-bottom: 120px;
          /* Ensure content can scroll past browser UI */
          min-height: calc(100vh + 120px);
        }

        /* Game Title */
        .game-title {
          text-align: center;
          margin: 1.5rem 0 1rem 0;
          font-size: 4rem;
          font-weight: 800;
          background: linear-gradient(to top, #FFD700 30%, #FF4500 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: drop-shadow(0 0 8px rgba(255, 165, 0, 0.8)) drop-shadow(0 0 15px rgba(255, 69, 0, 0.6));
          animation: flicker 1.5s infinite alternate;
          z-index: 20;
        }

        @keyframes flicker {
          0%, 100% { opacity: 1; transform: scale(1); }
          25% { opacity: 0.9; transform: scale(1.02); }
          50% { opacity: 1; transform: scale(1); }
          75% { opacity: 0.95; transform: scale(1.01); }
        }

        /* Mode Indicator */
        .mode-indicator {
          position: absolute;
          top: 1rem;
          left: 1rem;
          background: rgba(0, 0, 0, 0.8);
          padding: 0.75rem 1.5rem;
          border-radius: 1rem;
          border: 2px solid;
          backdrop-filter: blur(10px);
          font-family: 'Outfit', sans-serif;
          font-weight: 700;
          font-size: 1rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          z-index: 100;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .theme-toggle {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          border-radius: 50%;
          width: 3rem;
          height: 3rem;
          font-size: 1.5rem;
          cursor: pointer;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
          z-index: 100;
        }

        .theme-toggle:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: scale(1.1);
        }

        /* FIXED SCOREBOARD */
        .scoreboard {
          background: linear-gradient(145deg, #000000, #1a1a1a);
          border: 6px solid #333;
          border-radius: 20px;
          display: flex;
          width: 95%;
          max-width: 900px;
          height: 120px;
          min-height: 120px;
          max-height: 120px;
          box-shadow: 
            inset 0 0 30px rgba(0,0,0,0.8), 
            0 10px 30px rgba(0,0,0,0.6),
            0 0 20px rgba(255, 140, 0, 0.3);
          font-family: 'Share Tech Mono', monospace;
          color: #FF8C00;
          text-shadow: 0 0 15px rgba(255, 140, 0, 0.9);
          position: relative;
          padding: 8px;
          margin: 0 auto 1rem;
          flex-shrink: 0;
          overflow: hidden;
        }

        .scoreboard::before {
          content: '';
          position: absolute;
          top: -3px;
          left: -3px;
          right: -3px;
          bottom: -3px;
          background: linear-gradient(45deg, #FF8C00, #FFD700, #FF4500, #FF8C00);
          border-radius: 23px;
          z-index: -1;
          opacity: 0.3;
          animation: borderGlow 3s ease-in-out infinite;
        }

        @keyframes borderGlow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }

        .scoreboard-box {
          background: linear-gradient(145deg, #0a0a0a, #000000);
          border: 3px solid #444;
          border-radius: 12px;
          box-shadow: 
            inset 0 0 15px rgba(0,0,0,0.8), 
            0 4px 8px rgba(0,0,0,0.4);
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          padding: 8px;
          margin: 0 6px;
          position: relative;
          height: calc(100% - 16px);
          min-height: 96px;
          max-height: 96px;
          flex-shrink: 0;
          overflow: hidden;
        }

        .scoreboard-label {
          font-family: 'Outfit', sans-serif;
          font-size: 1rem;
          font-weight: 700;
          color: #FFD700;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 1px;
          text-shadow: 0 0 10px rgba(255, 215, 0, 0.8);
          height: 20px;
          line-height: 20px;
          flex-shrink: 0;
        }

        .scoreboard-value {
          font-family: 'Orbitron', monospace;
          font-size: 3.5rem;
          font-weight: 900;
          line-height: 1;
          color: #FF8C00;
          text-shadow: 
            0 0 20px rgba(255, 140, 0, 1),
            0 0 40px rgba(255, 140, 0, 0.6),
            0 0 60px rgba(255, 140, 0, 0.3);
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding-bottom: 8px;
          filter: brightness(1.2);
          flex-shrink: 0;
        }

        .scoreboard-timer {
          font-family: 'Orbitron', monospace;
          font-size: 3.5rem;
          font-weight: 900;
          line-height: 1;
          color: #FF0000;
          text-shadow: 
            0 0 20px rgba(255, 0, 0, 1),
            0 0 40px rgba(255, 0, 0, 0.6),
            0 0 60px rgba(255, 0, 0, 0.3);
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          padding-bottom: 8px;
          filter: brightness(1.2);
          flex-shrink: 0;
        }

        .scoreboard-timer.warning {
          color: #FF3333;
          text-shadow: 
            0 0 25px rgba(255, 50, 50, 1),
            0 0 50px rgba(255, 50, 50, 0.8),
            0 0 75px rgba(255, 50, 50, 0.5);
          animation: pulse-red 1s infinite alternate;
        }

        @keyframes pulse-red {
          from { 
            filter: brightness(1.2);
            transform: scale(1);
          }
          to { 
            filter: brightness(1.5);
            transform: scale(1.05);
          }
        }

        /* Question Section */
        .question-section {
          width: 95%;
          max-width: 900px;
          margin: 0 auto 2rem;
          text-align: center;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(147, 51, 234, 0.15));
          border-radius: 20px;
          padding: 1.5rem 2rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
        }

        .question-text {
          font-family: 'Outfit', sans-serif;
          font-size: 1.8rem;
          font-weight: 700;
          color: ${isDarkMode ? '#FFF' : '#333'};
          text-shadow: 0 0 10px rgba(${isDarkMode ? '255,255,255' : '0,0,0'},0.7);
          text-transform: uppercase;
          letter-spacing: 1px;
          margin: 0;
        }

        /* Main Game Area */
        .game-area {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          padding: 1rem;
          max-width: 1400px;
          margin: 0 auto;
          width: 100%;
        }

        .court-background {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) scale(0.6);
          z-index: 0;
          opacity: 0.15;
          pointer-events: none;
          width: 1000px;
          height: 500px;
        }

        /* CRITICAL MOBILE FIX: Player Comparison */
        .players-comparison {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 3rem;
          z-index: 10;
          width: 100%;
          max-width: 1200px;
          margin: 2rem 0;
        }

        .player-card-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          z-index: 20;
        }

        /* Player Cards */
        .player-card {
          position: relative;
          width: 18rem;
          height: 22rem;
          border-radius: 1rem;
          padding: 1.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
          border: 4px solid rgba(255, 255, 255, 0.2);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          background: none;
          font-family: inherit;
          z-index: 20;
        }

        .player-card:hover:not(.disabled) {
          transform: translateY(-8px) scale(1.05);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
          z-index: 30;
        }

        .player-card.selected {
          border-color: #3B82F6;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.4), 0 15px 35px rgba(0, 0, 0, 0.4);
          animation: pop-on-select 0.15s ease-out;
        }

        .player-card.correct {
          border-color: #10B981;
          box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.5), 0 15px 35px rgba(0, 0, 0, 0.4);
          animation: pop-in 0.3s ease-out;
        }

        .player-card.incorrect {
          border-color: #EF4444;
          box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.5), 0 15px 35px rgba(0, 0, 0, 0.4);
          animation: shake 0.5s ease-out;
        }

        .player-card.disabled {
          opacity: 0.8;
          cursor: not-allowed;
        }

        @keyframes pop-on-select {
          0% { transform: scale(1); }
          50% { transform: scale(1.03); }
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

        /* Player Card Content */
        .player-image {
          width: 10rem;
          height: 12rem;
          border-radius: 50%;
          object-fit: cover;
          margin-bottom: 1rem;
          border: 4px solid rgba(255, 255, 255, 0.3);
          transition: transform 0.3s ease;
        }

        .player-card:hover .player-image {
          transform: scale(1.05);
        }

        .player-name {
          font-family: 'DM Sans', sans-serif;
          font-size: 1.8rem;
          font-weight: 800;
          text-align: center;
          margin-bottom: 0.5rem;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.4);
          letter-spacing: 0.5px;
          /* Fix text overflow and truncation */
          word-wrap: break-word;
          overflow-wrap: break-word;
          hyphens: auto;
          max-width: 100%;
          line-height: 1.2;
          white-space: normal;
          overflow: visible;
          text-overflow: clip;
        }

        .player-team {
          font-family: 'DM Sans', sans-serif;
          font-size: 1.2rem;
          text-align: center;
          font-weight: 500;
          margin: 0;
          opacity: 0.9;
        }

        /* Reveal Section */
        .reveal-section {
          background: linear-gradient(135deg, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.8));
          color: #ffffff;
          padding: 1rem 1.5rem;
          border-radius: 0.75rem;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
          text-align: center;
          animation: fade-in-up 0.5s ease-out;
          min-width: 220px;
          z-index: 25;
        }

        .pick-number {
          font-size: 1.6rem;
          font-weight: 700;
          color: #FBBF24;
          margin-bottom: 0.5rem;
        }

        .nba-team {
          font-size: 1.1rem;
          opacity: 0.9;
          margin: 0;
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* VS Text */
        .vs-text {
          font-size: 5rem;
          font-weight: 800;
          background: linear-gradient(to top, #FFD700 30%, #FF4500 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: drop-shadow(0 0 8px rgba(255, 165, 0, 0.8)) drop-shadow(0 0 15px rgba(255, 69, 0, 0.6));
          animation: flicker 1.5s infinite alternate;
          z-index: 15;
          margin: 0 2rem;
        }

        /* Feedback Area */
        .feedback-area {
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 1rem;
          flex-shrink: 0;
        }

        .feedback-message {
          font-size: 1.5rem;
          font-weight: 600;
          text-align: center;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          animation: fade-in-up 0.5s ease-out;
          max-width: 300px;
          z-index: 10;
          margin: 0;
        }

        .feedback-message.correct {
          background: #10B981;
          color: white;
        }

        .feedback-message.incorrect {
          background: #EF4444;
          color: white;
        }

        .feedback-message.timeout {
          background: #3B82F6;
          color: white;
        }

        /* Action Buttons */
        .action-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
          margin-top: 2rem;
          z-index: 10;
        }

        .action-button {
          width: 180px !important;
          height: 50px !important;
          min-width: 180px !important;
          max-width: 180px !important;
          min-height: 50px !important;
          max-height: 50px !important;
          padding: 0 !important;
          margin: 0;
          border: none;
          border-radius: 25px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          box-sizing: border-box;
        }

        .action-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        }

        .action-button:active {
          transform: translateY(0);
        }

        .continue-button {
          background: linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%);
          color: white;
        }

        .play-again-button {
          background: linear-gradient(135deg, #10B981 0%, #059669 100%);
          color: white;
        }

        .share-button {
          background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%);
          color: white;
        }

        /* Share Modal */
        .share-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.75);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          padding: 1rem;
          animation: fade-in-up 0.3s ease-out;
        }

        .share-modal {
          background: ${isDarkMode ? '#2D3748' : '#FFFFFF'};
          color: ${isDarkMode ? '#FFFFFF' : '#2D3748'};
          padding: 2rem;
          border-radius: 1.5rem;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          max-width: 28rem;
          width: 100%;
          text-align: center;
        }

        .share-modal h2 {
          font-size: 2rem;
          font-weight: 800;
          margin-bottom: 1rem;
          color: ${isDarkMode ? '#FFFFFF' : '#2D3748'};
        }

        .share-modal p {
          font-size: 1.125rem;
          margin-bottom: 1rem;
          color: ${isDarkMode ? '#A0AEC0' : '#4A5568'};
        }

        .share-textarea {
          width: 100%;
          padding: 1rem;
          border: 2px solid ${isDarkMode ? '#4A5568' : '#E2E8F0'};
          border-radius: 0.5rem;
          font-family: 'Courier New', monospace;
          font-size: 1rem;
          resize: none;
          height: 7rem;
          margin-bottom: 1rem;
          background: ${isDarkMode ? '#1A202C' : '#F7FAFC'};
          color: ${isDarkMode ? '#FFFFFF' : '#2D3748'};
        }

        .share-textarea:focus {
          outline: none;
          border-color: #3B82F6;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
        }

        .share-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
        }

        .copy-button {
          background: linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%);
          color: white;
        }

        .back-button {
          background: ${isDarkMode ? '#4A5568' : '#E2E8F0'};
          color: ${isDarkMode ? '#FFFFFF' : '#2D3748'};
        }

        .back-button:hover {
          background: ${isDarkMode ? '#2D3748' : '#CBD5E0'};
        }

        /* MOBILE RESPONSIVE SCOREBOARD FIXES */
        @media (max-width: 768px) {
          .game-title {
            font-size: 3rem;
            margin: 1rem 0 0.5rem 0;
          }
          
          /* Mobile mode indicator - match theme toggle size */
          .mode-indicator {
            top: 1rem;
            left: 1rem;
            padding: 0.5rem;
            border-radius: 50%;
            font-size: 0.7rem;
            width: 3rem;
            height: 3rem;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            line-height: 1;
            letter-spacing: 0;
          }
          
          .scoreboard {
            width: 98%;
            margin: 0 auto 0.5rem;
            padding: 8px;
            height: 120px;
            min-height: 120px;
            max-height: 120px;
          }
          
          .scoreboard-box {
            padding: 8px 4px;
            margin: 0 4px;
            height: calc(100% - 16px);
            min-height: 88px;
            max-height: 88px;
          }
          
          .scoreboard-label {
            font-size: 0.7rem;
            height: 16px;
            line-height: 16px;
            margin-bottom: 6px;
            letter-spacing: 0.5px;
          }
          
          .scoreboard-value, .scoreboard-timer {
            font-size: 2.2rem;
            min-height: 50px;
            flex: 1;
          }
          
          .player-name {
            font-size: 1.3rem !important;
            line-height: 1.1 !important;
            max-width: 12rem !important;
            word-wrap: break-word !important;
            overflow-wrap: break-word !important;
            hyphens: auto !important;
            white-space: normal !important;
            overflow: visible !important;
            text-overflow: clip !important;
          }
          
          .question-section {
            width: 98%;
            margin: 0 auto 1.5rem;
            padding: 1rem;
          }
          
          .question-text {
            font-size: 1.4rem;
          }
          
          /* CRITICAL FIX: Mobile players stack vertically */
          .players-comparison {
            flex-direction: column !important;
            gap: 1.5rem !important;
            margin: 1rem 0 !important;
          }
          
          .player-card {
            width: 14rem !important;
            height: 18rem !important;
          }
          
          .player-image {
            width: 8rem !important;
            height: 10rem !important;
          }
          
          .player-name {
            font-size: 1.5rem !important;
          }
          
          .player-team {
            font-size: 1rem !important;
          }
          
          .vs-text {
            font-size: 3rem !important;
            margin: 0 1rem !important;
          }
          
          .feedback-message {
            font-size: 1.2rem;
          }
          
          .action-buttons {
            flex-direction: column;
            align-items: center;
            gap: 0.5rem;
          }
          
          .action-button {
            width: 200px !important;
            min-width: 200px !important;
            max-width: 200px !important;
            height: 50px !important;
            min-height: 50px !important;
            max-height: 50px !important;
          }
        }

        @media (max-width: 480px) {
          .game-title {
            font-size: 2.5rem;
          }
          
          /* Smaller mode indicator on very small screens */
          .mode-indicator {
            font-size: 0.6rem;
            width: 2.5rem;
            height: 2.5rem;
            padding: 0.4rem;
          }
          
          .scoreboard {
            height: 100px;
            min-height: 100px;
            max-height: 100px;
            padding: 6px;
          }
          
          .scoreboard-box {
            padding: 6px 2px;
            height: calc(100% - 12px);
            min-height: 76px;
            max-height: 76px;
          }
          
          .scoreboard-label {
            font-size: 0.6rem;
            height: 14px;
            line-height: 14px;
            margin-bottom: 4px;
          }
          
          .scoreboard-value, .scoreboard-timer {
            font-size: 1.8rem;
            min-height: 40px;
          }
          
          .question-text {
            font-size: 1.2rem;
          }
          
          .player-card {
            width: 12rem !important;
            height: 16rem !important;
          }
          
          .player-image {
            width: 7rem !important;
            height: 8.5rem !important;
          }
          
          .vs-text {
            font-size: 2.5rem !important;
            margin: 0 0.5rem !important;
          }
        }
      `}</style>

      {/* Mode Indicator */}
      <div 
        className="mode-indicator"
        style={{ 
          borderColor: getModeColor(currentMode),
          color: getModeColor(currentMode)
        }}
      >
        {currentMode} Mode
      </div>

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

      {/* Scoreboard */}
      <div className="scoreboard">
        <div className="scoreboard-box">
          <div className="scoreboard-label">Streak</div>
          <div className="scoreboard-value">{currentStreak}</div>
        </div>

        <div className="scoreboard-box">
          <div className="scoreboard-label">Shot Clock</div>
          <div className={`scoreboard-timer ${shotClockTime <= 3 ? 'warning' : ''}`}>
            {shotClockTime}
          </div>
        </div>

        <div className="scoreboard-box">
          <div className="scoreboard-label">High Score</div>
          <div className="scoreboard-value">{highScore}</div>
        </div>
      </div>

      {/* Question Section */}
      <div className="question-section">
        <div className="question-text">
          {currentQuestion ? currentQuestion.text : "Loading question..."}
        </div>
      </div>

      {/* Game Area */}
      <div className="game-area">
        {/* Basketball Court Background */}
        <div className="court-background" dangerouslySetInnerHTML={{ __html: basketballCourtSVG }} />

        {/* Player Comparison */}
        <div className="players-comparison">
          {player1 && (
            <PlayerCard
              player={player1}
              onClick={handleGuess}
              isSelected={selectedPlayerId === player1.id}
              isCorrect={selectedPlayerId !== null ? (currentQuestion?.getCorrectPlayerId(player1, player2) === player1.id) : null}
              showPick={selectedPlayerId !== null}
              disabled={selectedPlayerId !== null || gameOver}
              isDarkMode={isDarkMode}
            />
          )}

          {/* VS Text */}
          <div className="vs-text">VS</div>

          {player2 && (
            <PlayerCard
              player={player2}
              onClick={handleGuess}
              isSelected={selectedPlayerId === player2.id}
              isCorrect={selectedPlayerId !== null ? (currentQuestion?.getCorrectPlayerId(player1, player2) === player2.id) : null}
              showPick={selectedPlayerId !== null}
              disabled={selectedPlayerId !== null || gameOver}
              isDarkMode={isDarkMode}
            />
          )}
        </div>

        {/* Feedback Area */}
        <div className="feedback-area">
          {feedbackMessage && (
            <div className={`feedback-message ${
              isCorrectGuess === true ? 'correct' : 
              isCorrectGuess === false ? 'incorrect' : 'timeout'
            }`}>
              {feedbackMessage}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {selectedPlayerId !== null && (
          <div className="action-buttons">
            {!gameOver ? (
              <button onClick={handleContinue} className="action-button continue-button">
                Continue
              </button>
            ) : (
              <>
                <button onClick={handleContinue} className="action-button play-again-button">
                  Play Again
                </button>
                <button onClick={shareStreak} className="action-button share-button">
                  Share Streak
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="share-modal-overlay">
          <div className="share-modal">
            <h2>Share Your Streak!</h2>
            <p>Copy the text below to share your amazing streak!</p>
            <textarea
              ref={shareTextRef}
              className="share-textarea"
              readOnly
              value={`I just scored a streak of ${currentStreak} in the NBA Rookie Draft Pick game! Reached ${currentMode} Mode! Think you can beat it? Play at hooprapp.com! #NBADraftGame #SummerLeague`}
            />
            <div className="share-buttons">
              <button onClick={handleCopyShareText} className="action-button copy-button">
                Copy
              </button>
              <button onClick={handleCloseShareModal} className="action-button back-button">
                Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DraftDuelMain;import React, { useState, useEffect, useCallback, useRef } from 'react';

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
  { id: 1, name: "Cooper Flagg", draftPick: 1, team: "Dallas Mavericks", preDraftTeam: "Duke", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/5041939.png&w=350&h=254", height: 81, weight: 221, age: 18, position: "Forward", conference: "ACC", homePlace: "Newport, Maine", preDraftStats: { ppg: 19.2, rpg: 7.5, apg: 4.2 } },
  { id: 2, name: "Dylan Harper", draftPick: 2, team: "San Antonio Spurs", preDraftTeam: "Rutgers", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/5037871.png&w=350&h=254", height: 78, weight: 215, age: 19, position: "Guard", conference: "Big Ten", homePlace: "Franklin Lakes, New Jersey", preDraftStats: { ppg: 19.4, rpg: 4.6, apg: 4.0 } },
  { id: 3, name: "VJ Edgecombe", draftPick: 3, team: "Philadelphia 76ers", preDraftTeam: "Baylor", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/5124612.png&w=350&h=254", height: 77, weight: 193, age: 19, position: "Forward", conference: "Big 12", homePlace: "Freeport, Bahamas", preDraftStats: { ppg: 15, rpg: 5.6, apg: 3.2 } },
  { id: 4, name: "Kon Knueppel", draftPick: 4, team: "Charlotte Hornets", preDraftTeam: "Duke", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/5061575.png&w=350&h=254", height: 79, weight: 217, age: 19, position: "Forward", conference: "ACC", homePlace: "Milwaukee, Wisconsin", preDraftStats: { ppg: 14.4, rpg: 4.0, apg: 2.7 } },
  { id: 5, name: "Ace Bailey", draftPick: 5, team: "Utah Jazz", preDraftTeam: "Rutgers", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/4873138.png&w=350&h=254", height: 80, weight: 203, age: 19, position: "Forward", conference: "Big Ten", homePlace: "Chattanooga, Tennessee", preDraftStats: { ppg: 17.6, rpg: 7.2, apg: 1.3 } },
  { id: 6, name: "Tre Johnson", draftPick: 6, team: "Washington Wizards", preDraftTeam: "Texas", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/5238230.png&w=350&h=254", height: 77, weight: 190, age: 19, position: "Guard", conference: "Big 12", homePlace: "Garland, Texas", preDraftStats: { ppg: 19.9, rpg: 3.1, apg: 2.7 } },
  { id: 7, name: "Jeremiah Fears", draftPick: 7, team: "New Orleans Pelicans", preDraftTeam: "Oklahoma", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/5144091.png&w=350&h=254", height: 75, weight: 180, age: 18, position: "Guard", conference: "Big 12", homePlace: "Joliet, Illinois", preDraftStats: { ppg: 17.1, rpg: 4.1, apg: 4.1 } },
  { id: 8, name: "Egor Demin", draftPick: 8, team: "Brooklyn Nets", preDraftTeam: "BYU", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/mens-college-basketball/players/full/5243213.png", height: 81, weight: 199, age: 19, position: "Guard", conference: "Big 12", homePlace: "Moscow, Russia", preDraftStats: { ppg: 10.6, rpg: 3.9, apg: 5.5 } },
  { id: 9, name: "Collin Murray-Boyles", draftPick: 9, team: "Toronto Raptors", preDraftTeam: "South Carolina", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/5093267.png&w=350&h=254", height: 79, weight: 239, age: 20, position: "Forward", conference: "SEC", homePlace: "Columbia, South Carolina", preDraftStats: { ppg: 16.8, rpg: 8.3, apg: 2.4 } },
  { id: 10, name: "Khaman Maluach", draftPick: 10, team: "Phoenix Suns", preDraftTeam: "Duke", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/5203685.png&w=350&h=254", height: 85, weight: 253, age: 18, position: "Center", conference: "ACC", homePlace: "Rumbek, South Sudan", preDraftStats: { ppg: 8.6, rpg: 6.6, apg: 0.5 } },
  { id: 11, name: "Cedric Coward", draftPick: 11, team: "Memphis Grizzlies", preDraftTeam: "Washington State", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/4903027.png&w=350&h=254", height: 78, weight: 213, age: 21, position: "Guard", conference: "Pac-12", homePlace: "Fresno, California", preDraftStats: { ppg: 17.7, rpg: 7.0, apg: 3.7 } },
  { id: 12, name: "Noa Essengue", draftPick: 12, team: "Chicago Bulls", preDraftTeam: "Ratiopharm Ulm", imageUrl: "https://www.proballers.com/media/cache/resize_600_png/https---www.proballers.com/ul/player/noa-essengue-copie-1efa9906-9bc7-6e94-8e05-5b8404dd2f86.png", height: 81, weight: 198, age: 18, position: "Forward", conference: "International", homePlace: "Paris, France", preDraftStats: { ppg: 12.4, rpg: 5.3, apg: 1.4 } },
  { id: 13, name: "Derik Queen", draftPick: 13, team: "New Orleans Pelicans", preDraftTeam: "Maryland", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/4869780.png&w=350&h=254", height: 82, weight: 248, age: 20, position: "Center", conference: "Big Ten", homePlace: "Baltimore, Maryland", preDraftStats: { ppg: 16.5, rpg: 9.0, apg: 1.9 } },
  { id: 14, name: "Carter Bryant", draftPick: 14, team: "San Antonio Spurs", preDraftTeam: "Arizona", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/5061568.png&w=350&h=254", height: 79, weight: 215, age: 19, position: "Forward", conference: "Pac-12", homePlace: "Pasadena, California", preDraftStats: { ppg: 6.5, rpg: 4.1, apg: 1.0 } },
  { id: 15, name: "Thomas Sorber", draftPick: 15, team: "Oklahoma City Thunder", preDraftTeam: "Georgetown", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/5061603.png&w=350&h=254", height: 82, weight: 263, age: 19, position: "Center", conference: "Big East", homePlace: "Philadelphia, Pennsylvania", preDraftStats: { ppg: 14.5, rpg: 8.5, apg: 2.4 } },
  { id: 16, name: "Yang Hansen", draftPick: 16, team: "Portland Trail Blazers", preDraftTeam: "Qingdao Eagles", imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtUBYfXV6A3zDKF1N9vBExC0uJ-szXj23iA&s", height: 85, weight: 253, age: 20, position: "Center", conference: "International", homePlace: "Zibo, China", preDraftStats: { ppg: 16.2, rpg: 10.0, apg: 2.8 } },
  { id: 17, name: "Joan Beringer", draftPick: 17, team: "Minnesota Timberwolves", preDraftTeam: "Cedevita Olimpija", imageUrl: "https://cdn.nba.com/manage/2025/05/Beringer_Joan.jpg", height: 82, weight: 230, age: 19, position: "Center", conference: "International", homePlace: "Selestat, France", preDraftStats: { ppg: 8.9, rpg: 7.3, apg: 1.0 } },
  { id: 18, name: "Walter Clayton Jr.", draftPick: 18, team: "Utah Jazz", preDraftTeam: "Florida", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/4896372.png&w=350&h=254", height: 74, weight: 199, age: 22, position: "Guard", conference: "SEC", homePlace: "Lake Wales, Florida", preDraftStats: { ppg: 18.3, rpg: 3.7, apg: 4.2 } },
  { id: 19, name: "Nolan Traoré", draftPick: 19, team: "Brooklyn Nets", preDraftTeam: "Saint-Quentin", imageUrl: "https://www.nbadraft.net/wp-content/uploads/2022/08/Screenshot-2024-04-13-at-12.39.08-PM.png", height: 76, weight: 184, age: 19, position: "Guard", conference: "International", homePlace: "Paris, France", preDraftStats: { ppg: 11.8, rpg: 1.8, apg: 5.0 } },
  { id: 20, name: "Kasparas Jakučionis", draftPick: 20, team: "Miami Heat", preDraftTeam: "Illinois", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/5214640.png&w=350&h=254", height: 77, weight: 205, age: 19, position: "Guard", conference: "Big Ten", homePlace: "Vilnius, Lithuania", preDraftStats: { ppg: 15.0, rpg: 5.7, apg: 4.7 } },
  { id: 21, name: "Will Riley", draftPick: 21, team: "Washington Wizards", preDraftTeam: "Illinois", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/5144126.png&w=350&h=254", height: 79, weight: 186, age: 19, position: "Forward", conference: "Big Ten", homePlace: "Guelph, Ontario, Canada", preDraftStats: { ppg: 12.6, rpg: 4.1, apg: 2.2 } },
  { id: 22, name: "Drake Powell", draftPick: 22, team: "Brooklyn Nets", preDraftTeam: "North Carolina", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/5037873.png&w=350&h=254", height: 78, weight: 200, age: 19, position: "Guard", conference: "ACC", homePlace: "Pittsboro, North Carolina", preDraftStats: { ppg: 7.4, rpg: 3.4, apg: 1.1 } },
  { id: 23, name: "Asa Newell", draftPick: 23, team: "Atlanta Hawks", preDraftTeam: "Georgia", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/4873201.png&w=350&h=254", height: 81, weight: 224, age: 19, position: "Center", conference: "SEC", homePlace: "Athens, Georgia", preDraftStats: { ppg: 15.4, rpg: 6.9, apg: 0.9 } },
  { id: 24, name: "Nique Clifford", draftPick: 24, team: "Sacramento Kings", preDraftTeam: "Colorado State", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/4702384.png&w=350&h=254", height: 78, weight: 202, age: 23, position: "Guard", conference: "Mountain West", homePlace: "Colorado Springs, Colorado", preDraftStats: { ppg: 18.9, rpg: 9.6, apg: 4.4 } },
  { id: 25, name: "Jase Richardson", draftPick: 25, team: "Orlando Magic", preDraftTeam: "Michigan State", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/5239561.png&w=350&h=254", height: 75, weight: 180, age: 19, position: "Guard", conference: "Big Ten", homePlace: "Denver, Colorado", preDraftStats: { ppg: 12.1, rpg: 3.3, apg: 1.9 } },
  { id: 26, name: "Ben Saraf", draftPick: 26, team: "Brooklyn Nets", preDraftTeam: "Ratiopharm Ulm", imageUrl: "https://www.proballers.com/media/cache/torso_player/https---www.proballers.com/ul/player/ben-saraf-1ef52a2e-7e7a-66f8-b118-bf0b07cf5094.png", height: 77, weight: 200, age: 19, position: "Guard", conference: "International", homePlace: "Tel Aviv, Israel", preDraftStats: { ppg: 11.5, rpg: 1.3, apg: 3.0 } },
  { id: 27, name: "Danny Wolf", draftPick: 27, team: "Brooklyn Nets", preDraftTeam: "Michigan", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/5107173.png&w=350&h=254", height: 84, weight: 255, age: 21, position: "Center", conference: "Big Ten", homePlace: "Glencoe, Illinois", preDraftStats: { ppg: 13.2, rpg: 9.7, apg: 3.6 } },
  { id: 28, name: "Hugo González", draftPick: 28, team: "Boston Celtics", preDraftTeam: "Real Madrid", imageUrl: "https://i3.wp.com/img.mabumbe.net/wp-content/uploads/2025/06/hugo-gonzalez.png?w=600&resize=600,600&ssl=1", height: 78, weight: 205, age: 19, position: "Guard", conference: "International", homePlace: "Madrid, Spain", preDraftStats: { ppg: 4.5, rpg: 2.2, apg: 0.8 } },
  { id: 29, name: "Liam McNeeley", draftPick: 29, team: "UConn", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/5239590.png&w=350&h=254", height: 79, weight: 215, age: 19, position: "Forward", conference: "Big East", homePlace: "Richardson, Texas", preDraftStats: { ppg: 14.5, rpg: 6.0, apg: 2.3 } },
  { id: 30, name: "Yanic Konan Niederhauser", draftPick: 30, team: "Los Angeles Clippers", preDraftTeam: "Penn State", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/5108024.png&w=350&h=254", height: 84, weight: 243, age: 22, position: "Center", conference: "Big Ten", homePlace: "Zurich, Switzerland", preDraftStats: { ppg: 12.9, rpg: 6.3, apg: 0.8 } },
  { id: 31, name: "Rasheer Fleming", draftPick: 31, team: "Phoenix Suns", preDraftTeam: "Saint Joseph's", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/5105977.png&w=350&h=254", height: 81, weight: 232, age: 20, position: "Forward", conference: "A-10", homePlace: "Camden, New Jersey", preDraftStats: { ppg: 14.7, rpg: 8.5, apg: 1.3 } },
  { id: 32, name: "Noah Penda", draftPick: 32, team: "Orlando Magic", preDraftTeam: "Le Mans Sarthe", imageUrl: "https://cdn.nba.com/manage/2025/05/noah-penda-mugshot.jpg", height: 80, weight: 225, age: 20, position: "Forward", conference: "International", homePlace: "Le Mans, France", preDraftStats: { ppg: 10.3, rpg: 5.5, apg: 2.6 } },
  { id: 33, name: "Sion James", draftPick: 33, team: "Charlotte Hornets", preDraftTeam: "Duke", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/4602025.png&w=350&h=254", height: 77, weight: 218, age: 22, position: "Guard", conference: "ACC", homePlace: "Sugar Hill, Georgia", preDraftStats: { ppg: 8.6, rpg: 4.2, apg: 2.9 } },
  { id: 34, name: "Ryan Kalkbrenner", draftPick: 34, team: "Charlotte Hornets", preDraftTeam: "Creighton", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/4576060.png&w=350&h=254", height: 85, weight: 257, age: 23, position: "Center", conference: "Big East", homePlace: "Florissant, Missouri", preDraftStats: { ppg: 19.2, rpg: 8.7, apg: 1.5 } },
  { id: 35, name: "Johni Broome", draftPick: 35, team: "Philadelphia 76ers", preDraftTeam: "Auburn", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/4433569.png&w=350&h=254", height: 82, weight: 249, age: 22, position: "Forward", conference: "SEC", homePlace: "Plant City, Florida", preDraftStats: { ppg: 18.6, rpg: 10.8, apg: 2.9 } },
  { id: 36, name: "Adou Thiero", draftPick: 36, team: "Los Angeles Lakers", preDraftTeam: "Arkansas", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/5060631.png&w=350&h=254", height: 79, weight: 220, age: 21, position: "Forward", conference: "SEC", homePlace: "Leetsdale, Pennsylvania", preDraftStats: { ppg: 15.1, rpg: 5.8, apg: 1.9 } },
  { id: 37, name: "Chaz Lanier", draftPick: 37, team: "Detroit Pistons", preDraftTeam: "Tennessee", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/4700852.png&w=350&h=254", height: 76, weight: 190, age: 23, position: "Guard", conference: "SEC", homePlace: "Nashville, Tennessee", preDraftStats: { ppg: 18.0, rpg: 3.9, apg: 1.1 } },
  { id: 38, name: "Kam Jones", draftPick: 38, team: "Indiana Pacers", preDraftTeam: "Marquette", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/4697268.png&w=350&h=254", height: 76, weight: 195, age: 23, position: "Guard", conference: "Big East", homePlace: "Memphis, Tennessee", preDraftStats: { ppg: 18.0, rpg: 3.9, apg: 1.1 } },
  { id: 39, name: "Alijah Martin", draftPick: 39, team: "Toronto Raptors", preDraftTeam: "Florida", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/4702656.png&w=350&h=254", height: 74, weight: 210, age: 23, position: "Guard", conference: "SEC", homePlace: "Lehigh Acres, Florida", preDraftStats: { ppg: 14.4, rpg: 4.5, apg: 2.2 } },
  { id: 40, name: "Micah Peavy", draftPick: 40, team: "New Orleans Pelicans", preDraftTeam: "Georgetown", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/4432185.png&w=350&h=254", height: 78, weight: 215, age: 24, position: "Forward", conference: "Big East", homePlace: "Forest Hill, Texas", preDraftStats: { ppg: 17.2, rpg: 5.8, apg: 3.6 } },
  { id: 41, name: "Koby Brea", draftPick: 41, team: "Phoenix Suns", preDraftTeam: "Kentucky", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/4591259.png&w=350&h=254", height: 78, weight: 205, age: 22, position: "Guard", conference: "SEC", homePlace: "Washington Heights, New York", preDraftStats: { ppg: 11.6, rpg: 3.2, apg: 1.3 } },
  { id: 42, name: "Maxime Raynaud", draftPick: 42, team: "Sacramento Kings", preDraftTeam: "Stanford", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/4898371.png&w=350&h=254", height: 85, weight: 237, age: 22, position: "Center", conference: "Pac-12", homePlace: "Paris, France", preDraftStats: { ppg: 20.2, rpg: 10.6, apg: 1.7 } },
  { id: 43, name: "Jamir Watkins", draftPick: 43, team: "Utah Jazz", preDraftTeam: "Florida State", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/4606840.png&w=350&h=254", height: 77, weight: 215, age: 24, position: "Forward", conference: "ACC", homePlace: "Trenton, New Jersey", preDraftStats: { ppg: 18.4, rpg: 5.7, apg: 2.4 } },
  { id: 44, name: "Brooks Barnhizer", draftPick: 44, team: "Oklahoma City Thunder", preDraftTeam: "Northwestern", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/4684208.png&w=350&h=254", height: 77, weight: 228, age: 23, position: "Forward", conference: "Big Ten", homePlace: "Lafayette, Indiana", preDraftStats: { ppg: 17.1, rpg: 8.8, apg: 4.2 } },
  { id: 45, name: "Rocco Zikarsky", draftPick: 45, team: "Minnesota Timberwolves", preDraftTeam: "Brisbane Bullets", imageUrl: "https://cdn.prod.website-files.com/66de41e2655789935056f9d5/685e08140c91ba0c75af6fba_Rocco-Zikarsky.png", height: 87, weight: 257, age: 19, position: "Center", conference: "International", homePlace: "Brisbane, Australia", preDraftStats: { ppg: 4.6, rpg: 3.4, apg: 0.3 } },
  { id: 46, name: "Amari Williams", draftPick: 46, team: "Boston Celtics", preDraftTeam: "Kentucky", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/4702745.png&w=350&h=254", height: 84, weight: 265, age: 23, position: "Center", conference: "SEC", homePlace: "Nottingham, England", preDraftStats: { ppg: 11.0, rpg: 8.4, apg: 3.1 } },
  { id: 47, name: "Bogoljub Marković", draftPick: 47, team: "Milwaukee Bucks", preDraftTeam: "Mega Basket", imageUrl: "https://www.proballers.com/media/cache/resize_600_png/https---www.proballers.com/ul/player/bogoljub-markovic-copie-1efbca8c-eaa8-6d16-a2b8-4fc296eee1f0.png", height: 82, weight: 200, age: 20, position: "Forward", conference: "International", homePlace: "Belgrade, Serbia", preDraftStats: { ppg: 14.0, rpg: 6.9, apg: 2.5 } },
  { id: 48, name: "Javon Small", draftPick: 48, team: "Memphis Grizzlies", preDraftTeam: "West Virginia", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/4781746.png&w=350&h=254", height: 73, weight: 185, age: 22, position: "Guard", conference: "Big 12", homePlace: "South Bend, Indiana", preDraftStats: { ppg: 1.6, rpg: 4.1, apg: 5.6 } },
  { id: 49, name: "Tyrese Proctor", draftPick: 49, team: "Cleveland Cavaliers", preDraftTeam: "Duke", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/5023693.png&w=350&h=254", height: 77, weight: 190, age: 21, position: "Guard", conference: "ACC", homePlace: "Sydney, Australia", preDraftStats: { ppg: 12.4, rpg: 3.0, apg: 2.2 } },
  { id: 50, name: "Kobe Sanders", draftPick: 50, team: "Los Angeles Clippers", preDraftTeam: "Nevada", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/4702352.png&w=350&h=254", height: 79, weight: 203, age: 23, position: "Guard", conference: "Mountain West", homePlace: "San Diego, California", preDraftStats: { ppg: 15.8, rpg: 3.9, apg: 4.5 } },
  { id: 51, name: "Mohamed Diawara", draftPick: 51, team: "New York Knicks", preDraftTeam: "Cholet Basket", imageUrl: "https://cdn.nba.com/manage/2025/06/diawara.png", height: 80, weight: 223, age: 20, position: "Forward", conference: "International", homePlace: "Paris, France", preDraftStats: { ppg: 6.1, rpg: 3.2, apg: 1.4 } },
  { id: 52, name: "Alex Toohey", draftPick: 52, team: "Golden State Warriors", preDraftTeam: "Sydney Kings", imageUrl: "https://i1.sndcdn.com/artworks-Rg7ezT2M6zLV7MuL-BDZzxw-t500x500.png", height: 80, weight: 223, age: 21, position: "Forward", conference: "International", homePlace: "Canberra, Australia", preDraftStats: { ppg: 10.5, rpg: 3.9, apg: 1.3 } },
  { id: 53, name: "John Tonje", draftPick: 53, team: "Utah Jazz", preDraftTeam: "Wisconsin", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/4593043.png&w=350&h=254", height: 77, weight: 212, age: 24, position: "Guard", conference: "Big Ten", homePlace: "Omaha, Nebraska", preDraftStats: { ppg: 19.6, rpg: 5.3, apg: 1.8 } },
  { id: 54, name: "Taleon Peter", draftPick: 54, team: "Indiana Pacers", preDraftTeam: "Liberty", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/4703421.png&w=350&h=254", height: 76, weight: 210, age: 23, position: "Guard", conference: "ASUN", homePlace: "Houston, Texas", preDraftStats: { ppg: 13.7, rpg: 4.0, apg: 1.0 } },
  { id: 55, name: "Lachlan Olbrich", draftPick: 55, team: "Chicago Bulls", preDraftTeam: "Illawarra Hawks", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/mens-college-basketball/players/full/5107156.png", height: 82, weight: 230, age: 21, position: "Forward", conference: "International", homePlace: "Adelaide, Australia", preDraftStats: { ppg: 8.4, rpg: 3.8, apg: 1.6 } },
  { id: 56, name: "Will Richard", draftPick: 56, team: "Golden State Warriors", preDraftTeam: "Florida", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/4897262.png&w=350&h=254", height: 76, weight: 206, age: 23, position: "Guard", conference: "SEC", homePlace: "Gainesville, Florida", preDraftStats: { ppg: 13.3, rpg: 4.6, apg: 1.9 } },
  { id: 57, name: "Max Shulga", draftPick: 57, team: "Boston Celtics", preDraftTeam: "VCU", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/4701992.png&w=350&h=254", height: 77, weight: 195, age: 22, position: "Guard", conference: "A-10", homePlace: "Kyiv, Ukraine", preDraftStats: { ppg: 15.0, rpg: 5.9, apg: 4.0 } },
  { id: 58, name: "Saliou Niang", draftPick: 58, team: "Cleveland Cavaliers", preDraftTeam: "Trento", imageUrl: "https://www.proballers.com/media/cache/resize_600_png/https---www.proballers.com/ul/player/saliou-niang2-1ef7f63f-7604-60ca-9ae6-9b306d77b6be.png", height: 77, weight: 190, age: 21, position: "Forward", conference: "International", homePlace: "Dakar, Senegal", preDraftStats: { ppg: 8.2, rpg: 5.1, apg: 1.4 } },
  { id: 59, name: "Jahmai Mashack", draftPick: 59, team: "Memphis Grizzlies", preDraftTeam: "Tennessee", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/4683934.png&w=350&h=254", height: 76, weight: 201, age: 22, position: "Forward", conference: "SEC", homePlace: "Fontana, California", preDraftStats: { ppg: 6.0, rpg: 4.2, apg: 1.6 } },
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
  const [gameStarted, setGameStarted] = useState(false);
  const [currentMode, setCurrentMode] = useState('Easy');

  // Difficulty system
  const getDifficultyMode = (streak) => {
    if (streak >= 20) return 'Expert';
    if (streak >= 10) return 'Hard';
    return 'Easy';
  };

  const getModeColor = (mode) => {
    switch (mode) {
      case 'Easy': return '#10B981'; // Green
      case 'Hard': return '#F59E0B'; // Orange  
      case 'Expert': return '#EF4444'; // Red
      default: return '#10B981';
    }
  };

  // CORRECTED Question types organized by difficulty - EXACTLY AS SPECIFIED
  const EASY_QUESTIONS = [
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
      text: "Which player is TALLER?",
      getCorrectPlayerId: (p1, p2) => (p1.height > p2.height ? p1.id : p2.id),
      filter: (p1, p2) => p1.height !== p2.height,
    },
    {
      text: "Which player is SHORTER?",
      getCorrectPlayerId: (p1, p2) => (p1.height < p2.height ? p1.id : p2.id),
      filter: (p1, p2) => p1.height !== p2.height,
    },
  ];

  const HARD_QUESTIONS = [
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
      text: "Which player scored MORE points per game?",
      getCorrectPlayerId: (p1, p2) => (p1.preDraftStats.ppg > p2.preDraftStats.ppg ? p1.id : p2.id),
      filter: (p1, p2) => p1.preDraftStats.ppg !== p2.preDraftStats.ppg,
    },
    {
      text: "Which player scored FEWER points per game?",
      getCorrectPlayerId: (p1, p2) => (p1.preDraftStats.ppg < p2.preDraftStats.ppg ? p1.id : p2.id),
      filter: (p1, p2) => p1.preDraftStats.ppg !== p2.preDraftStats.ppg,
    },
    {
      text: "Which player is HEAVIER?",
      getCorrectPlayerId: (p1, p2) => (p1.weight > p2.weight ? p1.id : p2.id),
      filter: (p1, p2) => p1.weight !== p2.weight,
    },
    {
      text: "Which player is LIGHTER?",
      getCorrectPlayerId: (p1, p2) => (p1.weight < p2.weight ? p1.id : p2.id),
      filter: (p1, p2) => p1.weight !== p2.weight,
    },
  ];

  // Dynamic home place questions for Hard Mode
  const getHomePlaceQuestions = (p1, p2) => {
    const questions = [];
    
    // Check if one player is from a specific place and the other isn't
    if (p1.homePlace !== p2.homePlace) {
      questions.push({
        text: `Which player is from ${p1.homePlace}?`,
        getCorrectPlayerId: (player1, player2) => p1.id,
        filter: (player1, player2) => true,
      });
      questions.push({
        text: `Which player is from ${p2.homePlace}?`,
        getCorrectPlayerId: (player1, player2) => p2.id,
        filter: (player1, player2) => true,
      });
    }
    
    return questions;
  };

  const EXPERT_QUESTIONS = [
    {
      text: "Which player had MORE rebounds per game?",
      getCorrectPlayerId: (p1, p2) => (p1.preDraftStats.rpg > p2.preDraftStats.rpg ? p1.id : p2.id),
      filter: (p1, p2) => p1.preDraftStats.rpg !== p2.preDraftStats.rpg,
    },
    {
      text: "Which player had FEWER rebounds per game?",
      getCorrectPlayerId: (p1, p2) => (p1.preDraftStats.rpg < p2.preDraftStats.rpg ? p1.id : p2.id),
      filter: (p1, p2) => p1.preDraftStats.rpg !== p2.preDraftStats.rpg,
    },
    {
      text: "Which player had MORE assists per game?",
      getCorrectPlayerId: (p1, p2) => (p1.preDraftStats.apg > p2.preDraftStats.apg ? p1.id : p2.id),
      filter: (p1, p2) => p1.preDraftStats.apg !== p2.preDraftStats.apg,
    },
    {
      text: "Which player had FEWER assists per game?",
      getCorrectPlayerId: (p1, p2) => (p1.preDraftStats.apg < p2.preDraftStats.apg ? p1.id : p2.id),
      filter: (p1, p2) => p1.preDraftStats.apg !== p2.preDraftStats.apg,
    },
    {
      text: "Which player played in the ACC?",
      getCorrectPlayerId: (p1, p2) => (p1.conference === "ACC" ? p1.id : p2.id),
      filter: (p1, p2) => (p1.conference === "ACC" && p2.conference !== "ACC") || (p2.conference === "ACC" && p1.conference !== "ACC"),
    },
    {
      text: "Which player played in the SEC?",
      getCorrectPlayerId: (p1, p2) => (p1.conference === "SEC" ? p1.id : p2.id),
      filter: (p1, p2) => (p1.conference === "SEC" && p2.conference !== "SEC") || (p2.conference === "SEC" && p1.conference !== "SEC"),
    },
    {
      text: "Which player played in the Big Ten?",
      getCorrectPlayerId: (p1, p2) => (p1.conference === "Big Ten" ? p1.id : p2.id),
      filter: (p1, p2) => (p1.conference === "Big Ten" && p2.conference !== "Big Ten") || (p2.conference === "Big Ten" && p1.conference !== "Big Ten"),
    },
    {
      text: "Which player played in the Big 12?",
      getCorrectPlayerId: (p1, p2) => (p1.conference === "Big 12" ? p1.id : p2.id),
      filter: (p1, p2) => (p1.conference === "Big 12" && p2.conference !== "Big 12") || (p2.conference === "Big 12" && p1.conference !== "Big 12"),
    },
  ];

  // FIXED: Single, correct function declaration
  const getQuestionsForMode = (mode, p1, p2) => {
    switch (mode) {
      case 'Easy': 
        return EASY_QUESTIONS;
      case 'Hard': 
        // Hard mode gets its own questions PLUS dynamic home place questions
        const homePlaceQuestions = getHomePlaceQuestions(p1, p2);
        return [...HARD_QUESTIONS, ...homePlaceQuestions];
      case 'Expert': 
        return EXPERT_QUESTIONS;
      default: 
        return EASY_QUESTIONS;
    }
  };

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

  // FIXED: Correct selectRandomRookiesAndQuestion function
  const selectRandomRookiesAndQuestion = useCallback(() => {
    if (!gameStarted) return;

    const mode = getDifficultyMode(currentStreak);
    setCurrentMode(mode);

    let p1, p2, randomQuestion;
    let attempts = 0;
    const maxAttempts = 100;

    do {
      p1 = ROOKIES_2025_NBA[Math.floor(Math.random() * ROOKIES_2025_NBA.length)];
      p2 = ROOKIES_2025_NBA[Math.floor(Math.random() * ROOKIES_2025_NBA.length)];
      
      // Get questions for this specific player pair (important for home place questions)
      const questionsForPair = getQuestionsForMode(mode, p1, p2);
      randomQuestion = questionsForPair[Math.floor(Math.random() * questionsForPair.length)];
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
  }, [currentStreak, gameStarted]);

  // Start game function
  const startGame = () => {
    setGameStarted(true);
    setCurrentStreak(0);
    setCurrentMode('Easy');
    setGameOver(false);
    setSelectedPlayerId(null);
    setIsCorrectGuess(null);
    setFeedbackMessage('');
  };

  // Initialize game only when started
  useEffect(() => {
    if (gameStarted) {
      selectRandomRookiesAndQuestion();
    }
  }, [gameStarted, selectRandomRookiesAndQuestion]);

  // Shot clock timer
  useEffect(() => {
    if (gameStarted && player1 && player2 && selectedPlayerId === null && !gameOver) {
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
  }, [gameStarted, player1, player2, selectedPlayerId, gameOver, handleTimeOut]);

  // Handle user's guess
  const handleGuess = (id) => {
    if (selectedPlayerId !== null || !currentQuestion || gameOver || !gameStarted) return;

    clearInterval(shotClockIntervalRef.current);
    setSelectedPlayerId(id);

    const correctPlayerId = currentQuestion.getCorrectPlayerId(player1, player2);
    const isGuessCorrect = id === correctPlayerId;

    if (isGuessCorrect) {
      setIsCorrectGuess(true);
      const newStreak = currentStreak + 1;
      setCurrentStreak(newStreak);

      // Check for mode progression
      const newMode = getDifficultyMode(newStreak);
      if (newMode !== currentMode) {
        setFeedbackMessage(`Correct! 🔥 ${newMode} MODE UNLOCKED!`);
        setCurrentMode(newMode);
      } else {
        setFeedbackMessage('Correct! 🔥');
      }
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
      setGameStarted(false);
      setCurrentStreak(0);
      setCurrentMode('Easy');
      setPlayer1(null);
      setPlayer2(null);
      setCurrentQuestion(null);
      setSelectedPlayerId(null);
      setIsCorrectGuess(null);
      setFeedbackMessage('');
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

  // START GAME SCREEN
  if (!gameStarted) {
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
          
          .draft-duel-fullscreen {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            font-family: 'Outfit', sans-serif;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            overflow-x: hidden;
            overflow-y: auto;
            padding-bottom: 120px;
            min-height: calc(100vh + 120px);
          }

          .start-game-screen {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: ${isDarkMode ? '#1A202C' : '#F8F8F0'};
            background-image: url("data:image/svg+xml;utf8,${encodedBasketballPattern}");
            background-repeat: repeat;
            background-size: 200px 200px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
            z-index: 10000;
            color: ${isDarkMode ? '#ffffff' : '#333333'};
            text-align: center;
            padding: 1rem;
            padding-top: 2rem;
            overflow-y: auto;
            box-sizing: border-box;
          }

          .start-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            width: 100%;
            max-width: 800px;
            margin: 0 auto;
            padding: 1rem;
            box-sizing: border-box;
          }

          .start-title {
            font-size: 4rem;
            font-weight: 800;
            background: linear-gradient(45deg, #FFD700, #FF8C00, #FF4500);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 1rem;
            animation: flicker 1.5s infinite alternate;
            line-height: 1.1;
            word-wrap: break-word;
            hyphens: none;
            white-space: nowrap;
          }

          @keyframes flicker {
            0%, 100% { opacity: 1; transform: scale(1); }
            25% { opacity: 0.9; transform: scale(1.02); }
            50% { opacity: 1; transform: scale(1); }
            75% { opacity: 0.95; transform: scale(1.01); }
          }

          .start-subtitle {
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 2rem;
            opacity: 0.9;
          }

          .start-instructions {
            max-width: 600px;
            text-align: left;
            margin-bottom: 2rem;
            font-size: 1.1rem;
            line-height: 1.6;
          }

          .start-instructions h3 {
            color: ${isDarkMode ? '#4ecdc4' : '#2c3e50'};
            margin-bottom: 1rem;
          }

          .start-instructions ul {
            padding-left: 1.5rem;
          }

          .start-instructions li {
            margin-bottom: 0.5rem;
          }

          .difficulty-tiers {
            background: rgba(0,0,0,0.2);
            padding: 1rem;
            border-radius: 0.5rem;
            margin: 1rem 0;
          }

          .difficulty-tiers ul {
            margin-top: 0.5rem;
          }

          .start-button {
            background: linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%);
            color: white;
            border: none;
            padding: 1.5rem 3rem;
            border-radius: 2rem;
            font-size: 1.5rem;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-top: 1rem;
            min-width: 200px;
          }

          .start-button:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 30px rgba(59, 130, 246, 0.4);
          }

          .start-button:active {
            transform: translateY(-2px);
          }

          .theme-toggle {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: rgba(255, 255, 255, 0.1);
            border: none;
            border-radius: 50%;
            width: 3rem;
            height: 3rem;
            font-size: 1.5rem;
            cursor: pointer;
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
            z-index: 100;
          }

          .theme-toggle:hover {
            background: rgba(255, 255, 255, 0.2);
            transform: scale(1.1);
          }

          @media (max-width: 768px) {
            .start-game-screen {
              padding: 0.5rem;
              padding-top: 1rem;
              justify-content: flex-start;
            }
            
            .start-content {
              min-height: 100vh;
              justify-content: center;
              padding: 0.5rem;
            }
            
            .start-title {
              font-size: 2.8rem;
              margin-bottom: 0.5rem;
              white-space: normal;
              line-height: 1.1;
            }
            
            .start-subtitle {
              font-size: 1.2rem;
              margin-bottom: 1.5rem;
            }
            
            .start-instructions {
              font-size: 0.95rem;
              max-width: 95%;
              margin-bottom: 1.5rem;
            }
            
            .start-button {
              font-size: 1.2rem;
              padding: 1.2rem 2.5rem;
              margin-top: 0.5rem;
              width: 90%;
              max-width: 280px;
            }
          }

          @media (max-width: 480px) {
            .start-title {
              font-size: 2.2rem;
              margin-bottom: 0.5rem;
            }
            
            .start-subtitle {
              font-size: 1rem;
              margin-bottom: 1rem;
            }
            
            .start-instructions {
              font-size: 0.9rem;
              margin-bottom: 1rem;
            }
            
            .start-button {
              font-size: 1.1rem;
              padding: 1rem 2rem;
              width: 95%;
              max-width: 260px;
            }
          }
        `}</style>

        {/* Theme Toggle */}
        <button 
          className="theme-toggle"
          onClick={toggleDarkMode}
          aria-label="Toggle theme"
        >
          {isDarkMode ? '☀️' : '🌙'}
        </button>

        <div className="start-game-screen">
          <div className="start-content">
            <div className="start-title">🏀 DRAFT DUEL</div>
            <div className="start-subtitle">NBA Rookie Trivia Challenge</div>

            <div className="start-instructions">
              <h3>How to Play:</h3>
              <ul>
                <li>Compare two NBA rookies and answer questions about them</li>
                <li>You have 10 seconds per question - make it count!</li>
                <li>A wrong answer or running out of time ends the game</li>
                <li>Game gets progressively harder as you build your streak:</li>
                <div className="difficulty-tiers">
                  <ul>
                    <li><strong>Easy Mode:</strong> 0-9 points</li>
                    <li><strong>Hard Mode:</strong> 10-19 points</li>
                    <li><strong>Expert Mode:</strong> 20+ points</li>
                  </ul>
                </div>
              </ul>
            </div>

            <button onClick={startGame} className="start-button">
              Start Game
            </button>
          </div>
        </div>
      </div>
    );
  }
