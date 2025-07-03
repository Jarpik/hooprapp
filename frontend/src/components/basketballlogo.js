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
          {/* Main basketball gradient - realistic lighting */}
          <radialGradient id="basketballMain" cx="0.3" cy="0.3" r="0.85">
            <stop offset="0%" stopColor="#FF9B47" />
            <stop offset="15%" stopColor="#FF8A33" />
            <stop offset="35%" stopColor="#F27A24" />
            <stop offset="65%" stopColor="#E56A1A" />
            <stop offset="85%" stopColor="#D65A1F" />
            <stop offset="100%" stopColor="#B8471A" />
          </radialGradient>
          
          {/* Highlight gradient */}
          <radialGradient id="basketballHighlight" cx="0.25" cy="0.25" r="0.3">
            <stop offset="0%" stopColor="rgba(255,255,255,0.8)" />
            <stop offset="30%" stopColor="rgba(255,255,255,0.4)" />
            <stop offset="70%" stopColor="rgba(255,255,255,0.1)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
          
          {/* Shadow gradient */}
          <radialGradient id="basketballShadow" cx="0.7" cy="0.7" r="0.4">
            <stop offset="0%" stopColor="rgba(0,0,0,0)" />
            <stop offset="60%" stopColor="rgba(0,0,0,0.1)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.25)" />
          </radialGradient>
          
          {/* Inner glow */}
          <radialGradient id="innerGlow" cx="0.5" cy="0.5" r="0.9">
            <stop offset="0%" stopColor="rgba(255,255,255,0)" />
            <stop offset="70%" stopColor="rgba(255,255,255,0)" />
            <stop offset="90%" stopColor="rgba(255,255,255,0.05)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.15)" />
          </radialGradient>
          
          {/* Filter for realistic depth */}
          <filter id="basketballFilter" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="1"/>
            <feOffset dx="1" dy="1" result="offset"/>
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.3"/>
            </feComponentTransfer>
            <feMerge> 
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/> 
            </feMerge>
          </filter>
        </defs>
        
        {/* Main basketball circle with realistic gradient */}
        <circle 
          cx="50" 
          cy="50" 
          r="46" 
          fill="url(#basketballMain)"
          filter="url(#basketballFilter)"
        />
        
        {/* Basketball seams - refined and realistic */}
        <g stroke="#1A1A1A" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.9">
          {/* Vertical seam */}
          <path d="M 50 6 Q 47 20 48 35 Q 49 50 48 65 Q 47 80 50 94" 
                strokeWidth="2.2" />
          
          {/* Horizontal seam */}
          <path d="M 6 50 Q 20 47 35 48 Q 50 49 65 48 Q 80 47 94 50" 
                strokeWidth="2.2" />
          
          {/* Diagonal seam 1 */}
          <path d="M 20 20 Q 30 30 40 42 Q 50 50 60 58 Q 70 70 80 80" 
                strokeWidth="1.8" />
          
          {/* Diagonal seam 2 */}
          <path d="M 80 20 Q 70 30 60 42 Q 50 50 40 58 Q 30 70 20 80" 
                strokeWidth="1.8" />
        </g>
        
        {/* Secondary seam details for realism */}
        <g stroke="#2A2A2A" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.6">
          {/* Subtle connecting curves */}
          <path d="M 35 15 Q 50 25 65 15" />
          <path d="M 35 85 Q 50 75 65 85" />
          <path d="M 15 35 Q 25 50 15 65" />
          <path d="M 85 35 Q 75 50 85 65" />
        </g>
        
        {/* Shadow overlay */}
        <circle 
          cx="50" 
          cy="50" 
          r="46" 
          fill="url(#basketballShadow)"
        />
        
        {/* Highlight overlay */}
        <circle 
          cx="50" 
          cy="50" 
          r="46" 
          fill="url(#basketballHighlight)"
        />
        
        {/* Inner glow for depth */}
        <circle 
          cx="50" 
          cy="50" 
          r="46" 
          fill="url(#innerGlow)"
        />
        
        {/* Subtle texture dots for realism */}
        <g fill="rgba(0,0,0,0.08)" opacity="0.7">
          <circle cx="32" cy="28" r="0.8" />
          <circle cx="68" cy="28" r="0.8" />
          <circle cx="32" cy="72" r="0.8" />
          <circle cx="68" cy="72" r="0.8" />
          <circle cx="28" cy="45" r="0.6" />
          <circle cx="72" cy="45" r="0.6" />
          <circle cx="45" cy="28" r="0.6" />
          <circle cx="55" cy="72" r="0.6" />
          <circle cx="38" cy="38" r="0.4" />
          <circle cx="62" cy="38" r="0.4" />
          <circle cx="38" cy="62" r="0.4" />
          <circle cx="62" cy="62" r="0.4" />
        </g>
        
        {/* Final rim highlight */}
        <circle 
          cx="50" 
          cy="50" 
          r="46" 
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="0.5"
        />
      </svg>
    </div>
  );
};

export default BasketballLogo;
