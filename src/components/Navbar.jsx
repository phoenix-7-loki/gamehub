import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useUserStore from '../store/useUserStore';
import useCartStore from '../store/useCartStore';
import { useTheme } from '../context/ThemeContext';

const Navbar = ({ onFilterChange }) => {
  const { userEmail, userRole, logout } = useUserStore();
  const { getItemCount } = useCartStore();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();

  const cartCount = getItemCount();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm sticky-top">
      <div className="container">
        <Link to="/" className="navbar-brand"><strong>GameHub</strong></Link>
        <button className="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#navbarContent">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          <div className="ms-auto d-flex align-items-center gap-2">
            <button className="btn btn-outline-light btn-sm" onClick={toggleDarkMode}>
              {darkMode ? '☀️' : '🌙'}
            </button>
            <Link to="/cart" className="btn btn-outline-light position-relative">
              🛒 {cartCount > 0 && <span className="position-absolute top-0 start-100 translate-middle badge bg-danger">{cartCount}</span>}
            </Link>
            {userEmail ? (
              <>
                <Link to="/orders" className="btn btn-outline-light btn-sm">Mes commandes</Link>
                {userRole === 'admin' && <Link to="/admin" className="btn btn-outline-light btn-sm">Admin</Link>}
                <button onClick={handleLogout} className="btn btn-outline-danger btn-sm">Déconnexion</button>
              </>
            ) : (
              <Link to="/login" className="btn btn-outline-light btn-sm">🔐 Login</Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;