import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import { Footer, FloatingElements } from './Footer';

export default function Layout() {
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="layout">
      <Header />
      
      <main className="main-content">
        <Outlet />
      </main>

      <Footer />
      <FloatingElements />
    </div>
  );
}
