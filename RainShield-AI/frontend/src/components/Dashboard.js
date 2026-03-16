import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import WeatherWidget from './WeatherWidget';
import '../styles/dashboard.css';

const severityColor = { high: '#ef4444', medium: '#f59e0b', low: '#10b981' };
const typeIcon = { rain: '🌧️', heat: '🌡️', pollution: '💨', traffic: '🚦' };

export default function Dashboard() {
  const { user, authFetch, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [claims, setClaims] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [predicting, setPredicting] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const loadData = async () => {
    setLoading(true);
    try {
      const [s, c, p] = await Promise.all([
        authFetch('/api/dashboard/stats').then(r => r.json()),
        authFetch('/api/claims/my').then(r => r.json()),
        authFetch('/api/payouts/my').then(r => r.json()),
      ]);
      if (s.status === 'success') setStats(s.data);
      if (c.status === 'success') setClaims(c.data);
      if (p.status === 'success') setPayouts(p.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const runPrediction = async () => {
    setPredicting(true);
    try {
      const res = await authFetch('/api/predict', { method: 'POST' });
      const data = await res.json();
      if (data.status === 'success') {
        setPrediction(data.prediction);
        loadData(); // refresh alerts
      }
    } catch (err) {
      console.error(err);
    } finally {
      setPredicting(false);
    }
  };

  if (loading) return <div className="dash-loading">Loading your dashboard…</div>;

  return (
    <div className="dash-wrapper">
      {/* Sidebar */}
      <aside className="dash-sidebar">
        <div className="sidebar-logo">🌧️ RainShield AI</div>
        <nav>
          {['overview', 'predictor', 'claims', 'payouts'].map(tab => (
            <button key={tab} className={`sidebar-btn ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
              {tab === 'overview' && '📊'} {tab === 'predictor' && '🔮'} {tab === 'claims' && '📋'} {tab === 'payouts' && '💰'}
              {' '}{tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
        <div className="sidebar-user">
          <div className="user-avatar">{user?.name?.[0]?.toUpperCase()}</div>
          <div>
            <div className="user-name">{user?.name}</div>
            <div className="user-city">📍 {user?.city}</div>
          </div>
          <button className="logout-btn" onClick={logout} title="Logout">⏻</button>
        </div>
      </aside>

      {/* Main */}
      <main className="dash-main">
        <header className="dash-header">
          <h1>{activeTab === 'overview' && 'Dashboard Overview'}
            {activeTab === 'predictor' && '🔮 Income Loss Predictor'}
            {activeTab === 'claims' && '📋 My Claims'}
            {activeTab === 'payouts' && '💰 My Payouts'}
          </h1>
        </header>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && stats && (
          <div>
            <WeatherWidget />
            <div className="stats-grid">
              <div className="stat-card blue">
                <div className="stat-icon">💼</div>
                <div className="stat-value">₹{stats.policy?.weeklyPremium ?? '—'}</div>
                <div className="stat-label">Weekly Premium</div>
              </div>
              <div className="stat-card green">
                <div className="stat-icon">🛡️</div>
                <div className="stat-value">₹{stats.policy?.coverageAmount ?? '—'}</div>
                <div className="stat-label">Coverage Amount</div>
              </div>
              <div className="stat-card orange">
                <div className="stat-icon">📋</div>
                <div className="stat-value">{stats.claimsCount}</div>
                <div className="stat-label">Total Claims</div>
              </div>
              <div className="stat-card purple">
                <div className="stat-icon">💰</div>
                <div className="stat-value">₹{stats.totalPayoutReceived}</div>
                <div className="stat-label">Total Received</div>
              </div>
            </div>

            {/* Policy card */}
            {stats.policy && (
              <div className="info-card">
                <h3>Active Policy</h3>
                <div className="policy-row">
                  <span>Risk Score</span>
                  <span className="risk-badge" style={{ background: stats.policy.riskScore > 60 ? '#ef4444' : stats.policy.riskScore > 40 ? '#f59e0b' : '#10b981' }}>
                    {stats.policy.riskScore}/100
                  </span>
                </div>
                <div className="policy-row"><span>Status</span><span className="badge-green">{stats.policy.status}</span></div>
                <div className="policy-row"><span>Valid Until</span><span>{new Date(stats.policy.endDate).toLocaleDateString()}</span></div>
              </div>
            )}

            {/* Recent Alerts */}
            {stats.recentAlerts?.length > 0 && (
              <div className="info-card">
                <h3>Recent Alerts</h3>
                {stats.recentAlerts.map(a => (
                  <div key={a._id} className="alert-item" style={{ borderLeft: `4px solid ${severityColor[a.severity]}` }}>
                    <span>{typeIcon[a.type]} {a.message}</span>
                    <span className="alert-time">{new Date(a.createdAt).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PREDICTOR TAB */}
        {activeTab === 'predictor' && (
          <div>
            <div className="predictor-hero">
              <p>AI analyzes upcoming weather, pollution & traffic to predict your income loss <strong>before</strong> it happens.</p>
              <button className="btn-predict" onClick={runPrediction} disabled={predicting}>
                {predicting ? '⏳ Analyzing conditions…' : '🔮 Run Income Loss Prediction'}
              </button>
            </div>

            {prediction && (
              <div className="prediction-result" style={{ borderColor: severityColor[prediction.severity] }}>
                <div className="pred-header">
                  <span className="pred-icon">{typeIcon[prediction.conditionType]}</span>
                  <div>
                    <h3>{prediction.conditionLabel} Alert — {prediction.city}</h3>
                    <span className="severity-tag" style={{ background: severityColor[prediction.severity] }}>
                      {prediction.severity.toUpperCase()} SEVERITY
                    </span>
                  </div>
                </div>

                <div className="income-comparison">
                  <div className="income-box normal">
                    <div className="income-label">Normal Daily Income</div>
                    <div className="income-value">₹{prediction.normalDailyIncome}</div>
                  </div>
                  <div className="income-arrow">→</div>
                  <div className="income-box predicted">
                    <div className="income-label">Predicted Income</div>
                    <div className="income-value red">₹{prediction.predictedIncome}</div>
                  </div>
                  <div className="income-arrow">→</div>
                  <div className="income-box loss">
                    <div className="income-label">Estimated Loss</div>
                    <div className="income-value red">₹{prediction.predictedLoss}</div>
                  </div>
                </div>

                <div className="pred-message">💬 {prediction.message}</div>

                {prediction.autoClaimCreated && (
                  <div className="auto-claim-notice">
                    ✅ Parametric claim auto-created. Payout will be processed if disruption threshold is met.
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* CLAIMS TAB */}
        {activeTab === 'claims' && (
          <div className="info-card">
            {claims.length === 0 ? (
              <p className="empty-msg">No claims yet. Run the Income Loss Predictor to auto-generate claims.</p>
            ) : (
              <table className="data-table">
                <thead>
                  <tr><th>Type</th><th>Loss (₹)</th><th>Status</th><th>Auto</th><th>Date</th></tr>
                </thead>
                <tbody>
                  {claims.map(c => (
                    <tr key={c._id}>
                      <td>{typeIcon[c.type]} {c.type}</td>
                      <td>₹{c.estimatedLoss ?? '—'}</td>
                      <td><span className={`status-badge status-${c.status}`}>{c.status}</span></td>
                      <td>{c.autoTriggered ? '🤖 Yes' : '👤 No'}</td>
                      <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* PAYOUTS TAB */}
        {activeTab === 'payouts' && (
          <div className="info-card">
            {payouts.length === 0 ? (
              <p className="empty-msg">No payouts yet.</p>
            ) : (
              <table className="data-table">
                <thead>
                  <tr><th>Amount (₹)</th><th>Method</th><th>Status</th><th>Transaction ID</th><th>Date</th></tr>
                </thead>
                <tbody>
                  {payouts.map(p => (
                    <tr key={p._id}>
                      <td>₹{p.amount}</td>
                      <td>{p.method}</td>
                      <td><span className={`status-badge status-${p.status}`}>{p.status}</span></td>
                      <td className="txn-id">{p.transactionId ?? '—'}</td>
                      <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
