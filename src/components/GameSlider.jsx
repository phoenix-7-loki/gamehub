import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Price from './Price';

const GameSlider = ({ games }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    let interval;
    if (isPlaying && games.length > 0) {
      interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % games.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, games.length]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % games.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + games.length) % games.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  if (!games || games.length === 0) {
    return null;
  }

  const currentGame = games[currentIndex];

  return (
    <div className="game-slider-container position-relative mb-5" style={{ backgroundColor: '#000', borderRadius: '10px', overflow: 'hidden' }}>
      {}
      <div 
        className="slider-background"
        style={{
          backgroundImage: `url(${currentGame.img || 'https://via.placeholder.com/1200x500'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '500px',
          position: 'relative',
          transition: 'background-image 0.5s ease-in-out'
        }}
      >
        {}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(90deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 100%)'
        }}></div>

        {}
        <div className="container h-100 position-relative" style={{ zIndex: 10 }}>
          <div className="row h-100 align-items-center">
            <div className="col-lg-6 text-white">
              <div className="badge bg-primary mb-3 fs-6">
                {currentGame.genre}
              </div>
              <h1 className="display-3 fw-bold mb-3">{currentGame.title}</h1>
              <p className="lead mb-4">
                {currentGame.description?.substring(0, 150)}...
              </p>
              <div className="d-flex gap-3 align-items-center">
                <PriceDisplay price={currentGame.price} />
                <Link 
                  to={`/game-detail/${currentGame.id}`} 
                  className="btn btn-primary btn-lg"
                >
                  Voir détails
                </Link>
                <button 
                  className="btn btn-outline-light btn-lg"
                  onClick={() => {
                    const cart = JSON.parse(localStorage.getItem('cart')) || [];
                    const existingItem = cart.find(item => item.id === currentGame.id);
                    if (existingItem) {
                      existingItem.quantity += 1;
                    } else {
                      cart.push({ ...currentGame, quantity: 1 });
                    }
                    localStorage.setItem('cart', JSON.stringify(cart));
                    window.dispatchEvent(new Event('storage'));
                    alert(`${currentGame.title} ajouté au panier !`);
                  }}
                >
                  🛒 Ajouter au panier
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {}
      <div className="slider-controls">
        <button 
          className="btn btn-light rounded-circle position-absolute top-50 start-0 translate-middle-y ms-3"
          onClick={prevSlide}
          style={{ width: '40px', height: '40px', zIndex: 20 }}
        >
          ❮
        </button>
        <button 
          className="btn btn-light rounded-circle position-absolute top-50 end-0 translate-middle-y me-3"
          onClick={nextSlide}
          style={{ width: '40px', height: '40px', zIndex: 20 }}
        >
          ❯
        </button>

        {}
        <div className="position-absolute bottom-0 start-50 translate-middle-x mb-3 d-flex gap-2" style={{ zIndex: 20 }}>
          {games.map((_, idx) => (
            <button
              key={idx}
              className={`btn btn-sm rounded-circle ${currentIndex === idx ? 'btn-primary' : 'btn-outline-light'}`}
              onClick={() => goToSlide(idx)}
              style={{ width: '12px', height: '12px', padding: 0 }}
            />
          ))}
        </div>

        {}
        <button 
          className="btn btn-light position-absolute top-0 end-0 m-3"
          onClick={() => setIsPlaying(!isPlaying)}
          style={{ zIndex: 20 }}
        >
          {isPlaying ? '⏸️' : '▶️'}
        </button>

        {}
        <div className="position-absolute bottom-0 start-0 w-100" style={{ height: '3px', backgroundColor: 'rgba(255,255,255,0.3)', zIndex: 20 }}>
          <div 
            className="bg-primary h-100"
            style={{ 
              width: `${((currentIndex + 1) / games.length) * 100}%`,
              transition: 'width 0.5s ease-in-out'
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default GameSlider;