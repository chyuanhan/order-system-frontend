import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';

const OrderConfirmationPage: React.FC = () => {
  const { tableNumber } = useParams<{ tableNumber: string }>();
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const orderNumber = Math.floor(100000 + Math.random() * 900000);

  const handleBackToMenu = () => {
    clearCart(); // 清空购物车
    navigate(`/table/${tableNumber}`); // 导航回菜单页面
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Order Placed Successfully!</h1>
      <p className="text-xl mb-4">Table Number: {tableNumber}</p>
      <p className="text-xl mb-4">Order Number: {orderNumber}</p>
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
              <div className="flex items-center">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-12 h-12 object-cover rounded-md mr-4"
                />
                <span>{item.name} x {item.quantity}</span>
              </div>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))
        ) : (
          <p>Order is empty.</p>
        )}
        <div className="border-t pt-4 mt-4">
          <div className="flex justify-between font-bold">
            <span>Total:</span>
            <span>${getTotalPrice().toFixed(2)}</span>
          </div>
        </div>
      </div>
      <button
        onClick={handleBackToMenu}
        className="block w-full bg-blue-500 text-white text-center py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
      >
        Back to Menu
      </button>
    </div>
  );
};

export default OrderConfirmationPage;
