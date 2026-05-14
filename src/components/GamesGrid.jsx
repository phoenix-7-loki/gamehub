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
        console.log('Jeux chargés:', data);
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

    if (filters?.search && filters.search.trim() !== '') {
      const searchLower = filters.search.toLowerCase().trim();
      result = result.filter(game =>
        game.title.toLowerCase().includes(searchLower) ||
        game.description.toLowerCase().includes(searchLower) ||
        game.genre.toLowerCase().includes(searchLower)
      );
    }

    if (filters?.genre && filters.genre !== '') {
      result = result.filter(game => game.genre === filters.genre);
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

    // Toast notification
    const toast = document.createElement('div');
    toast.className = 'position-fixed bottom-0 end-0 p-3';
    toast.style.zIndex = '9999';
    toast.innerHTML = `
      <div class="toast show" role="alert">
        <div class="toast-header">
          <strong class="me-auto">✅ Ajouté au panier</strong>
          <button type="button" class="btn-close" onclick="this.parentElement.parentElement.remove()"></button>
        </div>
        <div class="toast-body">
          ${game.title} a été ajouté au panier
        </div>
      </div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  const indexOfLastGame = currentPage * gamesPerPage;
  const indexOfFirstGame = indexOfLastGame - gamesPerPage;
  const currentGames = filteredGames.slice(indexOfFirstGame, indexOfLastGame);
  const totalPages = Math.ceil(filteredGames.length / gamesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
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
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
        <h5>
          {filteredGames.length} jeu{filteredGames.length !== 1 ? 'x' : ''} trouvé{filteredGames.length !== 1 ? 's' : ''}
        </h5>
        <div className="d-flex gap-2 flex-wrap">
          {filters?.search && (
            <span className="badge bg-info text-dark">Recherche: "{filters.search}"</span>
          )}
          {filters?.genre && (
            <span className="badge bg-primary">Genre: {filters.genre}</span>
          )}
          {filters?.price && (
            <span className="badge bg-success">Prix: {filters.price}</span>
          )}
          {filters?.sort && (
            <span className="badge bg-secondary">Tri: {filters.sort === 'price_asc' ? 'Prix croissant' : 
              filters.sort === 'price_desc' ? 'Prix décroissant' :
              filters.sort === 'name_asc' ? 'Nom A-Z' : 'Nom Z-A'}</span>
          )}
        </div>
      </div>

      {currentGames.length === 0 ? (
        <div className="text-center py-5">
          <h4 className="text-muted">Aucun jeu trouvé</h4>
          <p>Essayez de modifier vos filtres de recherche.</p>
          <button
            className="btn btn-primary mt-3"
            onClick={() => window.location.reload()}
          >
            Recharger les jeux
          </button>
        </div>
      ) : (
        <>
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
            {currentGames.map(game => (
              <GameCard
                key={game.id}
                game={game}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <nav className="mt-5">
              <ul className="pagination justify-content-center">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={prevPage}>
                    &laquo; Précédent
                  </button>
                </li>
                
                {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <li key={pageNum} className={`page-item ${currentPage === pageNum ? 'active' : ''}`}>
                      <button className="page-link" onClick={() => paginate(pageNum)}>
                        {pageNum}
                      </button>
                    </li>
                  );
                })}
                
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={nextPage}>
                    Suivant &raquo;
                  </button>
                </li>
              </ul>
              <div className="text-center text-muted mt-2">
                Page {currentPage} sur {totalPages} • 
                Jeux {indexOfFirstGame + 1} à {Math.min(indexOfLastGame, filteredGames.length)} sur {filteredGames.length}
              </div>
            </nav>
          )}
        </>
      )}
    </div>
  );
};

export default GamesGrid;