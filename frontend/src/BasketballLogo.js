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
        <defs>
          {/* Basketball gradient - from lighter center to darker edges */}
          <radialGradient id="basketballGradient" cx="0.4" cy="0.4" r="0.6">
            <stop offset="0%" stopColor="#FFA751" />
            <stop offset="70%" stopColor="#F27A24" />
            <stop offset="100%" stopColor="#D65A1F" />
          </radialGradient>
          
          {/* Optional white highlight */}
          <radialGradient id="highlight" cx="0.3" cy="0.3" r="0.2">
            <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
            <stop offset="80%" stopColor="rgba(255,255,255,0.1)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
        </defs>
        
        {/* Main basketball circle */}
        <circle 
          cx="50" 
          cy="50" 
          r="47" 
          fill="url(#basketballGradient)"
          stroke="#000000"
          strokeWidth="2"
        />
        
        {/* Basketball seams - 4 primary black seams */}
        <g stroke="#000000" strokeWidth="3" fill="none" strokeLinecap="round">
          {/* Vertical seam - curved to suggest spherical surface */}
          <path d="M 50 8 Q 45 25 50 50 Q 55 75 50 92" />
          
          {/* Horizontal seam - curved */}
          <path d="M 8 50 Q 25 45 50 50 Q 75 55 92 50" />
          
          {/* Diagonal seam 1 - forming part of "X" shape */}
          <path d="M 22 22 Q 35 35 50 50 Q 65 65 78 78" />
          
          {/* Diagonal seam 2 - completing the "X" shape */}
          <path d="M 78 22 Q 65 35 50 50 Q 35 65 22 78" />
        </g>
        
        {/* Optional white highlight */}
        <circle 
          cx="50" 
          cy="50" 
          r="47" 
          fill="url(#highlight)"
        />
      </svg>
    </div>
  );
};

export default BasketballLogo;
