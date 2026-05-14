import React from 'react';
import { useGames } from '../../hooks/useGames';
import GameCard from '../GameCard';
import GameSlider from '../GameSlider';

const HomePage = () => {
  const { data: games = [], isLoading } = useGames();
  const featured = games.slice(0, 5);
  if (isLoading) return <div>Chargement...</div>;
  return (
    <>
      <GameSlider games={featured} />
      <div className="container py-4">
        <div className="row row-cols-1 row-cols-md-4 g-4">
          {games.map(game => <GameCard key={game.id} game={game} />)}
        </div>
      </div>
    </>
  );
};
export default HomePage;