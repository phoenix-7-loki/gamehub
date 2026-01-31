import React from 'react';
import GameCard from '../GameCard';
import { useEffect, useState } from 'react';

const GamesGrid = ({ searchTerm = '', filters = {} }) => {
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const gamesPerPage = 10;

  useEffect(() => {
    fetch('http://localhost:3001/games')
      .then(res => res.json())
      .then(data => {
        const validGames = data.filter(game =>
          game &&
          game.title &&
          game.title.trim() !== '' &&
          typeof game.price !== 'undefined'
        );

        const cleanedGames = validGames.map(game => ({
          id: game.id || Math.random(),
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
    let result = [...games];

    if (searchTerm && searchTerm.trim() !== '') {
      result = result.filter(game =>
        game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (game.genre && game.genre.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (game.description && game.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (filters.genre && filters.genre !== '') {
      result = result.filter(game =>
        game.genre === filters.genre
      );
    }

    if (filters.price && filters.price !== '') {
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
      }
    }

    if (filters.sort && filters.sort !== '') {
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
      }
    }

    setFilteredGames(result);
    setCurrentPage(1);
  }, [searchTerm, filters, games]);

  const handleAddToCart = (game) => {
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
//TODO: deplacer
    const toast = document.createElement('div');
    toast.className = 'position-fixed bottom-0 end-0 p-3';
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
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (loading) {
    return (
      <div className="album py-5 bg-light">
        <div className="container text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
          <p className="mt-3">Chargement des jeux...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="album py-5 bg-light">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            {searchTerm && (
              <h5 className="mb-0">Résultats pour "{searchTerm}"</h5>
            )}
          </div>
          <div className="text-muted">
            {filteredGames.length} jeu{filteredGames.length !== 1 ? 'x' : ''} trouvé{filteredGames.length !== 1 ? 's' : ''}
          </div>
        </div>

        {currentGames.length === 0 ? (
          <div className="text-center py-5">
            <h4 className="text-muted mb-4">Aucun jeu disponible</h4>
            <p>Aucun jeu ne correspond à vos critères de recherche.</p>
            <button
              className="btn btn-primary mt-3"
              onClick={() => window.location.reload()}
            >
              Recharger les jeux
            </button>
          </div>
        ) : (
          <>
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-3">
              {currentGames.map(game => (
                <GameCard
                  key={game.id}
                  game={game}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <nav aria-label="Pagination des jeux" className="mt-5">
                <ul className="pagination justify-content-center">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={prevPage}>
                      &laquo; Précédent
                    </button>
                  </li>

                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
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
    </div>
  );
};

export default GamesGrid;
