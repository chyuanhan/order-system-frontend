import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// import { Search } from 'lucide-react';

// 假设这些是我们的桌子数据
interface Table {
  id: number;
  number: number;
  status: 'occupied' | 'available';
  order?: {
    id: number;
    status: string;
  };
}

const tables: Table[] = [
  { id: 1, number: 1, status: 'occupied', order: { id: 101, status: 'pending' } },
  { id: 2, number: 2, status: 'available' },
  { id: 3, number: 3, status: 'occupied', order: { id: 102, status: 'served' } },
  // ... 更多桌子
];

const AdminDashboard: React.FC = () => {
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Bar */}
      {/* <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <img className="h-8 w-auto" src="/logo.png" alt="Restaurant Logo" />
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link to="/admin" className="border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Dashboard
                </Link>
                <Link to="/admin/menu" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Menu Management
                </Link>
                <Link to="/admin/tables" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Table Management
                </Link>
                <Link to="/admin/sales" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Monthly Sales
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <input
                  type="text"
                  placeholder="Search..."
                  className="border rounded-md py-2 px-3 leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div> 
      </nav>
*/}
      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex space-x-4">
          {/* Left Container: Table List */}
          <div className="w-1/3 bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Restaurant Tables
              </h3>
            </div>
            <div className="border-t border-gray-200">
              <ul className="divide-y divide-gray-200">
                {tables.map((table) => (
                  <li
                    key={table.id}
                    className={`px-4 py-4 hover:bg-gray-50 cursor-pointer ${
                      table.status === 'occupied' ? 'bg-yellow-50' : ''
                    }`}
                    onClick={() => setSelectedTable(table)}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-indigo-600 truncate">
                        Table {table.number}
                      </p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          table.status === 'occupied' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {table.status}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Container: Order Details */}
          <div className="w-2/3 bg-white shadow overflow-hidden sm:rounded-lg">
            {selectedTable && selectedTable.order ? (
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Order Details for Table {selectedTable.number}
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Order #{selectedTable.order.id} - Status: {selectedTable.order.status}
                </p>
                {/* Add more order details here */}
              </div>
            ) : (
              <div className="px-4 py-5 sm:px-6">
                <p className="text-gray-500">Select a table to view order details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
