// src/PlayerHeadshot.js - Expanded with most commonly guessed players
import React, { useState, useEffect } from 'react';

// EXPANDED PLAYER PHOTOS - focusing on most commonly searched/guessed players
const PLAYER_PHOTOS = {
  // YOUR EXISTING WORKING PLAYERS (keeping these exactly the same)
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
  "Zion Williamson": "https://cdn.nba.com/headshots/nba/latest/1040x760/1629627.png",

  // MOST COMMONLY GUESSED SUPERSTARS (same NBA CDN pattern)
  "Kawhi Leonard": "https://cdn.nba.com/headshots/nba/latest/1040x760/202695.png",
  "Paul George": "https://cdn.nba.com/headshots/nba/latest/1040x760/202331.png",
  "Russell Westbrook": "https://cdn.nba.com/headshots/nba/latest/1040x760/201566.png",
  "Chris Paul": "https://cdn.nba.com/headshots/nba/latest/1040x760/101108.png",
  "Klay Thompson": "https://cdn.nba.com/headshots/nba/latest/1040x760/202691.png",
  "Draymond Green": "https://cdn.nba.com/headshots/nba/latest/1040x760/203110.png",
  "Bradley Beal": "https://cdn.nba.com/headshots/nba/latest/1040x760/203078.png",
  "Karl-Anthony Towns": "https://cdn.nba.com/headshots/nba/latest/1040x760/1626157.png",
  "Rudy Gobert": "https://cdn.nba.com/headshots/nba/latest/1040x760/203497.png",
  "Ben Simmons": "https://cdn.nba.com/headshots/nba/latest/1040x760/1627732.png",

  // TOP YOUNG PLAYERS (frequently guessed)
  "Shai Gilgeous-Alexander": "https://cdn.nba.com/headshots/nba/latest/1040x760/1628983.png",
  "Victor Wembanyama": "https://cdn.nba.com/headshots/nba/latest/1040x760/1641705.png",
  "Paolo Banchero": "https://cdn.nba.com/headshots/nba/latest/1040x760/1630567.png",
  "Scottie Barnes": "https://cdn.nba.com/headshots/nba/latest/1040x760/1630567.png",
  "Cade Cunningham": "https://cdn.nba.com/headshots/nba/latest/1040x760/1630595.png",
  "Evan Mobley": "https://cdn.nba.com/headshots/nba/latest/1040x760/1630596.png",
  "LaMelo Ball": "https://cdn.nba.com/headshots/nba/latest/1040x760/1630163.png",
  "Anthony Edwards": "https://cdn.nba.com/headshots/nba/latest/1040x760/1630162.png",
  "Tyler Herro": "https://cdn.nba.com/headshots/nba/latest/1040x760/1629639.png",
  "RJ Barrett": "https://cdn.nba.com/headshots/nba/latest/1040x760/1629628.png",
  "Donovan Mitchell": "https://cdn.nba.com/headshots/nba/latest/1040x760/1628378.png",
  "Jalen Green": "https://cdn.nba.com/headshots/nba/latest/1040x760/1630224.png",
  "Franz Wagner": "https://cdn.nba.com/headshots/nba/latest/1040x760/1630532.png",
  "Alperen Şengün": "https://cdn.nba.com/headshots/nba/latest/1040x760/1630578.png",

  // POPULAR VETERANS & ALL-STARS (often searched)
  "DeMar DeRozan": "https://cdn.nba.com/headshots/nba/latest/1040x760/201942.png",
  "Kyle Lowry": "https://cdn.nba.com/headshots/nba/latest/1040x760/200768.png",
  "Al Horford": "https://cdn.nba.com/headshots/nba/latest/1040x760/201143.png",
  "Blake Griffin": "https://cdn.nba.com/headshots/nba/latest/1040x760/201933.png",
  "Andre Drummond": "https://cdn.nba.com/headshots/nba/latest/1040x760/203083.png",
  "CJ McCollum": "https://cdn.nba.com/headshots/nba/latest/1040x760/203468.png",
  "Tobias Harris": "https://cdn.nba.com/headshots/nba/latest/1040x760/202699.png",
  "Khris Middleton": "https://cdn.nba.com/headshots/nba/latest/1040x760/203114.png",
  "Jrue Holiday": "https://cdn.nba.com/headshots/nba/latest/1040x760/201950.png",
  "Marcus Smart": "https://cdn.nba.com/headshots/nba/latest/1040x760/203935.png",

  // ROLE PLAYERS & BREAKOUT STARS (commonly searched)
  "Austin Reaves": "https://cdn.nba.com/headshots/nba/latest/1040x760/1630559.png",
  "Jalen Brunson": "https://cdn.nba.com/headshots/nba/latest/1040x760/1628973.png",
  "Mikal Bridges": "https://cdn.nba.com/headshots/nba/latest/1040x760/1628969.png",
  "OG Anunoby": "https://cdn.nba.com/headshots/nba/latest/1040x760/1628384.png",
  "Jarrett Allen": "https://cdn.nba.com/headshots/nba/latest/1040x760/1628386.png",
  "Darius Garland": "https://cdn.nba.com/headshots/nba/latest/1040x760/1629636.png",
  "Desmond Bane": "https://cdn.nba.com/headshots/nba/latest/1040x760/1630217.png",
  "Tyrese Haliburton": "https://cdn.nba.com/headshots/nba/latest/1040x760/1630169.png",
  "Anfernee Simons": "https://cdn.nba.com/headshots/nba/latest/1040x760/1629014.png",
  "Tyrese Maxey": "https://cdn.nba.com/headshots/nba/latest/1040x760/1630178.png",

  // INTERNATIONAL STARS (popular globally)
  "Lauri Markkanen": "https://cdn.nba.com/headshots/nba/latest/1040x760/1628374.png",
  "Jonas Valančiūnas": "https://cdn.nba.com/headshots/nba/latest/1040x760/202685.png",
  "Kristaps Porziņģis": "https://cdn.nba.com/headshots/nba/latest/1040x760/204001.png",
  "Bogdan Bogdanović": "https://cdn.nba.com/headshots/nba/latest/1040x760/203992.png",
  "Nikola Vučević": "https://cdn.nba.com/headshots/nba/latest/1040x760/202696.png",
  "Domantas Sabonis": "https://cdn.nba.com/headshots/nba/latest/1040x760/1627734.png",
  "Rui Hachimura": "https://cdn.nba.com/headshots/nba/latest/1040x760/1629060.png",
  "Dennis Schröder": "https://cdn.nba.com/headshots/nba/latest/1040x760/203471.png",

  // DEFENSIVE SPECIALISTS & KEY ROLE PLAYERS
  "Robert Williams III": "https://cdn.nba.com/headshots/nba/latest/1040x760/1629057.png",
  "Matisse Thybulle": "https://cdn.nba.com/headshots/nba/latest/1040x760/1629680.png",
  "Lu Dort": "https://cdn.nba.com/headshots/nba/latest/1040x760/1629472.png",
  "Alex Caruso": "https://cdn.nba.com/headshots/nba/latest/1040x760/1627936.png",
  "Derrick White": "https://cdn.nba.com/headshots/nba/latest/1040x760/1628401.png",
  "Gary Trent Jr.": "https://cdn.nba.com/headshots/nba/latest/1040x760/1629018.png",

  // BENCH STARS & SIXTH MAN CANDIDATES
  "Jordan Clarkson": "https://cdn.nba.com/headshots/nba/latest/1040x760/203903.png",
  "Jordan Poole": "https://cdn.nba.com/headshots/nba/latest/1040x760/1629673.png",
  "Immanuel Quickley": "https://cdn.nba.com/headshots/nba/latest/1040x760/1630193.png",
  "Cam Thomas": "https://cdn.nba.com/headshots/nba/latest/1040x760/1630214.png",
  "Malik Monk": "https://cdn.nba.com/headshots/nba/latest/1040x760/1628370.png",

  // CLASSIC VETERANS (still popular)
  "Kevin Love": "https://cdn.nba.com/headshots/nba/latest/1040x760/201567.png",
  "Gordon Hayward": "https://cdn.nba.com/headshots/nba/latest/1040x760/202330.png",
  "Mike Conley": "https://cdn.nba.com/headshots/nba/latest/1040x760/201144.png",
  "D'Angelo Russell": "https://cdn.nba.com/headshots/nba/latest/1040x760/1626156.png"
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
