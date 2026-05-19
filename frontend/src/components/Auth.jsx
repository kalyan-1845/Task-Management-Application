import React, { useState } from 'react';
import { api } from '../api';
import { LogIn, UserPlus, Key, Mail, User, ShieldCheck } from 'lucide-react';

export default function Auth({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const response = await api.login(username, password);
        onAuthSuccess(response.user);
      } else {
        const response = await api.register(username, email, name, password);
        onAuthSuccess(response.user);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.glowBg}></div>
      <div className="glass-card animate-fade-in" style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logoWrapper}>
            <ShieldCheck size={32} color="var(--accent-secondary)" />
          </div>
          <h2 style={styles.title}>Vortex Tasks</h2>
          <p style={styles.subtitle}>
            {isLogin ? 'Access your high-performance workspace' : 'Create your secure account'}
          </p>
        </div>

        {error && <div style={styles.errorBox}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          {!isLogin && (
            <>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Full Name</label>
                <div style={styles.inputWrapper}>
                  <User size={18} style={styles.inputIcon} />
                  <input
                    type="text"
                    required
                    placeholder="Jane Doe"
                    className="glass-input"
                    style={styles.input}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Email Address</label>
                <div style={styles.inputWrapper}>
                  <Mail size={18} style={styles.inputIcon} />
                  <input
                    type="email"
                    required
                    placeholder="jane@example.com"
                    className="glass-input"
                    style={styles.input}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
            </>
          )}

          <div style={styles.inputGroup}>
            <label style={styles.label}>Username</label>
            <div style={styles.inputWrapper}>
              <User size={18} style={styles.inputIcon} />
              <input
                type="text"
                required
                placeholder="demo"
                className="glass-input"
                style={styles.input}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <div style={styles.inputWrapper}>
              <Key size={18} style={styles.inputIcon} />
              <input
                type="password"
                required
                placeholder="••••••••"
                className="glass-input"
                style={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-glow" style={styles.submitBtn}>
            {loading ? (
              'Processing...'
            ) : (
              <>
                {isLogin ? <LogIn size={18} /> : <UserPlus size={18} />}
                <span style={{ marginLeft: 8 }}>{isLogin ? 'Sign In' : 'Sign Up'}</span>
              </>
            )}
          </button>
        </form>

        <div style={styles.toggleWrapper}>
          <span style={styles.toggleText}>
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
          </span>
          <button style={styles.toggleBtn} onClick={() => { setIsLogin(!isLogin); setError(''); }}>
            {isLogin ? 'Create Account' : 'Sign In'}
          </button>
        </div>

        {isLogin && (
          <div style={styles.demoTipBox}>
            <h4 style={styles.demoTitle}>💡 Quick Demo Access</h4>
            <p style={styles.demoText}>
              <strong>Username:</strong> <code style={styles.code}>demo</code><br />
              <strong>Password:</strong> <code style={styles.code}>password123</code>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    position: 'relative',
    background: 'radial-gradient(circle at 50% 50%, #15093a 0%, var(--bg-primary) 100%)',
    overflow: 'hidden',
    padding: '20px'
  },
  glowBg: {
    position: 'absolute',
    width: '400px',
    height: '400px',
    borderRadius: '50%',
    background: 'var(--accent-primary)',
    filter: 'blur(150px)',
    opacity: 0.15,
    top: '30%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none'
  },
  card: {
    width: '100%',
    maxWidth: '440px',
    zIndex: 10,
    border: '1px solid rgba(255, 255, 255, 0.08)',
    boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
    textAlign: 'center'
  },
  header: {
    marginBottom: '28px'
  },
  logoWrapper: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: 'rgba(139, 92, 246, 0.1)',
    border: '1px solid rgba(139, 92, 246, 0.2)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '0 auto 16px auto',
    boxShadow: '0 0 15px rgba(6, 182, 212, 0.1)'
  },
  title: {
    fontSize: '2rem',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #fff 30%, #8b5cf6 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '6px'
  },
  subtitle: {
    color: 'var(--text-secondary)',
    fontSize: '0.9rem'
  },
  errorBox: {
    background: 'rgba(239, 68, 68, 0.15)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    color: '#fc8181',
    padding: '12px',
    borderRadius: '8px',
    fontSize: '0.88rem',
    marginBottom: '20px',
    textAlign: 'left'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
    textAlign: 'left'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  label: {
    fontSize: '0.82rem',
    fontWeight: '500',
    color: 'var(--text-secondary)',
    letterSpacing: '0.03em',
    textTransform: 'uppercase'
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  inputIcon: {
    position: 'absolute',
    left: '12px',
    color: 'var(--text-muted)',
    pointerEvents: 'none'
  },
  input: {
    width: '100%',
    paddingLeft: '40px'
  },
  submitBtn: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '14px',
    borderRadius: '8px',
    fontSize: '1rem',
    marginTop: '10px'
  },
  toggleWrapper: {
    marginTop: '24px',
    fontSize: '0.9rem',
    display: 'flex',
    justifyContent: 'center',
    gap: '8px'
  },
  toggleText: {
    color: 'var(--text-secondary)'
  },
  toggleBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--accent-secondary)',
    fontWeight: '600',
    cursor: 'pointer',
    textDecoration: 'underline',
    textUnderlineOffset: '3px'
  },
  demoTipBox: {
    marginTop: '24px',
    padding: '12px 16px',
    borderRadius: '8px',
    background: 'rgba(6, 182, 212, 0.05)',
    border: '1px solid rgba(6, 182, 212, 0.15)',
    textAlign: 'left'
  },
  demoTitle: {
    fontSize: '0.85rem',
    fontWeight: '600',
    color: 'var(--accent-secondary)',
    marginBottom: '6px'
  },
  demoText: {
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.4'
  },
  code: {
    background: 'rgba(255,255,255,0.08)',
    padding: '1px 5px',
    borderRadius: '4px',
    color: '#fff',
    fontFamily: 'monospace'
  }
};
