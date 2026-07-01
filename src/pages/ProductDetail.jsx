import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BRAND } from '../data/products';
import { productsAPI } from '../services/api';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await productsAPI.get(id);
        setProduct(res.data);
      } catch (err) {
        setError('Product not found or failed to load.');
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  if (loading) {
    return <div style={{ paddingTop: '160px', minHeight: '100vh', textAlign: 'center' }}>Loading product details...</div>;
  }

  if (error || !product) {
    return (
      <div style={{ paddingTop: '160px', minHeight: '100vh', textAlign: 'center' }}>
        <h2>{error || 'Product Not Found'}</h2>
        <Link to="/collections" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>Back to Collections</Link>
      </div>
    );
  }

  const handleInquiry = () => {
    const text = `Hi MAKUMA Wholesale! I'm interested in bulk ordering *${product.name}*. Please share more details.`;
    window.open(`${BRAND.whatsappLink}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <section className="product-detail-page" style={{ paddingTop: '120px', minHeight: '100vh', paddingBottom: '100px', backgroundColor: '#f9f9f9' }}>
      <div className="container">
        
        <Link to="/collections" className="back-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', marginBottom: '30px', fontSize: '0.9rem', fontWeight: '500' }}>
          ← Back to Catalog
        </Link>

        <div className="amazon-layout-grid">
          {/* Left: Image Gallery */}
          <motion.div 
            className="product-detail-gallery"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="main-image-container" style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden' }}>
              {product.badge && (
                <div style={{ position: 'absolute', top: '16px', left: '16px', background: 'var(--accent)', color: '#fff', padding: '6px 14px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', zIndex: 2 }}>
                  {product.badge}
                </div>
              )}
              {product.image ? (
                <img src={product.image} alt={product.name} style={{ width: '100%', height: 'auto', display: 'block' }} />
              ) : (
                <div className="image-placeholder" style={{ width: '100%', aspectRatio: '3/4', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}>No Image</div>
              )}
            </div>
          </motion.div>
          
          {/* Middle: Product Details */}
          <motion.div 
            className="product-detail-info"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <span className="product-category" style={{ fontSize: '0.9rem', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600' }}>
                {product.categoryLabel || (product.category?.name)}
              </span>
            </div>
            
            <h1 className="product-name" style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: '700', marginBottom: '16px', lineHeight: '1.2' }}>
              {product.name}
            </h1>
            
            <div style={{ paddingBottom: '24px', borderBottom: '1px solid var(--border)', marginBottom: '24px' }}>
              <p className="product-description" style={{ fontSize: '1.05rem', color: '#555', lineHeight: '1.7' }}>
                {product.description || 'Premium quality wholesale ladies denim. Contact us for detailed fabric and fit specifications.'}
              </p>
            </div>

            {/* Colors */}
            {product.availableColors && product.availableColors.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: '600', marginBottom: '12px' }}>Available Colors: <span style={{ color: 'var(--text-secondary)', fontWeight: '400' }}>{selectedColor || 'Select a color'}</span></h4>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {product.availableColors.map(color => (
                    <button 
                      key={color} 
                      onClick={() => setSelectedColor(color)}
                      style={{ 
                        padding: '8px 16px', 
                        border: selectedColor === color ? '2px solid var(--text-primary)' : '1px solid var(--border)', 
                        background: selectedColor === color ? '#f5f5f5' : '#fff',
                        borderRadius: '4px', 
                        fontSize: '0.9rem',
                        fontWeight: selectedColor === color ? '600' : '400',
                        transition: 'all 0.2s'
                      }}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div style={{ marginBottom: '32px' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: '600', marginBottom: '12px' }}>Size Range: <span style={{ color: 'var(--text-secondary)', fontWeight: '400' }}>{selectedSize || 'Select a size'}</span></h4>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {product.sizes.map(size => (
                    <button 
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      style={{ 
                        width: '48px', height: '48px', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: selectedSize === size ? '2px solid var(--text-primary)' : '1px solid var(--border)', 
                        background: selectedSize === size ? '#f5f5f5' : '#fff',
                        borderRadius: '4px', 
                        fontSize: '0.95rem',
                        fontWeight: selectedSize === size ? '700' : '500',
                        transition: 'all 0.2s'
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: '8px', padding: '20px' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: 'var(--accent)' }}>★</span> Product Details
              </h4>
              <ul style={{ listStyle: 'none', display: 'grid', gap: '10px', fontSize: '0.95rem', color: '#555' }}>
                <li><strong>Material:</strong> Premium Denim</li>
                <li><strong>MOQ (Minimum Order):</strong> Varies by tier</li>
                <li><strong>Dispatch:</strong> Same day dispatch available</li>
                <li><strong>Quality:</strong> Export quality guaranteed</li>
              </ul>
            </div>
          </motion.div>

          {/* Right: Buy Box / Inquiry Box */}
          <motion.div 
            className="product-detail-buybox"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div style={{ background: '#fff', border: '1px solid var(--border-accent)', borderRadius: '8px', padding: '24px', position: 'sticky', top: '100px', boxShadow: 'var(--shadow-card)' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '8px' }}>Wholesale Inquiry</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '24px' }}>Contact us directly to get the best B2B rates for your boutique or retail store. Please mention your required quantity.</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button 
                  onClick={handleInquiry}
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center', padding: '16px', fontSize: '1rem', letterSpacing: '0.5px' }}
                >
                  Message on WhatsApp
                </button>
                <div style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                  Secure transaction via WhatsApp directly with MAKUMA sales team.
                </div>
              </div>
              
              <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border)', display: 'flex', gap: '12px', alignItems: 'center', fontSize: '0.85rem', color: '#555' }}>
                <div style={{ width: '32px', height: '32px', background: '#f5f5f5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>✓</div>
                100% Secure & Verified Supplier
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
