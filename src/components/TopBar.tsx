import React, { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useParams } from 'react-router-dom';

interface TopBarProps {
  onSearch: (term: string) => void;
}

const TopBar: React.FC<TopBarProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { tableNumber } = useParams<{ tableNumber: string }>();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    onSearch(e.target.value);
  };

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
    if (!isSearchVisible) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 0);
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (searchInputRef.current && !searchInputRef.current.contains(event.target as Node)) {
      setIsSearchVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Restaurant Menu</h1>
        
        {/* 桌面版搜索栏和桌号 */}
        <div className="hidden md:flex flex-1 max-w-md mx-4 items-center">
          <span className="mr-4 font-semibold">Table {tableNumber}</span>
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search menu..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        
        {/* 移动设备搜索图标、搜索栏和桌号 */}
        <div className="md:hidden flex items-center">
          {isSearchVisible ? (
            <div className="relative w-full">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search menu..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          ) : (
            <>
              <span className="mr-4 font-semibold">Table {tableNumber}</span>
              <button
                onClick={toggleSearch}
                className="ml-auto p-2 rounded-full bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <Search className="text-gray-600" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopBar;
