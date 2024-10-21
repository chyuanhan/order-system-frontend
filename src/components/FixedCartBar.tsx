import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../hooks/useCart';

interface FixedCartBarProps {
  onClick: () => void;
}

const FixedCartBar: React.FC<FixedCartBarProps> = ({ onClick }) => {
  const { getTotalQuantity, getTotalPrice } = useCart();
  const totalQuantity = getTotalQuantity();
  const totalPrice = getTotalPrice();

  return (
    <div className="flex fixed justify-center bottom-0 left-0 right-0 bg-white p-4">
      <button
        onClick={onClick}
        className="w-full mx-2 bg-blue-500 text-white p-4 flex justify-between items-center shadow-lg rounded-lg"
      >
        <div className="flex items-center">
          <ShoppingCart className="w-6 h-6 mr-2" />
          <span className="font-bold">My Order • {totalQuantity} {totalQuantity === 1 ? 'Item' : 'Items'}</span>
        </div>
        <span className="font-bold">${totalPrice.toFixed(2)}</span>
      </button>
    </div>
  );
};

export default FixedCartBar;
