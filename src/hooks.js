import { useState, useEffect, useRef, useCallback } from 'react';

// ── Custom hook for scroll-triggered animations ──
export function useScrollAnimation(threshold = 0.1) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(node);
        }
      },
      { threshold, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(node);
    return () => observer.unobserve(node);
  }, [threshold]);

  return [ref, isVisible];
}

// ── Custom hook for counter animation ──
export function useCounterAnimation(end, duration = 1500, trigger = true) {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!trigger || hasAnimated.current) return;
    hasAnimated.current = true;

    let startTime = null;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [end, duration, trigger]);

  return count;
}

// ── Custom hook for header scroll ──
export function useHeaderScroll() {
  const [scrolled, setScrolled] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
      setShowBackToTop(window.scrollY > 600);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return { scrolled, showBackToTop };
}

// ── Sanitize text to prevent XSS ──
export function sanitize(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ── Format price ──
export function formatPrice(price) {
  return `₹${price.toLocaleString('en-IN')}`;
}

// ── Calculate discount percentage ──
export function calcDiscount(original, current) {
  return Math.round(((original - current) / original) * 100);
}

// ── Scroll to element by ID ──
export function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) {
    const headerHeight = 100;
    const top = el.getBoundingClientRect().top + window.scrollY - headerHeight;
    window.scrollTo({ top, behavior: 'smooth' });
  }
}
