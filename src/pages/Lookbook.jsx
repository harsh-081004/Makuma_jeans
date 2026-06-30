import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { lookbookAPI } from '../services/api';

export default function Lookbook() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    lookbookAPI.list()
      .then(res => setItems(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="page-section" style={{ paddingTop: '160px', minHeight: '100vh', paddingBottom: '100px' }}>
      <div className="container">
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="section-tag">Style Inspiration</div>
          <h2 className="section-title">The MAKUMA Lookbook</h2>
          <p className="section-subtitle">Discover our premium wholesale collection styled for the modern woman.</p>
        </motion.div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px 0' }}>Loading lookbook...</div>
        ) : items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '100px 0', color: '#888' }}>Lookbook coming soon — stay tuned!</div>
        ) : (
          <div className="lookbook-masonry" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px', gridAutoRows: '20px' }}>
            {items.map((item, i) => (
              <motion.div
                key={item._id}
                className="lookbook-masonry-item"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                style={{ gridRowEnd: `span ${Math.floor(Math.random() * 5) + 15}`, position: 'relative', overflow: 'hidden', borderRadius: 'var(--radius-md)' }}
              >
                {item.image ? (
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#f9f9f9', transition: 'transform 0.5s ease' }} 
                  />
                ) : (
                  <div className="image-placeholder">{item.title || 'Lookbook'}</div>
                )}
                <div className="lookbook-overlay" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', opacity: 0, transition: 'opacity 0.3s ease', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '24px' }}>
                  {item.category && <span style={{ color: 'var(--accent)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>{item.category}</span>}
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: 'white' }}>{item.title}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
