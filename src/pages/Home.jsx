import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Categories from '../components/Categories';
import { FeaturesSection } from '../components/Sections';
import { settingsAPI } from '../services/api';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
};

export default function Home() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    settingsAPI.get().then(res => setSettings(res.data)).catch(() => {});
  }, []);

  const heroImage = settings?.heroImage || '';

  return (
    <>
      <section className="hero-clean" style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', background: '#fff', paddingTop: '100px', position: 'relative', overflow: 'hidden' }}>
        
        {/* 3D Floating Elements */}
        <motion.div
          animate={{ y: [0, -30, 0], rotate: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
          style={{ position: 'absolute', top: '15%', left: '5%', width: '150px', height: '150px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(200,180,100,0.15) 0%, rgba(255,255,255,0) 70%)', filter: 'blur(10px)', zIndex: 0 }}
        />
        <motion.div
          animate={{ y: [0, 40, 0], x: [0, 20, 0] }}
          transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
          style={{ position: 'absolute', bottom: '10%', right: '10%', width: '250px', height: '250px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(150,150,150,0.1) 0%, rgba(255,255,255,0) 70%)', filter: 'blur(20px)', zIndex: 0 }}
        />

        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center', position: 'relative', zIndex: 1 }}>
          
          <motion.div 
            className="hero-text"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
          >
            <motion.div variants={fadeInUp} style={{ color: 'var(--accent)', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '20px', fontSize: '0.9rem' }}>
              {settings?.heroSubtitle || "Surat's Premium Wholesaler"}
            </motion.div>
            
            <motion.h1 variants={fadeInUp} style={{ fontSize: 'clamp(3rem, 5vw, 4.5rem)', lineHeight: '1.1', marginBottom: '30px', color: '#000' }}>
              {settings?.heroTitle ? (
                <div dangerouslySetInnerHTML={{ __html: settings.heroTitle.replace(/\\n/g, '<br/>') }} />
              ) : (
                <>Redefining <br/><span style={{ fontStyle: 'italic', fontWeight: '400' }}>Ladies Denim</span></>
              )}
            </motion.h1>
            
            <motion.p variants={fadeInUp} style={{ fontSize: '1.1rem', color: '#666', marginBottom: '40px', maxWidth: '450px', lineHeight: '1.6' }}>
              {settings?.heroDescription || 'Supply your boutique with our premium collection of wide-leg jeans, trousers, and palazzos. Exceptional quality at unbeatable wholesale pricing.'}
            </motion.p>
            
            <motion.div variants={fadeInUp} style={{ display: 'flex', gap: '16px' }}>
              <Link to="/collections" className="btn" style={{ background: '#000', color: '#fff', padding: '16px 36px', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>
                Shop Wholesale
              </Link>
              <Link to="/contact" className="btn" style={{ background: '#fff', color: '#000', border: '1px solid #000', padding: '16px 36px' }}>
                Inquire Now
              </Link>
            </motion.div>
          </motion.div>

          <motion.div 
            className="hero-image-wrapper"
            initial={{ opacity: 0, scale: 0.9, rotateY: 10 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            style={{ position: 'relative', perspective: '1000px' }}
          >
            <motion.div 
              style={{ transformStyle: 'preserve-3d' }}
              whileHover={{ scale: 1.03, y: -10 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {heroImage ? (
                <img 
                  src={heroImage} 
                  alt="Premium Ladies Denim" 
                  style={{ width: '100%', height: 'auto', maxHeight: '80vh', objectFit: 'contain', borderRadius: '8px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', background: '#f9f9f9' }}
                />
              ) : (
                <div style={{ width: '100%', height: '70vh', background: '#f5f5f5', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa' }}>
                  No Hero Image Uploaded
                </div>
              )}
              
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
                style={{ position: 'absolute', bottom: '-20px', left: '-20px', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', padding: '24px', border: '1px solid rgba(255,255,255,0.5)', borderRadius: '12px', boxShadow: '0 15px 35px rgba(0,0,0,0.1)', transform: 'translateZ(30px)' }}
              >
                <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--accent)', lineHeight: '1', background: 'linear-gradient(45deg, var(--accent), #ff9c3a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>500+</div>
                <div style={{ fontSize: '0.85rem', color: '#666', textTransform: 'uppercase', marginTop: '8px', letterSpacing: '1px', fontWeight: '600' }}>Retail Partners</div>
              </motion.div>
            </motion.div>
          </motion.div>
          
        </div>
      </section>

      {/* Brand Marquee */}
      <div className="brand-strip" style={{ background: 'var(--accent)', color: '#000', marginTop: '60px' }}>
        <div className="brand-strip-track">
          {[...Array(2)].fill(['MAKUMA WHOLESALE', 'B2B SUPPLY', 'PREMIUM DENIM', 'DIRECT WAREHOUSE', 'HIGH MARGINS']).flat().map((word, i) => (
            <span key={i} className="brand-strip-item" style={{ fontSize: '1.2rem', padding: '0 50px' }}>{word}</span>
          ))}
        </div>
      </div>

      <Categories onFilterProducts={() => {}} />
      <FeaturesSection />
    </>
  );
}
