// src/PlayerHeadshot.js
import React, { useState, useEffect } from 'react';

// Starting with a small set of popular players - we'll expand this
const PLAYER_PHOTO_MAPPING = {
  "LeBron James": "2544",
  "Stephen Curry": "201939", 
  "Kevin Durant": "201142",
  "Giannis Antetokounmpo": "203507",
  "Luka Dončić": "1629029",
  "Jayson Tatum": "1628369",
  "Joel Embiid": "203954",
  "Nikola Jokić": "203999",
  "Jimmy Butler": "202710",
  "Kawhi Leonard": "202695",
  "Anthony Davis": "203076",
  "Damian Lillard": "203081",
  "Russell Westbrook": "201566",
  "Chris Paul": "101108",
  "James Harden": "201935",
  "Kyrie Irving": "202681",
  "Paul George": "202331",
  "Klay Thompson": "202691",
  "Draymond Green": "203110",
  "Devin Booker": "1626164"
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
    
    // Check if we have a known player ID
    const playerId = PLAYER_PHOTO_MAPPING[playerName];
    
    if (playerId) {
      // Use NBA.com official headshots
      const nbaUrl = `https://cdn.nba.com/headshots/nba/latest/1040x760/${playerId}.png`;
      tryLoadImage(nbaUrl);
    } else {
      // For unknown players, go straight to fallback
      setHasError(true);
      setIsLoading(false);
    }
  }, [playerName]);

  const tryLoadImage = (url) => {
    const img = new Image();
    img.onload = () => {
      setImageSrc(url);
      setIsLoading(false);
      setHasError(false);
    };
    img.onerror = () => {
      setHasError(true);
      setIsLoading(false);
    };
    img.src = url;
  };

  const sizeClasses = {
    small: "w-12 h-12",
    medium: "w-20 h-20", 
    large: "w-32 h-32",
    xlarge: "w-48 h-48"
  };

  const borderClass = showBorder ? "border-2 border-orange-400" : "";

  // Generate initials for fallback
  const getInitials = (name) => {
    return name.split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  // Fallback avatar with initials
  if (hasError || !imageSrc) {
    const initials = getInitials(playerName);
    return (
      <div className={`${sizeClasses[size]} ${className} relative group`}>
        <div className={`w-full h-full bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center ${borderClass} shadow-lg transition-all duration-300 ${showAnimation ? 'group-hover:scale-105' : ''}`}>
          <span className="text-white font-bold text-lg">
            {initials}
          </span>
        </div>
        {showAnimation && (
          <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 to-red-500 rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
        )}
      </div>
    );
  }

  return (
    <div className={`${sizeClasses[size]} ${className} relative group`}>
      {isLoading && (
        <div className={`absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse rounded-full ${borderClass}`} />
      )}
      
      <img
        src={imageSrc}
        alt={`${playerName} headshot`}
        className={`
          w-full h-full object-cover rounded-full ${borderClass} shadow-xl 
          transition-all duration-500 ease-out
          ${isLoading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}
          ${showAnimation ? 'group-hover:scale-105 group-hover:shadow-2xl' : ''}
        `}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
        loading="lazy"
      />
      
      {showAnimation && !isLoading && !hasError && (
        <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 via-red-500 to-orange-400 rounded-full opacity-0 group-hover:opacity-40 transition-opacity duration-300"></div>
      )}
    </div>
  );
};

export default PlayerHeadshot;
