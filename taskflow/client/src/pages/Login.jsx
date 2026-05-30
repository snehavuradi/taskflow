import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [form, setForm]   = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}><span style={styles.dot} />TaskFlow</div>
        <h1 style={styles.title}>Welcome back</h1>
        <p style={styles.sub}>Sign in to your workspace</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={submit}>
          <label style={styles.label}>Email</label>
          <input style={styles.input} type="email" name="email" value={form.email}
            onChange={handle} placeholder="you@example.com" required />

          <label style={styles.label}>Password</label>
          <input style={styles.input} type="password" name="password" value={form.password}
            onChange={handle} placeholder="••••••••" required />

          <button style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }} disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p style={styles.footer}>
          No account? <Link to="/register" style={styles.link}>Create one</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page:  { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', padding: '20px' },
  card:  { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '36px 40px', width: '100%', maxWidth: 400 },
  logo:  { display: 'flex', alignItems: 'center', gap: 8, fontSize: 16, fontWeight: 600, marginBottom: 24 },
  dot:   { display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: 'var(--green)' },
  title: { fontSize: 22, fontWeight: 600, marginBottom: 6 },
  sub:   { fontSize: 13, color: 'var(--text-2)', marginBottom: 24 },
  error: { background: 'var(--red-lt)', color: 'var(--red)', borderRadius: 8, padding: '10px 14px', fontSize: 13, marginBottom: 16 },
  label: { display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-2)', marginBottom: 5 },
  input: { display: 'block', width: '100%', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 8, marginBottom: 14, outline: 'none', background: 'var(--bg)' },
  btn:   { width: '100%', padding: '11px', background: 'var(--green)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 14, marginTop: 4 },
  footer: { textAlign: 'center', fontSize: 13, color: 'var(--text-2)', marginTop: 20 },
  link:  { color: 'var(--green)', fontWeight: 500 },
};
