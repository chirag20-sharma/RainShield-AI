import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function WeatherWidget() {
  const { user, authFetch } = useAuth();
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user?.city) return;
    setLoading(true);
    authFetch(`/api/weather/current?city=${encodeURIComponent(user.city)}`)
      .then(r => r.json())
      .then(d => {
        if (d.success) setWeather(d.data);
        else setError(d.message || 'Failed to load weather');
      })
      .catch(() => setError('Weather unavailable'))
      .finally(() => setLoading(false));
  }, [user?.city]);

  if (loading) return <div className="weather-widget loading">Loading weather…</div>;
  if (error)   return <div className="weather-widget error">⚠️ {error}</div>;
  if (!weather) return null;

  const getRainRisk = (rain) => {
    if (rain >= 60) return { label: 'HIGH RISK', color: '#ef4444' };
    if (rain >= 20) return { label: 'MEDIUM RISK', color: '#f59e0b' };
    return { label: 'LOW RISK', color: '#10b981' };
  };

  const risk = getRainRisk(weather.rainfall_1h);

  return (
    <div className="weather-widget">
      <div className="ww-header">
        <div>
          <div className="ww-city">📍 {weather.city}, {weather.country}</div>
          <div className="ww-updated">Live · {new Date(weather.timestamp).toLocaleTimeString()}</div>
        </div>
        <div className="ww-risk-badge" style={{ background: risk.color }}>
          {risk.label}
        </div>
      </div>

      <div className="ww-main">
        <div className="ww-temp-block">
          <img src={weather.icon} alt={weather.description} className="ww-icon" />
          <div className="ww-temp">{Math.round(weather.temperature)}°C</div>
          <div className="ww-desc">{weather.description}</div>
        </div>

        <div className="ww-stats">
          <div className="ww-stat">
            <span className="ww-stat-icon">🌧️</span>
            <span className="ww-stat-val">{weather.rainfall_1h} mm</span>
            <span className="ww-stat-label">Rainfall/hr</span>
          </div>
          <div className="ww-stat">
            <span className="ww-stat-icon">💧</span>
            <span className="ww-stat-val">{weather.humidity}%</span>
            <span className="ww-stat-label">Humidity</span>
          </div>
          <div className="ww-stat">
            <span className="ww-stat-icon">💨</span>
            <span className="ww-stat-val">{weather.wind_speed} m/s</span>
            <span className="ww-stat-label">Wind</span>
          </div>
          <div className="ww-stat">
            <span className="ww-stat-icon">🌡️</span>
            <span className="ww-stat-val">{Math.round(weather.feels_like)}°C</span>
            <span className="ww-stat-label">Feels like</span>
          </div>
        </div>
      </div>

      {weather.rainfall_1h >= 60 && (
        <div className="ww-alert">
          🚨 Rainfall threshold exceeded! Your policy trigger may activate soon.
        </div>
      )}
      {weather.temperature >= 42 && (
        <div className="ww-alert">
          🌡️ Extreme heat detected! Heat trigger may activate soon.
        </div>
      )}
    </div>
  );
}
