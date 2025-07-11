import React, { useState, useEffect, useRef } from 'react';
// Updated import path to ensure case sensitivity
import PlayerHeadshot from './playerheadshot';

const AutocompleteInput = ({ onPlayerSelect, placeholder = "Enter NBA player name..." }) => {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [allPlayers, setAllPlayers] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Fetch all players when component mounts
  useEffect(() => {
    fetch('https://hooprapp.onrender.com/api/players')
      .then(response => response.json())
      .then(data => {
        console.log('Fetched players for autocomplete:', data.players.length); // Debug log
        // Debug: Check if players have headshot_url
        const playersWithPhotos = data.players.filter(p => p.headshot_url).length;
        console.log(`Players with photos in autocomplete: ${playersWithPhotos}/${data.players.length}`);
        setAllPlayers(data.players);
      })
      .catch(error => {
        console.error('Error fetching players:', error);
      });
  }, []);

  // Filter players based on input
  const filterPlayers = (searchTerm) => {
    if (!searchTerm.trim()) return [];
    
    const filtered = allPlayers.filter(player => 
      player.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    return filtered.slice(0, 8); // Show more results for better selection
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);
    setSelectedIndex(-1);
    
    if (value.trim()) {
      const filtered = filterPlayers(value);
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const selectPlayer = (playerName) => {
    setInput('');
    setShowSuggestions(false);
    setSelectedIndex(-1);
    setSuggestions([]);
    onPlayerSelect(playerName);
  };

  // Handle ALL keyboard events here
  const handleKeyDown = (e) => {
    // Don't do anything if no suggestions are visible
    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === 'Enter' && input.trim()) {
        selectPlayer(input);
      }
      return;
    }

    // Handle navigation keys
    if (e.key === 'ArrowDown' || e.code === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => {
        const newIndex = prev >= suggestions.length - 1 ? 0 : prev + 1;
        return newIndex;
      });
      return;
    }

    if (e.key === 'ArrowUp' || e.code === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => {
        const newIndex = prev <= 0 ? suggestions.length - 1 : prev - 1;
        return newIndex;
      });
      return;
    }

    if (e.key === 'Enter' || e.code === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        selectPlayer(suggestions[selectedIndex].name);
      } else if (input.trim()) {
        selectPlayer(input);
      }
      return;
    }

    if (e.key === 'Escape' || e.code === 'Escape') {
      setShowSuggestions(false);
      setSelectedIndex(-1);
      return;
    }
  };

  // Add event listener to the document to catch all key events
  useEffect(() => {
    const handleDocumentKeyDown = (e) => {
      if (document.activeElement === inputRef.current) {
        handleKeyDown(e);
      }
    };

    document.addEventListener('keydown', handleDocumentKeyDown);
    return () => document.removeEventListener('keydown', handleDocumentKeyDown);
  }, [showSuggestions, suggestions, selectedIndex, input]);

  return (
    <div className="autocomplete-container">
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={handleInputChange}
        placeholder={placeholder}
        className="player-input"
        autoComplete="off"
      />
      
      {showSuggestions && suggestions.length > 0 && (
        <div className="suggestions-dropdown" ref={dropdownRef}>
          {suggestions.map((player, index) => (
            <div
              key={player.name}
              className={`suggestion-item ${index === selectedIndex ? 'active' : ''}`}
              onClick={() => selectPlayer(player.name)}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              {/* UPDATED: Player Headshot - Now uses database photo URL */}
              <div className="player-headshot">
                <PlayerHeadshot 
                  playerName={player.name}
                  photoUrl={player.headshot_url} // ADDED: Pass database photo URL
                  size="tiny"
                  showBorder={false}
                  showAnimation={false}
                />
              </div>
              
              {/* SIMPLIFIED: Player Info Container - Just name, no hints */}
              <div className="player-info">
                <span className="player-name">{player.name}</span>
                {/* REMOVED: Team and position details since they're hints */}
                {/* OLD: <span className="player-details">{player.team} • {player.position} • {player.ppg} PPG</span> */}
                {/* NEW: Clean display with just player name to avoid spoiling hints */}
              </div>
              
              {/* Selection indicator */}
              <div className={`selection-indicator ${index === selectedIndex ? 'active' : ''}`}>
                ⭐
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AutocompleteInput;
