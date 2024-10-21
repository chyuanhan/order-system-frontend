import React from 'react';
import { Link, useNavigate,useParams } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { Minus, Plus, Trash2, ArrowLeft } from 'lucide-react';

const OrderDetailsPage: React.FC = () => {
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice } = useCart();
  const navigate = useNavigate();
  const { tableNumber } = useParams<{ tableNumber: string }>();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <button
          onClick={() => navigate(`/table/${tableNumber}`)}
          className="mr-4 p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-3xl font-bold">Order Details</h1>
      </div>
      <p className="text-xl mb-4">Table Number:{tableNumber}</p>
      {cartItems.length === 0 ? (
        <p className="text-xl">Order is empty.</p>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-4 border-b last:border-b-0">
                <div className="flex items-center flex-1">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-16 h-16 object-cover rounded-md mr-4"
                  />
                  <div>
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <p className="text-gray-600">${item.price.toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-1 rounded-full bg-gray-200 hover:bg-gray-300"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="mx-3 font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-1 rounded-full bg-gray-200 hover:bg-gray-300"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="ml-4 p-1 rounded-full text-red-500 hover:bg-red-100"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center mb-8">
            <span className="text-2xl font-bold">Total:</span>
            <span className="text-2xl font-bold">${getTotalPrice().toFixed(2)}</span>
          </div>
          <Link
            to={`/table/${tableNumber}/order-confirmation`}
            className="block w-full bg-blue-500 text-white text-center py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
          >
            Place Order
          </Link>
        </>
      )}
    </div>
  );
};

export default OrderDetailsPage;
