import { useEffect, useState } from 'react';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  const [status, setStatus] = useState('starting');

  useEffect(() => {
    fetch('/api/diagnostics/health')
      .then((r) => r.json())
      .then((data) => setStatus(data.status))
      .catch(() => setStatus('offline'));
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1>RainShield AI</h1>
        <p className="status">Backend status: <strong>{status}</strong></p>
      </header>

      <main>
        <Dashboard />
      </main>

      <footer>
        <small>Data is mocked; this is an MVP starter kit.</small>
      </footer>
    </div>
  );
}

export default App;
