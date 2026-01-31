import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const navigate = useNavigate();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3001/games')
      .then(res => res.json())
      .then(data => {
        setGames(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Supprimer ce jeu ?')) {
      try {
        await fetch(`http://localhost:3001/games/${id}`, {
          method: 'DELETE'
        });
        setGames(games.filter(game => game.id !== id));
      } catch (error) {
        console.error('Erreur:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
        <p className="mt-3">Chargement des données admin...</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h1 className="mb-4">Administration</h1>

      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Gestion des jeux</h5>
          <button
            className="btn btn-light btn-sm"
            onClick={() => navigate('/game/new')}
          >
            + Ajouter un jeu
          </button>
        </div>

        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Titre</th>
                  <th>Genre</th>
                  <th>Prix</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {games.map(game => (
                  <tr key={game.id}>
                    <td>{game.id}</td>
                    <td>{game.title}</td>
                    <td>
                      <span className="badge bg-primary">{game.genre}</span>
                    </td>
                    <td>${game.price?.toFixed(2)}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => navigate(`/game/edit/${game.id}`)}
                      >
                        ✏️
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(game.id)}
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {games.length === 0 && (
            <div className="text-center py-4">
              <p className="text-muted">Aucun jeu trouvé</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
