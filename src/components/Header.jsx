import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useHeaderScroll } from '../hooks';
import { BRAND } from '../data/products';

export default function Header() {
  const { scrolled } = useHeaderScroll();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    document.body.style.overflow = menuOpen ? '' : 'hidden';
  };

  const closeMenu = () => {
    setMenuOpen(false);
    document.body.style.overflow = '';
  };

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Collections', path: '/collections' },
    { label: 'Lookbook', path: '/lookbook' },
    { label: 'About', path: '/about' },
  ];

  return (
    <>
      {/* Announcement Bar Removed */}

      {/* Header */}
      <header className={`header${scrolled ? ' scrolled' : ''}`} id="site-header">
        <div className="container">
          <nav className="nav">
            <Link to="/" className="nav-logo" onClick={closeMenu} id="nav-logo">
              <img src="/images/logo.jpeg" alt={`${BRAND.name} Logo`} />
              <span className="nav-logo-text">{BRAND.name}</span>
            </Link>

            <div className={`nav-links${menuOpen ? ' active' : ''}`} id="nav-links">
              {navItems.map((item) => (
                <NavLink 
                  key={item.path} 
                  to={item.path} 
                  onClick={closeMenu}
                  className={({ isActive }) => isActive ? 'active' : ''}
                  end={item.path === '/'}
                >
                  {item.label}
                </NavLink>
              ))}
              <Link
                to="/contact"
                className="nav-cta"
                onClick={closeMenu}
                id="nav-contact-btn"
              >
                Wholesale Inquiry
              </Link>
            </div>

            <button
              className={`nav-toggle${menuOpen ? ' active' : ''}`}
              onClick={toggleMenu}
              aria-label="Toggle navigation menu"
              id="nav-toggle"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </nav>
        </div>
      </header>
    </>
  );
}
