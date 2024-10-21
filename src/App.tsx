import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TopBar from './components/TopBar';
import MenuPage from './pages/User/MenuPage';
import OrderDetailsPage from './pages/User/OrderDetailsPage';
import OrderConfirmationPage from './pages/User/OrderConfirmationPage';
import AdminLogin from './pages/Admin/AdminLogin';
import AdminDashboard from './pages/Admin/AdminDashboard';
import MenuManagement from './pages/Admin/MenuManagement';
import TableManagement from './pages/Admin/TableManagement';
import MonthlySales from './pages/Admin/MonthlySales';
import {CartProvider} from './context/CartContext';
import { AuthProvider,AuthContext } from './context/AuthContext';

const App: React.FC = () => {
  
  const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated } = useContext(AuthContext) || {};
  return isAuthenticated ? <>{children}</> : <Navigate to="/admin/login" replace />;
};

  const handleSearch = (term: string) => {
    // 實現搜索邏輯
    console.log('Searching for:', term);
  };

  return (
    <CartProvider>
        <AuthProvider>
        <Router>
          <TopBar onSearch={handleSearch} />
          <Routes>
            <Route path="/table/:tableNumber" element={<MenuPage />} />
            <Route path="/table/:tableNumber/order-details" element={<OrderDetailsPage />} />
            <Route path="/table/:tableNumber/order-confirmation" element={<OrderConfirmationPage />} />
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/menu" element={<MenuManagement />} />
            <Route path="/admin/tables" element={<TableManagement />} />
            <Route path="/admin/sales" element={<MonthlySales />} />
          </Routes>
        </Router>
      </AuthProvider>
    </CartProvider>
  );
};

export default App;
