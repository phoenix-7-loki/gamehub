import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useUserStore from '../../store/useUserStore';

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoading, error } = useUserStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) navigate('/');
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow-lg border-0">
            <div className="card-header bg-primary text-white text-center py-4">
              <h3 className="mb-0">Connexion</h3>
            </div>
            <div className="card-body p-4">
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="form-label fw-bold">Email</label>
                  <input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <div className="mb-4">
                  <label className="form-label fw-bold">Mot de passe</label>
                  <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-primary btn-lg w-100" disabled={isLoading}>
                  {isLoading ? 'Connexion...' : 'Se connecter'}
                </button>
                <div className="text-center mt-4">
                  <p className="text-muted">Comptes test :</p>
                  <small>admin@gamehub.com / admin123</small><br />
                  <small>user@gamehub.com / user123</small>
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