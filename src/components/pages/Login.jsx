import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!credentials.email || !credentials.password) {
      setError('Veuillez remplir tous les champs');
      setLoading(false);
      return;
    }

    try {
      setTimeout(() => {
        if (credentials.email === 'reda@gamehub.ma' && credentials.password === '0011') {
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('userRole', 'admin');
          localStorage.setItem('userEmail', credentials.email);
          navigate('/');
        } else if (credentials.email === 'client@gamehub.ma' && credentials.password === '2026') {
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('userRole', 'user');
          localStorage.setItem('userEmail', credentials.email);
          navigate('/');
        } else {
          setError('Email ou mot de passe incorrect');
        }
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError('Erreur de connexion');
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow-lg border-0">
            <div className="card-header bg-primary text-white text-center py-4">
              <h3 className="mb-0">Connexion à GameHub</h3>
            </div>
            <div className="card-body p-4">
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="email" className="form-label fw-bold">
                    Adresse email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={credentials.email}
                    onChange={handleChange}
                    placeholder="votre@email.com"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="password" className="form-label fw-bold">
                    Mot de passe
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={credentials.password}
                    onChange={handleChange}
                    placeholder="Votre mot de passe"
                    required
                  />
                </div>

                <div className="d-grid gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Connexion en cours...
                      </>
                    ) : (
                      'Se connecter'
                    )}
                  </button>
                </div>

                <div className="text-center mt-4 pt-3 border-top">
                  <p className="mb-2">Pas encore de compte ?</p>
                  <Link to="/" className="btn btn-outline-secondary">
                    Retour à l'accueil
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
