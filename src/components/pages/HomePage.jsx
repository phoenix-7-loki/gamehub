import React, { useState } from 'react';
import GamesGrid from './GamesGrid';

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});

  const handleSearch = (value) => {
    if (typeof value === 'string') {
      setSearchTerm(value);
    } else if (typeof value === 'object') {
      setFilters(value);
    }
  };

  return (
    <>
      <section className="py-5 text-center container">
        <div className="row py-lg-5">
          <div className="col-lg-6 col-md-8 mx-auto">
            <h1 className="fw-light">GameHub</h1>
            <p className="lead text-muted">
              Découvrez notre collection de jeux incroyables !
            </p>
          </div>
        </div>
      </section>
      <GamesGrid searchTerm={searchTerm} filters={filters} />
    </>
  );
};

export default HomePage;
