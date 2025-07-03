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
          {/* Basketball gradient - more realistic orange */}
          <radialGradient id="basketballGradient" cx="0.35" cy="0.35" r="0.8">
            <stop offset="0%" stopColor="#ff9500" />
            <stop offset="20%" stopColor="#ff7800" />
            <stop offset="60%" stopColor="#e55100" />
            <stop offset="100%" stopColor="#cc4400" />
          </radialGradient>
          
          {/* Inner shadow */}
          <radialGradient id="innerShadow" cx="0.6" cy="0.6" r="0.5">
            <stop offset="0%" stopColor="rgba(0,0,0,0)" />
            <stop offset="80%" stopColor="rgba(0,0,0,0.1)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.3)" />
          </radialGradient>
          
          {/* Highlight */}
          <radialGradient id="highlight" cx="0.3" cy="0.3" r="0.4">
            <stop offset="0%" stopColor="rgba(255,255,255,0.6)" />
            <stop offset="40%" stopColor="rgba(255,255,255,0.3)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
        </defs>
        
        {/* Main basketball circle */}
        <circle 
          cx="50" 
          cy="50" 
          r="45" 
          fill="url(#basketballGradient)"
          stroke="#cc4400"
          strokeWidth="1"
        />
        
        {/* Basketball seam lines - the classic curved lines */}
        <g stroke="#aa3300" strokeWidth="2.5" fill="none" strokeLinecap="round">
          {/* Left curved seam */}
          <path d="M 15 50 Q 35 20, 50 50 Q 35 80, 15 50" />
          
          {/* Right curved seam */}
          <path d="M 85 50 Q 65 20, 50 50 Q 65 80, 85 50" />
          
          {/* Top curved seam */}
          <path d="M 50 15 Q 20 35, 50 50 Q 80 35, 50 15" />
          
          {/* Bottom curved seam */}
          <path d="M 50 85 Q 20 65, 50 50 Q 80 65, 50 85" />
        </g>
        
        {/* Inner shadow overlay */}
        <circle 
          cx="50" 
          cy="50" 
          r="45" 
          fill="url(#innerShadow)"
        />
        
        {/* Highlight overlay */}
        <circle 
          cx="50" 
          cy="50" 
          r="45" 
          fill="url(#highlight)"
        />
        
        {/* Basketball texture - subtle pebbled surface */}
        <g fill="rgba(170, 51, 0, 0.15)">
          <circle cx="30" cy="30" r="1" />
          <circle cx="70" cy="30" r="1" />
          <circle cx="30" cy="70" r="1" />
          <circle cx="70" cy="70" r="1" />
          <circle cx="40" cy="25" r="0.8" />
          <circle cx="60" cy="25" r="0.8" />
          <circle cx="40" cy="75" r="0.8" />
          <circle cx="60" cy="75" r="0.8" />
          <circle cx="25" cy="40" r="0.8" />
          <circle cx="75" cy="40" r="0.8" />
          <circle cx="25" cy="60" r="0.8" />
          <circle cx="75" cy="60" r="0.8" />
          <circle cx="50" cy="35" r="0.6" />
          <circle cx="50" cy="65" r="0.6" />
          <circle cx="35" cy="50" r="0.6" />
          <circle cx="65" cy="50" r="0.6" />
        </g>
      </svg>
    </div>
  );
};

export default BasketballLogo;
