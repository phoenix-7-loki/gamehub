import React from 'react';
import { Link } from 'react-router-dom';
import useCartStore from '../store/useCartStore';
import PriceDisplay from './PriceDisplay';

const GameCard = ({ game }) => {
  const addItem = useCartStore(state => state.addItem);
  return (
    <div className="col">
      <div className="card h-100">
        <img src={game.img} className="card-img-top" alt={game.title} style={{ height: '200px', objectFit: 'cover' }} />
        <div className="card-body">
          <h5 className="card-title">{game.title}</h5>
          <PriceDisplay price={game.price} />
          <div className="mt-2">
            <Link to={`/game-detail/${game.id}`} className="btn btn-sm btn-outline-primary me-2">Voir</Link>
            <button className="btn btn-sm btn-success" onClick={() => addItem(game)}>Ajouter au panier</button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default GameCard;