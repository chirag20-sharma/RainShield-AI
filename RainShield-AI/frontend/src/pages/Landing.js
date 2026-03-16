import { Link } from 'react-router-dom';
import '../styles/landing.css';

const features = [
  { icon: '⚡', title: 'Instant Payouts', desc: 'Automatic payouts when weather triggers are met. No manual claims needed.' },
  { icon: '🤖', title: 'AI-Powered', desc: 'Predict income loss before it happens using real-time weather & traffic data.' },
  { icon: '🛡️', title: 'Parametric Cover', desc: 'Pre-defined triggers mean zero paperwork and zero disputes.' },
  { icon: '💰', title: 'Affordable', desc: 'Weekly premiums starting at just ₹20. Cancel anytime.' },
];

const triggers = [
  { icon: '🌧️', condition: 'Heavy Rainfall', threshold: '> 60 mm/day', payout: '₹200' },
  { icon: '🌡️', condition: 'Extreme Heat', threshold: '> 42 °C', payout: '₹150' },
  { icon: '💨', condition: 'Severe Pollution', threshold: 'AQI > 300', payout: '₹150' },
  { icon: '🚦', condition: 'Traffic Congestion', threshold: '> 80% delay', payout: '₹100' },
];

const steps = [
  { num: '01', title: 'Register & Onboard', desc: 'Enter your city, platform, and average daily income in under 2 minutes.' },
  { num: '02', title: 'Buy Weekly Policy', desc: 'AI calculates your risk score and suggests the right coverage for ₹20–₹50/week.' },
  { num: '03', title: 'We Monitor 24/7', desc: 'Our system watches weather, AQI, and traffic data around the clock.' },
  { num: '04', title: 'Get Paid Instantly', desc: 'When a trigger fires, your payout is processed automatically via UPI.' },
];

const testimonials = [
  { name: 'Rahul K.', city: 'Mumbai', platform: 'Zomato', quote: 'Last monsoon I lost 3 days of income. With RainShield I got ₹600 automatically. No forms, no calls.' },
  { name: 'Priya S.', city: 'Delhi', platform: 'Swiggy', quote: 'The heat wave payout saved me during May. I didn\'t even have to apply — it just came.' },
  { name: 'Arjun M.', city: 'Bangalore', platform: 'Dunzo', quote: 'Finally something built for us. ₹30 a week is nothing compared to what I could lose.' },
];

export default function Landing() {
  return (
    <div className="landing">

      {/* Navbar */}
      <nav className="land-nav">
        <div className="land-nav-inner">
          <div className="land-logo">🌧️ RainShield AI</div>
          <div className="land-nav-links">
            <a href="#how">How it works</a>
            <a href="#triggers">Coverage</a>
            <a href="#testimonials">Stories</a>
          </div>
          <div className="land-nav-actions">
            <Link to="/login" className="btn-ghost">Sign In</Link>
            <Link to="/register" className="btn-solid">Get Protected →</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-badge">🏆 Built for India's 15M+ Gig Workers</div>
        <h1 className="hero-title">
          Protect Your Income<br />
          <span className="hero-highlight">From Climate Shocks</span>
        </h1>
        <p className="hero-sub">
          AI-powered parametric insurance for delivery workers.<br />
          When rain stops your rides — we pay you automatically.
        </p>
        <div className="hero-actions">
          <Link to="/register" className="btn-hero-primary">Start for ₹20/week →</Link>
          <a href="#how" className="btn-hero-ghost">See how it works</a>
        </div>
        <div className="hero-stats">
          <div className="hstat"><span className="hstat-val">₹200</span><span className="hstat-label">Rain payout</span></div>
          <div className="hstat-divider" />
          <div className="hstat"><span className="hstat-val">&lt; 2 min</span><span className="hstat-label">Payout time</span></div>
          <div className="hstat-divider" />
          <div className="hstat"><span className="hstat-val">0</span><span className="hstat-label">Forms to fill</span></div>
          <div className="hstat-divider" />
          <div className="hstat"><span className="hstat-val">24/7</span><span className="hstat-label">Monitoring</span></div>
        </div>
      </section>

      {/* Features */}
      <section className="section">
        <div className="section-inner">
          <div className="features-grid">
            {features.map(f => (
              <div key={f.title} className="feature-card">
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section section-dark" id="how">
        <div className="section-inner">
          <div className="section-label">HOW IT WORKS</div>
          <h2 className="section-title">From signup to payout in 4 steps</h2>
          <div className="steps-grid">
            {steps.map(s => (
              <div key={s.num} className="step-card">
                <div className="step-num">{s.num}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Triggers / Coverage */}
      <section className="section" id="triggers">
        <div className="section-inner">
          <div className="section-label">COVERAGE</div>
          <h2 className="section-title">What triggers your payout?</h2>
          <p className="section-sub">Pre-defined environmental thresholds. When crossed, you get paid — automatically.</p>
          <div className="triggers-grid">
            {triggers.map(t => (
              <div key={t.condition} className="trigger-card">
                <div className="trigger-icon">{t.icon}</div>
                <div className="trigger-info">
                  <div className="trigger-condition">{t.condition}</div>
                  <div className="trigger-threshold">{t.threshold}</div>
                </div>
                <div className="trigger-payout">{t.payout}</div>
              </div>
            ))}
          </div>
          <p className="trigger-note">Maximum weekly payout: <strong>₹1,000</strong> · Paid via UPI within minutes</p>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section section-dark" id="testimonials">
        <div className="section-inner">
          <div className="section-label">WORKER STORIES</div>
          <h2 className="section-title">Real workers. Real payouts.</h2>
          <div className="testimonials-grid">
            {testimonials.map(t => (
              <div key={t.name} className="testimonial-card">
                <p className="testimonial-quote">"{t.quote}"</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">{t.name[0]}</div>
                  <div>
                    <div className="testimonial-name">{t.name}</div>
                    <div className="testimonial-meta">{t.platform} · {t.city}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="section-inner" style={{ textAlign: 'center' }}>
          <h2 className="cta-title">Ready to protect your income?</h2>
          <p className="cta-sub">Join thousands of gig workers already protected by RainShield AI.</p>
          <Link to="/register" className="btn-hero-primary">Get Protected for ₹20/week →</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="land-footer">
        <div className="land-footer-inner">
          <div className="land-logo">🌧️ RainShield AI</div>
          <p className="footer-tagline">Protecting gig workers from climate income shocks.</p>
          <p className="footer-copy">© 2024 RainShield AI · Built for India's gig economy</p>
        </div>
      </footer>

    </div>
  );
}
