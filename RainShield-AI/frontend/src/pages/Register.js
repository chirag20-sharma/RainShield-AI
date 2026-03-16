import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/auth.css';

const INDIAN_CITIES = [
  // Metro & Tier-1
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad',
  // Tier-2
  'Surat', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Bhopal', 'Visakhapatnam',
  'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik', 'Faridabad', 'Meerut',
  'Rajkot', 'Varanasi', 'Srinagar', 'Aurangabad', 'Dhanbad', 'Amritsar', 'Allahabad',
  'Ranchi', 'Howrah', 'Coimbatore', 'Jabalpur', 'Gwalior', 'Vijayawada', 'Jodhpur',
  'Madurai', 'Raipur', 'Kota', 'Chandigarh', 'Guwahati', 'Solapur', 'Hubli',
  'Tiruchirappalli', 'Bareilly', 'Aligarh', 'Moradabad', 'Mysuru', 'Gurugram', 'Noida',
  'Jalandhar', 'Bhubaneswar', 'Salem', 'Warangal', 'Guntur', 'Bhiwandi', 'Saharanpur',
  'Gorakhpur', 'Bikaner', 'Amravati', 'Noida', 'Jamshedpur', 'Bhilai', 'Cuttack',
  'Firozabad', 'Kochi', 'Bhavnagar', 'Dehradun', 'Durgapur', 'Asansol', 'Nanded',
  'Kolhapur', 'Ajmer', 'Akola', 'Gulbarga', 'Jamnagar', 'Ujjain', 'Loni', 'Siliguri',
  'Jhansi', 'Ulhasnagar', 'Jammu', 'Sangli', 'Mangalore', 'Erode', 'Belgaum',
  'Ambattur', 'Tirunelveli', 'Malegaon', 'Gaya', 'Udaipur', 'Kakinada', 'Davanagere',
  'Kozhikode', 'Kurnool', 'Rajpur Sonarpur', 'Bokaro', 'South Dumdum', 'Bellary',
  'Patiala', 'Gopalpur', 'Agartala', 'Bhagalpur', 'Muzaffarnagar', 'Bhatpara',
  'Panihati', 'Latur', 'Dhule', 'Rohtak', 'Korba', 'Bhilwara', 'Brahmapur',
  'Muzaffarpur', 'Ahmednagar', 'Mathura', 'Kollam', 'Avadi', 'Kadapa', 'Kamarhati',
  'Bilaspur', 'Shahjahanpur', 'Bijapur', 'Rampur', 'Shambhajinagar', 'Shimla',
  'Haridwar', 'Tirupati', 'Thrissur', 'Thiruvananthapuram', 'Imphal', 'Shillong',
  'Aizawl', 'Kohima', 'Gangtok', 'Itanagar', 'Dispur', 'Panaji', 'Puducherry',
  'Port Blair', 'Leh', 'Jaisalmer', 'Manali', 'Kargil',
].sort();

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: '',
    city: 'Mumbai', normalDailyIncome: 600,
    vehicleType: 'bike', platform: 'zomato',
  });
  const [citySearch, setCitySearch] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const filteredCities = citySearch
    ? INDIAN_CITIES.filter(c => c.toLowerCase().includes(citySearch.toLowerCase()))
    : INDIAN_CITIES;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.status === 'success') {
        login(data.user, data.token);
        navigate('/dashboard');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch {
      setError('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card auth-card-wide">
        <div className="auth-logo">RainShield AI</div>
        <h2>Create Account</h2>
        <p className="auth-subtitle">Get AI-powered income protection today</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" required placeholder="Rahul Kumar" value={form.name} onChange={e => set('name', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input type="tel" placeholder="9876543210" value={form.phone} onChange={e => set('phone', e.target.value)} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Email</label>
              <input type="email" required placeholder="you@example.com" value={form.email} onChange={e => set('email', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" required placeholder="Min 6 characters" value={form.password} onChange={e => set('password', e.target.value)} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>City — selected: <strong style={{color:'#60a5fa'}}>{form.city}</strong></label>
              <input
                type="text" placeholder="Search city..."
                value={citySearch}
                onChange={e => setCitySearch(e.target.value)}
                style={{ marginBottom: 4 }}
              />
              <select
                size={5}
                value={form.city}
                onChange={e => { set('city', e.target.value); setCitySearch(''); }}
                style={{ height: 'auto' }}
              >
                {filteredCities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Normal Daily Income (Rs.)</label>
              <input type="number" min="100" max="5000" value={form.normalDailyIncome} onChange={e => set('normalDailyIncome', +e.target.value)} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Vehicle Type</label>
              <select value={form.vehicleType} onChange={e => set('vehicleType', e.target.value)}>
                <option value="bike">Bike</option>
                <option value="cycle">Cycle</option>
                <option value="foot">On Foot</option>
              </select>
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
  );
}
