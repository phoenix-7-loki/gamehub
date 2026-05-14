import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useOrder } from '../../hooks/useOrders';

const OrderDetailPage = () => {
  const { id } = useParams();
  const { data: order, isLoading } = useOrder(id);

  if (isLoading) return <div className="text-center py-5">Chargement...</div>;
  if (!order) return <div className="text-center py-5">Commande non trouvée</div>;

  return (
    <div className="container py-4">
      <h1 className="mb-4">Détail de la commande</h1>
      <div className="card mb-4">
        <div className="card-body">
          <p><strong>Référence :</strong> {order.reference}</p>
          <p><strong>Date :</strong> {new Date(order.date).toLocaleString()}</p>
          <p><strong>Statut :</strong> <span className={`badge ${order.status === 'draft' ? 'bg-secondary' : order.status === 'confirmed' ? 'bg-primary' : 'bg-success'}`}>{order.status}</span></p>
          <p><strong>Total :</strong> ${order.total.toFixed(2)}</p>
        </div>
      </div>
      <h3>Jeux commandés</h3>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr><th>Titre</th><th>Quantité</th><th>Prix unitaire</th><th>Sous-total</th></tr>
          </thead>
          <tbody>
            {order.items.map((item, idx) => (
              <tr key={idx}>
                <td>{item.title}</td>
                <td>{item.quantity}</td>
                <td>${item.price.toFixed(2)}</td>
                <td>${(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Link to="/orders" className="btn btn-secondary">Retour</Link>
    </div>
  );
};

export default OrderDetailPage;