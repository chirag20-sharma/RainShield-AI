import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/auth.css';

export default function Login() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [form, setForm]   = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res  = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.status === 'success') { login(data.user, data.token); navigate('/dashboard'); }
      else setError(data.message || 'Login failed');
    } catch { setError('Server error. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="auth-container">
      {/* Left */}
      <div className="auth-left">
        <div className="brand-mark">
          <div className="brand-icon">🌧</div>
          <span className="brand-name">RainShield AI</span>
        </div>
        <h1>Protect your income<br /><span>before the storm hits.</span></h1>
        <p>India's first AI-powered parametric insurance for gig workers. Get paid automatically when weather disrupts your work.</p>
        <div className="feature-list">
          {[
            'Real-time income loss prediction',
            'Automatic claim generation',
            'Instant payout processing',
            'Fraud-proof AI verification',
          ].map(f => (
            <div key={f} className="feature-item">
              <div className="feature-dot" />
              {f}
            </div>
          ))}
        </div>
      </div>

      {/* Right */}
      <div className="auth-right">
        <div className="auth-form-wrap">
          <h2>Welcome back</h2>
          <p className="auth-subtitle">Sign in to your protection account</p>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email address</label>
              <input type="email" required placeholder="you@example.com"
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" required placeholder="Enter your password"
                value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
            </div>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="auth-link">
            New to RainShield? <Link to="/register">Create account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
