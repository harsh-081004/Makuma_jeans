import { useScrollAnimation } from '../hooks';
import { BRAND, FEATURES, TESTIMONIALS } from '../data/products';


/* ── Features Section ── */
export function FeaturesSection() {
  const [headerRef, headerVisible] = useScrollAnimation();

  return (
    <section className="features">
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
          <div className="section-tag">Why MAKUMA</div>
          <h2 className="section-title">The MAKUMA Promise</h2>
          <p className="section-subtitle">We don't just sell bottoms — we deliver confidence.</p>
        </div>

        <div className="features-grid">
          {FEATURES.map((feature, i) => (
            <FeatureCard key={i} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ feature, index }) {
  const [ref, isVisible] = useScrollAnimation();

  return (
    <div
      ref={ref}
      className="feature-card"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
        transition: `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`,
      }}
    >
      <div className="feature-icon">{feature.icon}</div>
      <h3 className="feature-title">{feature.title}</h3>
      <p className="feature-text">{feature.text}</p>
    </div>
  );
}

/* ── Testimonials Section ── */
export function TestimonialsSection() {
  const [headerRef, headerVisible] = useScrollAnimation();

  return (
    <section className="testimonials">
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
          <div className="section-tag">Customer Love</div>
          <h2 className="section-title">What Our Customers Say</h2>
          <p className="section-subtitle">Real reviews from real customers who wear MAKUMA with confidence.</p>
        </div>

        <div className="testimonials-grid">
          {TESTIMONIALS.map((t, i) => (
            <TestimonialCard key={t.id} testimonial={t} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ testimonial, index }) {
  const [ref, isVisible] = useScrollAnimation();

  return (
    <div
      ref={ref}
      className="testimonial-card"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
        transition: `opacity 0.6s ease ${index * 0.12}s, transform 0.6s ease ${index * 0.12}s`,
      }}
    >
      <div className="testimonial-stars">
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <span key={i}>★</span>
        ))}
      </div>
      <p className="testimonial-text">{testimonial.text}</p>
      <div className="testimonial-author">
        <div className="testimonial-avatar">{testimonial.initial}</div>
        <div>
          <div className="testimonial-name">{testimonial.name}</div>
          <div className="testimonial-location">{testimonial.location}</div>
        </div>
      </div>
    </div>
  );
}

