// src/PlayerHeadshot.js - Simple version with direct photo URLs
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
