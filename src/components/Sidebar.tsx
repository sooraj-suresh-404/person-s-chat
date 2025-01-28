import React, { useState } from 'react';
import { Search, Moon, Sun, Users, ChevronLeft, Filter, X } from 'lucide-react';
import { AIPersonality } from '../types';
import { useDarkMode } from '../contexts/DarkModeContext';

interface SidebarProps {
  onSelectPersonality: (personality: AIPersonality) => void;
  selectedPersonality: AIPersonality | null;
  personalities: AIPersonality[];
}

export default function Sidebar({ onSelectPersonality, selectedPersonality, personalities }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const categories = ['science', 'politics', 'philosophy', 'art'] as const;

  const filteredPersonalities = personalities.filter(personality => {
    const matchesSearch = personality.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      personality.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || personality.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const onlineCount = personalities.filter(p => p.status === 'online').length;

  return (
    <>
      {/* Mobile Floating Personalities Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed right-4 bottom-24 z-50 p-4 rounded-full shadow-lg 
          bg-green-500 hover:bg-green-600 transition-all transform hover:scale-110
          active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        aria-label="Show AI Personalities"
      >
        <Users size={24} className="text-white" />
        {onlineCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
            {onlineCount}
          </span>
        )}
      </button>

      {/* Main Sidebar */}
      <div className={`
        fixed md:static inset-y-0 left-0 z-50 w-full md:w-72 transform transition-all duration-300 ease-in-out
        bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700
        ${isOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
      `}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsOpen(false)}
                className="md:hidden -ml-1 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <ChevronLeft size={24} className="text-gray-700 dark:text-gray-200" />
              </button>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                AI Personalities
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
              >
                <Filter size={20} className="text-gray-700 dark:text-gray-200" />
                {selectedCategory && (
                  <span className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full"></span>
                )}
              </button>
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {isDarkMode ? (
                  <Sun size={20} className="text-gray-200" />
                ) : (
                  <Moon size={20} className="text-gray-700" />
                )}
              </button>
            </div>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search personalities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border bg-gray-50 dark:bg-gray-800 
                border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white 
                placeholder-gray-500 dark:placeholder-gray-400
                focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Categories */}
        {showFilters && (
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 animate-fadeIn">
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium capitalize transition-colors
                    ${selectedCategory === category
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }
                  `}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Personalities list */}
        <div className="overflow-y-auto h-[calc(100vh-180px)] pb-20 md:pb-0">
          {filteredPersonalities.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-4 text-center text-gray-500 dark:text-gray-400">
              <Users size={48} className="mb-4 opacity-50" />
              <p className="font-medium">No personalities found</p>
              <p className="text-sm mt-1">Try adjusting your search or filters</p>
            </div>
          ) : (
            filteredPersonalities.map(personality => (
              <button
                key={personality.id}
                onClick={() => {
                  onSelectPersonality(personality);
                  setIsOpen(false);
                }}
                className={`w-full p-4 flex items-center gap-3 border-b border-gray-200 dark:border-gray-700 transition-colors
                  ${selectedPersonality?.id === personality.id
                    ? 'bg-green-50 dark:bg-gray-800'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                  }
                `}
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={personality.avatar}
                    alt={personality.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-gray-900
                    ${personality.status === 'online' ? 'bg-green-500' : 'bg-gray-400'}
                  `}></div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 dark:text-white truncate">
                    {personality.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                    {personality.description}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}