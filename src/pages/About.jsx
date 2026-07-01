import { motion } from 'framer-motion';

export default function About() {
  return (
    <div className="about-page">
      <section className="about page-section" style={{ paddingTop: '160px', minHeight: '100vh', flex: 1 }}>
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="section-tag">About MAKUMA</div>
            <h2 className="section-title">Wholesale Denim Experts</h2>
          </motion.div>

          <div className="responsive-grid-2" style={{ marginTop: '60px' }}>
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <img src="/images/product-04.jpeg" alt="Wholesale Supply" style={{ width: '100%', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-card)', objectFit: 'contain', maxHeight: '600px' }} />
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
            >
              <h3 style={{ fontSize: '2rem', marginBottom: '16px' }}>Direct from Surat to Your Store</h3>
              <p style={{ color: '#555', fontSize: '1.1rem', lineHeight: '1.6' }}>
                We understand the retail business. Your success depends on offering high-quality, trend-right products at price points that allow for healthy markups.
              </p>
              <p style={{ color: '#555', fontSize: '1.1rem', lineHeight: '1.6' }}>
                Located in the heart of Surat's textile hub, MAKUMA specializes exclusively in ladies bottoms — primarily premium wide-leg jeans, palazzos, and formal trousers.
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
                <div style={{ padding: '20px', background: '#f9f9f9', borderRadius: '8px' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent)' }}>100%</div>
                  <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '8px' }}>In-house Quality Control</div>
                </div>
                <div style={{ padding: '20px', background: '#f9f9f9', borderRadius: '8px' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent)' }}>48h</div>
                  <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '8px' }}>Average Dispatch Time</div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="responsive-grid-2" style={{ marginTop: '100px', marginBottom: '40px' }}>
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h3 style={{ fontSize: '2rem', marginBottom: '16px' }}>B2B Partnership Philosophy</h3>
              <p style={{ color: '#555', fontSize: '1.1rem', lineHeight: '1.6' }}>
                We don't just sell products; we build long-term supply partnerships. When you stock MAKUMA, you're getting consistent sizing, reliable stock availability, and a product that your customers will love.
              </p>
              <ul style={{ listStyle: 'none', padding: 0, marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {['Low Minimum Order Quantities (MOQ)', 'Dedicated WhatsApp Support', 'High Margins for Retailers', 'Regular New Arrivals'].map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.05rem' }}>
                    <span style={{ color: 'var(--accent)' }}>✓</span> {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <img src="/images/product-03.jpeg" alt="B2B Wholesale" style={{ width: '100%', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-card)' }} />
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
