import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './components/pages/HomePage';
import GameDetail from './components/pages/GameDetail';
import GameForme from './components/pages/GameForme';
import Login from './components/pages/Login';
import CartPage from './components/pages/CartPage';
import Admin from './components/pages/Admin';
import OrdersPage from './components/pages/OrdersPage';
import OrderDetailPage from './components/pages/OrderDetailPage';
import useUserStore from './store/useUserStore';
import './App.css';

function App() {
  const { fetchUserRole } = useUserStore();

  useEffect(() => {
    fetchUserRole();
  }, []);

  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/game-detail/:id" element={<GameDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/orders" element={
              <ProtectedRoute>
                <OrdersPage />
              </ProtectedRoute>
            } />
            <Route path="/order/:id" element={
              <ProtectedRoute>
                <OrderDetailPage />
              </ProtectedRoute>
            } />
            <Route path="/game/new" element={
              <ProtectedRoute requiredRole="admin">
                <GameForme />
              </ProtectedRoute>
            } />
            <Route path="/game/edit/:id" element={
              <ProtectedRoute requiredRole="admin">
                <GameForme />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute requiredRole="admin">
                <Admin />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;