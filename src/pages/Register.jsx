import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Register() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (form.password !== form.confirm) { setError('Passwords do not match'); return }
    if (form.password.length < 8) { setError('Password must be at least 8 characters'); return }
    setLoading(true)
    setError(null)
    const { error: err } = await signUp(form.email, form.password, form.username)
    if (err) {
      setError(err.message)
      setLoading(false)
    } else {
      setSuccess(true)
    }
  }

  if (success) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={styles.successIcon}>⬡</div>
          <div className="section-label">// REGISTRATION COMPLETE</div>
          <h2 style={styles.title}>
            WELCOME TO<br /><span style={{ color: 'var(--teal)' }}>THE NEXUS</span>
          </h2>
          <p style={{ color: 'var(--text-dim)', marginBottom: '2rem', lineHeight: 1.7 }}>
            Check your email to verify your account, then log in to start booking sessions.
          </p>
          <Link to="/login" className="btn-primary" style={{ display: 'block', textAlign: 'center', padding: '1rem' }}>
            ▶ GO TO LOGIN
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.page}>
      <div style={styles.grid} />
      <div style={styles.card}>
        <div style={styles.logo}>
          <span style={{ color: 'var(--teal)', fontSize: '2rem' }}>⬡</span>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1.1rem', letterSpacing: '0.1em' }}>
              WULFSPAR NEXUS
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '0.2em' }}>
              NEW OPERATOR
            </div>
          </div>
        </div>

        <div className="section-label">// REGISTRATION</div>
        <h2 style={styles.title}>JOIN THE NEXUS</h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          {[
            { key: 'username', label: 'OPERATOR HANDLE', type: 'text',     placeholder: 'YourCallsign',       auto: 'username' },
            { key: 'email',    label: 'EMAIL',            type: 'email',    placeholder: 'operator@nexus.gg',  auto: 'email' },
            { key: 'password', label: 'PASSWORD',         type: 'password', placeholder: 'Min. 8 characters',  auto: 'new-password' },
            { key: 'confirm',  label: 'CONFIRM PASSWORD', type: 'password', placeholder: 'Repeat password',    auto: 'new-password' },
          ].map(({ key, label, type, placeholder, auto }) => (
            <div key={key} style={styles.field}>
              <label style={styles.label}>{label}</label>
              <input
                type={type}
                required
                placeholder={placeholder}
                value={form[key]}
                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                autoComplete={auto}
              />
            </div>
          ))}

          {error && (
            <div style={styles.errorBox}>
              <span style={{ color: 'var(--red)' }}>⚠</span> {error}
            </div>
          )}

          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            By creating an account you agree to our terms and conditions.
          </p>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ width: '100%', padding: '1rem', opacity: loading ? 0.7 : 1, fontSize: '0.8rem' }}
          >
            {loading ? 'CREATING ACCOUNT...' : '▶ CREATE OPERATOR PROFILE'}
          </button>
        </form>

        <div style={styles.divider}>ALREADY REGISTERED?</div>
        <Link to="/login" className="btn-ghost" style={{ display: 'block', textAlign: 'center', padding: '0.875rem' }}>
          SIGN IN
        </Link>
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem 1rem',
    position: 'relative',
  },
  grid: {
    position: 'fixed',
    inset: 0,
    backgroundImage: `
      linear-gradient(rgba(0,245,212,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,245,212,0.03) 1px, transparent 1px)
    `,
    backgroundSize: '50px 50px',
    pointerEvents: 'none',
  },
  card: {
    background: 'var(--bg-1)',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    padding: '2.5rem',
    width: '100%',
    maxWidth: '420px',
    position: 'relative',
    zIndex: 1,
  },
  successIcon: {
    fontSize: '3rem',
    color: 'var(--teal)',
    textShadow: '0 0 30px rgba(0,245,212,0.5)',
    textAlign: 'center',
    marginBottom: '1.5rem',
  },
  logo: {
    display: 'flex',
    gap: '0.75rem',
    alignItems: 'center',
    marginBottom: '2rem',
    paddingBottom: '1.5rem',
    borderBottom: '1px solid var(--border)',
  },
  title: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.8rem',
    fontWeight: 900,
    letterSpacing: '0.05em',
    marginBottom: '2rem',
    marginTop: '0.5rem',
    lineHeight: 1.1,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  },
  label: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.65rem',
    color: 'var(--teal)',
    letterSpacing: '0.2em',
  },
  errorBox: {
    background: 'var(--red-glow)',
    border: '1px solid var(--border-red)',
    borderRadius: '6px',
    padding: '0.875rem 1rem',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.75rem',
    color: 'var(--red)',
    letterSpacing: '0.05em',
  },
  divider: {
    textAlign: 'center',
    margin: '1.5rem 0',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.6rem',
    color: 'var(--text-muted)',
    letterSpacing: '0.2em',
  },
}
