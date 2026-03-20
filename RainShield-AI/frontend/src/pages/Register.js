import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/auth.css';

const INDIAN_CITIES = [
  'Agartala','Agra','Ahmedabad','Ahmednagar','Ajmer','Akola','Aligarh','Allahabad',
  'Amravati','Amritsar','Asansol','Aurangabad','Avadi','Bareilly','Belgaum','Bellary',
  'Bhagalpur','Bhavnagar','Bhilai','Bhilwara','Bhopal','Bhubaneswar','Bikaner','Bilaspur',
  'Bokaro','Brahmapur','Chandigarh','Chennai','Coimbatore','Cuttack','Davangere','Dehradun',
  'Delhi','Dhanbad','Dhule','Dispur','Durgapur','Erode','Faridabad','Firozabad',
  'Gangtok','Gaya','Ghaziabad','Gorakhpur','Gulbarga','Guntur','Gurugram','Guwahati',
  'Gwalior','Haridwar','Howrah','Hubli','Hyderabad','Imphal','Indore','Itanagar',
  'Jabalpur','Jaipur','Jaisalmer','Jalandhar','Jammu','Jamnagar','Jamshedpur','Jhansi',
  'Jodhpur','Kadapa','Kakinada','Kanpur','Kargil','Kochi','Kohima','Kolhapur',
  'Kolkata','Korba','Kota','Kozhikode','Kurnool','Latur','Leh','Lucknow',
  'Ludhiana','Madurai','Manali','Mangalore','Mathura','Meerut','Moradabad','Mumbai',
  'Muzaffarpur','Muzaffarnagar','Mysuru','Nagpur','Nashik','Nanded','Noida','Panaji',
  'Patna','Patiala','Port Blair','Puducherry','Pune','Rajkot','Rampur','Ranchi',
  'Raipur','Rohtak','Salem','Saharanpur','Sangli','Shahjahanpur','Shillong','Shimla',
  'Siliguri','Solapur','Srinagar','Surat','Thiruvananthapuram','Thrissur','Tirupati',
  'Tiruchirappalli','Tirunelveli','Udaipur','Ujjain','Vadodara','Varanasi','Vijayawada',
  'Visakhapatnam','Warangal',
].sort();

export default function Register() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: '',
    city: 'Mumbai', normalDailyIncome: 600,
    vehicleType: 'bike', platform: 'zomato',
  });
  const [citySearch, setCitySearch] = useState('');
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const filtered = citySearch
    ? INDIAN_CITIES.filter(c => c.toLowerCase().includes(citySearch.toLowerCase()))
    : INDIAN_CITIES;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res  = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.status === 'success') { login(data.user, data.token); navigate('/dashboard'); }
      else setError(data.message || 'Registration failed');
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
        <h1>Your income,<br /><span>protected by AI.</span></h1>
        <p>Join thousands of delivery workers across India who get automatic payouts when weather disrupts their work — no paperwork, no waiting.</p>
        <div className="feature-list">
          {[
            'Coverage in 60 seconds',
            'AI risk score on signup',
            'Auto-claim on disruption',
            'Supports 130+ Indian cities',
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
        <div className="auth-form-wrap" style={{ maxWidth: 520 }}>
          <h2>Create account</h2>
          <p className="auth-subtitle">Get protected in under a minute</p>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" required placeholder="Rahul Kumar"
                  value={form.name} onChange={e => set('name', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input type="tel" placeholder="9876543210"
                  value={form.phone} onChange={e => set('phone', e.target.value)} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Email</label>
                <input type="email" required placeholder="you@example.com"
                  value={form.email} onChange={e => set('email', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input type="password" required placeholder="Min 6 characters"
                  value={form.password} onChange={e => set('password', e.target.value)} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>City</label>
                <div className="city-selected">Selected: {form.city}</div>
                <input type="text" placeholder="Search city..."
                  value={citySearch} onChange={e => setCitySearch(e.target.value)} />
                <select size={4} value={form.city}
                  onChange={e => { set('city', e.target.value); setCitySearch(''); }}
                  style={{ marginTop: 4, height: 'auto' }}>
                  {filtered.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Daily Income (Rs.)</label>
                <input type="number" min="100" max="5000"
                  value={form.normalDailyIncome} onChange={e => set('normalDailyIncome', +e.target.value)} />
                <label style={{ marginTop: 12 }}>Vehicle</label>
                <select value={form.vehicleType} onChange={e => set('vehicleType', e.target.value)}>
                  <option value="bike">Bike</option>
                  <option value="cycle">Cycle</option>
                  <option value="foot">On Foot</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Delivery Platform</label>
              <select value={form.platform} onChange={e => set('platform', e.target.value)}>
                <option value="zomato">Zomato</option>
                <option value="swiggy">Swiggy</option>
                <option value="dunzo">Dunzo</option>
                <option value="other">Other</option>
              </select>
            </div>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account & Get Protected'}
            </button>
          </form>

          <p className="auth-link">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
