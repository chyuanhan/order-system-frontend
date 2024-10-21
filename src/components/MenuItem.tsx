import React from 'react';
import { Plus, Minus } from 'lucide-react';
import { useCart } from '../hooks/useCart';

interface MenuItemProps {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

const MenuItem: React.FC<MenuItemProps> = ({ id, name, description, price, image }) => {
  const { addToCart, updateQuantity, getItemQuantity } = useCart();
  const quantity = getItemQuantity(id);

  const handleAddToCart = () => {
    addToCart({ id, name, price, quantity: 1,image });
  };

  const handleDecreaseQuantity = () => {
    updateQuantity(id, quantity - 1);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img src={image} alt={name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{name}</h3>
        <p className="text-gray-600 mb-2">{description}</p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold">${price.toFixed(2)}</span>
          <div className="flex items-center">
            {quantity > 0 ? (
              <>
                <button
                  onClick={handleDecreaseQuantity}
                  className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors mr-2"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="mx-2 font-semibold">{quantity}</span>
              </>
            ) : null}
            <button
              onClick={handleAddToCart}
              className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuItem;
