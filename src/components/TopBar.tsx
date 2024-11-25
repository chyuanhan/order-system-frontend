import React, { useState, useRef, useEffect } from 'react';
import { Search, Menu, X } from 'lucide-react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface TopBarProps {
  onSearch?: (term: string) => void;
}

const TopBar: React.FC<TopBarProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { tableNumber } = useParams<{ tableNumber: string }>();
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // 檢查當前路徑是否為管理員登錄頁面
  const isAdminLoginPage = location.pathname === '/admin/login';

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
    if (!isSearchVisible) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 0);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
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

  const renderAdminLinks = () => (
    <>
      <Link
        to="/admin"
        className={`border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
          location.pathname === '/admin' ? 'border-indigo-500 text-gray-900' : ''
        }`}
      >
        Orders
      </Link>
      <Link
        to="/admin/menu"
        className={`border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
          location.pathname === '/admin/menu' ? 'border-indigo-500 text-gray-900' : ''
        }`}
      >
        Menu Management
      </Link>
      <Link
        to="/admin/sales"
        className={`border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
          location.pathname === '/admin/sales' ? 'border-indigo-500 text-gray-900' : ''
        }`}
      >
        Monthly Sales
      </Link>
    </>
  );

  // 如果是管理員登錄頁面，不顯示 TopBar
  if (isAdminLoginPage) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <img className="h-16 w-auto" src="/logo.jpg" alt="Restaurant Logo" />
            </div>
            {isAuthenticated && (
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {renderAdminLinks()}
              </div>
            )}
          </div>
          
          <div className="flex items-center">
            {isAuthenticated ? (
              <>
                <button
                  onClick={handleLogout}
                  className="hidden md:block ml-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Logout
                </button>
                <button
                  className="md:hidden ml-4 p-2"
                  onClick={toggleSidebar}
                >
                  <Menu className="text-gray-600" />
                </button>
              </>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      </div>

      {/* 側邊欄 */}
      {isAuthenticated && (
        <div className={`fixed inset-y-0 right-0 z-50 w-64 bg-white shadow-lg transform ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out md:hidden`}>
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-lg font-semibold">Menu</h2>
            <button onClick={toggleSidebar}>
              <X className="text-gray-600" />
            </button>
          </div>
          <nav className="mt-4 flex flex-col space-y-2 p-4">
            {renderAdminLinks()}
            <button
              onClick={logout}
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Logout
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default TopBar;
