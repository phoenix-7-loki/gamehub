import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [genreFilter, setGenreFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [sortFilter, setSortFilter] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.body.classList.add('dark-mode');
    }

    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      const count = cart.reduce((acc, item) => acc + item.quantity, 0);
      setCartCount(count);
    };

    updateCartCount();
    window.addEventListener('storage', updateCartCount);
    return () => window.removeEventListener('storage', updateCartCount);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);

    if (newDarkMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearch) onSearch(value);
  };

  const applyFilters = () => {
    const filters = {
      search: searchTerm,
      genre: genreFilter,
      price: priceFilter,
      sort: sortFilter
    };
    if (onSearch) onSearch(filters);
  };

  useEffect(() => {
    applyFilters();
  }, [genreFilter, priceFilter, sortFilter]);

  return (
    <header className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container">
        <Link to="/" className="navbar-brand d-flex align-items-center">
          <strong>GameHub</strong>
        </Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          <div className="d-flex flex-column flex-lg-row align-items-start align-items-lg-center w-100">
            <div className="me-lg-3 mb-2 mb-lg-0">
              <input
                type="search"
                className="form-control"
                placeholder="Rechercher un jeu..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>

            <div className="d-flex flex-wrap gap-2 mb-2 mb-lg-0">
              <select
                className="form-select form-select-sm"
                style={{width: 'auto'}}
                value={genreFilter}
                onChange={(e) => setGenreFilter(e.target.value)}
              >
                <option value="">Tous les genres</option>
                <option value="Action">Action</option>
                <option value="Aventure">Aventure</option>
                <option value="RPG">RPG</option>
                <option value="Stratégie">Stratégie</option>
                <option value="Sport">Sport</option>
                <option value="Simulation">Simulation</option>
                <option value="FPS">FPS</option>
                <option value="Horreur">Horreur</option>
              </select>

              <select
                className="form-select form-select-sm"
                style={{width: 'auto'}}
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
              >
                <option value="">Tous les prix</option>
                <option value="0-20">Moins de $20</option>
                <option value="20-50">$20 - $50</option>
                <option value="50+">Plus de $50</option>
              </select>

              <select
                className="form-select form-select-sm"
                style={{width: 'auto'}}
                value={sortFilter}
                onChange={(e) => setSortFilter(e.target.value)}
              >
                <option value="">Trier par</option>
                <option value="price_asc">Prix croissant</option>
                <option value="price_desc">Prix décroissant</option>
                <option value="name_asc">Nom A-Z</option>
                <option value="name_desc">Nom Z-A</option>
              </select>
            </div>

            <div className="ms-lg-auto d-flex align-items-center gap-2">
              <button
                className="btn btn-outline-light btn-sm"
                onClick={toggleDarkMode}
                title={darkMode ? 'Mode clair' : 'Mode sombre'}
              >
                {darkMode ? '☀️' : '🌙'}
              </button>

              <Link to="/cart" className="btn btn-outline-light position-relative">
                🛒
                {cartCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {cartCount}
                  </span>
                )}
              </Link>

              <Link to="/game/new" className="btn btn-primary btn-sm">
                + Ajouter
              </Link>

              <Link to="/login" className="btn btn-outline-light btn-sm">
                🔐 Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
