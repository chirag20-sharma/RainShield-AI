import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const RISK_COLOR = { high: '#ef4444', medium: '#f59e0b', low: '#10b981' };
const RISK_BG    = { high: 'rgba(239,68,68,0.1)', medium: 'rgba(245,158,11,0.1)', low: 'rgba(16,185,129,0.1)' };

export default function WeatherWidget() {
  const { user, authFetch } = useAuth();
  const [weather, setWeather]   = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');

  useEffect(() => {
    const city = user?.city || 'Mumbai';
    setLoading(true);
    Promise.all([
      authFetch(`/api/weather/current?city=${encodeURIComponent(city)}`).then(r => r.json()),
      authFetch(`/api/weather/forecast?city=${encodeURIComponent(city)}`).then(r => r.json()),
    ]).then(([cur, fore]) => {
      if (cur.status === 'success')  setWeather(cur.data);
      else setError(cur.message);
      if (fore.status === 'success') setForecast(fore.data.forecast.slice(0, 6));
    }).catch(() => setError('Weather unavailable'))
      .finally(() => setLoading(false));
  }, [user?.city]);

  if (loading) return (
    <div style={{ background: '#080e1a', border: '1px solid #111c30', borderRadius: 14, padding: '18px 22px', marginBottom: 20, color: '#334155', fontSize: 13 }}>
      Loading weather for {user?.city}...
    </div>
  );

  if (error || !weather) return (
    <div style={{ background: '#080e1a', border: '1px solid #111c30', borderRadius: 14, padding: '18px 22px', marginBottom: 20, color: '#475569', fontSize: 13 }}>
      Weather data unavailable
    </div>
  );

  const risk = weather.risk_level;

  return (
    <div style={{
      background: 'linear-gradient(135deg, #0a1628, #060a12)',
      border: `1px solid ${RISK_COLOR[risk]}33`,
      borderRadius: 14, padding: '20px 24px', marginBottom: 20,
    }}>
      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src={weather.icon} alt={weather.description} style={{ width: 52, height: 52 }} />
          <div>
            <div style={{ fontSize: 38, fontWeight: 800, letterSpacing: -2, color: '#f0f4ff', lineHeight: 1 }}>
              {weather.temp}°C
            </div>
            <div style={{ fontSize: 13, color: '#475569', textTransform: 'capitalize', marginTop: 2 }}>
              {weather.description}
            </div>
            <div style={{ fontSize: 12, color: '#334155', marginTop: 2 }}>
              📍 {weather.city}, {weather.country}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
          <span style={{
            padding: '5px 14px', borderRadius: 20,
            background: RISK_BG[risk], border: `1px solid ${RISK_COLOR[risk]}44`,
            color: RISK_COLOR[risk], fontSize: 11, fontWeight: 800,
            textTransform: 'uppercase', letterSpacing: 0.5,
          }}>
            {risk} delivery risk
          </span>
          <div style={{ display: 'flex', gap: 16, marginTop: 4 }}>
            {[
              { label: 'Humidity',  val: `${weather.humidity}%` },
              { label: 'Wind',      val: `${weather.wind_speed} m/s` },
              { label: 'Feels',     val: `${weather.feels_like}°C` },
              { label: 'Rain 1h',   val: `${weather.rainfall_1h} mm` },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#e2e8f0' }}>{s.val}</div>
                <div style={{ fontSize: 10, color: '#334155', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Risk alert banner */}
      {risk !== 'low' && (
        <div style={{
          padding: '9px 14px', borderRadius: 8, marginBottom: 14,
          background: RISK_BG[risk], border: `1px solid ${RISK_COLOR[risk]}33`,
          color: RISK_COLOR[risk], fontSize: 12, fontWeight: 500,
        }}>
          {risk === 'high'
            ? `⚠ High disruption risk in ${weather.city} — consider activating income protection`
            : `⚡ Moderate conditions in ${weather.city} — monitor for changes`}
        </div>
      )}

      {/* 24h Forecast strip */}
      {forecast.length > 0 && (
        <div>
          <div style={{ fontSize: 11, color: '#334155', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>
            24-Hour Forecast
          </div>
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
            {forecast.map((f, i) => (
              <div key={i} style={{
                flex: '0 0 auto', textAlign: 'center',
                background: '#060a12', border: '1px solid #111c30',
                borderRadius: 10, padding: '10px 12px', minWidth: 72,
              }}>
                <div style={{ fontSize: 11, color: '#475569', marginBottom: 4 }}>{f.time}</div>
                <img src={f.icon} alt={f.condition} style={{ width: 32, height: 32 }} />
                <div style={{ fontSize: 14, fontWeight: 700, color: '#f0f4ff', marginTop: 2 }}>{f.temp}°</div>
                {f.pop > 0 && (
                  <div style={{ fontSize: 10, color: '#3b82f6', marginTop: 2 }}>💧{f.pop}%</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
