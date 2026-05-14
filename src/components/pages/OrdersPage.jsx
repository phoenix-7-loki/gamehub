import React from 'react';
import { Link } from 'react-router-dom';
import { useOrders } from '../../hooks/useOrders';
import { useUpdateOrderStatus } from '../../hooks/useOrders';
import useUserStore from '../../store/useUserStore';
import _ from 'lodash';

const OrdersPage = () => {
  const { userRole } = useUserStore();
  const { data: orders = [], isLoading } = useOrders();
  const updateStatusMutation = useUpdateOrderStatus();

  const sortedOrders = _.orderBy(orders, ['date'], ['desc']);

  const canUpdateStatus = (order, newStatus) => {
    if (order.status === 'draft' && newStatus === 'confirmed') return userRole === 'user';
    if (order.status === 'confirmed' && newStatus === 'delivered') return userRole === 'admin';
    return false;
  };

  const handleStatusChange = (orderId, currentStatus, newStatus) => {
    if (window.confirm(`Passer la commande en statut "${newStatus}" ?`)) {
      updateStatusMutation.mutate({ id: orderId, status: newStatus });
    }
  };

  if (isLoading) return <div className="text-center py-5">Chargement...</div>;

  return (
    <div className="container py-4">
      <h1 className="mb-4">Mes commandes</h1>
      {sortedOrders.length === 0 ? (
        <p>Aucune commande.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr><th>Référence</th><th>Date</th><th>Nombre d'articles</th><th>Total</th><th>Statut</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {sortedOrders.map(order => (
                <tr key={order.id}>
                  <td>{order.reference}</td>
                  <td>{new Date(order.date).toLocaleDateString()}</td>
                  <td>{order.items.reduce((sum, i) => sum + i.quantity, 0)}</td>
                  <td>${order.total.toFixed(2)}</td>
                  <td>
                    <span className={`badge ${order.status === 'draft' ? 'bg-secondary' : order.status === 'confirmed' ? 'bg-primary' : 'bg-success'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <Link to={`/order/${order.id}`} className="btn btn-sm btn-outline-primary me-2">Détails</Link>
                    {order.status === 'draft' && canUpdateStatus(order, 'confirmed') && (
                      <button className="btn btn-sm btn-success" onClick={() => handleStatusChange(order.id, order.status, 'confirmed')}>
                        Confirmer
                      </button>
                    )}
                    {order.status === 'confirmed' && canUpdateStatus(order, 'delivered') && (
                      <button className="btn btn-sm btn-info" onClick={() => handleStatusChange(order.id, order.status, 'delivered')}>
                        Marquer livré
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;