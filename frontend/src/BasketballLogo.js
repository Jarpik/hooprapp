import React from 'react';
import './BasketballLogo.css';

const BasketballLogo = ({ size = 'medium', className = '' }) => {
  const sizeMap = {
    small: 32,
    medium: 48,
    large: 64,
    xlarge: 80
  };

  const logoSize = sizeMap[size] || sizeMap.medium;

  return (
    <div className={`basketball-logo ${className}`} style={{ width: logoSize, height: logoSize }}>
      <svg 
        width={logoSize} 
        height={logoSize} 
        viewBox="0 0 100 100" 
        className="basketball-svg"
      >
        {/* Basketball base gradient */}
        <defs>
          <radialGradient id="basketballGradient" cx="0.3" cy="0.3" r="0.8">
            <stop offset="0%" stopColor="#ff8c42" />
            <stop offset="30%" stopColor="#ff6b1a" />
            <stop offset="70%" stopColor="#e55100" />
            <stop offset="100%" stopColor="#bf360c" />
          </radialGradient>
          
          {/* Shadow gradient */}
          <radialGradient id="shadowGradient" cx="0.7" cy="0.7" r="0.4">
            <stop offset="0%" stopColor="rgba(0,0,0,0)" />
            <stop offset="70%" stopColor="rgba(0,0,0,0.1)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.3)" />
          </radialGradient>
          
          {/* Highlight gradient */}
          <radialGradient id="highlightGradient" cx="0.2" cy="0.2" r="0.3">
            <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.2)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
        </defs>
        
        {/* Main basketball circle */}
        <circle 
          cx="50" 
          cy="50" 
          r="48" 
          fill="url(#basketballGradient)"
          className="basketball-main"
        />
        
        {/* Basketball seam lines */}
        <g className="basketball-lines">
          {/* Vertical center line */}
          <path 
            d="M 50 2 Q 50 25 50 50 Q 50 75 50 98" 
            stroke="#bf360c" 
            strokeWidth="2" 
            fill="none"
            className="center-line"
          />
          
          {/* Horizontal center line */}
          <path 
            d="M 2 50 Q 25 50 50 50 Q 75 50 98 50" 
            stroke="#bf360c" 
            strokeWidth="2" 
            fill="none"
            className="center-line"
          />
          
          {/* Curved seam lines */}
          <path 
            d="M 20 15 Q 50 35 80 15" 
            stroke="#bf360c" 
            strokeWidth="1.5" 
            fill="none"
            className="seam-line"
          />
          
          <path 
            d="M 20 85 Q 50 65 80 85" 
            stroke="#bf360c" 
            strokeWidth="1.5" 
            fill="none"
            className="seam-line"
          />
          
          <path 
            d="M 15 20 Q 35 50 15 80" 
            stroke="#bf360c" 
            strokeWidth="1.5" 
            fill="none"
            className="seam-line"
          />
          
          <path 
            d="M 85 20 Q 65 50 85 80" 
            stroke="#bf360c" 
            strokeWidth="1.5" 
            fill="none"
            className="seam-line"
          />
        </g>
        
        {/* Shadow overlay */}
        <circle 
          cx="50" 
          cy="50" 
          r="48" 
          fill="url(#shadowGradient)"
          className="basketball-shadow"
        />
        
        {/* Highlight */}
        <circle 
          cx="50" 
          cy="50" 
          r="48" 
          fill="url(#highlightGradient)"
          className="basketball-highlight"
        />
        
        {/* Subtle texture dots */}
        <g className="basketball-texture">
          <circle cx="25" cy="25" r="0.5" fill="rgba(191, 54, 12, 0.3)" />
          <circle cx="75" cy="25" r="0.5" fill="rgba(191, 54, 12, 0.3)" />
          <circle cx="25" cy="75" r="0.5" fill="rgba(191, 54, 12, 0.3)" />
          <circle cx="75" cy="75" r="0.5" fill="rgba(191, 54, 12, 0.3)" />
          <circle cx="35" cy="40" r="0.5" fill="rgba(191, 54, 12, 0.2)" />
          <circle cx="65" cy="40" r="0.5" fill="rgba(191, 54, 12, 0.2)" />
          <circle cx="35" cy="60" r="0.5" fill="rgba(191, 54, 12, 0.2)" />
          <circle cx="65" cy="60" r="0.5" fill="rgba(191, 54, 12, 0.2)" />
        </g>
      </svg>
    </div>
  );
};

export default BasketballLogo;
