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
          <div className="lookbook-masonry">
            {items.map((item, i) => (
              <motion.div
                key={item._id}
                className="lookbook-item"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: (i % 3) * 0.1, duration: 0.6, ease: "easeOut" }}
              >
                <div className="lookbook-image-wrapper">
                  {item.image ? (
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="lookbook-image"
                      loading="lazy"
                    />
                  ) : (
                    <div className="image-placeholder">{item.title || 'Lookbook'}</div>
                  )}
                  <div className="lookbook-overlay">
                    <div className="lookbook-content">
                      {item.category && <span className="lookbook-category">{item.category}</span>}
                      <h3 className="lookbook-title">{item.title}</h3>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
