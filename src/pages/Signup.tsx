import React, { useState } from 'react';
import axios from 'axios';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';

const Signup: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [error, setError] = useState('');

  const handleSendOtp = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/send-otp', { name, email });
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
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Create Account</h2>

        {step === 'form' ? (
          <>
            <input
              type="text"
              placeholder="Full Name"
              style={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              style={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button style={styles.buttonBlue} onClick={handleSendOtp}>
              Send OTP
            </button>
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              style={{ ...styles.input, borderColor: '#10b981' }}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button style={styles.buttonGreen} onClick={handleVerifyOtp}>
              Verify OTP
            </button>
          </>
        )}

        <div style={styles.or}>OR</div>

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
  wrapper: {
    minHeight: '100vh',
    background: 'linear-gradient(to bottom right, #cbd5e1, #ffffff, #c7d2fe)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  card: {
    width: '100%',
    maxWidth: '400px',
    background: 'rgba(255, 255, 255, 0.95)',
    padding: '32px',
    borderRadius: '24px',
    boxShadow: '0 15px 30px rgba(0,0,0,0.1)',
    border: '1px solid #dbeafe',
    backdropFilter: 'blur(12px)',
    animation: 'fade-in 0.6s ease-in-out',
  },
  heading: {
    fontSize: '32px',
    fontWeight: 800,
    textAlign: 'center',
    color: '#4f46e5',
    marginBottom: '24px',
  },
  input: {
    width: '100%',
    marginBottom: '16px',
    padding: '12px 16px',
    borderRadius: '12px',
    border: '1px solid #d1d5db',
    fontSize: '16px',
    outline: 'none',
    transition: 'border 0.3s',
  },
  buttonBlue: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#4f46e5',
    color: '#fff',
    fontWeight: 600,
    borderRadius: '12px',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(79, 70, 229, 0.2)',
    transition: 'background 0.3s',
  },
  buttonGreen: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#10b981',
    color: '#fff',
    fontWeight: 600,
    borderRadius: '12px',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)',
    transition: 'background 0.3s',
  },
  or: {
    margin: '24px 0 16px',
    textAlign: 'center',
    color: '#6b7280',
    fontWeight: 500,
  },
  error: {
    marginTop: '16px',
    color: '#ef4444',
    textAlign: 'center',
    fontWeight: 500,
    animation: 'pulse 1s infinite',
  },
};

export default Signup;
