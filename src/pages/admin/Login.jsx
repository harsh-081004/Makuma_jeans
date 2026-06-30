import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authAPI } from '../../services/api';

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState('login'); // 'login' or 'setup'
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [allowSetup, setAllowSetup] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('setup') === 'true') {
      setAllowSetup(true);
    }
  }, [location]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let res;
      if (mode === 'setup') {
        res = await authAPI.setup(form);
      } else {
        res = await authAPI.login({ username: form.username, password: form.password });
      }

      localStorage.setItem('makuma_token', res.data.token);
      localStorage.setItem('makuma_admin', JSON.stringify(res.data.admin));
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5', paddingTop: '80px' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ background: '#fff', padding: '48px', borderRadius: '8px', width: '100%', maxWidth: '420px', border: '1px solid #eaeaea', boxShadow: '0 10px 40px rgba(0,0,0,0.06)' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', marginBottom: '8px' }}>MAKUMA</h1>
          <p style={{ color: '#888', fontSize: '0.95rem' }}>
            {mode === 'setup' ? 'Create your admin account' : 'Admin Panel Login'}
          </p>
        </div>

        {error && (
          <div style={{ background: '#fff1f0', border: '1px solid #ffccc7', color: '#cf1322', padding: '12px 16px', borderRadius: '4px', marginBottom: '24px', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.9rem' }}>Username</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '12px 16px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '1rem', outline: 'none', transition: 'border 0.3s', boxSizing: 'border-box' }}
              onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
            />
          </div>

          {mode === 'setup' && (
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.9rem' }}>Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '12px 16px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '1rem', outline: 'none', transition: 'border 0.3s', boxSizing: 'border-box' }}
                onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
                onBlur={(e) => e.target.style.borderColor = '#ddd'}
              />
            </div>
          )}

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.9rem' }}>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={mode === 'setup' ? 8 : 1}
              style={{ width: '100%', padding: '12px 16px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '1rem', outline: 'none', transition: 'border 0.3s', boxSizing: 'border-box' }}
              onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', padding: '14px', background: '#000', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '1rem', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, textTransform: 'uppercase', letterSpacing: '1px', transition: 'background 0.3s' }}
            onMouseOver={(e) => !loading && (e.target.style.background = 'var(--accent)')}
            onMouseOut={(e) => (e.target.style.background = '#000')}
          >
            {loading ? 'Please wait...' : mode === 'setup' ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          {allowSetup && (
            <button
              onClick={() => { setMode(mode === 'login' ? 'setup' : 'login'); setError(''); }}
              style={{ color: 'var(--accent)', fontSize: '0.9rem', textDecoration: 'underline', cursor: 'pointer', background: 'none', border: 'none' }}
            >
              {mode === 'login' ? 'First time? Create superadmin →' : '← Back to login'}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
