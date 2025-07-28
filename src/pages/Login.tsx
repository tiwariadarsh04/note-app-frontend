import React, { useState } from 'react';
import axios from 'axios';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [error, setError] = useState('');

  const handleSendOtp = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/send-otp', {
        name: 'User',
        email,
      });
      setStep('otp');
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/verify-otp', { email, otp });
      localStorage.setItem('token', res.data.token);
      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.response?.data?.message || 'OTP verification failed');
    }
  };

  const handleGoogleLogin = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      setError('Google credential missing');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/auth/google-login', {
        token: credentialResponse.credential,
      });

      localStorage.setItem('token', res.data.token);
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Google login failed', error);
      setError('Google login failed');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Login</h2>

        {step === 'form' ? (
          <>
            <input
              type="email"
              placeholder="Enter your email"
              style={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button style={{ ...styles.button, backgroundColor: '#2563eb' }} onClick={handleSendOtp}>
              Send OTP
            </button>
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              style={styles.input}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button style={{ ...styles.button, backgroundColor: '#16a34a' }} onClick={handleVerifyOtp}>
              Verify OTP
            </button>
          </>
        )}

        <div style={styles.divider}>OR</div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => setError('Google login failed')}
          />
        </div>

        {error && <p style={styles.error}>{error}</p>}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #ece9e6, #ffffff)',
    padding: '20px',
  },
  card: {
    backgroundColor: '#fff',
    padding: '40px 30px',
    borderRadius: '12px',
    maxWidth: '400px',
    width: '100%',
    boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '24px',
    textAlign: 'center',
    color: '#333',
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    marginBottom: '16px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '16px',
    outline: 'none',
    transition: 'border 0.2s ease',
  },
  button: {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: 'none',
    color: '#fff',
    fontSize: '16px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    marginBottom: '12px',
  },
  divider: {
    textAlign: 'center',
    color: '#aaa',
    margin: '20px 0',
  },
  error: {
    marginTop: '12px',
    color: '#dc2626',
    textAlign: 'center',
    fontWeight: 500,
  },
};

export default Login;
