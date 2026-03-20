import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import WeatherWidget from './WeatherWidget';
import '../styles/dashboard.css';

const SEV_COLOR = { high: '#ef4444', medium: '#f59e0b', low: '#10b981' };
const TYPE_ICON  = { rain: '🌧', heat: '🌡', pollution: '💨', traffic: '🚦' };
const NAV = [
  { id: 'overview',  icon: '▦',  label: 'Overview' },
  { id: 'predictor', icon: '◈',  label: 'AI Predictor' },
  { id: 'claims',    icon: '≡',  label: 'Claims' },
  { id: 'payouts',   icon: '◎',  label: 'Payouts' },
];

export default function Dashboard() {
  const { user, authFetch, logout } = useAuth();
  const [stats, setStats]         = useState(null);
  const [claims, setClaims]       = useState([]);
  const [payouts, setPayouts]     = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading]     = useState(true);
  const [predicting, setPredicting] = useState(false);
  const [tab, setTab]             = useState('overview');

  const load = async () => {
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
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const runPredict = async () => {
    setPredicting(true);
    try {
      const res  = await authFetch('/api/predict', { method: 'POST' });
      const data = await res.json();
      if (data.status === 'success') { setPrediction(data.prediction); load(); }
    } finally { setPredicting(false); }
  };

  const tabTitle = { overview: 'Overview', predictor: 'AI Income Predictor', claims: 'My Claims', payouts: 'My Payouts' };

  if (loading) return (
    <div className="dash-loading">
      <span style={{ fontSize: 28 }}>◈</span> Loading dashboard...
    </div>
  );

  return (
    <div className="dash-wrapper">

      {/* ── Sidebar ── */}
      <aside className="dash-sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">🌧</div>
          <div>
            <div className="sidebar-brand-name">RainShield</div>
            <div className="sidebar-brand-sub">AI Protection</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-section-label">Menu</div>
          {NAV.map(n => (
            <button key={n.id} className={`sidebar-btn ${tab === n.id ? 'active' : ''}`} onClick={() => setTab(n.id)}>
              <span className="sb-icon">{n.icon}</span>
              {n.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-avatar">{user?.name?.[0]?.toUpperCase()}</div>
          <div className="user-info">
            <div className="user-name">{user?.name}</div>
            <div className="user-city">{user?.city}</div>
          </div>
          <button className="logout-btn" onClick={logout} title="Sign out">↩</button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="dash-main">
        <div className="dash-topbar">
          <h1>{tabTitle[tab]}</h1>
          <div className="topbar-right">
            <span className="topbar-city">📍 {user?.city}</span>
          </div>
        </div>

        <div className="dash-content">

          {/* ══ OVERVIEW ══ */}
          {tab === 'overview' && stats && (
            <>
              {/* Stats */}
              <WeatherWidget />
              <div className="stats-grid">
                <div className="stat-card blue">
                  <div className="stat-top">
                    <span className="stat-label">Weekly Premium</span>
                    <div className="stat-icon-wrap">💼</div>
                  </div>
                  <div className="stat-value">₹{stats.policy?.weeklyPremium ?? '—'}</div>
                  <div className="stat-sub">AI-calculated rate</div>
                </div>
                <div className="stat-card green">
                  <div className="stat-top">
                    <span className="stat-label">Coverage</span>
                    <div className="stat-icon-wrap">🛡</div>
                  </div>
                  <div className="stat-value">₹{stats.policy?.coverageAmount ?? '—'}</div>
                  <div className="stat-sub">Active protection</div>
                </div>
                <div className="stat-card orange">
                  <div className="stat-top">
                    <span className="stat-label">Total Claims</span>
                    <div className="stat-icon-wrap">📋</div>
                  </div>
                  <div className="stat-value">{stats.claimsCount}</div>
                  <div className="stat-sub">{stats.pendingClaims} pending</div>
                </div>
                <div className="stat-card purple">
                  <div className="stat-top">
                    <span className="stat-label">Total Received</span>
                    <div className="stat-icon-wrap">💰</div>
                  </div>
                  <div className="stat-value">₹{stats.totalPayoutReceived}</div>
                  <div className="stat-sub">Lifetime payouts</div>
                </div>
              </div>

              {/* Policy */}
              {stats.policy && (
                <div className="card">
                  <div className="section-header">
                    <span className="section-title">Active Policy</span>
                    <span className="status-badge status-approved">{stats.policy.status}</span>
                  </div>
                  <div className="policy-grid">
                    <div className="policy-item">
                      <div className="policy-item-label">Risk Score</div>
                      <div className="policy-item-value" style={{ color: stats.policy.riskScore > 60 ? '#ef4444' : stats.policy.riskScore > 40 ? '#f59e0b' : '#10b981' }}>
                        {stats.policy.riskScore}<span style={{ fontSize: 14, color: '#334155', fontWeight: 500 }}>/100</span>
                      </div>
                      <div className="risk-bar-wrap">
                        <div className="risk-bar-bg">
                          <div className="risk-bar-fill" style={{
                            width: `${stats.policy.riskScore}%`,
                            background: stats.policy.riskScore > 60 ? '#ef4444' : stats.policy.riskScore > 40 ? '#f59e0b' : '#10b981'
                          }} />
                        </div>
                      </div>
                    </div>
                    <div className="policy-item">
                      <div className="policy-item-label">Daily Income</div>
                      <div className="policy-item-value">₹{user?.normalDailyIncome}</div>
                    </div>
                    <div className="policy-item">
                      <div className="policy-item-label">Valid Until</div>
                      <div className="policy-item-value" style={{ fontSize: 15 }}>{new Date(stats.policy.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Alerts */}
              {stats.recentAlerts?.length > 0 && (
                <div className="card">
                  <div className="section-header">
                    <span className="section-title">Recent Alerts</span>
                  </div>
                  <div className="alert-feed">
                    {stats.recentAlerts.map(a => (
                      <div key={a._id} className="alert-row">
                        <div className="alert-dot" style={{ background: SEV_COLOR[a.severity] }} />
                        <span className="alert-text">{TYPE_ICON[a.type]} {a.message}</span>
                        <span className="alert-meta">{new Date(a.createdAt).toLocaleDateString('en-IN')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* ══ PREDICTOR ══ */}
          {tab === 'predictor' && (
            <>
              <div className="predictor-banner">
                <h2>Income Loss Predictor</h2>
                <p>Our AI scans real-time weather, pollution & traffic data to forecast how much income you'll lose — before it happens. High-risk events auto-trigger parametric protection.</p>
                <button className="btn-predict" onClick={runPredict} disabled={predicting}>
                  {predicting ? 'Analyzing conditions...' : 'Run Prediction Now'}
                </button>
              </div>

              {prediction && (
                <div className="prediction-card">
                  <div className="pred-top">
                    <div className="pred-condition-icon">{TYPE_ICON[prediction.conditionType]}</div>
                    <div>
                      <div className="pred-condition-name">{prediction.conditionLabel}</div>
                      <div className="pred-location">📍 {prediction.city}</div>
                    </div>
                    <span className="severity-pill" style={{ background: SEV_COLOR[prediction.severity] }}>
                      {prediction.severity} risk
                    </span>
                  </div>

                  <div className="income-strip">
                    <div className="income-cell">
                      <div className="income-cell-label">Normal Income</div>
                      <div className="income-cell-value positive">₹{prediction.normalDailyIncome}</div>
                    </div>
                    <div className="income-arrow">→</div>
                    <div className="income-cell">
                      <div className="income-cell-label">Predicted Income</div>
                      <div className="income-cell-value negative">₹{prediction.predictedIncome}</div>
                    </div>
                    <div className="income-arrow">→</div>
                    <div className="income-cell">
                      <div className="income-cell-label">Estimated Loss</div>
                      <div className="income-cell-value negative">₹{prediction.predictedLoss}</div>
                    </div>
                  </div>

                  <div className="pred-msg">{prediction.message}</div>

                  {prediction.autoClaimCreated && (
                    <div className="auto-claim-tag">
                      ✓ Parametric claim auto-created — payout triggers if threshold is met
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* ══ CLAIMS ══ */}
          {tab === 'claims' && (
            <div className="card">
              {claims.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">📋</div>
                  No claims yet. Run the AI Predictor to auto-generate claims.
                </div>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr><th>Type</th><th>Loss</th><th>Status</th><th>Triggered By</th><th>Date</th></tr>
                  </thead>
                  <tbody>
                    {claims.map(c => (
                      <tr key={c._id}>
                        <td>{TYPE_ICON[c.type]} {c.type}</td>
                        <td style={{ color: '#f0f4ff', fontWeight: 600 }}>₹{c.estimatedLoss ?? '—'}</td>
                        <td><span className={`status-badge status-${c.status}`}>{c.status}</span></td>
                        <td style={{ color: c.autoTriggered ? '#818cf8' : '#475569' }}>{c.autoTriggered ? 'AI Auto' : 'Manual'}</td>
                        <td>{new Date(c.createdAt).toLocaleDateString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* ══ PAYOUTS ══ */}
          {tab === 'payouts' && (
            <div className="card">
              {payouts.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">💰</div>
                  No payouts yet.
                </div>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr><th>Amount</th><th>Method</th><th>Status</th><th>Transaction ID</th><th>Date</th></tr>
                  </thead>
                  <tbody>
                    {payouts.map(p => (
                      <tr key={p._id}>
                        <td style={{ color: '#10b981', fontWeight: 700 }}>₹{p.amount}</td>
                        <td>{p.method}</td>
                        <td><span className={`status-badge status-${p.status}`}>{p.status}</span></td>
                        <td className="txn-id">{p.transactionId ?? '—'}</td>
                        <td>{new Date(p.createdAt).toLocaleDateString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
