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
    <section className="product-detail-page" style={{ paddingTop: '120px', minHeight: '100vh', paddingBottom: '100px' }}>
      <div className="container">
        
        <Link to="/collections" className="back-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', marginBottom: '40px', fontSize: '0.9rem' }}>
          ← Back to Catalog
        </Link>

        <div className="product-detail-grid">
          <motion.div 
            className="product-detail-image"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {product.image ? (
              <img src={product.image} alt={product.name} style={{ width: '100%', borderRadius: 'var(--radius-lg)', objectFit: 'cover', aspectRatio: '3/4' }} />
            ) : (
              <div className="image-placeholder" style={{ width: '100%', borderRadius: 'var(--radius-lg)', aspectRatio: '3/4', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>{product.name}</div>
            )}
          </motion.div>
          
          <motion.div 
            className="product-detail-content"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="product-category" style={{ fontSize: '0.85rem', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '600', marginBottom: '12px' }}>
              {product.categoryLabel}
            </div>
            
            <h1 className="product-name" style={{ fontFamily: 'var(--font-heading)', fontSize: '2.4rem', fontWeight: '700', marginBottom: '16px', lineHeight: '1.2' }}>
              {product.name}
            </h1>
            
            <p className="product-description" style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: '1.8', marginBottom: '32px' }}>
              {product.description}
            </p>

            <div className="wholesale-box" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-accent)', borderRadius: 'var(--radius-md)', padding: '32px', marginBottom: '32px' }}>
              <div className="wholesale-box-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--border)' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--accent)' }}>Bulk Pricing</h3>
              </div>
              
              <div className="pricing-tiers">
                {product.bulkPricing.map((tier, idx) => (
                  <div key={idx} className="pricing-tier" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '1.05rem' }}>
                    <span className="tier-range" style={{ color: 'var(--text-secondary)' }}>
                      {tier.max ? `${tier.min} - ${tier.max} pcs` : `${tier.min}+ pcs`}
                    </span>
                    <span className="tier-price" style={{ fontWeight: '700', color: 'var(--text-primary)' }}>
                      ₹{tier.price} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>/pc</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="product-meta-details" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '40px' }}>
              <div>
                <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>Available Colors</h4>
                <p style={{ fontSize: '0.95rem' }}>{product.availableColors.join(', ')}</p>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '8px' }}>Size Range</h4>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {product.sizes.map(size => (
                    <span key={size} style={{ padding: '6px 12px', border: '1px solid var(--border)', borderRadius: '4px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{size}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="product-actions" style={{ display: 'flex', gap: '16px' }}>
              <a 
                href={`${BRAND.whatsappLink}?text=${whatsappMsg}`}
                className="btn btn-primary"
                style={{ flex: 1, justifyContent: 'center' }}
                target="_blank"
                rel="noopener noreferrer"
              >
                Request Wholesale Quote
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
