}}
    >
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono:wght@400&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        
        /* Enhanced full screen styles */
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
          transition: all 0.3s ease;
        }

        /* Enhanced Game Title with Summer League theming */
        .game-title {
          text-align: center;
          margin: 1rem 0;
          font-size: 4.5rem;
          font-weight: 900;
          background: linear-gradient(45deg, #FFD700 0%, #FF8C00 25%, #FF4500 50%, #FF6B35 75%, #FFD700 100%);
          background-size: 300% 300%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: drop-shadow(0 0 12px rgba(255, 165, 0, 0.9)) drop-shadow(0 0 25px rgba(255, 69, 0, 0.7));
          animation: titleShine 3s ease-in-out infinite, titleFloat 2s ease-in-out infinite alternate;
          z-index: 20;
          text-shadow: 0 0 30px rgba(255, 140, 0, 0.8);
        }

        @keyframes titleShine {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes titleFloat {
          0% { transform: translateY(0px); }
          100% { transform: translateY(-3px); }
        }

        /* Enhanced Theme Toggle */
        .theme-toggle {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          background: rgba(255, 255, 255, 0.15);
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          width: 3.5rem;
          height: 3.5rem;
          font-size: 1.5rem;
          cursor: pointer;
          backdrop-filter: blur(15px);
          transition: all 0.3s ease;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
          color: ${isDarkMode ? '#FFD700' : '#FF6B35'};
        }

        .theme-toggle:hover {
          background: rgba(255, 255, 255, 0.25);
          transform: scale(1.1) rotate(180deg);
          box-shadow: 0 0 20px rgba(255, 165, 0, 0.4);
        }

        /* ENHANCED SCOREBOARD with Summer League styling */
        .scoreboard {
          background: linear-gradient(145deg, #000000 0%, #1a1a1a 50%, #000000 100%);
          border: 8px solid transparent;
          background-clip: padding-box;
          border-radius: 25px;
          position: relative;
          display: flex;
          width: 95%;
          max-width: 1000px;
          height: 140px;
          min-height: 140px;
          max-height: 140px;
          box-shadow: 
            inset 0 0 40px rgba(0,0,0,0.9), 
            0 15px 40px rgba(0,0,0,0.7),
            0 0 30px rgba(255, 140, 0, 0.4),
            0 0 60px rgba(255, 69, 0, 0.2);
          font-family: 'Share Tech Mono', monospace;
          color: #FF8C00;
          text-shadow: 0 0 20px rgba(255, 140, 0, 1);
          padding: 12px;
          margin: 0 auto 1.5rem;
          flex-shrink: 0;
          overflow: hidden;
        }

        .scoreboard::before {
          content: '';
          position: absolute;
          top: -8px;
          left: -8px;
          right: -8px;
          bottom: -8px;
          background: linear-gradient(45deg, #FF8C00, #FFD700, #FF4500, #FF6B35, #FF8C00);
          background-size: 400% 400%;
          border-radius: 33px;
          z-index: -1;
          animation: borderFlow 4s ease-in-out infinite;
        }

        @keyframes borderFlow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .scoreboard-box {
          background: linear-gradient(145deg, #0a0a0a 0%, #000000 50%, #0a0a0a 100%);
          border: 4px solid #333;
          border-radius: 15px;
          box-shadow: 
            inset 0 0 20px rgba(0,0,0,0.9), 
            0 6px 12px rgba(0,0,0,0.5);
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          padding: 10px;
          margin: 0 8px;
          position: relative;
          height: calc(100% - 20px);
          min-height: 108px;
          max-height: 108px;
          flex-shrink: 0;
          overflow: hidden;
        }

        .scoreboard-label {
          font-family: 'Outfit', sans-serif;
          font-size: 1.1rem;
          font-weight: 800;
          color: #FFD700;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          text-shadow: 0 0 15px rgba(255, 215, 0, 1);
          height: 22px;
          line-height: 22px;
          flex-shrink: 0;
        }

        .scoreboard-value {
          font-family: 'Orbitron', monospace;
          font-size: 4rem;
          font-weight: 900;
          line-height: 1;
          color: #FF8C00;
          text-shadow: 
            0 0 25px rgba(255, 140, 0, 1),
            0 0 50px rgba(255, 140, 0, 0.7),
            0 0 75px rgba(255, 140, 0, 0.4);
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding-bottom: 8px;
          filter: brightness(1.3);
          flex-shrink: 0;
          animation: numberPulse 2s ease-in-out infinite;
        }

        @keyframes numberPulse {
          0%, 100% { filter: brightness(1.3); }
          50% { filter: brightness(1.5); }
        }

        .scoreboard-timer {
          font-family: 'Orbitron', monospace;
          font-size: 4rem;
          font-weight: 900;
          line-height: 1;
          color: ${shotClockTime <= 5 ? '#FF3333' : '#00FF41'};
          text-shadow: 
            0 0 25px rgba(${shotClockTime <= 5 ? '255, 50, 50' : '0, 255, 65'}, 1),
            0 0 50px rgba(${shotClockTime <= 5 ? '255, 50, 50' : '0, 255, 65'}, 0.8),
            0 0 75px rgba(${shotClockTime <= 5 ? '255, 50, 50' : '0, 255, 65'}, 0.5);
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          padding-bottom: 8px;
          filter: brightness(1.3);
          flex-shrink: 0;
          transition: all 0.3s ease;
        }

        .scoreboard-timer.warning {
          color: #FF3333;
          animation: timerAlert 0.5s infinite alternate;
        }

        @keyframes timerAlert {
          from { 
            filter: brightness(1.3);
            transform: scale(1);
          }
          to { 
            filter: brightness(1.8);
            transform: scale(1.1);
          }
        }

        /* Enhanced Question Section */
        .question-section {
          width: 95%;
          max-width: 1000px;
          margin: 0 auto 2rem;
          text-align: center;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(147, 51, 234, 0.2), rgba(245, 101, 101, 0.1));
          border-radius: 25px;
          padding: 2rem 2.5rem;
          border: 2px solid rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(15px);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
          position: relative;
          overflow: hidden;
        }

        .question-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          animation: questionShine 3s infinite;
        }

        @keyframes questionShine {
          0% { left: -100%; }
          100% { left: 100%; }
        }

        .question-text {
          font-family: 'Outfit', sans-serif;
          font-size: 2rem;
          font-weight: 800;
          color: ${isDarkMode ? '#FFF' : '#333'};
          text-shadow: 0 0 15px rgba(${isDarkMode ? '255,255,255' : '0,0,0'},0.8);
          text-transform: uppercase;
          letter-spacing: 2px;
          margin: 0;
          position: relative;
          z-index: 1;
        }

        /* Enhanced Game Area */
        .game-area {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          padding: 1.5rem;
          max-width: 1600px;
          margin: 0 auto;
          width: 100%;
        }

        .court-background {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) scale(0.7);
          z-index: 0;
          opacity: 0.12;
          pointer-events: none;
          width: 1000px;
          height: 500px;
        }

        /* Enhanced Player Comparison */
        .players-comparison {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 4rem;
          z-index: 10;
          width: 100%;
          max-width: 1400px;
          margin: 2rem 0;
        }

        .player-card-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
          z-index: 20;
        }

        /* ENHANCED Player Cards */
        .player-card {
          position: relative;
          width: 20rem;
          height: 26rem;
          border-radius: 1.5rem;
          padding: 2rem;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-shadow: 
            0 20px 40px rgba(0, 0, 0, 0.5),
            0 10px 20px rgba(0, 0, 0, 0.3);
          border: 4px solid rgba(255, 255, 255, 0.2);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          background: none;
          font-family: inherit;
          z-index: 20;
          overflow: hidden;
        }

        .card-glow {
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          border-radius: 1.5rem;
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: -1;
        }

        .player-card:hover:not(.disabled) {
          transform: translateY(-12px) scale(1.08);
          box-shadow: 
            0 35px 60px rgba(0, 0, 0, 0.6),
            0 15px 30px rgba(0, 0, 0, 0.4),
            0 0 30px rgba(255, 165, 0, 0.3);
          z-index: 30;
        }

        .player-card:hover:not(.disabled) .card-glow {
          opacity: 1;
        }

        .player-card.selected {
          border-color: #3B82F6;
          box-shadow: 
            0 0 0 6px rgba(59, 130, 246, 0.4), 
            0 20px 40px rgba(0, 0, 0, 0.5),
            0 0 40px rgba(59, 130, 246, 0.3);
          animation: selectedPulse 0.2s ease-out;
        }

        .player-card.correct {
          border-color: #10B981;
          box-shadow: 
            0 0 0 6px rgba(16, 185, 129, 0.5), 
            0 20px 40px rgba(0, 0, 0, 0.5),
            0 0 50px rgba(16, 185, 129, 0.4);
          animation: correctCelebration 0.6s ease-out;
        }

        .player-card.incorrect {
          border-color: #EF4444;
          box-shadow: 
            0 0 0 6px rgba(239, 68, 68, 0.5), 
            0 20px 40px rgba(0, 0, 0, 0.5),
            0 0 40px rgba(239, 68, 68, 0.4);
          animation: incorrectShake 0.8s ease-out;
        }

        @keyframes selectedPulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1.02); }
        }

        @keyframes correctCelebration {
          0% { transform: scale(0.9); opacity: 0.8; }
          30% { transform: scale(1.15); opacity: 1; }
          60% { transform: scale(0.95); }
          100% { transform: scale(1); }
        }

        @keyframes incorrectShake {
          10%, 90% { transform: translate3d(-2px, 0, 0) scale(0.98); }
          20%, 80% { transform: translate3d(4px, 0, 0) scale(0.98); }
          30%, 50%, 70% { transform: translate3d(-6px, 0, 0) scale(0.98); }
          40%, 60% { transform: translate3d(6px, 0, 0) scale(0.98); }
        }

        /* Enhanced Player Card Content */
        .player-image {
          width: 11rem;
          height: 13rem;
          border-radius: 50%;
          object-fit: cover;
          margin-bottom: 1rem;
          border: 6px solid rgba(255, 255, 255, 0.3);
          transition: all 0.4s ease;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
        }

        .player-card:hover .player-image {
          transform: scale(1.08);
          border-color: rgba(255, 165, 0, 0.4);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.4);
        }

        .player-info {
          text-align: center;
          width: 100%;
        }

        .player-name {
          font-family: 'DM Sans', sans-serif;
          font-size: 2rem;
          font-weight: 900;
          text-align: center;
          margin-bottom: 0.5rem;
          text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.5);
          letter-spacing: 0.5px;
          line-height: 1.1;
        }

        .player-team {
          font-family: 'DM Sans', sans-serif;
          font-size: 1.3rem;
          text-align: center;
          font-weight: 600;
          margin: 0.5rem 0;
          opacity: 0.95;
        }

        .player-stats {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-top: 0.5rem;
          align-items: center;
        }

        .position-badge {
          background: rgba(255, 165, 0, 0.2);
          color: #FFD700;
          padding: 0.3rem 0.8rem;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 700;
          border: 2px solid rgba(255, 215, 0, 0.3);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .height-stat {
          background: rgba(59, 130, 246, 0.2);
          color: #60A5FA;
          padding: 0.3rem 0.8rem;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 700;
          border: 2px solid rgba(96, 165, 250, 0.3);
        }

        /* Enhanced Reveal Section */
        .reveal-section.enhanced {
          background: linear-gradient(135deg, rgba(0, 0, 0, 0.95), rgba(20, 20, 20, 0.9));
          color: #ffffff;
          padding: 1.5rem 2rem;
          border-radius: 1rem;
          box-shadow: 
            0 12px 24px rgba(0, 0, 0, 0.5),
            0 0 30px rgba(255, 140, 0, 0.2);
          text-align: center;
          animation: revealSlideUp 0.6s ease-out;
          min-width: 280px;
          z-index: 25;
          border: 2px solid rgba(255, 140, 0, 0.3);
        }

        .pick-info {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .pick-number {
          font-size: 2.2rem;
          font-weight: 900;
          color: #FBBF24;
          margin: 0;
          text-shadow: 0 0 20px rgba(251, 191, 36, 0.6);
        }

        .draft-details {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .nba-team {
          font-size: 1.3rem;
          font-weight: 700;
          margin: 0;
          color: #60A5FA;
        }

        .summer-league {
          font-size: 1rem;
          opacity: 0.8;
          margin: 0;
          color: #FBD38D;
          font-style: italic;
        }

        @keyframes revealSlideUp {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        /* Enhanced VS Text */
        .vs-text {
          font-size: 6rem;
          font-weight: 900;
          background: linear-gradient(45deg, #FFD700 0%, #FF8C00 25%, #FF4500 50%, #FF6B35 75%, #FFD700 100%);
          background-size: 300% 300%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: drop-shadow(0 0 15px rgba(255, 165, 0, 1)) drop-shadow(0 0 30px rgba(255, 69, 0, 0.8));
          animation: vsGlow 2s ease-in-out infinite alternate, titleShine 3s ease-in-out infinite;
          z-index: 15;
          margin: 0 3rem;
          text-shadow: 0 0 40px rgba(255, 140, 0, 0.9);
        }

        @keyframes vsGlow {
          from { 
            filter: drop-shadow(0 0 15px rgba(255, 165, 0, 1)) drop-shadow(0 0 30px rgba(255, 69, 0, 0.8));
          }
          to { 
            filter: drop-shadow(0 0 25px rgba(255, 165, 0, 1)) drop-shadow(0 0 50px rgba(255, 69, 0, 1));
          }
        }

        /* Enhanced Feedback Area */
        .feedback-area {
          height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 1.5rem;
          flex-shrink: 0;
        }

        .feedback-message {
          font-size: 1.8rem;
          font-weight: 700;
          text-align: center;
          padding: 1rem 2rem;
          border-radius: 1rem;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
          animation: feedbackBounce 0.6s ease-out;
          max-width: 400px;
          z-index: 10;
          margin: 0;
          border: 3px solid transparent;
        }

        .feedback-message.correct {
          background: linear-gradient(135deg, #10B981, #047857);
          color: white;
          border-color: #34D399;
          box-shadow: 0 8px 20px rgba(16, 185, 129, 0.4);
        }

        .feedback-message.incorrect {
          background: linear-gradient(135deg, #EF4444, #DC2626);
          color: white;
          border-color: #F87171;
          box-shadow: 0 8px 20px rgba(239, 68, 68, 0.4);
        }

        .feedback-message.timeout {
          background: linear-gradient(135deg, #3B82F6, #1D4ED8);
          color: white;
          border-color: #60A5FA;
          box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
        }

        @keyframes feedbackBounce {
          0% { 
            opacity: 0;
            transform: translateY(20px) scale(0.8);
          }
          60% { 
            opacity: 1;
            transform: translateY(-5px) scale(1.05);
          }
          100% { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        /* Enhanced Action Buttons */
        .action-buttons {
          display: flex;
          gap: 1.5rem;
          justify-content: center;
          flex-wrap: wrap;
          margin-top: 2.5rem;
          z-index: 10;
        }

        .action-button {
          width: 200px !important;
          height: 60px !important;
          min-width: 200px !important;
          max-width: 200px !important;
          min-height: 60px !important;
          max-height: 60px !important;
          padding: 0 !important;
          margin: 0;
          border: none;
          border-radius: 30px;
          font-size: 1.1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          box-sizing: border-box;
          position: relative;
          overflow: hidden;
        }

        .action-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s;
        }

        .action-button:hover::before {
          left: 100%;
        }

        .action-button:hover {
          transform: translateY(-4px) scale(1.05);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
        }

        .action-button:active {
          transform: translateY(-2px) scale(1.02);
        }

        .continue-button {
          background: linear-gradient(135deg, #3B82F6 0%, #1E40AF 50%, #1D4ED8 100%);
          color: white;
          box-shadow: 0 8px 15px rgba(59, 130, 246, 0.3);
        }

        .continue-button:hover {
          box-shadow: 0 15px 35px rgba(59, 130, 246, 0.4);
        }

        .play-again-button {
          background: linear-gradient(135deg, #10B981 0%, #047857 50%, #059669 100%);
          color: white;
          box-shadow: 0 8px 15px rgba(16, 185, 129, 0.3);
        }

        .play-again-button:hover {
          box-shadow: 0 15px 35px rgba(16, 185, 129, 0.4);
        }

        .share-button {
          background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 50%, #6D28D9 100%);
          color: white;
          box-shadow: 0 8px 15px rgba(139, 92, 246, 0.3);
        }

        .share-button:hover {
          box-shadow: 0 15px 35px rgba(139, 92, 246, 0.4);
        }

        /* Achievement Popup */
        .achievement-popup {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: linear-gradient(135deg, #FFD700, #FFA500);
          color: #000;
          padding: 2rem 3rem;
          border-radius: 1.5rem;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
          z-index: 10000;
          animation: achievementSlideIn 0.8s ease-out;
          border: 4px solid #FF8C00;
          max-width: 90vw;
        }

        .achievement-content {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          text-align: left;
        }

        .achievement-icon {
          font-size: 3rem;
          animation: achievementBounce 1s ease-in-out infinite;
        }

        .achievement-text h3 {
          font-size: 1.8rem;
          font-weight: 900;
          margin: 0 0 0.5rem 0;
          color: #000;
        }

        .achievement-text p {
          font-size: 1.2rem;
          margin: 0;
          color: #333;
          font-weight: 600;
        }

        @keyframes achievementSlideIn {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.5) rotate(-10deg);
          }
          70% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.1) rotate(5deg);
          }
          100% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1) rotate(0deg);
          }
        }

        @keyframes achievementBounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }

        /* Enhanced Share Modal */
        .share-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.85);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          padding: 1rem;
          animation: modalFadeIn 0.4s ease-out;
          backdrop-filter: blur(10px);
        }

        .share-modal {
          background: ${isDarkMode ? 'linear-gradient(135deg, #2D3748, #1A202C)' : 'linear-gradient(135deg, #FFFFFF, #F7FAFC)'};
          color: ${isDarkMode ? '#FFFFFF' : '#2D3748'};
          padding: 3rem;
          border-radius: 2rem;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4);
          max-width: 32rem;
          width: 100%;
          text-align: center;
          border: 2px solid ${isDarkMode ? '#4A5568' : '#E2E8F0'};
          animation: modalSlideUp 0.4s ease-out;
        }

        .share-modal h2 {
          font-size: 2.5rem;
          font-weight: 900;
          margin-bottom: 1rem;
          color: ${isDarkMode ? '#FFD700' : '#FF6B35'};
          text-shadow: 0 0 20px rgba(255, 165, 0, 0.3);
        }

        .share-modal p {
          font-size: 1.2rem;
          margin-bottom: 1.5rem;
          color: ${isDarkMode ? '#A0AEC0' : '#4A5568'};
          font-weight: 500;
        }

        .share-textarea {
          width: 100%;
          padding: 1.5rem;
          border: 3px solid ${isDarkMode ? '#4A5568' : '#E2E8F0'};
          border-radius: 1rem;
          font-family: 'DM Sans', sans-serif;
          font-size: 1rem;
          resize: none;
          height: 8rem;
          margin-bottom: 2rem;
          background: ${isDarkMode ? '#1A202C' : '#F7FAFC'};
          color: ${isDarkMode ? '#FFFFFF' : '#2D3748'};
          transition: all 0.3s ease;
        }

        .share-textarea:focus {
          outline: none;
          border-color: #3B82F6;
          box-shadow: 0 0 0 6px rgba(59, 130, 246, 0.1);
          transform: scale(1.02);
        }

        .share-buttons {
          display: flex;
          gap: 1.5rem;
          justify-content: center;
        }

        .copy-button {
          background: linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%);
          color: white;
        }

        .back-button {
          background: ${isDarkMode ? 'linear-gradient(135deg, #4A5568, #2D3748)' : 'linear-gradient(135deg, #E2E8F0, #CBD5E0)'};
          color: ${isDarkMode ? '#FFFFFF' : '#2D3748'};
        }

        .back-button:hover {
          background: ${isDarkMode ? 'linear-gradient(135deg, #2D3748, #1A202C)' : 'linear-gradient(135deg, #CBD5E0, #A0AEC0)'};
        }

        @keyframes modalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes modalSlideUp {
          from {
            opacity: 0;
            transform: translateY(50px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        /* Mobile Responsive Enhancements */
        @media (max-width: 768px) {
          .game-title {
            font-size: 3.5rem;
            margin: 0.5rem 0;
          }
          
          .theme-toggle {
            top: 1rem;
            right: 1rem;
            width: 3rem;
            height: 3rem;
          }
          
          .scoreboard {
            width: 98%;
            margin: 0 auto 1rem;
            padding: 8px;
            height: 120px;
            min-height: 120px;
            max-height: 120px;
          }
          
          .scoreboard-box {
            padding: 8px;
            margin: 0 4px;
            height: calc(100% - 16px);
            min-height: 88px;
            max-height: 88px;
          }
          
          .scoreboard-value, .scoreboard-timer {
            font-size: 3rem;
            height: 50px;
          }
          
          .question-section {
            width: 98%;
            margin: 0 auto 1.5rem;
            padding: 1.5rem;
          }
          
          .question-text {
            font-size: 1.6rem;
            letter-spacing: 1px;
          }
          
          .players-comparison {
            gap: 2rem;
            margin: 1.5rem 0;
          }
          
          .player-card {
            width: 16rem;
            height: 22rem;
            padding: 1.5rem;
          }
          
          .player-image {
            width: 9rem;
            height: 11rem;
          }
          
          .player-name {
            font-size: 1.6rem;
          }
          
          .player-team {
            font-size: 1.1rem;
          }
          
          .vs-text {
            font-size: 4rem;
            margin: 0 1.5rem;
          }
          
          .feedback-message {
            font-size: 1.4rem;
            padding: 0.8rem 1.5rem;
          }
          
          .action-buttons {
            flex-direction: column;
            align-items: center;
            gap: 1rem;
          }
          
          .action-button {
            width: 220px !important;
            min-width: 220px !important;
            max-width: 220px !important;
            height: 55px !important;
            min-height: 55px !important;
            max-height: 55px !important;
          }
          
          .share-modal {
            margin: 1rem;
            padding: 2rem;
          }
          
          .share-modal h2 {
            font-size: 2rem;
          }
          
          .achievement-popup {
            margin: 1rem;
            padding: 1.5rem 2rem;
          }
          
          .achievement-content {
            flex-direction: column;
            text-align: center;
            gap: 1rem;
          }
        }

        @media (max-width: 480px) {
          .game-title {
            font-size: 2.8rem;
          }
          
          .question-text {
            font-size: 1.3rem;
          }
          
          .players-comparison {
            gap: 1.5rem;
            flex-direction: column;
            align-items: center;
          }
          
          .vs-text {
            font-size: 3rem;
            margin: 1rem 0;
            order: 1;
          }
          
          .player-card {
            width: 14rem;
            height: 20rem;
          }
          
          .player-image {
            width: 8rem;
            height: 9.5rem;
          }
          
          .player-name {
            font-size: 1.4rem;
          }
          
          .scoreboard-value, .scoreboard-timer {
            font-size: 2.5rem;
            height: 45px;
          }
          
          .scoreboard-label {
            font-size: 0.9rem;
          }
        }

        /* Reduced motion for accessibility */
        @media (prefers-reduced-motion: reduce) {
          .game-title,
          .scoreboard::before,
          .vs-text,
          .question-section::before,
          .achievement-icon {
            animation: none;
          }
          
          .player-card,
          .action-button {
            transition: none;
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

      {/* Enhanced Game Title */}
      <div className="game-title">DRAFT DUEL</div>

      {/* Enhanced Scoreboard */}
      <div className="scoreboard">
        <div className="scoreboard-box">
          <div className="scoreboard-label">Streak</div>
          <div className="scoreboard-value">{currentStreak}</div>
        </div>

        <div className="scoreboard-box">
          <div className="scoreboard-label">Shot Clock</div>
          <div className={`scoreboard-timer ${shotClockTime <= 5 ? 'warning' : ''}`}>
            {shotClockTime}
          </div>
        </div>

        <div className="scoreboard-box">
          <div className="scoreboard-label">High Score</div>
          <div className="scoreboard-value">{highScore}</div>
        </div>
      </div>

      {/* Enhanced Question Section */}
      <div className="question-section">
        <div className="question-text">
          {currentQuestion ? currentQuestion.text : "Loading question..."}
        </div>
      </div>

      {/* Game Area */}
      <div className="game-area">
        {/* Enhanced Basketball Court Background */}
        <div className="court-background" dangerouslySetInnerHTML={{ __html: basketballCourtSVG }} />

        {/* Enhanced Player Comparison */}
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
          
          {/* Enhanced VS Text */}
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

        {/* Enhanced Feedback Area */}
        <div className="feedback-area">
          {feedbackMessage && (
            <div className={`feedback-message ${
              isCorrectGuess === true ? 'correct' : 
              isCorrectGuess === false ? 'incorrect' : 'timeout'
            }`}>
              {feedbackMessage}
              {isNewHighScore && <span> 🎉 NEW HIGH SCORE!</span>}
            </div>
          )}
        </div>

        {/* Enhanced Action Buttons */}
        {selectedPlayerId !== null && (
          <div className="action-buttons">
            {!gameOver ? (
              <button onClick={handleContinue} className="action-button continue-button">
                Continue Streak
              </button>
            ) : (
              <>
                <button onClick={handleContinue} className="action-button play-again-button">
                  Play Again
                </button>
                <button onClick={shareStreak} className="action-button share-button">
                  Share Score
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Achievement Popup */}
      {showAchievement && (
        <AchievementPopup 
          achievement={showAchievement} 
          onClose={() => setShowAchievement(null)} 
        />
      )}

      {/* Enhanced Share Modal */}
      {showShareModal && (
        <div className="share-modal-overlay">
          <div className="share-modal">
            <h2>🏀 Share Your Score!</h2>
            <p>Show everyone your Draft Duel skills at Summer League!</p>
            <textarea
              ref={shareTextRef}
              className="share-textarea"
              readOnly
              value={getShareText()}
            />
            <div className="share-buttons">
              <button onClick={handleCopyShareText} className="action-button copy-button">
                Copy Text
              </button>
              <button onClick={handleCloseShareModal} className="action-button back-button">
                Back to Game
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DraftDuelMain;import React, { useState, useEffect, useCallback, useRef } from 'react';

// Enhanced Team colors with more college teams and international
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

// NBA Rookies data with Summer League team assignments
const ROOKIES_2025_NBA = [
  { id: 1, name: "Cooper Flagg", draftPick: 1, team: "Dallas Mavericks", preDraftTeam: "Duke", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/5041939.png&w=350&h=254", height: 81, age: 18, position: "Forward", conference: "ACC", summerLeague: "Utah Jazz Summer League" },
  { id: 2, name: "Dylan Harper", draftPick: 2, team: "San Antonio Spurs", preDraftTeam: "Rutgers", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/5037871.png&w=350&h=254", height: 76, age: 18, position: "Guard", conference: "Big Ten", summerLeague: "Utah Jazz Summer League" },
  { id: 3, name: "VJ Edgecombe", draftPick: 3, team: "Philadelphia 76ers", preDraftTeam: "Baylor", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/5124612.png&w=350&h=254", height: 77, age: 19, position: "Guard", conference: "Big 12", summerLeague: "California Classic" },
  { id: 4, name: "Kon Knueppel", draftPick: 4, team: "Charlotte Hornets", preDraftTeam: "Duke", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/5061575.png&w=350&h=254", height: 79, age: 19, position: "Forward", conference: "ACC", summerLeague: "Utah Jazz Summer League" },
  { id: 5, name: "Ace Bailey", draftPick: 5, team: "Utah Jazz", preDraftTeam: "Rutgers", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/4873138.png&w=350&h=254", height: 81, age: 19, position: "Forward", conference: "Big Ten", summerLeague: "Utah Jazz Summer League" },
  { id: 6, name: "Tre Johnson", draftPick: 6, team: "Washington Wizards", preDraftTeam: "Texas", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/5238230.png&w=350&h=254", height: 76, age: 19, position: "Guard", conference: "Big 12", summerLeague: "2K25 Summer League" },
  { id: 7, name: "Jeremiah Fears", draftPick: 7, team: "New Orleans Pelicans", preDraftTeam: "Oklahoma", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/5144091.png&w=350&h=254", height: 74, age: 18, position: "Guard", conference: "Big 12", summerLeague: "2K25 Summer League" },
  { id: 8, name: "Egor Demin", draftPick: 8, team: "Brooklyn Nets", preDraftTeam: "BYU", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/mens-college-basketball/players/full/5243213.png", height: 79, age: 19, position: "Guard", conference: "Big 12", summerLeague: "2K25 Summer League" },
  { id: 9, name: "Collin Murray-Boyles", draftPick: 9, team: "Toronto Raptors", preDraftTeam: "South Carolina", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/5093267.png&w=350&h=254", height: 80, age: 20, position: "Forward", conference: "SEC", summerLeague: "California Classic" },
  { id: 10, name: "Khaman Maluach", draftPick: 10, team: "Phoenix Suns", preDraftTeam: "Duke", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/5203685.png&w=350&h=254", height: 85, age: 18, position: "Center", conference: "ACC", summerLeague: "California Classic" },
];

// Enhanced PlayerCard with better visuals and animations
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
        style={{ 
          backgroundColor: cardBackgroundColor, 
          color: cardTextColor,
          backgroundImage: `linear-gradient(135deg, ${cardBackgroundColor}dd, ${cardBackgroundColor})`
        }}
      >
        {/* Enhanced card with better gradient overlay */}
        <div className="card-glow"></div>
        <img
          src={player.imageUrl}
          alt={player.name}
          className="player-image"
          onError={(e) => { 
            e.target.onerror = null; 
            e.target.src = `https://placehold.co/200x200/666666/FFFFFF?text=${player.name.split(' ').map(n => n[0]).join('')}`; 
          }}
        />
        <div className="player-info">
          <h3 className="player-name">{player.name}</h3>
          <p className="player-team">{player.preDraftTeam}</p>
          <div className="player-stats">
            <span className="position-badge">{player.position}</span>
            <span className="height-stat">{Math.floor(player.height/12)}'{player.height%12}"</span>
          </div>
        </div>
      </button>

      {showPick && (
        <div className="reveal-section enhanced">
          <div className="pick-info">
            <div className="pick-number">#{player.draftPick}</div>
            <div className="draft-details">
              <p className="nba-team">{player.team}</p>
              <p className="summer-league">{player.summerLeague}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// New Achievement System
const AchievementPopup = ({ achievement, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="achievement-popup">
      <div className="achievement-content">
        <div className="achievement-icon">🏆</div>
        <div className="achievement-text">
          <h3>{achievement.title}</h3>
          <p>{achievement.description}</p>
        </div>
      </div>
    </div>
  );
};

const DraftDuelMain = () => {
  const [player1, setPlayer1] = useState(null);
  const [player2, setPlayer2] = useState(null);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [totalGamesPlayed, setTotalGamesPlayed] = useState(() => {
    const saved = localStorage.getItem('draftDuelTotalGames');
    return saved ? parseInt(saved) : 0;
  });
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('draftDuelHighScore');
    return saved ? parseInt(saved) : 0;
  });
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [selectedPlayerId, setSelectedPlayerId] = useState(null);
  const [isCorrectGuess, setIsCorrectGuess] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [shotClockTime, setShotClockTime] = useState(15); // Increased to 15 seconds
  const shotClockIntervalRef = useRef(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const shareTextRef = useRef(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [achievements, setAchievements] = useState([]);
  const [showAchievement, setShowAchievement] = useState(null);
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  // Enhanced questions with more variety
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
      filter: (p1, p2) => (p1.position === "Forward" && p2.position !== "Forward") || (p2.position === "Forward" && p1.position !== "Forward"),
    },
    {
      text: "Which player is in the UTAH JAZZ SUMMER LEAGUE?",
      getCorrectPlayerId: (p1, p2) => (p1.summerLeague === "Utah Jazz Summer League" ? p1.id : p2.id),
      filter: (p1, p2) => (p1.summerLeague === "Utah Jazz Summer League") !== (p2.summerLeague === "Utah Jazz Summer League"),
    },
  ];

  // Achievement definitions
  const ACHIEVEMENT_DEFINITIONS = [
    { id: 'first_correct', title: 'First Blood!', description: 'Got your first answer correct!', threshold: 1 },
    { id: 'streak_5', title: 'On Fire!', description: 'Reached a 5-game streak!', threshold: 5 },
    { id: 'streak_10', title: 'Unstoppable!', description: 'Reached a 10-game streak!', threshold: 10 },
    { id: 'streak_15', title: 'Summer League MVP!', description: 'Reached a 15-game streak!', threshold: 15 },
    { id: 'games_10', title: 'Rookie Scout', description: 'Played 10 games total!', threshold: 10 },
    { id: 'games_25', title: 'Draft Expert', description: 'Played 25 games total!', threshold: 25 },
    { id: 'games_50', title: 'NBA Insider', description: 'Played 50 games total!', threshold: 50 },
  ];

  // Check for achievements
  const checkAchievements = useCallback((streak, totalGames) => {
    const newAchievements = [];
    
    // Streak-based achievements
    if (streak === 1 && !achievements.includes('first_correct')) {
      newAchievements.push({ id: 'first_correct', title: 'First Blood!', description: 'Got your first answer correct!' });
    }
    if (streak === 5 && !achievements.includes('streak_5')) {
      newAchievements.push({ id: 'streak_5', title: 'On Fire!', description: 'Reached a 5-game streak!' });
    }
    if (streak === 10 && !achievements.includes('streak_10')) {
      newAchievements.push({ id: 'streak_10', title: 'Unstoppable!', description: 'Reached a 10-game streak!' });
    }
    if (streak === 15 && !achievements.includes('streak_15')) {
      newAchievements.push({ id: 'streak_15', title: 'Summer League MVP!', description: 'Reached a 15-game streak!' });
    }
    
    // Total games achievements
    if (totalGames === 10 && !achievements.includes('games_10')) {
      newAchievements.push({ id: 'games_10', title: 'Rookie Scout', description: 'Played 10 games total!' });
    }
    if (totalGames === 25 && !achievements.includes('games_25')) {
      newAchievements.push({ id: 'games_25', title: 'Draft Expert', description: 'Played 25 games total!' });
    }
    if (totalGames === 50 && !achievements.includes('games_50')) {
      newAchievements.push({ id: 'games_50', title: 'NBA Insider', description: 'Played 50 games total!' });
    }

    if (newAchievements.length > 0) {
      const updatedAchievements = [...achievements, ...newAchievements.map(a => a.id)];
      setAchievements(updatedAchievements);
      localStorage.setItem('draftDuelAchievements', JSON.stringify(updatedAchievements));
      setShowAchievement(newAchievements[0]); // Show first new achievement
    }
  }, [achievements]);

  // Load achievements on startup
  useEffect(() => {
    const savedAchievements = localStorage.getItem('draftDuelAchievements');
    if (savedAchievements) {
      setAchievements(JSON.parse(savedAchievements));
    }
  }, []);

  // Enhanced background animations
  const basketballCourtSVG = `
    <svg width="100%" height="100%" viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="courtGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${isDarkMode ? '#2D1810' : '#F5E6D3'};stop-opacity:0.3" />
          <stop offset="50%" style="stop-color:${isDarkMode ? '#3D2820' : '#E8D5C2'};stop-opacity:0.2" />
          <stop offset="100%" style="stop-color:${isDarkMode ? '#2D1810' : '#F5E6D3'};stop-opacity:0.3" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <rect x="0" y="0" width="1000" height="500" fill="url(#courtGradient)" rx="15" ry="15"/>
      <rect x="0" y="0" width="1000" height="500" fill="none" stroke="${isDarkMode ? '#D4AF37' : '#8B4513'}" stroke-width="8" stroke-opacity="0.5" rx="15" ry="15" filter="url(#glow)"/>
      <line x1="500" y1="0" x2="500" y2="500" stroke="${isDarkMode ? '#D4AF37' : '#8B4513'}" stroke-width="6" stroke-opacity="0.4"/>
      <circle cx="500" cy="250" r="70" fill="none" stroke="${isDarkMode ? '#D4AF37' : '#8B4513'}" stroke-width="6" stroke-opacity="0.4" filter="url(#glow)"/>
      <circle cx="500" cy="250" r="12" fill="${isDarkMode ? '#D4AF37' : '#8B4513'}" fill-opacity="0.5"/>
      
      <!-- Enhanced 3-point lines and key areas -->
      <path d="M 120 60 L 120 440 L 380 440 L 380 60 Z" fill="none" stroke="${isDarkMode ? '#D4AF37' : '#8B4513'}" stroke-width="6" stroke-opacity="0.4"/>
      <path d="M 120 60 A 240 240 0 0 1 120 440" fill="none" stroke="${isDarkMode ? '#D4AF37' : '#8B4513'}" stroke-width="6" stroke-opacity="0.4"/>
      <rect x="0" y="160" width="190" height="180" fill="none" stroke="${isDarkMode ? '#D4AF37' : '#8B4513'}" stroke-width="6" stroke-opacity="0.4"/>
      <circle cx="190" cy="250" r="60" fill="none" stroke="${isDarkMode ? '#D4AF37' : '#8B4513'}" stroke-width="6" stroke-opacity="0.4"/>
      
      <!-- Hoops with enhanced design -->
      <ellipse cx="15" cy="250" rx="20" ry="8" fill="none" stroke="${isDarkMode ? '#FF6B35' : '#FF4500'}" stroke-width="4" stroke-opacity="0.6"/>
      <line x1="15" y1="242" x2="15" y2="258" stroke="${isDarkMode ? '#FF6B35' : '#FF4500'}" stroke-width="2" stroke-opacity="0.6"/>
      
      <!-- Right side mirror -->
      <path d="M 880 60 L 880 440 L 620 440 L 620 60 Z" fill="none" stroke="${isDarkMode ? '#D4AF37' : '#8B4513'}" stroke-width="6" stroke-opacity="0.4"/>
      <path d="M 880 60 A 240 240 0 0 0 880 440" fill="none" stroke="${isDarkMode ? '#D4AF37' : '#8B4513'}" stroke-width="6" stroke-opacity="0.4"/>
      <rect x="810" y="160" width="190" height="180" fill="none" stroke="${isDarkMode ? '#D4AF37' : '#8B4513'}" stroke-width="6" stroke-opacity="0.4"/>
      <circle cx="810" cy="250" r="60" fill="none" stroke="${isDarkMode ? '#D4AF37' : '#8B4513'}" stroke-width="6" stroke-opacity="0.4"/>
      <ellipse cx="985" cy="250" rx="20" ry="8" fill="none" stroke="${isDarkMode ? '#FF6B35' : '#FF4500'}" stroke-width="4" stroke-opacity="0.6"/>
      <line x1="985" y1="242" x2="985" y2="258" stroke="${isDarkMode ? '#FF6B35' : '#FF4500'}" stroke-width="2" stroke-opacity="0.6"/>
    </svg>
  `;

  const handleTimeOut = useCallback(() => {
    setIsCorrectGuess(false);
    setFeedbackMessage('Time ran out! ⏰');
    setGameOver(true);
    if (currentStreak > highScore) {
      setHighScore(currentStreak);
      setIsNewHighScore(true);
      localStorage.setItem('draftDuelHighScore', currentStreak.toString());
    }
    if (player1) {
      setSelectedPlayerId(player1.id);
    }
    setTotalGamesPlayed(prev => {
      const newTotal = prev + 1;
      localStorage.setItem('draftDuelTotalGames', newTotal.toString());
      checkAchievements(currentStreak, newTotal);
      return newTotal;
    });
  }, [currentStreak, highScore, player1, checkAchievements]);

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
    setIsNewHighScore(false);
    setShotClockTime(15);
    setGameStarted(true);
  }, []);

  // Initialize game
  useEffect(() => {
    selectRandomRookiesAndQuestion();
  }, [selectRandomRookiesAndQuestion]);

  // Enhanced shot clock with sound effect simulation
  useEffect(() => {
    if (player1 && player2 && selectedPlayerId === null && !gameOver && gameStarted) {
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
  }, [player1, player2, selectedPlayerId, gameOver, handleTimeOut, gameStarted]);

  // Enhanced guess handling with achievements
  const handleGuess = (id) => {
    if (selectedPlayerId !== null || !currentQuestion || gameOver) return;

    clearInterval(shotClockIntervalRef.current);
    setSelectedPlayerId(id);

    const correctPlayerId = currentQuestion.getCorrectPlayerId(player1, player2);
    const isGuessCorrect = id === correctPlayerId;

    if (isGuessCorrect) {
      setIsCorrectGuess(true);
      const newStreak = currentStreak + 1;
      setCurrentStreak(newStreak);
      setFeedbackMessage('Correct! 🔥');
      
      // Check for new high score
      if (newStreak > highScore) {
        setHighScore(newStreak);
        setIsNewHighScore(true);
        localStorage.setItem('draftDuelHighScore', newStreak.toString());
      }
      
      checkAchievements(newStreak, totalGamesPlayed);
    } else {
      setIsCorrectGuess(false);
      setFeedbackMessage('Incorrect! 😤');
      setGameOver(true);
      if (currentStreak > highScore) {
        setHighScore(currentStreak);
        setIsNewHighScore(true);
        localStorage.setItem('draftDuelHighScore', currentStreak.toString());
      }
      setTotalGamesPlayed(prev => {
        const newTotal = prev + 1;
        localStorage.setItem('draftDuelTotalGames', newTotal.toString());
        checkAchievements(currentStreak, newTotal);
        return newTotal;
      });
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

  // Enhanced share functionality with achievements
  const shareStreak = () => {
    setShowShareModal(true);
  };

  const getShareText = () => {
    const baseText = `🏀 Just scored ${currentStreak} in a row on Draft Duel!`;
    const highScoreText = isNewHighScore ? ` 🔥 NEW HIGH SCORE! 🔥` : '';
    const achievementText = achievements.length > 0 ? ` Earned ${achievements.length} achievements! 🏆` : '';
    const callToAction = ` Think you know the 2025 NBA Draft better? Play at hooprapp.com! #DraftDuel #NBADraft2025 #SummerLeague`;
    
    return baseText + highScoreText + achievementText + callToAction;
  };

  const handleCopyShareText = () => {
    if (shareTextRef.current) {
      shareTextRef.current.select();
      document.execCommand('copy');
      setFeedbackMessage('Copied to clipboard! 📋');
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
        backgroundColor: isDarkMode ? '#0F0F23' : '#F8F9FA',
        backgroundImage: `radial-gradient(circle at 25% 25%, ${isDarkMode ? '#1a1a2e' : '#e3f2fd'} 0%, transparent 50%), radial-gradient(circle at 75% 75%, ${isDarkMode ? '#16213e' : '#fff3e0'} 0%, transparent 50%)`,
        backgroundAttachment: 'fixed',
