import React, { useState, useEffect } from 'react';
import { Search, Menu, Moon, Sun } from 'lucide-react';
import { AIPersonality } from '../types';
import { personalities } from '../data/personalities';

interface SidebarProps {
  onSelectPersonality: (personality: AIPersonality) => void;
  selectedPersonality: AIPersonality | null;
}

export default function Sidebar({ onSelectPersonality, selectedPersonality }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Initialize from localStorage or system preference
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) {
      return savedMode === 'true';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [filteredPersonalities, setFilteredPersonalities] = useState(personalities);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle dark mode changes
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('darkMode', isDarkMode.toString());
  }, [isDarkMode]);

  // Handle search filtering
  useEffect(() => {
    const filtered = personalities.filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPersonalities(filtered);
  }, [searchQuery]);

  return (
    <div className={`w-[350px] h-screen border-r flex flex-col transition-colors duration-200 
      ${isDarkMode 
        ? 'border-gray-700 bg-gray-900 text-white' 
        : 'border-gray-200 bg-white text-gray-900'
      }`}>
      {/* Header */}
      <div className={`h-16 flex items-center justify-between px-4 border-b
        ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center text-white font-bold text-lg">
            AI
          </div>
          <span className="font-semibold">AI Chat</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`sidebar-button ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            title={isDarkMode ? 'Light mode' : 'Dark mode'}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`sidebar-button ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`} 
            title="Menu"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="p-3">
        <div className={`rounded-lg flex items-center px-4 py-2 transition-shadow
          ${isDarkMode 
            ? 'bg-gray-800 focus-within:ring-2 focus-within:ring-green-500' 
            : 'bg-gray-100 focus-within:ring-2 focus-within:ring-green-500'
          }`}>
          <Search size={20} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search personalities"
            className={`bg-transparent border-none focus:outline-none ml-2 w-full text-sm
              ${isDarkMode ? 'placeholder-gray-500' : 'placeholder-gray-400'}`}
          />
        </div>
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto">
        {filteredPersonalities.length === 0 ? (
          <div className={`text-center p-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            No personalities found matching "{searchQuery}"
          </div>
        ) : (
          filteredPersonalities.map((personality) => (
            <div
              key={personality.id}
              onClick={() => onSelectPersonality(personality)}
              className={`personality-card transition-colors duration-200
                ${isDarkMode 
                  ? 'hover:bg-gray-800' 
                  : 'hover:bg-gray-50'
                }
                ${selectedPersonality?.id === personality.id 
                  ? (isDarkMode ? 'bg-gray-800' : 'bg-gray-100') 
                  : ''
                }`}
            >
              <div className="relative">
                <img
                  src={personality.avatar}
                  alt={personality.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold truncate">{personality.name}</h3>
                  <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} flex-shrink-0`}>
                    {personality.lastMessageTime?.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <p className={`text-sm truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {personality.description}
                </p>
                {personality.lastMessage && (
                  <p className={`text-xs truncate ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    {personality.lastMessage}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}