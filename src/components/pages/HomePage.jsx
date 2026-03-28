import React, { useState, useEffect } from 'react';
import GamesGrid from './GamesGrid';
import GameSlider from '../GameSlider';

const HomePage = ({ filters }) => {
  const [featuredGames, setFeaturedGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3001/games')
      .then(res => res.json())
      .then(data => {
        const cleanedGames = data.slice(0, 5).map(game => ({
          id: game.id,
          title: game.title || 'Titre inconnu',
          description: game.description || 'Description non disponible',
          price: parseFloat(game.price) || 0,
          genre: game.genre || 'Non spécifié',
          img: game.img || 'https://via.placeholder.com/1200x500'
        }));
        setFeaturedGames(cleanedGames);
        setLoading(false);
      })
      .catch(err => {
        console.error('Erreur chargement slider:', err);
        setLoading(false);
      });
  }, []);

  return (
    <>
      {}
      {!loading && featuredGames.length > 0 && (
        <GameSlider games={featuredGames} />
      )}

      {}
      <section className="py-5 text-center bg-light">
        <div className="container">
          <h1 className="display-4">GameHub</h1>
          <p className="lead text-muted">
            Découvrez notre collection de jeux incroyables !
          </p>
        </div>
      </section>

      {}
      <GamesGrid filters={filters} />
    </>
  );
};

export default HomePage;