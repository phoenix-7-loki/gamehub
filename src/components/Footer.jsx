import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="text-muted py-5 bg-light mt-auto">
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-3">
            <h5>GameHub</h5>
            <p className="small">
              La plateforme ultime pour découvrir et acheter vos jeux préférés.
            </p>
          </div>
          <div className="col-md-4 mb-3">
            <h5>Liens rapides</h5>
            <ul className="list-unstyled">
              <li><Link to="/" className="text-muted">Accueil</Link></li>
              <li><Link to="/game/new" className="text-muted">Ajouter un jeu</Link></li>
              <li><Link to="/login" className="text-muted">Connexion</Link></li>
              <li><Link to="/cart" className="text-muted">Panier</Link></li>
            </ul>
          </div>
          <div className="col-md-4 mb-3">
            <h5>Contact</h5>
            <ul className="list-unstyled">
              <li className="text-muted">support@gamehub.com</li>
              <li className="text-muted">911</li>
            </ul>
          </div>
        </div>
        <hr className="my-4" />
        <div className="d-flex justify-content-between align-items-center">
          <p className="mb-0">GameHub &copy; 2026</p>
          <Link to="#" className="text-muted">
            ↑ Haut de page
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
