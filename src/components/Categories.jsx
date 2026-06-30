import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useScrollAnimation, scrollToSection } from '../hooks';
import { categoriesAPI } from '../services/api';

export default function Categories({ onFilterProducts }) {
  const [headerRef, headerVisible] = useScrollAnimation();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await categoriesAPI.list();
        setCategories(res.data);
      } catch (err) {
        setError('Failed to load categories');
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  return (
    <section className="categories" id="collections">
      <div className="container">
        <div
          ref={headerRef}
          className="section-header"
          style={{
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
          }}
        >
          <div className="section-tag">Browse By Category</div>
          <h2 className="section-title">Find Your Perfect Fit</h2>
          <p className="section-subtitle">From casual weekend vibes to office-ready elegance — we've got every style covered.</p>
        </div>

        <div className="categories-grid">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', gridColumn: '1 / -1' }}>Loading categories...</div>
          ) : error ? (
            <div style={{ textAlign: 'center', color: 'red', padding: '40px', gridColumn: '1 / -1' }}>{error}</div>
          ) : (
            categories.map((cat, i) => (
              <CategoryCard key={cat._id || cat.id} category={cat} index={i} onFilterProducts={onFilterProducts} />
            ))
          )}
        </div>
      </div>
    </section>
  );
}

function CategoryCard({ category, index, onFilterProducts }) {
  const [ref, isVisible] = useScrollAnimation();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/collections/${category._id || category.id}`);
  };

  return (
    <div
      ref={ref}
      className="category-card"
      onClick={handleClick}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
        transition: `opacity 0.6s ease ${index * 0.12}s, transform 0.6s ease ${index * 0.12}s`,
      }}
      id={`category-${category.slug || category.id}`}
    >
      {category.image ? (
        <img src={category.image} alt={category.name} loading="lazy" />
      ) : (
        <div className="image-placeholder">{category.name}</div>
      )}
      <div className="category-overlay">
        <span className="category-name">{category.name}</span>
        <span className="category-count">{category.productCount || category.count || 0} Products</span>
      </div>
      <div className="category-arrow">→</div>
    </div>
  );
}
