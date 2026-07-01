import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { productsAPI } from '../services/api';

export default function Collections() {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState(category || 'all');

  useEffect(() => {
    setActiveFilter(category || 'all');
  }, [category]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [prodRes, catRes] = await Promise.all([
          productsAPI.list('limit=100'),
          import('../services/api').then(m => m.categoriesAPI.list())
        ]);
        setProducts(prodRes.data);
        setCategories(catRes.data);
      } catch (err) {
        setError(err.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredProducts = activeFilter === 'all' 
    ? products 
    : products.filter(p => (p.category?._id || p.category) === activeFilter);

  return (
    <section className="products page-section" style={{ paddingTop: '160px', minHeight: '100vh', flex: 1 }}>
      <div className="container">
        <motion.div 
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="section-tag">Wholesale Jeans Catalog</div>
          <h2 className="section-title">Premium Denim Collection</h2>
          <p className="section-subtitle">Explore our complete range of high-margin ladies jeans ready for bulk dispatch.</p>
        </motion.div>

        {!loading && !error && categories.length > 0 && (
          <div className="product-filters" style={{ marginTop: '30px', marginBottom: '10px' }}>
            <button
              className={`filter-btn${activeFilter === 'all' ? ' active' : ''}`}
              onClick={() => setActiveFilter('all')}
            >
              All
            </button>
            {categories.map((c) => (
              <button
                key={c._id}
                className={`filter-btn${activeFilter === c._id ? ' active' : ''}`}
                onClick={() => setActiveFilter(c._id)}
              >
                {c.name}
              </button>
            ))}
          </div>
        )}

        <motion.div layout className="products-grid" style={{ marginTop: '30px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '100px 0', gridColumn: '1 / -1' }}>Loading products...</div>
          ) : error ? (
            <div style={{ textAlign: 'center', color: 'red', padding: '100px 0', gridColumn: '1 / -1' }}>{error}</div>
          ) : filteredProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '100px 0', gridColumn: '1 / -1' }}>No products found in this category.</div>
          ) : (
            <AnimatePresence>
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id || product._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="product-card wholesale-card"
                >
                  <Link to={`/product/${product.id || product._id}`} style={{ display: 'block' }}>
                    <div className="product-image">
                      {product.image ? (
                        <img src={product.image} alt={product.name} loading="lazy" />
                      ) : (
                        <div className="image-placeholder">{product.name}</div>
                      )}
                    </div>
                    <div className="product-info">
                      <div className="product-category">{product.categoryLabel}</div>
                      <h3 className="product-name">{product.name}</h3>
                      {product.description && (
                        <p className="product-description" style={{ fontSize: '0.9rem', color: '#666', marginTop: '8px', lineHeight: '1.4' }}>
                          {product.description}
                        </p>
                      )}
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </motion.div>
      </div>
    </section>
  );
}
