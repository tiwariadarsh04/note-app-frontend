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
      <div style={styles.leftPane}>
        <div style={styles.card}>
          <h2 style={styles.heading}>Sign up</h2>

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
              <button style={styles.button} onClick={handleSendOtp}>
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

          <div style={styles.or}>OR</div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => setError('Google login failed')}
            />
          </div>

          <p style={styles.footerText}>
            Already have an account?{' '}
            <a href="/login" style={styles.link}>
              Sign in
            </a>
          </p>

          {error && <p style={styles.error}>{error}</p>}
        </div>
      </div>

      <div style={styles.rightPane}>
        <img src="/bg.jpg" alt="Background" style={styles.image} />
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  wrapper: {
    display: 'flex',
    minHeight: '100vh',
    fontFamily: 'sans-serif',
  },
  leftPane: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#f8fafc',
    padding: '40px',
  },
  rightPane: {
    flex: 1,
    overflow: 'hidden',
    borderTopLeftRadius: '40px',
    borderBottomLeftRadius: '40px',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderTopLeftRadius: '40px',
    borderBottomLeftRadius: '40px',
  },
  card: {
    width: '100%',
    maxWidth: '400px',
    background: '#ffffff',
    padding: '32px',
    borderRadius: '20px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
    border: '1px solid #e5e7eb',
  },
  heading: {
    fontSize: '28px',
    fontWeight: 700,
    color: '#1e3a8a',
    marginBottom: '24px',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    marginBottom: '16px',
    fontSize: '16px',
    border: '1px solid #cbd5e1',
    borderRadius: '10px',
    outline: 'none',
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#2563eb',
    color: '#fff',
    fontWeight: 600,
    fontSize: '16px',
    borderRadius: '10px',
    border: 'none',
    cursor: 'pointer',
    marginBottom: '16px',
  },
  or: {
    textAlign: 'center',
    margin: '20px 0',
    color: '#6b7280',
    fontWeight: 500,
  },
  footerText: {
    marginTop: '16px',
    textAlign: 'center',
    color: '#4b5563',
    fontSize: '14px',
  },
  link: {
    color: '#2563eb',
    textDecoration: 'none',
    fontWeight: 600,
  },
  error: {
    marginTop: '16px',
    color: '#dc2626',
    textAlign: 'center',
    fontWeight: 500,
  },
};

export default Signup;
