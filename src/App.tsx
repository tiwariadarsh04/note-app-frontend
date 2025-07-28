import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

// Move this to .env.local and access via process.env
const clientId = '307290812804-7sje0av5oumol5b1mc06cdjo20gnn5kc.apps.googleusercontent.com';

function App() {
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <Router>
        <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom right, #eef2ff, #fff)', padding: '16px' }}>
          {/* Optional: Navbar for dev/demo */}
          <nav style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '20px' }}>
            <Link to="/" style={linkStyle}>Signup</Link>
            <Link to="/login" style={linkStyle}>Login</Link>
            <Link to="/dashboard" style={linkStyle}>Dashboard</Link>
          </nav>

          <Routes>
            <Route path="/" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            {/* Optional 404 fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </GoogleOAuthProvider>
  );
}

const linkStyle: React.CSSProperties = {
  textDecoration: 'none',
  color: '#4f46e5',
  fontWeight: 'bold',
  fontSize: '16px',
};

export default App;
