import React, { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TopBar from '../components/TopBar';
import MenuItem from '../components/MenuItem';
import NotFound from '../components/NotFound';
import FixedCartBar from '../components/FixedCartBar';

const menuCategories = [
  { id: 'all', name: 'All' },
  { id: 'rice', name: 'Rice' },
  { id: 'noodles', name: 'Noodles' },
  { id: 'appetizers', name: 'Appetizers' },
  { id: 'drinks', name: 'Drinks' },
];

const menuItems = [
  { id: '1', name: 'Fried Rice', description: 'Classic Chinese fried rice', price: 10.99, image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&q=80&w=1000', category: 'rice' },
  { id: '2', name: 'Chow Mein', description: 'Stir-fried noodles with vegetables', price: 11.99, image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&q=80&w=1000', category: 'noodles' },
  { id: '3', name: 'Spring Rolls', description: 'Crispy vegetable spring rolls', price: 6.99, image: 'https://images.unsplash.com/photo-1548811256-1627d99e7a4b?auto=format&fit=crop&q=80&w=1000', category: 'appetizers' },
  { id: '4', name: 'Bubble Tea', description: 'Milk tea with tapioca pearls', price: 4.99, image: 'https://images.unsplash.com/photo-1558857563-c0c5ee9b0e5a?auto=format&fit=crop&q=80&w=1000', category: 'drinks' },
];

const MenuPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { tableNumber } = useParams<{ tableNumber: string }>();
  const navigate = useNavigate();

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, activeCategory]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setActiveCategory('all');
  };

  const handleCartClick = () => {
    navigate(`/table/${tableNumber}/order-details`);
  };

  return (
    <div className="relative pb-24">
      <TopBar onSearch={handleSearch} />
      <div className="sticky top-[64px] bg-white z-10 shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex overflow-x-auto md:overflow-x-hidden pb-2 hide-scrollbar">
            {menuCategories.map((category) => (
              <button
                key={category.id}
                className={`flex-none md:flex-1 min-w-[120px] md:min-w-0 px-4 py-2 mx-1 rounded-full whitespace-nowrap text-center ${
                  activeCategory === category.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                } transition-colors`}
                onClick={() => setActiveCategory(category.id)}
              >
                <span className="block truncate">{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <MenuItem key={item.id} {...item} />
            ))}
          </div>
        ) : (
          <NotFound />
        )}
      </div>
      <FixedCartBar onClick={handleCartClick} />
    </div>
  );
};

export default MenuPage;
