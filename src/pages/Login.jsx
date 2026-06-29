import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('FARMER');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await login(email, password, role);
      navigate('/dashboard');
    } catch (err) {
      setError(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <div className="card glass-card p-4 shadow border-0" style={{ maxWidth: '440px', width: '100%' }}>
        <div className="text-center mb-4">
          <span className="fs-1">🌱</span>
          <h3 className="fw-bold mt-2 text-success">{t('appName')}</h3>
          <p className="text-muted">{t('loginTitle')}</p>
        </div>

        {error && (
          <div className="alert alert-danger py-2" role="alert" style={{ fontSize: '14px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Email input */}
          <div className="mb-3">
            <label className="form-label fw-semibold" style={{ fontSize: '14px' }}>{t('emailLabel')}</label>
            <input
              type="email"
              className="form-control"
              placeholder="e.g. farmer.ramesh@agrichain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              id="input-login-email"
            />
          </div>

          {/* Password input */}
          <div className="mb-3">
            <label className="form-label fw-semibold" style={{ fontSize: '14px' }}>{t('passwordLabel')}</label>
            <input
              type="password"
              className="form-control"
              placeholder="••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              id="input-login-password"
            />
          </div>

          {/* Role select */}
          <div className="mb-4">
            <label className="form-label fw-semibold" style={{ fontSize: '14px' }}>{t('roleSelectLabel')}</label>
            <select
              className="form-select text-uppercase"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              id="select-login-role"
            >
              <option value="FARMER">{t('farmer')}</option>
              <option value="BUYER">{t('buyer')}</option>
              <option value="PROCESSOR">{t('processor')}</option>
              <option value="EXPORTER">{t('exporter')}</option>
              <option value="ADMIN">{t('admin')}</option>
            </select>
          </div>

          <button
            type="submit"
            className="btn btn-primary-custom w-100 py-2 mb-3"
            disabled={submitting}
            id="btn-login-submit"
          >
            {submitting ? t('loading') : t('loginBtn')}
          </button>
        </form>

        <div className="text-center mt-2" style={{ fontSize: '14px' }}>
          <span className="text-muted">{t('noAccount')} </span>
          <Link to="/register" className="text-success fw-bold text-decoration-none">
            {t('registerBtn')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
