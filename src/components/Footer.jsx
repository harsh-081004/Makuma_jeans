import { useState } from 'react';
import { useScrollAnimation } from '../hooks';
import { BRAND } from '../data/products';
import { MessageCircle, MapPin, Phone, Clock, ArrowUp } from 'lucide-react';

/* ── Newsletter Section ── */
export function Newsletter() {
  const [ref, isVisible] = useScrollAnimation();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setEmail('');
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <section className="newsletter" style={{ background: 'var(--bg-secondary)', padding: '80px 0', borderTop: '1px solid var(--border)' }}>
      <div className="container">
        <div
          ref={ref}
          className="newsletter-box"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
            textAlign: 'center',
            maxWidth: '600px',
            margin: '0 auto'
          }}
        >
          <h2 className="newsletter-title" style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', marginBottom: '16px' }}>Join the MAKUMA B2B Network</h2>
          <p className="newsletter-subtitle" style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Subscribe for wholesale catalog updates, exclusive B2B offers, and new arrivals.</p>
          <form className="newsletter-form" onSubmit={handleSubmit} id="newsletter-form" style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <input
              type="email"
              placeholder="Enter your business email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              id="newsletter-email"
              style={{ flex: 1, maxWidth: '350px', padding: '14px 20px', borderRadius: '4px', border: '1px solid var(--border)', fontSize: '1rem' }}
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '14px 32px' }}>
              {submitted ? 'Subscribed!' : 'Subscribe'}
            </button>
          </form>
          {submitted && <p className="success-msg" style={{ color: 'var(--accent)', marginTop: 16, fontWeight: '600' }}>Welcome to the network! ✦</p>}
        </div>
      </div>
    </section>
  );
}

/* ── Footer ── */
export function Footer() {
  const quickLinks = [
    { label: 'Home', id: '' },
    { label: 'Wholesale Catalog', id: 'collections' },
    { label: 'Lookbook', id: 'lookbook' },
    { label: 'About Manufacturer', id: 'about' },
  ];

  const categories = [
    'Wide Leg Jeans',
    'Embellished Jeans',
    'Flare Jeans',
    'Formal Trousers',
    'Linen Palazzo',
  ];

  return (
    <footer className="footer" id="contact" style={{ background: '#0a0a0a', color: '#ffffff', paddingTop: '80px', paddingBottom: '40px', borderTop: '4px solid var(--accent)' }}>
      <div className="container">
        <div className="footer-top" style={{ marginBottom: '60px' }}>
          
          <div className="footer-brand">
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: 'var(--accent)', letterSpacing: '2px', marginBottom: '16px' }}>
              MAKUMA
            </h2>
            <p style={{ color: '#aaaaaa', lineHeight: '1.8', marginBottom: '24px', maxWidth: '300px' }}>
              {BRAND.tagline} Premium ladies bottoms crafted in Surat, delivered securely across India.
            </p>
            <div className="footer-socials" style={{ display: 'flex', gap: '16px' }}>
              <a className="footer-social" href="https://www.instagram.com/makuma_jeans_wold?utm_source=qr" title="Instagram" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--bg-primary)', background: 'var(--text-primary)', padding: '10px', borderRadius: '50%', display: 'flex', border: '1px solid var(--border)' }}>IG</a>
              <a className="footer-social" href={BRAND.whatsappLink} title="WhatsApp" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--bg-primary)', background: 'var(--text-primary)', padding: '10px', borderRadius: '50%', display: 'flex', border: '1px solid var(--border)' }}>WA</a>
            </div>
          </div>

          <div className="footer-col">
            <h4 style={{ fontSize: '1.1rem', marginBottom: '24px', color: '#fff', textTransform: 'uppercase', letterSpacing: '1px' }}>Company</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {quickLinks.map((link) => (
                <li key={link.id}><a href={`/${link.id}`} style={{ color: '#aaaaaa', transition: 'color 0.3s' }} onMouseOver={e => e.target.style.color = 'var(--accent)'} onMouseOut={e => e.target.style.color = '#aaaaaa'}>{link.label}</a></li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h4 style={{ fontSize: '1.1rem', marginBottom: '24px', color: '#fff', textTransform: 'uppercase', letterSpacing: '1px' }}>Catalog</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {categories.map((cat, i) => (
                <li key={i}><a href="/collections" style={{ color: '#aaaaaa', transition: 'color 0.3s' }} onMouseOver={e => e.target.style.color = 'var(--accent)'} onMouseOut={e => e.target.style.color = '#aaaaaa'}>{cat}</a></li>
              ))}
            </ul>
          </div>

          <div className="footer-col">
            <h4 style={{ fontSize: '1.1rem', marginBottom: '24px', color: '#fff', textTransform: 'uppercase', letterSpacing: '1px' }}>Contact Hub</h4>
            <div className="footer-contact-item" style={{ display: 'flex', gap: '12px', marginBottom: '16px', color: '#aaaaaa' }}>
              <MapPin size={20} color="var(--accent)" style={{ flexShrink: 0 }} />
              <span>{BRAND.location}</span>
            </div>
            <div className="footer-contact-item" style={{ display: 'flex', gap: '12px', marginBottom: '16px', color: '#aaaaaa' }}>
              <Phone size={20} color="var(--accent)" style={{ flexShrink: 0 }} />
              <a href={`tel:+91${BRAND.phone}`}>+91 {BRAND.phone.replace(/(\d{5})(\d{5})/, '$1 $2')}</a>
            </div>
            <div className="footer-contact-item" style={{ display: 'flex', gap: '12px', marginBottom: '16px', color: '#aaaaaa' }}>
              <Clock size={20} color="var(--accent)" style={{ flexShrink: 0 }} />
              <span>{BRAND.hours}</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom" style={{ borderTop: '1px solid #222', paddingTop: '24px', color: '#777', fontSize: '0.9rem' }}>
          <p>&copy; {new Date().getFullYear()} {BRAND.name}. All B2B rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="/admin/login" style={{ transition: 'color 0.3s' }} onMouseOver={e => e.target.style.color = 'white'} onMouseOut={e => e.target.style.color = '#777'}>Admin Portal</a>
            <a href="#" style={{ transition: 'color 0.3s' }} onMouseOver={e => e.target.style.color = 'white'} onMouseOut={e => e.target.style.color = '#777'}>Privacy Policy</a>
            <a href="#" style={{ transition: 'color 0.3s' }} onMouseOver={e => e.target.style.color = 'white'} onMouseOut={e => e.target.style.color = '#777'}>Terms & Conditions</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ── Floating WhatsApp & Back To Top ── */
export function FloatingElements() {
  const [showBackToTop, setShowBackToTop] = useState(false);

  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', () => {
      setShowBackToTop(window.scrollY > 600);
    }, { passive: true });
  }

  return (
    <>
      <div className="whatsapp-float">
        <a
          href={`${BRAND.whatsappLink}?text=${encodeURIComponent("Hi MAKUMA! I want to inquire about wholesale orders.")}`}
          className="whatsapp-btn"
          target="_blank"
          rel="noopener noreferrer"
          title="Chat on WhatsApp"
        >
          <MessageCircle size={32} fill="white" />
        </a>
      </div>

      <button
        className={`back-to-top${showBackToTop ? ' visible' : ''}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        title="Back to Top"
      >
        <ArrowUp size={24} />
      </button>
    </>
  );
}
