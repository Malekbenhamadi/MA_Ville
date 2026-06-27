import { useState } from 'react';

import { API_BASE } from '../lib/api';

function AuthPage() {
  const [authMode, setAuthMode] = useState('login');
  const [authStatus, setAuthStatus] = useState('');
  const [authError, setAuthError] = useState('');
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    email: '',
    password: '',
  });

  const handleLoginChange = (event) => {
    const { name, value } = event.target;
    setLoginForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegisterChange = (event) => {
    const { name, value } = event.target;
    setRegisterForm((prev) => ({ ...prev, [name]: value }));
  };

  const submitLogin = async (event) => {
    event.preventDefault();
    setAuthStatus('');
    setAuthError('');
    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm),
      });
      if (!response.ok) {
        throw new Error('Identifiants invalides');
      }
      const payload = await response.json();
      localStorage.setItem('maville_token', payload.access_token);
      setAuthStatus('Connexion reussie');
    } catch (error) {
      setAuthError(error.message || 'Erreur de connexion');
    }
  };

  const submitRegister = async (event) => {
    event.preventDefault();
    setAuthStatus('');
    setAuthError('');
    try {
      const response = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerForm),
      });
      if (!response.ok) {
        throw new Error('Inscription impossible');
      }
      setAuthStatus('Compte cree, connectez-vous');
      setAuthMode('login');
      setLoginForm({ email: registerForm.email, password: '' });
    } catch (error) {
      setAuthError(error.message || 'Erreur lors de la creation du compte');
    }
  };

  return (
    <section className="auth-section">
      <div className="auth-copy">
        <p className="eyebrow">Sprint 1</p>
        <h2>Authentification citoyen & admin</h2>
        <p>Creez un compte ou connectez-vous pour suivre vos signalements.</p>
        <div className="auth-toggle">
          <button
            type="button"
            className={authMode === 'login' ? 'primary' : 'ghost'}
            onClick={() => setAuthMode('login')}
          >
            Se connecter
          </button>
          <button
            type="button"
            className={authMode === 'register' ? 'primary' : 'ghost'}
            onClick={() => setAuthMode('register')}
          >
            Creer un compte
          </button>
        </div>
        <div className="auth-status">
          {authStatus && <span className="success-text">{authStatus}</span>}
          {authError && <span className="error-text">{authError}</span>}
        </div>
      </div>
      <div className="auth-panel">
        {authMode === 'login' ? (
          <form className="auth-form" onSubmit={submitLogin}>
            <label>
              Email
              <input
                name="email"
                type="email"
                value={loginForm.email}
                onChange={handleLoginChange}
                placeholder="vous@exemple.com"
                required
              />
            </label>
            <label>
              Mot de passe
              <input
                name="password"
                type="password"
                value={loginForm.password}
                onChange={handleLoginChange}
                placeholder="********"
                required
              />
            </label>
            <button className="primary" type="submit">
              Se connecter
            </button>
          </form>
        ) : (
          <form className="auth-form" onSubmit={submitRegister}>
            <label>
              Email
              <input
                name="email"
                type="email"
                value={registerForm.email}
                onChange={handleRegisterChange}
                placeholder="vous@exemple.com"
                required
              />
            </label>
            <label>
              Mot de passe
              <input
                name="password"
                type="password"
                value={registerForm.password}
                onChange={handleRegisterChange}
                placeholder="********"
                required
              />
            </label>
            <button className="primary" type="submit">
              Creer un compte
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

export default AuthPage;
