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
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [filteredPersonalities, setFilteredPersonalities] = useState(personalities);

  useEffect(() => {
    const filtered = personalities.filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPersonalities(filtered);
  }, [searchQuery]);

  return (
    <div className="w-[350px] h-screen border-r border-gray-200 bg-white flex flex-col">
      {/* Header */}
      <div className="h-16 bg-white flex items-center justify-between px-4 border-b">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center text-white font-bold text-lg">
            AI
          </div>
          <span className="font-semibold">AI Chat</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="sidebar-button"
            title={isDarkMode ? 'Light mode' : 'Dark mode'}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button className="sidebar-button" title="Menu">
            <Menu size={20} />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="p-3">
        <div className="bg-gray-100 rounded-lg flex items-center px-4 py-2 focus-within:ring-2 focus-within:ring-green-500 transition-shadow">
          <Search size={20} className="text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search personalities"
            className="bg-transparent border-none focus:outline-none ml-2 w-full text-sm"
          />
        </div>
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto">
        {filteredPersonalities.length === 0 ? (
          <div className="text-center p-4 text-gray-500">
            No personalities found matching "{searchQuery}"
          </div>
        ) : (
          filteredPersonalities.map((personality) => (
            <div
              key={personality.id}
              onClick={() => onSelectPersonality(personality)}
              className={`personality-card ${
                selectedPersonality?.id === personality.id ? 'personality-card-active' : ''
              }`}
            >
              <div className="relative">
                <img
                  src={personality.avatar}
                  alt={personality.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold truncate">{personality.name}</h3>
                  <span className="text-xs text-gray-500 flex-shrink-0">
                    {personality.lastMessageTime?.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <p className="text-sm text-gray-500 truncate">{personality.description}</p>
                {personality.lastMessage && (
                  <p className="text-xs text-gray-400 truncate">{personality.lastMessage}</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}