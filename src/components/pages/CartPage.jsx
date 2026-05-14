import React from 'react';
import { Link } from 'react-router-dom';
import useCartStore from '../../store/useCartStore';
import { useCreateOrder } from '../../hooks/useOrders';
import PriceDisplay from '../PriceDisplay';
import useUserStore from '../../store/useUserStore';

const CartPage = () => {
  const { items, removeItem, updateQuantity, clearCart, getTotal, getItemCount } = useCartStore();
  const { userEmail } = useUserStore();
  const createOrderMutation = useCreateOrder();
  const total = getTotal();
  const itemCount = getItemCount();

  const handleCheckout = () => {
    if (!userEmail) {
      alert('Veuillez vous connecter pour passer commande');
      return;
    }
    createOrderMutation.mutate();
  };

  if (items.length === 0) {
    return (
      <div className="container py-5 text-center">
        <h2>Panier vide</h2>
        <Link to="/" className="btn btn-primary">Voir les jeux</Link>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h1>Panier</h1>
      <div className="row">
        <div className="col-lg-8">
          {items.map(item => (
            <div key={item.id} className="card mb-3">
              <div className="row g-0 p-3 align-items-center">
                <div className="col-md-2">
                  <img src={item.img} alt={item.title} style={{ width: '80px', height: '80px', objectFit: 'cover' }} />
                </div>
                <div className="col-md-4">
                  <h5>{item.title}</h5>
                  <PriceDisplay price={item.price} />
                </div>
                <div className="col-md-3">
                  <div className="input-group" style={{ width: '140px' }}>
                    <button className="btn btn-outline-secondary" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                    <input type="text" className="form-control text-center" value={item.quantity} readOnly />
                    <button className="btn btn-outline-secondary" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                  </div>
                </div>
                <div className="col-md-2 text-end">
                  <strong>${(item.price * item.quantity).toFixed(2)}</strong>
                </div>
                <div className="col-md-1 text-end">
                  <button className="btn btn-sm btn-danger" onClick={() => removeItem(item.id)}>🗑️</button>
                </div>
              </div>
            </div>
          ))}
          <button className="btn btn-outline-danger" onClick={clearCart}>Vider le panier</button>
        </div>
        <div className="col-lg-4">
          <div className="card">
            <div className="card-body">
              <h5>Récapitulatif</h5>
              <p>Articles : {itemCount}</p>
              <p>Sous-total : ${total.toFixed(2)}</p>
              <p>Taxes (15%) : ${(total * 0.15).toFixed(2)}</p>
              <h5>Total : ${(total * 1.15).toFixed(2)}</h5>
              <button className="btn btn-success w-100" onClick={handleCheckout} disabled={createOrderMutation.isPending}>
                {createOrderMutation.isPending ? 'Confirmation...' : 'Confirmer la commande'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;