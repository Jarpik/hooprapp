// src/PlayerHeadshot.js - Fixed version with proper sizing
import React, { useState, useEffect } from 'react';

// Manual mapping of player photos - you can expand this list
const PLAYER_PHOTOS = {
  "LeBron James": "https://cdn.nba.com/headshots/nba/latest/1040x760/2544.png",
  "Stephen Curry": "https://cdn.nba.com/headshots/nba/latest/1040x760/201939.png",
  "Kevin Durant": "https://cdn.nba.com/headshots/nba/latest/1040x760/201142.png",
  "Giannis Antetokounmpo": "https://cdn.nba.com/headshots/nba/latest/1040x760/203507.png",
  "Luka Dončić": "https://cdn.nba.com/headshots/nba/latest/1040x760/1629029.png",
  "Jayson Tatum": "https://cdn.nba.com/headshots/nba/latest/1040x760/1628369.png",
  "Joel Embiid": "https://cdn.nba.com/headshots/nba/latest/1040x760/203954.png",
  "Nikola Jokić": "https://cdn.nba.com/headshots/nba/latest/1040x760/203999.png",
  "Jimmy Butler": "https://cdn.nba.com/headshots/nba/latest/1040x760/202710.png",
  "Anthony Davis": "https://cdn.nba.com/headshots/nba/latest/1040x760/203076.png",
  "Damian Lillard": "https://cdn.nba.com/headshots/nba/latest/1040x760/203081.png",
  "James Harden": "https://cdn.nba.com/headshots/nba/latest/1040x760/201935.png",
  "Kyrie Irving": "https://cdn.nba.com/headshots/nba/latest/1040x760/202681.png",
  "Devin Booker": "https://cdn.nba.com/headshots/nba/latest/1040x760/1626164.png",
  "Ja Morant": "https://cdn.nba.com/headshots/nba/latest/1040x760/1629630.png",
  "Trae Young": "https://cdn.nba.com/headshots/nba/latest/1040x760/1629027.png",
  "Zion Williamson": "https://cdn.nba.com/headshots/nba/latest/1040x760/1629627.png"
};

const PlayerHeadshot = ({ 
  playerName, 
  size = "large", 
  className = "",
  showBorder = true,
  showAnimation = true 
}) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    
    // Check if we have a direct photo URL for this player
    const photoUrl = PLAYER_PHOTOS[playerName];
    
    if (photoUrl) {
      // Test if the image loads
      const img = new Image();
      img.onload = () => {
        setImageSrc(photoUrl);
        setIsLoading(false);
        setHasError(false);
      };
      img.onerror = () => {
        setHasError(true);
        setIsLoading(false);
      };
      img.src = photoUrl;
    } else {
      // No photo available for this player
      setHasError(true);
      setIsLoading(false);
    }
  }, [playerName]);

  // FIXED: Use inline styles instead of Tailwind classes for precise control
  const getSizeStyles = (size) => {
    const sizes = {
      tiny: { width: '32px', height: '32px' },
      small: { width: '48px', height: '48px' },
      medium: { width: '80px', height: '80px' },
      large: { width: '128px', height: '128px' },
      xlarge: { width: '192px', height: '192px' }
    };
    return sizes[size] || sizes.large;
  };

  const sizeStyles = getSizeStyles(size);
  const borderStyle = showBorder ? '2px solid #f97316' : 'none';

  // Generate initials for fallback
  const getInitials = (name) => {
    return name.split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const baseStyles = {
    ...sizeStyles,
    borderRadius: '50%',
    border: borderStyle,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden'
  };

  // Fallback avatar with initials
  if (hasError || !imageSrc) {
    const initials = getInitials(playerName);
    return (
      <div 
        className={`${className} ${showAnimation ? 'group' : ''}`}
        style={{
          ...baseStyles,
          background: 'linear-gradient(135deg, #f97316, #dc2626)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: showAnimation ? 'pointer' : 'default'
        }}
        onMouseEnter={(e) => {
          if (showAnimation) {
            e.target.style.transform = 'scale(1.05)';
          }
        }}
        onMouseLeave={(e) => {
          if (showAnimation) {
            e.target.style.transform = 'scale(1)';
          }
        }}
      >
        <span 
          style={{
            color: 'white',
            fontWeight: 'bold',
            fontSize: size === 'tiny' ? '12px' : size === 'small' ? '14px' : '18px'
          }}
        >
          {initials}
        </span>
      </div>
    );
  }

  return (
    <div className={`${className} ${showAnimation ? 'group' : ''}`}>
      {isLoading && (
        <div 
          style={{
            ...baseStyles,
            background: 'linear-gradient(135deg, #e5e7eb, #d1d5db)',
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
          }}
        />
      )}
      
      <img
        src={imageSrc}
        alt={`${playerName} headshot`}
        style={{
          ...baseStyles,
          objectFit: 'cover',
          opacity: isLoading ? 0 : 1,
          transform: isLoading ? 'scale(0.95)' : 'scale(1)',
          cursor: showAnimation ? 'pointer' : 'default'
        }}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
        onMouseEnter={(e) => {
          if (showAnimation && !isLoading) {
            e.target.style.transform = 'scale(1.05)';
            e.target.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.4)';
          }
        }}
        onMouseLeave={(e) => {
          if (showAnimation && !isLoading) {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
          }
        }}
        loading="lazy"
      />
    </div>
  );
};

export default PlayerHeadshot;
