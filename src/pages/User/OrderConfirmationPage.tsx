import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
}

interface OrderItem {
  menuItem: MenuItem;
  quantity: number;
  imageUrl: string;
  name: string;
  _id: string;
}

interface OrderData {
  _id: string;
  tableId: string;
  items: OrderItem[];
  totalAmount: number;
}

const OrderConfirmationPage: React.FC = () => {
  const { tableNumber } = useParams<{ tableNumber: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const orderData = location.state?.orderData as OrderData;

  const handleBackToMenu = () => {
    navigate(`/table/${tableNumber}`);
  };

  if (!orderData) {
    return <div>No order data available. Please try again.</div>;
  }

  const shortOrderId = orderData._id.slice(-6);


  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Order Placed Successfully!</h1>
      <p className="text-xl mb-4">Table Number: {orderData.tableId}</p>
      <p className="text-xl mb-4">Order Number: {shortOrderId}</p>
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        {orderData.items.map((item) => (
          <div key={item._id} className="flex items-center justify-between py-2 border-b last:border-b-0">
            <div className="flex items-center">
              <img 
                src={item.imageUrl} 
                alt={item.name} 
                className="w-12 h-12 object-cover rounded-md mr-4"
              />
              <span>{item.menuItem.name} x {item.quantity}</span>
            </div>
            <span>${(item.menuItem.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="border-t pt-4 mt-4">
          <div className="flex justify-between font-bold">
            <span>Total:</span>
            <span>${orderData.totalAmount.toFixed(2)}</span>
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
