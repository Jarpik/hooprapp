import React, { useState, useEffect, useCallback, useRef } from 'react';

// Define a mapping of preDraftTeam names to specific colors.
// These colors are chosen to be distinct and generally look good with dark text.
// A default color is provided for teams not explicitly listed.
const TEAM_COLORS = {
  "Duke": "#001A57", // Dark Blue
  "Rutgers": "#CC0033", // Scarlet
  "Baylor": "#154734", // Dark Green
  "UCLA": "#2D68C4", // Blue
  "Texas": "#BF5700", // Burnt Orange
  "Oklahoma": "#841617", // Crimson
  "BYU": "#002255", // Navy Blue
  "South Carolina": "#73000A", // Garnet
  "Washington State": "#990000", // Crimson
  "Ratiopharm Ulm": "#FF6600", // Orange
  "Maryland": "#E03A3E", // Red
  "Arizona": "#003366", // Navy Blue
  "Georgetown": "#041E42", // Dark Blue
  "Qingdao Eagles": "#008080", // Teal
  "Cedevita Olimpija": "#005691", // Blue
  "Florida": "#0021A5", // Blue
  "Saint-Quentin": "#000080", // Navy
  "Illinois": "#13294B", // Dark Blue
  "North Carolina": "#7BAFD4", // Light Blue
  "Georgia": "#BA0C0F", // Red
  "Colorado State": "#004B40", // Dark Green
  "Michigan State": "#18453B", // Dark Green
  "Real Madrid": "#00529F", // Blue
  "Penn State": "#041E42", // Navy Blue
  "Saint Joseph's": "#800000", // Maroon
  "Le Mans Sarthe": "#2C3E50", // Dark Grey (for international teams with no obvious color)
  "Creighton": "#003366", // Blue
  "Auburn": "#0C2340", // Navy Blue
  "Arkansas": "#9D2235", // Cardinal
  "Tennessee": "#FF8200", // Orange
  "Marquette": "#002D62", // Blue
  "VCU": "#2C3E50", // Dark Grey
  "Liberty": "#800000", // Red
  "Wisconsin": "#C5050C", // Red
  "Northwestern": "#4E2A84", // Purple
  "Brisbane Bullets": "#002D62", // Blue
  "Mega Basket": "#FF0000", // Red
  "West Virginia": "#EAAA00", // Gold
  "Nevada": "#003366", // Blue
  "Cholet Basket": "#CC0000", // Red
  "Sydney Kings": "#522D80", // Purple
  "Illawarra Hawks": "#CC0000", // Red
  "Trento": "#2C3E50", // Dark Grey
  // Default color if team not found
  "DEFAULT": "#34495E", // Dark Slate Gray
};

// Function to determine text color based on background luminance for readability
const getContrastTextColor = (hexcolor) => {
  if (!hexcolor || hexcolor === TEAM_COLORS.DEFAULT) return '#FFFFFF'; // Default text color for dark backgrounds

  const r = parseInt(hexcolor.substr(1, 2), 16);
  const g = parseInt(hexcolor.substr(3, 2), 16);
  const b = parseInt(hexcolor.substr(5, 2), 16);
  const y = (r * 299 + g * 587 + b * 114) / 1000;
  return (y >= 128) ? '#333333' : '#FFFFFF'; // Use dark text for light backgrounds, light text for dark backgrounds
};


