// src/ConfettiAnimation.js - Confetti celebration component
import React, { useEffect, useState } from 'react';

const ConfettiAnimation = ({ 
  isActive = false, 
  duration = 3000,
  intensity = 'normal', // 'light', 'normal', 'intense'
  colors = ['#f97316', '#ea580c', '#dc2626', '#3b82f6', '#10b981', '#8b5cf6', '#f59e0b']
}) => {
  const [confettiPieces, setConfettiPieces] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  // Generate confetti pieces when animation starts
  useEffect(() => {
    if (isActive) {
      setIsVisible(true);
      generateConfetti();
      
      // Hide confetti after duration
      const timeout = setTimeout(() => {
        setIsVisible(false);
        setConfettiPieces([]);
      }, duration);
      
      return () => clearTimeout(timeout);
    }
  }, [isActive, duration]);

  const generateConfetti = () => {
    const pieces = [];
    const pieceCount = intensity === 'light' ? 50 : intensity === 'intense' ? 150 : 100;
    
    for (let i = 0; i < pieceCount; i++) {
      pieces.push({
        id: i,
        color: colors[Math.floor(Math.random() * colors.length)],
        left: Math.random() * 100, // Percentage
        animationDelay: Math.random() * 2, // Seconds
        size: Math.random() * 10 + 5, // 5-15px
        rotation: Math.random() * 360, // Degrees
        shape: Math.random() > 0.5 ? 'square' : 'circle',
        duration: Math.random() * 2 + 2, // 2-4 seconds
      });
    }
    
    setConfettiPieces(pieces);
  };

  if (!isVisible) return null;

  return (
    <div className="confetti-container">
      {confettiPieces.map((piece) => (
        <div
          key={piece.id}
          className={`confetti-piece confetti-${piece.shape}`}
          style={{
            '--confetti-color': piece.color,
            '--confetti-left': `${piece.left}%`,
            '--confetti-delay': `${piece.animationDelay}s`,
            '--confetti-duration': `${piece.duration}s`,
            '--confetti-size': `${piece.size}px`,
            '--confetti-rotation': `${piece.rotation}deg`,
          }}
        />
      ))}
      
      <style jsx>{`
        .confetti-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1000;
          overflow: hidden;
        }

        .confetti-piece {
          position: absolute;
          top: -20px;
          left: var(--confetti-left);
          width: var(--confetti-size);
          height: var(--confetti-size);
          background-color: var(--confetti-color);
          animation: confetti-fall var(--confetti-duration) linear var(--confetti-delay) forwards;
          transform: rotate(var(--confetti-rotation));
        }

        .confetti-square {
          /* Square shape (default) */
        }

        .confetti-circle {
          border-radius: 50%;
        }

        @keyframes confetti-fall {
          0% {
            transform: translateY(-20px) rotate(var(--confetti-rotation)) scale(1);
            opacity: 1;
          }
          10% {
            transform: translateY(0px) rotate(calc(var(--confetti-rotation) + 36deg)) scale(1.1);
            opacity: 1;
          }
          50% {
            transform: translateY(50vh) rotate(calc(var(--confetti-rotation) + 180deg)) scale(0.8);
            opacity: 0.8;
          }
          100% {
            transform: translateY(100vh) rotate(calc(var(--confetti-rotation) + 360deg)) scale(0.5);
            opacity: 0;
          }
        }

        /* Enhanced confetti with physics-like movement */
        @media (min-width: 768px) {
          @keyframes confetti-fall {
            0% {
              transform: translateY(-20px) translateX(0px) rotate(var(--confetti-rotation)) scale(1);
              opacity: 1;
            }
            25% {
              transform: translateY(25vh) translateX(-20px) rotate(calc(var(--confetti-rotation) + 90deg)) scale(1.1);
              opacity: 1;
            }
            50% {
              transform: translateY(50vh) translateX(20px) rotate(calc(var(--confetti-rotation) + 180deg)) scale(0.9);
              opacity: 0.8;
            }
            75% {
              transform: translateY(75vh) translateX(-10px) rotate(calc(var(--confetti-rotation) + 270deg)) scale(0.7);
              opacity: 0.5;
            }
            100% {
              transform: translateY(100vh) translateX(0px) rotate(calc(var(--confetti-rotation) + 360deg)) scale(0.4);
              opacity: 0;
            }
          }
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .confetti-piece {
            animation: confetti-fall-simple var(--confetti-duration) linear var(--confetti-delay) forwards;
          }
          
          @keyframes confetti-fall-simple {
            0% {
              transform: translateY(-20px) scale(1);
              opacity: 1;
            }
            100% {
              transform: translateY(100vh) scale(0.5);
              opacity: 0;
            }
          }
        }
      `}</style>
    </div>
  );
};

export default ConfettiAnimation;
