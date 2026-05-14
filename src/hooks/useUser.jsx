import React from 'react';
import { Link } from 'react-router-dom';
import Price from './Price';

const GameCard = ({ game, onAddToCart }) => {
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(game);
    }
  };

  return (
    <div className="col">
      <div className="card shadow-sm h-100">
        <img
          src={game.img || "https://via.placeholder.com/300x225"}
          alt={game.title}
          className="card-img-top"
          style={{height: '225px', objectFit: 'cover', objectPosition: 'center'}}
        />

        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{game.title}</h5>
          <p className="card-text flex-grow-1">
            {game.description?.substring(0, 100) || 'Aucune description disponible'}...
          </p>

          <div className="d-flex justify-content-between align-items-center mt-auto">
            <div>
              <span className="badge bg-primary me-2">{game.genre || 'Non spécifié'}</span>
              <Price price={game.price} />
            </div>

            <div className="d-flex gap-1">
              <Link
                to={`/game-detail/${game.id}`}
                className="btn btn-sm btn-outline-secondary"
              >
                👁️
              </Link>
              <button
                className="btn btn-sm btn-success"
                onClick={handleAddToCart}
              >
                🛒
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameCard;