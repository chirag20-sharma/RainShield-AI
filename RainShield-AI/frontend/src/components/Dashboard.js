import { useEffect, useState } from 'react';

const API_BASE = '/api';

const fetchJson = async (path) => {
  const res = await fetch(path);
  if (!res.ok) throw new Error('Network error');
  return res.json();
};

function Dashboard() {
  const [users, setUsers] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [claims, setClaims] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [u, p, c, pay] = await Promise.all([
          fetchJson(`${API_BASE}/users`),
          fetchJson(`${API_BASE}/policies`),
          fetchJson(`${API_BASE}/claims`),
          fetchJson(`${API_BASE}/payouts`),
        ]);

        setUsers(u.data || []);
        setPolicies(p.data || []);
        setClaims(c.data || []);
        setPayouts(pay.data || []);
      } catch (err) {
        console.warn(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <section className="card">
      <h2>Quick Snapshot</h2>
      {loading ? (
        <p>Loading stats…</p>
      ) : (
        <div style={{ display: 'grid', gap: '12px', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          <div>
            <strong>{users.length}</strong>
            <div>Users</div>
          </div>
          <div>
            <strong>{policies.length}</strong>
            <div>Policies</div>
          </div>
          <div>
            <strong>{claims.length}</strong>
            <div>Claims</div>
          </div>
          <div>
            <strong>{payouts.length}</strong>
            <div>Payouts</div>
          </div>
        </div>
      )}

      <div style={{ marginTop: 18 }}>
        <button
          onClick={async () => {
            setLoading(true);
            await fetchJson(`${API_BASE}/triggers/weather`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ city: 'Mumbai', triggerType: 'rain' }),
            });
            setLoading(false);
            window.location.reload();
          }}
        >
          Test weather trigger
        </button>
      </div>
    </section>
  );
}

export default Dashboard;