// Real data for 2025 NBA rookies (All 59 picks).
// Added 'preDraftTeam' for college/previous pro team, 'team' is now explicitly NBA team.
// Image URLs are placeholders using player initials due to external image hosting complexities (CORS).
const ROOKIES_2025_NBA = [
  { id: 1, name: "Cooper Flagg", draftPick: 1, team: "Dallas Mavericks", preDraftTeam: "Duke", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/5041939.png&w=350&h=254", height: 81, age: 18, position: "Forward", conference: "ACC" },
  { id: 2, name: "Dylan Harper", draftPick: 2, team: "San Antonio Spurs", preDraftTeam: "Rutgers", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/5037871.png&w=350&h=254", height: 76, age: 18, position: "Guard", conference: "Big Ten" },
  { id: 3, name: "VJ Edgecombe", draftPick: 3, team: "Philadelphia 76ers", preDraftTeam: "Baylor", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/5124612.png&w=350&h=254", height: 77, age: 19, position: "Guard", conference: "Big 12" },
  { id: 4, name: "Kon Knueppel", draftPick: 4, team: "Charlotte Hornets", preDraftTeam: "Duke", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/5061575.png&w=350&h=254", height: 79, age: 19, position: "Forward", conference: "ACC" },
  { id: 5, name: "Ace Bailey", draftPick: 5, team: "Utah Jazz", preDraftTeam: "Rutgers", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/4873138.png&w=350&h=254", height: 81, age: 19, position: "Forward", conference: "Big Ten" },
  { id: 6, name: "Tre Johnson", draftPick: 6, team: "Washington Wizards", preDraftTeam: "Texas", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/5238230.png&w=350&h=254", height: 76, age: 19, position: "Guard", conference: "Big 12" },
  { id: 7, name: "Jeremiah Fears", draftPick: 7, team: "New Orleans Pelicans", preDraftTeam: "Oklahoma", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/5144091.png&w=350&h=254", height: 74, age: 18, position: "Guard", conference: "Big 12" },
  { id: 8, name: "Egor Demin", draftPick: 8, team: "Brooklyn Nets", preDraftTeam: "BYU", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/mens-college-basketball/players/full/5243213.png", height: 79, age: 19, position: "Guard", conference: "Big 12" },
  { id: 9, name: "Collin Murray-Boyles", draftPick: 9, team: "Toronto Raptors", preDraftTeam: "South Carolina", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/5093267.png&w=350&h=254", height: 80, age: 20, position: "Forward", conference: "SEC" },
  { id: 10, name: "Khaman Maluach", draftPick: 10, team: "Phoenix Suns", preDraftTeam: "Duke", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/5203685.png&w=350&h=254", height: 85, age: 18, position: "Center", conference: "ACC" },
  { id: 11, name: "Cedric Coward", draftPick: 11, team: "Memphis Grizzlies", preDraftTeam: "Washington State", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/4903027.png&w=350&h=254", height: 78, age: 22, position: "Forward", conference: "Pac-12" },
  { id: 12, name: "Noa Essengue", draftPick: 12, team: "Chicago Bulls", preDraftTeam: "Ratiopharm Ulm", imageUrl: "https://www.proballers.com/media/cache/resize_600_png/https---www.proballers.com/ul/player/noa-essengue-copie-1efa9906-9bc7-6e94-8e05-5b8404dd2f86.png", height: 80, age: 18, position: "Forward", conference: "International" },
  { id: 13, name: "Derik Queen", draftPick: 13, team: "New Orleans Pelicans", preDraftTeam: "Maryland", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/4869780.png&w=350&h=254", height: 81, age: 19, position: "Forward", conference: "Big Ten" },
  { id: 14, name: "Carter Bryant", draftPick: 14, team: "San Antonio Spurs", preDraftTeam: "Arizona", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/5061568.png&w=350&h=254", height: 80, age: 19, position: "Forward", conference: "Pac-12" },
  { id: 15, name: "Thomas Sorber", draftPick: 15, team: "Oklahoma City Thunder", preDraftTeam: "Georgetown", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/5061603.png&w=350&h=254", height: 82, age: 19, position: "Center", conference: "Big East" },
  { id: 16, name: "Yang Hansen", draftPick: 16, team: "Portland Trail Blazers", preDraftTeam: "Qingdao Eagles", imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtUBYfXV6A3zDKF1N9vBExC0uJ-szXj23iA&s", height: 85, age: 20, position: "Center", conference: "International" },
  { id: 17, name: "Joan Beringer", draftPick: 17, team: "Minnesota Timberwolves", preDraftTeam: "Cedevita Olimpija", imageUrl: "https://cdn.nba.com/manage/2025/05/Beringer_Joan.jpg", height: 79, age: 19, position: "Forward", conference: "International" },
  { id: 18, name: "Walter Clayton Jr.", draftPick: 18, team: "Utah Jazz", preDraftTeam: "Florida", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/4896372.png&w=350&h=254", height: 75, age: 22, position: "Guard", conference: "SEC" },
  { id: 19, name: "Nolan Traoré", draftPick: 19, team: "Brooklyn Nets", preDraftTeam: "Saint-Quentin", imageUrl: "https://www.nbadraft.net/wp-content/uploads/2022/08/Screenshot-2024-04-13-at-12.39.08-PM.png", height: 76, age: 18, position: "Guard", conference: "International" },
  { id: 20, name: "Kasparas Jakučionis", draftPick: 20, team: "Miami Heat", preDraftTeam: "Illinois", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/5214640.png&w=350&h=254", height: 77, age: 19, position: "Guard", conference: "Big Ten" },
  { id: 21, name: "Will Riley", draftPick: 21, team: "Washington Wizards", preDraftTeam: "Illinois", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/5144126.png&w=350&h=254", height: 79, age: 18, position: "Forward", conference: "Big Ten" },
  { id: 22, name: "Drake Powell", draftPick: 22, team: "Brooklyn Nets", preDraftTeam: "North Carolina", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/5037873.png&w=350&h=254", height: 77, age: 19, position: "Guard", conference: "ACC" },
  { id: 23, name: "Asa Newell", draftPick: 23, team: "Atlanta Hawks", preDraftTeam: "Georgia", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/4873201.png&w=350&h=254", height: 80, age: 19, position: "Forward", conference: "SEC" },
  { id: 24, name: "Nique Clifford", draftPick: 24, team: "Sacramento Kings", preDraftTeam: "Colorado State", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/4702384.png&w=350&h=254", height: 77, age: 22, position: "Guard", conference: "Mountain West" },
  { id: 25, name: "Jase Richardson", draftPick: 25, team: "Orlando Magic", preDraftTeam: "Michigan State", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/5239561.png&w=350&h=254", height: 75, age: 19, position: "Guard", conference: "Big Ten" },
  { id: 26, name: "Ben Saraf", draftPick: 26, team: "Brooklyn Nets", preDraftTeam: "Ratiopharm Ulm", imageUrl: "https://www.proballers.com/media/cache/torso_player/https---www.proballers.com/ul/player/ben-saraf-1ef52a2e-7e7a-66f8-b118-bf0b07cf5094.png", height: 78, age: 19, position: "Guard", conference: "International" },
  { id: 27, name: "Danny Wolf", draftPick: 27, team: "Brooklyn Nets", preDraftTeam: "Michigan", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/5107173.png&w=350&h=254", height: 83, age: 21, position: "Center", conference: "Big Ten" },
  { id: 28, name: "Hugo González", draftPick: 28, team: "Boston Celtics", preDraftTeam: "Real Madrid", imageUrl: "https://i3.wp.com/img.mabumbe.net/wp-content/uploads/2025/06/hugo-gonzalez.png?w=600&resize=600,600&ssl=1", height: 78, age: 19, position: "Guard", conference: "International" },
  { id: 29, name: "Liam McNeeley", draftPick: 29, team: "Charlotte Hornets", preDraftTeam: "UConn", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/5239590.png&w=350&h=254", height: 79, age: 19, position: "Forward", conference: "Big East" },
  { id: 30, name: "Yanic Konan Niederhauser", draftPick: 30, team: "Los Angeles Clippers", preDraftTeam: "Penn State", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/5108024.png&w=350&h=254", height: 82, age: 20, position: "Center", conference: "Big Ten" },
  { id: 31, name: "Rasheer Fleming", draftPick: 31, team: "Phoenix Suns", preDraftTeam: "Saint Joseph's", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/5105977.png&w=350&h=254", height: 80, age: 20, position: "Forward", conference: "A-10" },
  { id: 32, name: "Noah Penda", draftPick: 32, team: "Orlando Magic", preDraftTeam: "Le Mans Sarthe", imageUrl: "https://cdn.nba.com/manage/2025/05/noah-penda-mugshot.jpg", height: 79, age: 20, position: "Forward", conference: "International" },
  { id: 33, name: "Sion James", draftPick: 33, team: "Charlotte Hornets", preDraftTeam: "Duke", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/4602025.png&w=350&h=254", height: 78, age: 22, position: "Guard", conference: "ACC" },
  { id: 34, name: "Ryan Kalkbrenner", draftPick: 34, team: "Charlotte Hornets", preDraftTeam: "Creighton", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/4576060.png&w=350&h=254", height: 85, age: 23, position: "Center", conference: "Big East" },
  { id: 35, name: "Johni Broome", draftPick: 35, team: "Philadelphia 76ers", preDraftTeam: "Auburn", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/4433569.png&w=350&h=254", height: 81, age: 22, position: "Forward", conference: "SEC" },
  { id: 36, name: "Adou Thiero", draftPick: 36, team: "Los Angeles Lakers", preDraftTeam: "Arkansas", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/5060631.png&w=350&h=254", height: 79, age: 20, position: "Forward", conference: "SEC" },
  { id: 37, name: "Chaz Lanier", draftPick: 37, team: "Detroit Pistons", preDraftTeam: "Tennessee", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/4700852.png&w=350&h=254", height: 76, age: 23, position: "Guard", conference: "SEC" },
  { id: 38, name: "Kam Jones", draftPick: 38, team: "Indiana Pacers", preDraftTeam: "Marquette", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/4697268.png&w=350&h=254", height: 75, age: 22, position: "Guard", conference: "Big East" },
  { id: 39, name: "Alijah Martin", draftPick: 39, team: "Toronto Raptors", preDraftTeam: "Florida", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/4702656.png&w=350&h=254", height: 76, age: 23, position: "Guard", conference: "SEC" },
  { id: 40, name: "Micah Peavy", draftPick: 40, team: "New Orleans Pelicans", preDraftTeam: "Georgetown", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/4432185.png&w=350&h=254", height: 78, age: 23, position: "Forward", conference: "Big East" },
  { id: 41, name: "Koby Brea", draftPick: 41, team: "Phoenix Suns", preDraftTeam: "Kentucky", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/4591259.png&w=350&h=254", height: 78, age: 23, position: "Guard", conference: "SEC" },
  { id: 42, name: "Maxime Raynaud", draftPick: 42, team: "Sacramento Kings", preDraftTeam: "Stanford", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/4898371.png&w=350&h=254", height: 84, age: 21, position: "Center", conference: "Pac-12" },
  { id: 43, name: "Jamir Watkins", draftPick: 43, team: "Utah Jazz", preDraftTeam: "Florida State", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/4606840.png&w=350&h=254", height: 79, age: 23, position: "Forward", conference: "ACC" },
  { id: 44, name: "Brooks Barnhizer", draftPick: 44, team: "Oklahoma City Thunder", preDraftTeam: "Northwestern", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/4684208.png&w=350&h=254", height: 77, age: 22, position: "Forward", conference: "Big Ten" },
  { id: 45, name: "Rocco Zikarsky", draftPick: 45, team: "Minnesota Timberwolves", preDraftTeam: "Brisbane Bullets", imageUrl: "https://cdn.prod.website-files.com/66de41e2655789935056f9d5/685e08140c91ba0c75af6fba_Rocco-Zikarsky.png", height: 86, age: 18, position: "Center", conference: "International" },
  { id: 46, name: "Amari Williams", draftPick: 46, team: "Boston Celtics", preDraftTeam: "Kentucky", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/4702745.png&w=350&h=254", height: 82, age: 22, position: "Center", conference: "SEC" },
  { id: 47, name: "Bogoljub Marković", draftPick: 47, team: "Milwaukee Bucks", preDraftTeam: "Mega Basket", imageUrl: "https://www.proballers.com/media/cache/resize_600_png/https---www.proballers.com/ul/player/bogoljub-markovic-copie-1efbca8c-eaa8-6d16-a2b8-4fc296eee1f0.png", height: 82, age: 19, position: "Forward", conference: "International" },
  { id: 48, name: "Javon Small", draftPick: 48, team: "Memphis Grizzlies", preDraftTeam: "West Virginia", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/4781746.png&w=350&h=254", height: 75, age: 22, position: "Guard", conference: "Big 12" },
  { id: 49, name: "Tyrese Proctor", draftPick: 49, team: "Cleveland Cavaliers", preDraftTeam: "Duke", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/5023693.png&w=350&h=254", height: 76, age: 21, position: "Guard", conference: "ACC" },
  { id: 50, name: "Kobe Sanders", draftPick: 50, team: "Los Angeles Clippers", preDraftTeam: "Nevada", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/4702352.png&w=350&h=254", height: 75, age: 23, position: "Guard", conference: "Mountain West" },
  { id: 51, name: "Mohamed Diawara", draftPick: 51, team: "New York Knicks", preDraftTeam: "Cholet Basket", imageUrl: "https://cdn.nba.com/manage/2025/06/diawara.png", height: 79, age: 19, position: "Forward", conference: "International" },
  { id: 52, name: "Alex Toohey", draftPick: 52, team: "Golden State Warriors", preDraftTeam: "Sydney Kings", imageUrl: "https://i1.sndcdn.com/artworks-Rg7ezT2M6zLV7MuL-BDZzxw-t500x500.png", height: 80, age: 20, position: "Forward", conference: "International" },
  { id: 53, name: "John Tonje", draftPick: 53, team: "Utah Jazz", preDraftTeam: "Wisconsin", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/4593043.png&w=350&h=254", height: 77, age: 23, position: "Guard", conference: "Big Ten" },
  { id: 54, name: "Taleon Peter", draftPick: 54, team: "Indiana Pacers", preDraftTeam: "Liberty", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/4703421.png&w=350&h=254", height: 75, age: 22, position: "Guard", conference: "ASUN" },
  { id: 55, name: "Lachlan Olbrich", draftPick: 55, team: "Chicago Bulls", preDraftTeam: "Illawarra Hawks", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/mens-college-basketball/players/full/5107156.png", height: 82, age: 20, position: "Forward", conference: "International" },
  { id: 56, name: "Will Richard", draftPick: 56, team: "Golden State Warriors", preDraftTeam: "Florida", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/4897262.png&w=350&h=254", height: 78, age: 22, position: "Guard", conference: "SEC" },
  { id: 57, name: "Max Shulga", draftPick: 57, team: "Boston Celtics", preDraftTeam: "VCU", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/4701992.png&w=350&h=254", height: 77, age: 22, position: "Guard", conference: "A-10" },
  { id: 58, name: "Saliou Niang", draftPick: 58, team: "Cleveland Cavaliers", preDraftTeam: "Trento", imageUrl: "https://www.proballers.com/media/cache/resize_600_png/https---www.proballers.com/ul/player/saliou-niang2-1ef7f63f-7604-60ca-9ae6-9b306d77b6be.png", height: 80, age: 19, position: "Forward", conference: "International" },
  { id: 59, name: "Jahmai Mashack", draftPick: 59, team: "Memphis Grizzlies", preDraftTeam: "Tennessee", imageUrl: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/4683934.png&w=350&h=254", height: 78, age: 22, position: "Guard", conference: "SEC" },
];

// PlayerCard component to display individual rookie information
const PlayerCard = ({ player, onClick, isSelected, isCorrect, showPick, disabled, isDarkMode }) => {
  const cardBackgroundColor = TEAM_COLORS[player.preDraftTeam] || TEAM_COLORS.DEFAULT;
  const cardTextColor = getContrastTextColor(cardBackgroundColor);

  // Determine card styling based on game state
  const cardClasses = `
    relative flex flex-col items-center p-6 m-2 rounded-2xl shadow-xl
    transform transition-all duration-300 ease-out
    w-64 h-80 sm:w-72 sm:h-96   /* Fixed width and height for all cards */
    border-4 ${isDarkMode ? 'border-gray-700' : 'border-gray-300'}
    ${isSelected ? 'border-blue-500 ring-4 ring-blue-300 animate-pop-on-select' : 'hover:scale-103 hover:shadow-2xl'}
    ${isCorrect === true ? 'border-green-600 ring-4 ring-green-400 animate-pop-in' : ''}
    ${isCorrect === false ? 'border-red-600 ring-4 ring-red-400 animate-shake' : ''}
    ${disabled ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}
  `;

  return (
    <div className="flex flex-col items-center w-full max-w-xs mx-auto"> {/* Wrapper div for card and reveal section */}
      <button
        className={cardClasses}
        onClick={() => onClick(player.id)}
        disabled={disabled}
        style={{ backgroundColor: cardBackgroundColor, color: cardTextColor }} // Apply dynamic background and text color
      >
        <img
          src={player.imageUrl}
          alt={player.name}
          className={`w-36 h-36 md:w-44 md:h-44 rounded-full object-cover mb-4 border-4 ${isDarkMode ? 'border-gray-800' : 'border-gray-100'} shadow-md transform transition-transform duration-300 hover:scale-105`}
          // Fallback if the image fails to load (e.g., due to CORS or broken link)
          onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/200x200/666666/FFFFFF?text=${player.name.split(' ').map(n => n[0]).join('')}`; }}
        />
        <h3 className="text-2xl md:text-3xl font-bold text-center mb-2 leading-tight">{player.name}</h3>
        {/* Display preDraftTeam before guess */}
        <p className="text-lg text-center font-medium">{player.preDraftTeam}</p>
      </button>

      {showPick && (
        <div className={`mt-4 bg-gradient-to-r ${isDarkMode ? 'from-gray-800 to-gray-900' : 'from-gray-100 to-gray-200'} ${isDarkMode ? 'text-white' : 'text-gray-900'} text-center px-6 py-3 rounded-xl shadow-lg text-base md:text-lg w-full transform transition-all duration-500 ease-out animate-fade-in-up`}>
          <p className="font-bold text-yellow-300 text-xl md:text-2xl mb-1">Pick #{player.draftPick}</p>
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{player.team}</p> {/* Display NBA team here */}
        </div>
      )}
    </div>
  );
};

const DraftDuelMain = () => {
  const [player1, setPlayer1] = useState(null);
  const [player2, setPlayer2] = useState(null);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [selectedPlayerId, setSelectedPlayerId] = useState(null);
  const [isCorrectGuess, setIsCorrectGuess] = useState(null); // null: no guess, true: correct, false: incorrect
  const [currentQuestion, setCurrentQuestion] = useState(null); // Stores the current question object
  const [shotClockTime, setShotClockTime] = useState(10); // 10-second shot clock
  const shotClockIntervalRef = useRef(null); // Ref to hold the interval ID
  const [showShareModal, setShowShareModal] = useState(false); // New state for share modal visibility
  const shareTextRef = useRef(null); // Ref to hold the textarea for copying
  const [isDarkMode, setIsDarkMode] = useState(true); // State for dark mode, default is true

  // Define all possible question types and their logic
  const QUESTIONS = [
    {
      text: "Which player was drafted HIGHER?", // Lower pick number
      getCorrectPlayerId: (p1, p2) => (p1.draftPick < p2.draftPick ? p1.id : p2.id),
      getComparisonText: (p1, p2) => `Higher pick: #${Math.min(p1.draftPick, p2.draftPick)}`,
      // Filter function to ensure players are suitable for this question type
      filter: (p1, p2) => p1.draftPick !== p2.draftPick,
    },
    {
      text: "Which player was drafted LOWER?", // Higher pick number
      getCorrectPlayerId: (p1, p2) => (p1.draftPick > p2.draftPick ? p1.id : p2.id),
      getComparisonText: (p1, p2) => `Lower pick: #${Math.max(p1.draftPick, p2.draftPick)}`,
      filter: (p1, p2) => p1.draftPick !== p2.draftPick,
    },
    {
      text: "Which player is TALLER?",
      getCorrectPlayerId: (p1, p2) => (p1.height > p2.height ? p1.id : p2.id),
      getComparisonText: (p1, p2) => `Taller: ${p1.height > p2.height ? p1.name : p2.name} (${Math.max(p1.height, p2.height)} inches)`,
      filter: (p1, p2) => p1.height !== p2.height,
    },
    {
      text: "Which player is SHORTER?",
      getCorrectPlayerId: (p1, p2) => (p1.height < p2.height ? p1.id : p2.id),
      getComparisonText: (p1, p2) => `Shorter: ${p1.height < p2.height ? p1.name : p2.name} (${Math.min(p1.height, p2.height)} inches)`,
      filter: (p1, p2) => p1.height !== p2.height,
    },
    {
      text: "Which player is OLDER?",
      getCorrectPlayerId: (p1, p2) => (p1.age > p2.age ? p1.id : p2.id),
      getComparisonText: (p1, p2) => `Older: ${p1.age > p2.age ? p1.name : p2.name} (${Math.max(p1.age, p2.age)} years old)`,
      filter: (p1, p2) => p1.age !== p2.age,
    },
    {
      text: "Which player is YOUNGER?",
      getCorrectPlayerId: (p1, p2) => (p1.age < p2.age ? p1.id : p2.id),
      getComparisonText: (p1, p2) => `Younger: ${p1.age < p2.age ? p1.name : p2.name} (${Math.min(p1.age, p2.age)} years old)`,
      filter: (p1, p2) => p1.age !== p2.age,
    },
    {
      text: "Which player is a GUARD?",
      getCorrectPlayerId: (p1, p2) => (p1.position === "Guard" ? p1.id : p2.id),
      getComparisonText: (p1, p2) => `Guard: ${p1.position === "Guard" ? p1.name : p2.name}`,
      // Filter to ensure one is a Guard and the other is not
      filter: (p1, p2) => (p1.position === "Guard" && p2.position !== "Guard") || (p2.position === "Guard" && p1.position !== "Guard"),
    },
    {
      text: "Which player is a FORWARD?",
      getCorrectPlayerId: (p1, p2) => (p1.position === "Forward" ? p1.id : p2.id),
      getComparisonText: (p1, p2) => `Forward: ${p1.position === "Forward" ? p1.name : p2.name}`,
      // Filter to ensure one is a Forward and the other is a Guard
      filter: (p1, p2) => (p1.position === "Forward" && p2.position === "Guard") || (p2.position === "Forward" && p1.position === "Guard"),
    },
  ];

  // Handle time out - defined before useEffect that uses it
  const handleTimeOut = useCallback(() => {
    setIsCorrectGuess(false);
    setFeedbackMessage('Time ran out! You need to make a pick within 10 seconds. Click "Play Again" to try again.');
    setGameOver(true);
    if (currentStreak > highScore) {
      setHighScore(currentStreak);
      localStorage.setItem('nbaRookieHighScore', currentStreak.toString());
    }
    // Only attempt to set selectedPlayerId if player1 exists
    if (player1) {
      setSelectedPlayerId(player1.id); // Arbitrarily select one to show feedback, but it's wrong
    } else {
      setSelectedPlayerId(null); // Or just set to null if player1 is not available
    }
  }, [currentStreak, highScore, player1]); // Dependencies for useCallback

  // Function to select two random, distinct rookies and a random question
  const selectRandomRookiesAndQuestion = useCallback(() => {
    let p1, p2, randomQuestion;
    let attempts = 0;
    const maxAttempts = 100; // Prevent infinite loops in case of impossible filters

    do {
      p1 = ROOKIES_2025_NBA[Math.floor(Math.random() * ROOKIES_2025_NBA.length)];
      p2 = ROOKIES_2025_NBA[Math.floor(Math.random() * ROOKIES_2025_NBA.length)];
      randomQuestion = QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)];
      attempts++;
    } while ((p1.id === p2.id || (randomQuestion.filter && !randomQuestion.filter(p1, p2))) && attempts < maxAttempts);

    // Fallback if no suitable pair found after many attempts (shouldn't happen with current data/filters)
    if (attempts >= maxAttempts) {
      console.warn("Could not find a suitable player pair and question after many attempts. Resetting with default question.");
      randomQuestion = QUESTIONS[0]; // Default to a basic draft pick question
      do {
        p1 = ROOKIES_2025_NBA[Math.floor(Math.random() * ROOKIES_2025_NBA.length)];
        p2 = ROOKIES_2025_NBA[Math.floor(Math.random() * ROOKIES_2025_NBA.length)];
      } while (p1.id === p2.id || (randomQuestion.filter && !randomQuestion.filter(p1, p2)));
    }


    setPlayer1(p1);
    setPlayer2(p2);
    setCurrentQuestion(randomQuestion);
    setSelectedPlayerId(null);
    setIsCorrectGuess(null);
    setFeedbackMessage('');
    setGameOver(false);
    setShotClockTime(10); // Reset shot clock for new round
  }, []);

  // Initialize game on component mount
  useEffect(() => {
    selectRandomRookiesAndQuestion();
    // Load high score from local storage if available
    const savedHighScore = localStorage.getItem('nbaRookieHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }
  }, [selectRandomRookiesAndQuestion]);

  // Shot clock timer effect
  useEffect(() => {
    // Only start timer if players are loaded, no guess has been made, and game is not over
    if (player1 && player2 && selectedPlayerId === null && !gameOver) {
      shotClockIntervalRef.current = setInterval(() => {
        setShotClockTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(shotClockIntervalRef.current);
            handleTimeOut();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    // Cleanup interval on component unmount or when a guess is made/game over
    return () => {
      if (shotClockIntervalRef.current) {
        clearInterval(shotClockIntervalRef.current);
      }
    };
  }, [player1, player2, selectedPlayerId, gameOver, handleTimeOut]); // Add player1, player2 to dependencies

  // Handle user's guess
  const handleGuess = (id) => {
    if (selectedPlayerId !== null || !currentQuestion || gameOver) return; // Prevent multiple guesses or if no question/game over

    clearInterval(shotClockIntervalRef.current); // Stop the shot clock
    setSelectedPlayerId(id); // Set selected ID immediately

    const correctPlayerId = currentQuestion.getCorrectPlayerId(player1, player2);
    const isGuessCorrect = id === correctPlayerId;

    if (isGuessCorrect) {
      setIsCorrectGuess(true);
      setCurrentStreak(prev => prev + 1);
      setFeedbackMessage('Correct! Click "Continue" to play the next round.');
    } else {
      setIsCorrectGuess(false);
      // Removed the detailed comparison sentence as per user request
      setFeedbackMessage(`Incorrect! Click "Play Again" to try again.`);
      setGameOver(true);
      if (currentStreak > highScore) {
        setHighScore(currentStreak);
        localStorage.setItem('nbaRookieHighScore', currentStreak.toString()); // Save high score
      }
    }
  };

  // Handle continue to next round or reset game
  const handleContinue = () => {
    if (gameOver) {
      resetGame(); // If game over, reset completely
    } else {
      selectRandomRookiesAndQuestion(); // If correct, move to next round
    }
  };

  // Reset the game
  const resetGame = () => {
    setCurrentStreak(0);
    selectRandomRookiesAndQuestion();
  };

  // Share streak functionality (show modal)
  const shareStreak = () => {
    setShowShareModal(true);
  };

  // Handle copying text from the modal
  const handleCopyShareText = () => {
    if (shareTextRef.current) {
      shareTextRef.current.select();
      document.execCommand('copy');
      // Provide feedback within the modal itself
      setFeedbackMessage('Copied to clipboard!');
      setTimeout(() => setFeedbackMessage(''), 2000); // Clear feedback after 2 seconds
    }
  };

  // Handle closing the share modal
  const handleCloseShareModal = () => {
    setShowShareModal(false);
    setFeedbackMessage(''); // Clear any modal-specific feedback
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  // Base64 encoded SVG for a translucent basketballs arranged diagonally within the tile
  const basketballPatternSVG = `
    <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      <!-- First basketball -->
      <g opacity="0.055">
        <circle cx="50" cy="50" r="45" fill="#FF8C00" stroke="#000000" stroke-width="2"/>
        <path d="M50 5 C75 5 95 25 95 50 C95 75 75 95 50 95 C25 95 5 75 5 50 C5 25 25 5 50 5Z" fill="none" stroke="#000000" stroke-width="2"/>
        <path d="M5 50 H95 M50 5 V95" fill="none" stroke="#000000" stroke-width="2"/>
        <path d="M15 85 Q25 70 50 70 Q75 70 85 85" fill="none" stroke="#000000" stroke-width="2"/>
        <path d="M15 15 Q25 30 50 30 Q75 30 85 15" fill="none" stroke="#000000" stroke-width="2"/>
      </g>
      <!-- Second basketball, diagonally offset -->
      <g transform="translate(100 100)" opacity="0.055">
        <circle cx="50" cy="50" r="45" fill="#FF8C00" stroke="#000000" stroke-width="2"/>
        <path d="M50 5 C75 5 95 25 95 50 C95 75 75 95 50 95 C25 95 5 75 5 50 C5 25 25 5 50 5Z" fill="none" stroke="#000000" stroke-width="2"/>
        <path d="M5 50 H95 M50 5 V95" fill="none" stroke="#000000" stroke-width="2"/>
        <path d="M15 85 Q25 70 50 70 Q75 70 85 85" fill="none" stroke="#000000" stroke-width="2"/>
        <path d="M15 15 Q25 30 50 30 Q75 30 85 15" fill="none" stroke="#000000" stroke-width="2"/>
      </g>
    </svg>
  `;
  const encodedSVG = encodeURIComponent(basketballPatternSVG).replace(/'/g, '%27').replace(/"/g, '%22');
  const backgroundImageStyle = `url("data:image/svg+xml;utf8,${encodedSVG}")`;

  // SVG for the basketball court lines with a 3D aesthetic
  const basketballCourtSVG = `
    <svg width="100%" height="100%" viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
      <!-- Court base with a subtle fill -->
      <rect x="0" y="0" width="1000" height="500" fill="${isDarkMode ? '#332211' : '#F0D8B6'}" fill-opacity="0.25" rx="10" ry="10"/>

      <!-- Court outline and half-court line - slightly more visible -->
      <rect x="0" y="0" width="1000" height="500" fill="none" stroke="${isDarkMode ? '#D4AF37' : '#8B4513'}" stroke-width="6" stroke-opacity="0.45" rx="10" ry="10"/>
      <line x1="500" y1="0" x2="500" y2="500" stroke="${isDarkMode ? '#D4AF37' : '#8B4513'}" stroke-width="6" stroke-opacity="0.45"/>
      <circle cx="500" cy="250" r="60" fill="none" stroke="${isDarkMode ? '#D4AF37' : '#8B4513'}" stroke-width="6" stroke-opacity="0.45"/>
      <circle cx="500" cy="250" r="10" fill="${isDarkMode ? '#D4AF37' : '#8B4513'}" fill-opacity="0.45"/> <!-- Center circle dot -->

      <!-- Left half -->
      <!-- Three-point arc (left) -->
      <path d="M 100 50 L 100 450 L 400 450 L 400 50 Z" fill="none" stroke="${isDarkMode ? '#D4AF37' : '#8B4513'}" stroke-width="6" stroke-opacity="0.45"/>
      <path d="M 100 50 A 237.5 237.5 0 0 1 100 450" fill="none" stroke="${isDarkMode ? '#D4AF37' : '#8B4513'}" stroke-width="6" stroke-opacity="0.45"/>
      <!-- Free throw line and key (left) -->
      <rect x="0" y="150" width="190" height="200" fill="none" stroke="${isDarkMode ? '#D4AF37' : '#8B4513'}" stroke-width="6" stroke-opacity="0.45"/>
      <circle cx="190" cy="250" r="60" fill="none" stroke="${isDarkMode ? '#D4AF37' : '#8B4513'}" stroke-width="6" stroke-opacity="0.45"/>
      <line x1="190" y1="150" x2="190" y2="350" stroke="${isDarkMode ? '#D4AF37' : '#8B4513'}" stroke-width="6" stroke-opacity="0.45"/>
      <!-- Basket (left) -->
      <circle cx="60" cy="250" r="7.5" fill="${isDarkMode ? '#D4AF37' : '#8B4513'}" fill-opacity="0.45"/>
      <line x1="60" y1="230" x2="60" y2="270" stroke="${isDarkMode ? '#D4AF37' : '#8B4513'}" stroke-width="3" stroke-opacity="0.45"/>
      <line x1="40" y1="250" x2="80" y2="250" stroke="${isDarkMode ? '#D4AF37' : '#8B4513'}" stroke-width="3" stroke-opacity="0.45"/>

      <!-- Right half -->
      <!-- Three-point arc (right) -->
      <path d="M 900 50 L 900 450 L 600 450 L 600 50 Z" fill="none" stroke="${isDarkMode ? '#D4AF37' : '#8B4513'}" stroke-width="6" stroke-opacity="0.45"/>
      <path d="M 900 50 A 237.5 237.5 0 0 0 900 450" fill="none" stroke="${isDarkMode ? '#D4AF37' : '#8B4513'}" stroke-width="6" stroke-opacity="0.45"/>
      <!-- Free throw line and key (right) -->
      <rect x="810" y="150" width="190" height="200" fill="none" stroke="${isDarkMode ? '#D4AF37' : '#8B4513'}" stroke-width="6" stroke-opacity="0.45"/>
      <circle cx="810" cy="250" r="60" fill="none" stroke="${isDarkMode ? '#D4AF37' : '#8B4513'}" stroke-width="6" stroke-opacity="0.45"/>
      <line x1="810" y1="150" x2="810" y2="350" stroke="${isDarkMode ? '#D4AF37' : '#8B4513'}" stroke-width="6" stroke-opacity="0.45"/>
      <!-- Basket (right) -->
      <circle cx="940" cy="250" r="7.5" fill="${isDarkMode ? '#D4AF37' : '#8B4513'}" fill-opacity="0.45"/>
      <line x1="940" y1="230" x2="940" y2="270" stroke="${isDarkMode ? '#D4AF37' : '#8B4513'}" stroke-width="3" stroke-opacity="0.45"/>
      <line x1="920" y1="250" x2="960" y2="250" stroke="${isDarkMode ? '#D4AF37' : '#8B4513'}" stroke-width="3" stroke-opacity="0.45"/>
    </svg>
  `;

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4 relative App" // Added App class for consistency
      style={{
        backgroundColor: isDarkMode ? '#1A202C' : '#F8F8F0', // Dark or light background
        fontFamily: "'Outfit', sans-serif",
        backgroundImage: basketballPatternSVG ? `url("data:image/svg+xml;utf8,${encodedSVG}")` : 'none',
        backgroundRepeat: 'repeat',
        backgroundSize: '200px 200px', // Size of the repeating pattern tile
      }}
    >
      <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=VT323&display=swap'); /* Digital 7-segment like font */

        body { font-family: 'Outfit', sans-serif; }
        .animate-shake {
          animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
          transform: translate3d(0, 0, 0);
          backface-visibility: hidden;
          perspective: 1000px;
        }
        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
          40%, 60% { transform: translate3d(4px, 0, 0); }
        }
        .animate-pop-in {
            animation: pop-in 0.3s ease-out forwards;
        }
        @keyframes pop-in {
            0% { transform: scale(0.8); opacity: 0; }
            70% { transform: scale(1.1); opacity: 1; }
            100% { transform: scale(1); }
        }
        .animate-pop-on-select {
            animation: pop-on-select 0.15s ease-out forwards;
        }
        @keyframes pop-on-select {
            0% { transform: scale(1); }
            50% { transform: scale(1.03); }
            100% { transform: scale(1.02); }
        }
        .animate-fade-in-up {
            animation: fade-in-up 0.5s ease-out forwards;
        }
        @keyframes fade-in-up {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
        }
        .vs-text {
          background: linear-gradient(to top, #FFD700 30%, #FF4500 100%); /* Yellow to OrangeRed */
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          color: transparent; /* Fallback for non-webkit browsers */
          filter: drop-shadow(0 0 8px rgba(255, 165, 0, 0.8)) drop-shadow(0 0 15px rgba(255, 69, 0, 0.6)); /* Fiery glow */
          animation: flicker 1.5s infinite alternate;
        }

        @keyframes flicker {
          0%, 100% { opacity: 1; transform: scale(1); }
          25% { opacity: 0.9; transform: scale(1.02); }
          50% { opacity: 1; transform: scale(1); }
          75% { opacity: 0.95; transform: scale(1.01); }
        }

        /* Scoreboard specific styles */
        .scoreboard {
          background-color: #000; /* Black background for scoreboard */
          border: 5px solid #333;
          border-radius: 15px;
          display: flex; /* Use flexbox for horizontal layout */
          width: 95%;
          max-width: 800px;
          box-shadow: inset 0 0 20px rgba(0,0,0,0.7), 0 8px 20px rgba(0,0,0,0.5);
          font-family: 'VT323', monospace;
          color: #FF8C00; /* Amber/Orange for digital numbers */
          text-shadow: 0 0 12px rgba(255, 140, 0, 0.8); /* Glow effect */
          position: relative; /* For internal lines */
          padding: 5px; /* Padding inside the main scoreboard container */
          min-height: 100px; /* Vertically shorter */
          height: auto; /* Allow height to adjust based on content */
        }

        .scoreboard-box {
          background-color: #000; /* Dark background for individual boxes */
          border: 2px solid #333; /* Outline for each box */
          border-radius: 8px; /* Slightly rounded corners for boxes */
          box-shadow: inset 0 0 10px rgba(0,0,0,0.5), 0 2px 5px rgba(0,0,0,0.2);
          flex: 1; /* Distribute space */
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between; /* Space out label and value */
          padding: 5px 5px; /* Reduced padding inside segments */
          margin: 0 5px; /* Space between boxes */
          position: relative; /* For internal lines if needed */
          min-height: 60px; /* Adjusted min-height for shorter scoreboard */
        }

        .scoreboard-middle-box {
          flex: 2; /* Middle section takes more space */
          display: flex;
          flex-direction: column;
          justify-content: space-between; /* Question at top, timer at bottom */
          padding: 5px 5px; /* Reduced padding inside segments */
        }

        /* Removed horizontal line inside the middle box */
        .scoreboard-middle-box::after {
          content: none;
        }

        /* Horizontal line for Streak and High Score boxes */
        .scoreboard-box:not(.scoreboard-middle-box)::before {
          content: '';
          position: absolute;
          left: 5%; /* Start slightly in from edge */
          right: 5%; /* End slightly in from edge */
          top: 45%; /* Position in the middle, adjusted for new height */
          transform: translateY(-50%); /* Center vertically */
          height: 2px; /* Thickness of horizontal line */
          background-color: #333;
          box-shadow: 0 0 5px rgba(255, 140, 0, 0.5);
        }


        .scoreboard-label {
          font-family: 'Outfit', sans-serif; /* Labels use Outfit for readability */
          font-size: 1.2rem; /* Reduced font size */
          font-weight: 700;
          color: #FFD700; /* Changed to yellow */
          margin-bottom: 5px; /* Space between label and value */
          align-self: center; /* Center labels */
          padding-top: 5px; /* Align with question text */
        }

        .scoreboard-value {
          font-family: 'VT323', monospace; /* Digital font for numbers */
          font-size: 3rem; /* Reduced font size */
          font-weight: 700;
          line-height: 1;
          color: #FF8C00; /* Amber/Orange for scores */
          text-shadow: 0 0 15px rgba(255, 140, 0, 0.8);
          align-self: center; /* Center values */
          padding-bottom: 5px; /* Align with timer */
        }

        .scoreboard-question-text {
          font-family: 'Outfit', sans-serif; /* Question uses Outfit for readability */
          font-size: 1.2rem; /* Reduced font size */
          font-weight: 700;
          color: ${isDarkMode ? '#FFF' : '#333'}; /* Dynamic color */
          text-shadow: 0 0 8px rgba(${isDarkMode ? '255,255,255' : '0,0,0'},0.6); /* Dynamic shadow */
          text-align: center;
          align-self: flex-start; /* Align to top within its segment */
          width: 100%; /* Take full width */
          padding-top: 5px; /* Align with labels */
        }

        .scoreboard-timer {
          font-family: 'VT323', monospace; /* Digital font for timer */
          font-size: 3rem; /* Reduced font size */
          font-weight: 700;
          line-height: 1;
          color: #FF0000; /* Red for timer */
          text-shadow: 0 0 15px rgba(255, 0, 0, 0.9);
          min-width: 100px; /* Ensure timer numbers don't jump around */
          text-align: center;
          align-self: flex-end; /* Align to bottom within its segment */
          width: 100%; /* Take full width */
          padding-bottom: 5px; /* Ensure consistent padding */
        }

        .scoreboard-timer.warning {
          color: #FF3333; /* Brighter red for warning */
          text-shadow: 0 0 20px rgba(255, 50, 50, 1);
          animation: pulse-red 1s infinite alternate;
        }

        @keyframes pulse-red {
          from { text-shadow: 0 0 15px rgba(255, 0, 0, 0.9); }
          to { text-shadow: 0 0 25px rgba(255, 0, 0, 1.2); }
        }
        `}
      </style>

      {/* Dark/Light Mode Toggle Button */}
      <button
        onClick={toggleDarkMode}
        className={`absolute top-4 right-4 p-3 rounded-full shadow-lg transition-colors duration-300
          ${isDarkMode ? 'bg-gray-700 text-yellow-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}
        `}
        title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        {isDarkMode ? (
          // Moon icon for dark mode
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9 9 0 008.354-5.646z" />
          </svg>
        ) : (
          // Sun icon for light mode
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h1M4 12H3m15.354 5.354l-.707.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        )}
      </button>

      <div className="relative w-full mb-4 flex justify-center items-center">
        <h1 className="text-4xl md:text-6xl font-extrabold text-center drop-shadow-lg relative z-10 vs-text">
          {/* Title removed, as it will be in the page wrapper */}
        </h1>
      </div>

      {/* High School Basketball Scoreboard */}
      <div className="scoreboard mb-6 mt-4">
        <div className="scoreboard-box">
          <div className="scoreboard-label">Streak</div>
          <div className="scoreboard-value">{currentStreak}</div>
        </div>

        <div className="scoreboard-box scoreboard-middle-box">
          <div className="scoreboard-question-text">
            {currentQuestion ? currentQuestion.text : "Loading question..."}
          </div>
          <div className={`scoreboard-timer ${shotClockTime <= 3 ? 'warning' : ''}`}>
            {shotClockTime}
          </div>
        </div>

        <div className="scoreboard-box">
          <div className="scoreboard-label">High Score</div>
          <div className="scoreboard-value">{highScore}</div>
        </div>
      </div>


      {/* The main game content (player cards and VS) */}
      <div className="relative flex flex-col md:flex-row justify-center items-stretch gap-8 w-full max-w-5xl mt-6">
        {/* Basketball court SVG as background for the VS section */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-full h-full max-w-5xl max-h-96 relative overflow-hidden">
            <div
              className="absolute inset-0"
              dangerouslySetInnerHTML={{ __html: basketballCourtSVG }}
              style={{ transform: 'scale(0.38) translateY(35px)', opacity: 0.45 }}
            />
          </div>
        </div>

        {player1 && (
          <PlayerCard
            player={player1}
            onClick={handleGuess}
            isSelected={selectedPlayerId === player1.id}
            isCorrect={selectedPlayerId !== null ? (currentQuestion.getCorrectPlayerId(player1, player2) === player1.id) : null}
            showPick={selectedPlayerId !== null}
            disabled={selectedPlayerId !== null || gameOver}
            isDarkMode={isDarkMode} // Pass isDarkMode prop
          />
        )}
        {/* VS text styling remains the same */}
        <div className="relative z-10 flex items-center justify-center text-6xl font-extrabold md:px-4">
          <span className="vs-text">VS</span>
        </div>
        {player2 && (
          <PlayerCard
            player={player2}
            onClick={handleGuess}
            isSelected={selectedPlayerId === player2.id}
            isCorrect={selectedPlayerId !== null ? (currentQuestion.getCorrectPlayerId(player1, player2) === player2.id) : null}
            showPick={selectedPlayerId !== null}
            disabled={selectedPlayerId !== null || gameOver}
            isDarkMode={isDarkMode} // Pass isDarkMode prop
          />
        )}
      </div>

      {feedbackMessage && (
        <p className={`mt-10 text-3xl font-bold text-center px-6 py-4 rounded-xl shadow-lg animate-fade-in-up
          ${isCorrectGuess === true ? 'bg-green-700 text-white' : ''}
          ${isCorrectGuess === false ? 'bg-red-700 text-white' : ''}
          ${isCorrectGuess === null ? 'bg-blue-500 text-white' : ''}
        `}>
          {feedbackMessage}
        </p>
      )}

      {selectedPlayerId !== null && ( // Show continue/play again buttons only after a selection
        <div className="mt-10 flex flex-col sm:flex-row gap-6">
          {!gameOver ? ( // If not game over (correct guess)
            <button
              onClick={handleContinue}
              className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-bold py-4 px-10 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-75 text-xl"
            >
              Continue
            </button>
          ) : ( // If game over (incorrect guess)
            <>
              <button
                onClick={handleContinue} // This will call resetGame()
                className="bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-bold py-4 px-10 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-green-400 focus:ring-opacity-75 text-xl"
              >
                Play Again
              </button>
              <button
                onClick={shareStreak}
                className="bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white font-bold py-4 px-10 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-purple-400 focus:ring-opacity-75 text-xl"
              >
                Share Streak
              </button>
            </>
          )}
        </div>
      )}

      {/* Share Streak Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fade-in-up">
          <div className={`p-8 rounded-2xl shadow-2xl max-w-md w-full text-center transform scale-105 transition-transform duration-300 ease-out
            ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}
          `}>
            <h2 className="text-3xl font-extrabold mb-6">Share Your Streak!</h2>
            <p className={`text-lg mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Copy the text below to share your amazing streak!
            </p>
            <textarea
              ref={shareTextRef}
              readOnly
              value={`I just scored a streak of ${currentStreak} in the NBA Rookie Draft Pick game! Think you can beat it? #NBADraftGame`}
              className={`w-full p-4 border-2 rounded-lg font-mono text-base resize-none mb-6 focus:outline-none focus:border-blue-500 h-28
                ${isDarkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : 'bg-gray-50 border-gray-300 text-gray-800'}
              `}
            />
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={handleCopyShareText}
                className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-400 text-lg"
              >
                Copy
              </button>
              <button
                onClick={handleCloseShareModal}
                className={`font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 text-lg
                  ${isDarkMode ? 'bg-gray-600 hover:bg-gray-500 text-white focus:ring-gray-400' : 'bg-gray-300 hover:bg-gray-400 text-gray-800 focus:ring-gray-400'}
                `}
              >
                Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DraftDuelMain;
