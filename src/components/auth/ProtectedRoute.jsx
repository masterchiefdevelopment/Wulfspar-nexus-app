import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, isAdmin, loading } = useAuth()

  if (loading) {
    return (
      <div style={styles.loading}>
        <span style={styles.spinner}>⬡</span>
        <span style={styles.text}>AUTHENTICATING...</span>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />
  if (adminOnly && !isAdmin) return <Navigate to="/" replace />

  return children
}

const styles = {
  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
    gap: '1rem',
  },
  spinner: {
    fontSize: '3rem',
    color: 'var(--teal)',
  },
  text: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.8rem',
    color: 'var(--teal)',
    letterSpacing: '0.2em',
  },
}
