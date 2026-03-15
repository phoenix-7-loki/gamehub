import React, { useEffect, useState } from 'react';
import GameCard from '../GameCard';

const GamesGrid = ({ filters }) => {
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const gamesPerPage = 10;

  useEffect(() => {
    fetch('http://localhost:3001/games')
      .then(res => res.json())
      .then(data => {
        const cleanedGames = data.map(game => ({
          id: game.id,
          title: game.title || 'Titre inconnu',
          description: game.description || 'Description non disponible',
          price: parseFloat(game.price) || 0,
          genre: game.genre || 'Non spécifié',
          img: game.img || 'https://via.placeholder.com/300x225?text=No+Image'
        }));
        setGames(cleanedGames);
        setFilteredGames(cleanedGames);
        setLoading(false);
      })
      .catch(err => {
        console.error('Erreur API:', err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (games.length === 0) return;

    let result = [...games];
    console.log('Filtres appliqués:', filters);

    if (filters?.search && filters.search.trim() !== '') {
      const searchLower = filters.search.toLowerCase().trim();
      result = result.filter(game =>
        game.title.toLowerCase().includes(searchLower) ||
        game.description.toLowerCase().includes(searchLower) ||
        game.genre.toLowerCase().includes(searchLower)
      );
    }

    if (filters?.genre && filters.genre !== '') {
      result = result.filter(game => 
        game.genre === filters.genre
      );
    }

    if (filters?.price && filters.price !== '') {
      switch(filters.price) {
        case '0-20':
          result = result.filter(game => game.price < 20);
          break;
        case '20-50':
          result = result.filter(game => game.price >= 20 && game.price <= 50);
          break;
        case '50+':
          result = result.filter(game => game.price > 50);
          break;
        default:
          break;
      }
    }

    if (filters?.sort && filters.sort !== '') {
      switch(filters.sort) {
        case 'price_asc':
          result.sort((a, b) => a.price - b.price);
          break;
        case 'price_desc':
          result.sort((a, b) => b.price - a.price);
          break;
        case 'name_asc':
          result.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case 'name_desc':
          result.sort((a, b) => b.title.localeCompare(a.title));
          break;
        default:
          break;
      }
    }

    setFilteredGames(result);
    setCurrentPage(1);
  }, [filters, games]);

  const indexOfLastGame = currentPage * gamesPerPage;
  const indexOfFirstGame = indexOfLastGame - gamesPerPage;
  const currentGames = filteredGames.slice(indexOfFirstGame, indexOfLastGame);
  const totalPages = Math.ceil(filteredGames.length / gamesPerPage);

  const handleAddToCart = (game) => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.id === game.id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...game, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('storage'));

    alert(`${game.title} ajouté au panier !`);
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
        <p className="mt-3">Chargement des jeux...</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Résumé des résultats */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5>
          {filteredGames.length} jeu{filteredGames.length !== 1 ? 'x' : ''} trouvé{filteredGames.length !== 1 ? 's' : ''}
        </h5>
        {filters?.search && (
          <span className="text-muted">Recherche: "{filters.search}"</span>
        )}
      </div>

      {/* Grille des jeux */}
      {currentGames.length === 0 ? (
        <div className="text-center py-5">
          <h4 className="text-muted">Aucun jeu trouvé</h4>
          <p>Essayez de modifier vos filtres de recherche.</p>
        </div>
      ) : (
        <>
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-4">
            {currentGames.map(game => (
              <GameCard
                key={game.id}
                game={game}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav className="mt-5">
              <ul className="pagination justify-content-center">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setCurrentPage(prev => prev - 1)}>
                    Précédent
                  </button>
                </li>
                
                {[...Array(totalPages)].map((_, i) => (
                  <li key={i + 1} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
                      {i + 1}
                    </button>
                  </li>
                ))}
                
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => setCurrentPage(prev => prev + 1)}>
                    Suivant
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </>
      )}
    </div>
  );
};

export default GamesGrid;