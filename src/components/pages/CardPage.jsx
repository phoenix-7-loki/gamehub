import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const CardPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(savedCart);
    calculateTotal(savedCart);
    setLoading(false);

    const handleStorageChange = () => {
      const updatedCart = JSON.parse(localStorage.getItem('cart')) || [];
      setCartItems(updatedCart);
      calculateTotal(updatedCart);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const calculateTotal = (items) => {
    const sum = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    setTotal(sum);
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;

    const updatedCart = cartItems.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );

    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    calculateTotal(updatedCart);
  };

  const removeItem = (id) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    calculateTotal(updatedCart);
  };

  const clearCart = () => {
    if (window.confirm('Vider tout le panier ?')) {
      setCartItems([]);
      localStorage.removeItem('cart');
      setTotal(0);
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Votre panier est vide');
      return;
    }

    alert(`Paiement de $${total.toFixed(2)} effectué avec succès !`);
    setCartItems([]);
    localStorage.removeItem('cart');
    setTotal(0);
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
        <p className="mt-3">Chargement du panier...</p>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container py-5">
        <div className="text-center py-5">
          <div className="display-1 text-muted mb-4">🛒</div>
          <h2 className="mb-4">Votre panier est vide</h2>
          <p className="lead text-muted mb-4">
            Ajoutez des jeux à votre panier pour les acheter
          </p>
          <Link to="/" className="btn btn-primary btn-lg">
            ← Voir les jeux
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h1 className="mb-4">🛒 Mon Panier</h1>

      <div className="row">
        <div className="col-lg-8">
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              {cartItems.map(item => (
                <div key={item.id} className="row align-items-center border-bottom pb-3 mb-3">
                  <div className="col-md-2">
                    <img
                      src={item.img || 'https://via.placeholder.com/100'}
                      alt={item.title}
                      className="img-fluid rounded"
                      style={{ height: '80px', objectFit: 'cover' }}
                    />
                  </div>
                  <div className="col-md-5">
                    <h5 className="mb-1">{item.title}</h5>
                    <p className="text-muted small mb-2">{item.genre}</p>
                    <span className="badge bg-success fs-6">
                      ${item.price?.toFixed(2)}
                    </span>
                  </div>
                  <div className="col-md-3">
                    <div className="input-group" style={{width: '140px'}}>
                      <button
                        className="btn btn-outline-secondary"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        -
                      </button>
                      <input
                        type="text"
                        className="form-control text-center"
                        value={item.quantity}
                        readOnly
                      />
                      <button
                        className="btn btn-outline-secondary"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="col-md-2 text-end">
                    <div className="fw-bold">${(item.price * item.quantity).toFixed(2)}</div>
                    <button
                      className="btn btn-link text-danger p-0 mt-1"
                      onClick={() => removeItem(item.id)}
                    >
                      🗑️ Supprimer
                    </button>
                  </div>
                </div>
              ))}

              <div className="text-end">
                <button className="btn btn-outline-danger" onClick={clearCart}>
                  🗑️ Vider le panier
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card shadow-sm sticky-top" style={{ top: '20px' }}>
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Récapitulatif</h5>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between mb-2">
                <span>Sous-total ({cartItems.reduce((acc, item) => acc + item.quantity, 0)} articles)</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Frais de port</span>
                <span className="text-success">Gratuit</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Taxes</span>
                <span>${(total * 0.15).toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-3 border-top pt-3">
                <span className="fw-bold">Total</span>
                <span className="fw-bold fs-4">${(total * 1.15).toFixed(2)}</span>
              </div>

              <button
                className="btn btn-success btn-lg w-100 mb-3"
                onClick={handleCheckout}
              >
                💳 Procéder au paiement
              </button>

              <Link to="/" className="btn btn-outline-secondary w-100">
                 Continuer mes achats
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardPage;
