import { useState } from 'react';
import { motion } from 'framer-motion';
import { BRAND } from '../data/products';
import { inquiriesAPI } from '../services/api';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    business: '',
    phone: '',
    interest: 'Jeans',
    volume: '50-100 pcs',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await inquiriesAPI.submit(formData);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 5000);
      setFormData({ name: '', business: '', phone: '', interest: 'Wide Leg Jeans', volume: '50 - 100 pcs' });
    } catch (err) {
      setError(err.message || 'Failed to submit inquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section className="contact-page page-section" style={{ paddingTop: '160px', minHeight: '100vh', paddingBottom: '100px' }}>
      <div className="container">
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="section-tag">Partner With Us</div>
          <h2 className="section-title">Wholesale Inquiry</h2>
          <p className="section-subtitle">Become a MAKUMA retail partner. Fill the form below or contact us directly on WhatsApp.</p>
        </motion.div>

        <div className="contact-grid responsive-grid-2" style={{ marginTop: '60px' }}>
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div style={{ background: 'var(--bg-card)', padding: '40px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', marginBottom: '32px' }}>Dealer Registration Form</h3>
              
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Full Name</label>
                  <input type="text" name="name" required value={formData.name} onChange={handleChange} style={{ padding: '14px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} />
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Business / Boutique Name</label>
                  <input type="text" name="business" required value={formData.business} onChange={handleChange} style={{ padding: '14px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Email Address</label>
                  <input type="email" name="email" value={formData.email || ''} onChange={handleChange} style={{ padding: '14px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Phone Number / WhatsApp</label>
                  <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} style={{ padding: '14px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} />
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Interested Products</label>
                  <select name="interest" value={formData.interest} onChange={handleChange} style={{ padding: '14px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', WebkitAppearance: 'none' }}>
                    <option>Wide Leg Jeans</option>
                    <option>Embellished Jeans</option>
                    <option>Formal Trousers</option>
                    <option>Linen Palazzo</option>
                    <option>Mixed Catalog</option>
                  </select>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Expected Initial Volume</label>
                  <select name="volume" value={formData.volume} onChange={handleChange} style={{ padding: '14px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', WebkitAppearance: 'none' }}>
                    <option>50 - 100 pcs</option>
                    <option>100 - 300 pcs</option>
                    <option>300 - 500 pcs</option>
                    <option>500+ pcs</option>
                  </select>
                </div>
                
                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '16px' }} disabled={loading}>
                  {loading ? 'Submitting...' : submitted ? 'Inquiry Submitted!' : 'Request Wholesale Catalog'}
                </button>
                {error && <p style={{ color: 'red', marginTop: '10px', textAlign: 'center' }}>{error}</p>}
                {submitted && <p style={{ color: 'var(--accent)', marginTop: '10px', textAlign: 'center', fontWeight: '600' }}>Thank you! We will contact you shortly.</p>}
              </form>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
          >
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', marginBottom: '24px' }}>Get in Touch Directly</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '40px', fontSize: '1.05rem', lineHeight: '1.8' }}>
              Prefer to speak directly with our wholesale team? Reach out using the details below. We typically respond within 2 hours during business hours.
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--bg-card)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', color: 'var(--accent)' }}>📍</div>
                <div>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>Wholesale Warehouse</h4>
                  <p style={{ color: 'var(--text-secondary)' }}>{BRAND.location}</p>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--bg-card)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', color: 'var(--accent)' }}>📞</div>
                <div>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>Sales & Inquiry</h4>
                  <p style={{ color: 'var(--text-secondary)' }}>+91 {BRAND.phone.replace(/(\d{5})(\d{5})/, '$1 $2')}</p>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--bg-card)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', color: 'var(--accent)' }}>💬</div>
                <div>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>WhatsApp Business</h4>
                  <a href={BRAND.whatsappLink} target="_blank" rel="noopener noreferrer" style={{ color: '#25d366', fontWeight: '600' }}>Message Us Now →</a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
