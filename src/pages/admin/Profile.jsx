import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authAPI } from '../../services/api';

export default function AdminProfile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('makuma_token');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    authAPI.me()
      .then(res => setProfile(res.data))
      .catch(() => navigate('/admin/login'))
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '80px' }}>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: '120px', minHeight: '100vh', background: '#f9f9f9' }}>
      <div className="container" style={{ maxWidth: '600px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ background: '#fff', padding: '40px', borderRadius: '8px', border: '1px solid #eaeaea', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}
        >
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', marginBottom: '32px' }}>Admin Profile</h1>

          {profile && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '16px' }}>
                <div style={{
                  width: '64px', height: '64px', borderRadius: '50%',
                  background: 'var(--accent)', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.6rem', fontWeight: '700', fontFamily: 'var(--font-heading)',
                }}>
                  {profile.username?.charAt(0).toUpperCase() || 'A'}
                </div>
                <div>
                  <div style={{ fontSize: '1.3rem', fontWeight: '600' }}>{profile.username}</div>
                  <div style={{ fontSize: '0.85rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>{profile.role}</div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '20px' }}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Username</label>
                  <div style={{ fontSize: '1rem', fontWeight: '500' }}>{profile.username}</div>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Email</label>
                  <div style={{ fontSize: '1rem', fontWeight: '500' }}>{profile.email}</div>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Role</label>
                  <div style={{ fontSize: '1rem', fontWeight: '500' }}>{profile.role}</div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Account ID</label>
                  <div style={{ fontSize: '0.85rem', fontFamily: 'monospace', color: '#555' }}>{profile.id}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button
                  onClick={() => navigate('/admin/dashboard')}
                  style={{ padding: '12px 24px', background: '#000', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem' }}
                >
                  ← Back to Dashboard
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
