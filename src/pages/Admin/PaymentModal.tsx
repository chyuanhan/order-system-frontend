import React, { useState } from 'react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: () => void;
  totalAmount: number;
  tableId: string;
  orderId: string;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onPaymentSuccess,
  totalAmount,
  tableId,
  orderId
}) => {
  const [amountPaid, setAmountPaid] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [error, setError] = useState('');

  const handleNumberClick = (num: string) => {
    if (num === '.' && amountPaid.includes('.')) return;
    if (num === '.' && amountPaid === '') {
      setAmountPaid('0.');
      return;
    }
    setAmountPaid(prev => prev + num);
  };

  const handleClear = () => {
    setAmountPaid('');
    setError('');
  };

  const handleDelete = () => {
    setAmountPaid(prev => prev.slice(0, -1));
    setError('');
  };

  const handleSubmit = async () => {
    const paid = parseFloat(amountPaid);
    // 将金额转换为整数进行比较（乘以100消除小数）
    const paidInCents = Math.round(paid * 100);
    const totalInCents = Math.round(totalAmount * 100);

    if (paidInCents < totalInCents) {
      setError('Amount paid must be greater than or equal to total amount');
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          tableId,
          totalAmount,
          amountPaid: paid,
          change: Math.round((paid - totalAmount) * 100) / 100,
          paymentMethod,
          createdAt: new Date(),
          status: 'success'
        }),
      });

      if (!response.ok) {
        throw new Error('Payment failed');
      }

      await onPaymentSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
    }
  };
  

  if (!isOpen) return null;

  const change = amountPaid ? parseFloat(amountPaid) - totalAmount : 0;

  const getChangeTextColor = () => {
    if (!amountPaid) return 'text-gray-500';
    return Math.round(change * 100) / 100 < 0 ? 'text-red-600' : 'text-green-600';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Payment</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        <div className="mb-4">
          <div className="flex justify-between items-center">
            <p className="text-gray-600">Total Amount</p>
            <p className="text-2xl font-bold">
              ${totalAmount.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <p className="text-gray-600">Amount Paid</p>
            <p className="text-2xl font-bold text-blue-600">
              {amountPaid ? `$${amountPaid}` : '-'}
            </p>
          </div>
          <input
            type="text"
            value={amountPaid}
            readOnly
            className="w-full text-2xl font-bold bg-gray-100 p-2 rounded"
          />
        </div>

        <div className="mb-4">
          <div className="flex justify-between items-center">
            <p className="text-gray-600">Change</p>
            <p className={`text-2xl font-bold ${getChangeTextColor()}`}>
              {amountPaid ? `$${change.toFixed(2)}` : '-'}
            </p>
          </div>
        </div>

        {error && (
          <p className="text-red-500 mb-4">{error}</p>
        )}

        <div className="grid grid-cols-3 gap-2">
          {['7', '8', '9', '4', '5', '6', '1', '2', '3', '0', '.'].map((num) => (
            <button
              key={num}
              onClick={() => handleNumberClick(num)}
              className="bg-gray-200 p-4 rounded hover:bg-gray-300"
            >
              {num}
            </button>
          ))}
          <button
            onClick={handleDelete}
            className="bg-red-200 p-4 rounded hover:bg-red-300"
          >
            ←
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-4">
          <button
            onClick={handleClear}
            className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
          >
            Clear
          </button>
          <button
            onClick={handleSubmit}
            className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
          >
            Submit
          </button>
        </div>

        <div className="mt-4 mb-4">
          <p className="text-gray-600 mb-2">Payment Method</p>
          <div className="flex space-x-2">
            <button
              onClick={() => setPaymentMethod('cash')}
              className={`px-4 py-2 rounded ${
                paymentMethod === 'cash' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200'
              }`}
            >
              Cash
            </button>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal; 