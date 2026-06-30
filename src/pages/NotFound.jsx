import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <section style={{ paddingTop: '160px', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ textAlign: 'center', maxWidth: '500px', padding: '40px' }}
      >
        <div style={{ fontSize: '8rem', fontWeight: '800', fontFamily: 'var(--font-heading)', lineHeight: 1, color: 'var(--accent)', marginBottom: '16px' }}>
          404
        </div>
        <h1 style={{ fontSize: '1.8rem', marginBottom: '16px', fontFamily: 'var(--font-heading)' }}>
          Page Not Found
        </h1>
        <p style={{ color: '#666', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '32px' }}>
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            to="/"
            style={{
              padding: '14px 32px',
              background: '#000',
              color: '#fff',
              textDecoration: 'none',
              borderRadius: '4px',
              fontWeight: '600',
              fontSize: '0.95rem',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              transition: 'background 0.3s',
            }}
            onMouseOver={(e) => e.target.style.background = 'var(--accent)'}
            onMouseOut={(e) => e.target.style.background = '#000'}
          >
            Back to Home
          </Link>
          <Link
            to="/collections"
            style={{
              padding: '14px 32px',
              background: 'transparent',
              color: '#000',
              textDecoration: 'none',
              borderRadius: '4px',
              fontWeight: '600',
              fontSize: '0.95rem',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              border: '1px solid #ddd',
              transition: 'all 0.3s',
            }}
            onMouseOver={(e) => { e.target.style.background = '#000'; e.target.style.color = '#fff'; }}
            onMouseOut={(e) => { e.target.style.background = 'transparent'; e.target.style.color = '#000'; }}
          >
            View Collections
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
