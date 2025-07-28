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
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.formSection}>
          <h2 style={styles.heading}>Welcome Back</h2>
          <p style={styles.subheading}>Please login to your account</p>

          {step === 'form' ? (
            <>
              <input
                type="email"
                placeholder="Enter your email"
                style={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button style={styles.buttonPrimary} onClick={handleSendOtp}>
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
              <button style={styles.buttonSuccess} onClick={handleVerifyOtp}>
                Verify OTP
              </button>
            </>
          )}

          <div style={styles.or}>OR</div>

          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => setError('Google login failed')}
            />
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <p style={styles.footer}>
            Don’t have an account? <a href="/signup" style={styles.link}>Sign up</a>
          </p>
        </div>

        <div style={styles.imageSection}>
          <img src="/bg.jpg" alt="Background" style={styles.image} />
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    height: '100vh',
    display: 'flex',
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '16px',
  },
  container: {
    display: 'flex',
    width: '100%',
    maxWidth: '1000px',
    height: '600px',
    backgroundColor: '#ffffff',
    borderRadius: '24px',
    boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
    overflow: 'hidden',
  },
  formSection: {
    flex: 1,
    padding: '48px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  heading: {
    fontSize: '32px',
    fontWeight: 700,
    marginBottom: '8px',
    color: '#1e293b',
  },
  subheading: {
    fontSize: '16px',
    color: '#64748b',
    marginBottom: '32px',
  },
  input: {
    padding: '14px 16px',
    borderRadius: '10px',
    border: '1px solid #cbd5e1',
    fontSize: '16px',
    marginBottom: '16px',
    outline: 'none',
  },
  buttonPrimary: {
    padding: '14px',
    backgroundColor: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontWeight: 600,
    fontSize: '16px',
    cursor: 'pointer',
    marginBottom: '20px',
  },
  buttonSuccess: {
    padding: '14px',
    backgroundColor: '#10b981',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    fontWeight: 600,
    fontSize: '16px',
    cursor: 'pointer',
    marginBottom: '20px',
  },
  or: {
    textAlign: 'center',
    color: '#94a3b8',
    margin: '16px 0',
    fontWeight: 500,
  },
  error: {
    color: '#ef4444',
    textAlign: 'center',
    marginBottom: '16px',
    fontWeight: 500,
  },
  footer: {
    textAlign: 'center',
    color: '#475569',
    fontSize: '14px',
  },
  link: {
    color: '#2563eb',
    fontWeight: 600,
    textDecoration: 'none',
    marginLeft: '4px',
  },
  imageSection: {
    flex: 1,
    backgroundColor: '#4f46e5',
    overflow: 'hidden',
    borderTopRightRadius: '24px',
    borderBottomRightRadius: '24px',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderTopRightRadius: '24px',
    borderBottomRightRadius: '24px',
  },
};

export default Login;
