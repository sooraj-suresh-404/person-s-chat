import React, { useState } from 'react';
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

  const filteredPersonalities = personalities.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-[350px] h-screen border-r border-gray-200 bg-white flex flex-col">
      {/* Header */}
      <div className="h-16 bg-gray-100 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gray-300"></div>
          <span className="font-semibold">AI Chat</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 hover:bg-gray-200 rounded-full"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button className="p-2 hover:bg-gray-200 rounded-full">
            <Menu size={20} />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="p-2">
        <div className="bg-gray-100 rounded-lg flex items-center px-4 py-2">
          <Search size={20} className="text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search personalities"
            className="bg-transparent border-none focus:outline-none ml-2 w-full"
          />
        </div>
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto">
        {filteredPersonalities.map((personality) => (
          <div
            key={personality.id}
            onClick={() => onSelectPersonality(personality)}
            className={`flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer transition-colors duration-200 ${
              selectedPersonality?.id === personality.id ? 'bg-gray-100' : ''
            }`}
          >
            <img
              src={personality.avatar}
              alt={personality.name}
              className="w-12 h-12 rounded-full object-cover"
            />
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
              <p className="text-xs text-gray-400 truncate">{personality.lastMessage}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}