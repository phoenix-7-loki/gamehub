import React from 'react';
import GamesGrid from './GamesGrid';

const HomePage = ({ filters }) => {
  console.log('HomePage reçoit filtres:', filters);
  
  return (
    <>
      <section className="py-5 text-center bg-light">
        <div className="container">
          <h1 className="display-4">GameHub</h1>
          <p className="lead text-muted">
            Découvrez notre collection de jeux incroyables !
          </p>
        </div>
      </section>
      <GamesGrid filters={filters} />
    </>
  );
};

export default HomePage;