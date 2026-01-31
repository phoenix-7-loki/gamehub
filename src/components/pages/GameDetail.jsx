import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

const GameDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3001/games/${id}`)
      .then(res => {
        if (!res.ok) {
          throw new Error('Jeu non trouvé');
        }
        return res.json();
      })
      .then(data => {
        setGame(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce jeu ?')) {
      try {
        const response = await fetch(`http://localhost:3001/games/${id}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          navigate('/');
        } else {
          alert('Erreur lors de la suppression');
        }
      } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur de connexion au serveur');
      }
    }
  };

  const handleAddToCart = () => {
    if (!game) return;

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.id === game.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...game, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));

    const event = new Event('storage');
    window.dispatchEvent(event);

    alert(`${game.title} a été ajouté à votre panier`);
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
        <p className="mt-3">Chargement des détails du jeu...</p>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="container py-5 text-center">
        <h4 className="text-danger mb-3">Jeu non trouvé</h4>
        <p className="text-muted mb-4">Le jeu que vous recherchez n'existe pas ou a été supprimé.</p>
        <Link to="/" className="btn btn-primary">
          Retour à l'accueil
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-lg-6 mb-4">
          <div className="card shadow-sm border-0">
            <img
              src={game.img || 'https://via.placeholder.com/600x400'}
              alt={game.title}
              className="card-img-top rounded"
              style={{ height: '400px', objectFit: 'cover' }}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/600x400?text=Image+non+disponible';
              }}
            />
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
              <h1 className="card-title display-5 fw-bold mb-3">{game.title}</h1>

              <div className="mb-4">
                <h5 className="text-muted mb-2">Genre :</h5>
                <div className="d-flex flex-wrap gap-2">
                  <span className="badge bg-primary fs-6 px-3 py-2">
                    {game.genre || 'Non spécifié'}
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <h5 className="text-muted mb-2">Prix :</h5>
                <div className="display-4 fw-bold text-success">
                  ${typeof game.price === 'number' ? game.price.toFixed(2) : game.price || '0.00'}
                </div>
              </div>

              <div className="mb-4">
                <h5 className="text-muted mb-2">Description :</h5>
                <p className="fs-5" style={{ lineHeight: '1.8' }}>
                  {game.description || 'Aucune description disponible pour ce jeu.'}
                </p>
              </div>

              <div className="mb-4">
                <h5 className="text-muted mb-3">Informations :</h5>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <div className="card bg-light border-0">
                      <div className="card-body">
                        <h6 className="card-subtitle mb-2 text-muted">ID du jeu</h6>
                        <p className="card-text fw-bold">{game.id}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="d-flex flex-wrap gap-3 mt-4 pt-3 border-top">
                <Link to="/" className="btn btn-outline-secondary px-4">
                  Retour à l'accueil
                </Link>

                <button
                  onClick={handleAddToCart}
                  className="btn btn-success px-4"
                >
                  🛒 Ajouter au panier
                </button>

                <Link to={`/game/edit/${id}`} className="btn btn-primary px-4">
                  ✏️ Modifier
                </Link>

                <button
                  onClick={handleDelete}
                  className="btn btn-danger px-4"
                >
                  🗑️ Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameDetail;
