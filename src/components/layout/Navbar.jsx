import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/book', label: 'Book' },
  { to: '/membership', label: 'Membership' },
  { to: '/tournaments', label: 'Tournaments' },
  { to: '/leaderboard', label: 'Leaderboard' },
]

export default function Navbar() {
  const { user, signOut, isAdmin } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth <= 768)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        {/* Logo */}
        <Link to="/" style={styles.logo}>
          <span style={styles.logoAccent}>⬡</span>
          <span style={styles.logoText}>WULFSPAR</span>
          <span style={styles.logoSub}>NEXUS</span>
        </Link>

        {/* Desktop links */}
        <div style={{ ...styles.links, ...(isMobile ? styles.hidden : {}) }}>
          {NAV_LINKS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              style={{
                ...styles.link,
                ...(location.pathname === to ? styles.linkActive : {})
              }}
            >
              {label}
            </Link>
          ))}
          {isAdmin && (
            <Link to="/admin" style={{ ...styles.link, color: 'var(--red)' }}>
              ADMIN
            </Link>
          )}
        </div>

        {/* Auth */}
        <div style={{ ...styles.auth, ...(isMobile ? styles.hidden : {}) }}>
          {user ? (
            <>
              <Link to="/profile" style={styles.profileBtn}>
                <span style={styles.profileIcon}>◈</span>
                PROFILE
              </Link>
              <button
                onClick={handleSignOut}
                className="btn-danger"
                style={{ padding: '0.5rem 1rem', fontSize: '0.7rem' }}
              >
                EXIT
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost" style={{ padding: '0.5rem 1rem', fontSize: '0.7rem' }}>
                LOGIN
              </Link>
              <Link to="/register" className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.7rem' }}>
                JOIN
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          style={{ ...styles.hamburger, ...(isMobile ? styles.hamburgerVisible : {}) }}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span style={{ color: menuOpen ? 'var(--red)' : 'var(--teal)', fontSize: '1.4rem' }}>
            {menuOpen ? '✕' : '☰'}
          </span>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={styles.mobileMenu}>
          {NAV_LINKS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              style={styles.mobileLink}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
          <div style={styles.mobileAuth}>
            {user ? (
              <>
                <Link to="/profile" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>
                  PROFILE
                </Link>
                <button
                  onClick={() => { handleSignOut(); setMenuOpen(false) }}
                  className="btn-danger"
                  style={{ width: '100%' }}
                >
                  SIGN OUT
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="btn-ghost"
                  style={{ display: 'block', textAlign: 'center', marginBottom: '0.5rem' }}
                  onClick={() => setMenuOpen(false)}
                >
                  LOGIN
                </Link>
                <Link
                  to="/register"
                  className="btn-primary"
                  style={{ display: 'block', textAlign: 'center' }}
                  onClick={() => setMenuOpen(false)}
                >
                  JOIN NOW
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

const styles = {
  nav: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    background: 'rgba(6,6,8,0.95)',
    borderBottom: '1px solid var(--border)',
    backdropFilter: 'blur(10px)',
  },
  inner: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
    height: '64px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    textDecoration: 'none',
    flexShrink: 0,
  },
  logoAccent: {
    color: 'var(--teal)',
    fontSize: '1.4rem',
  },
  logoText: {
    fontFamily: 'var(--font-display)',
    fontWeight: 900,
    fontSize: '1rem',
    color: 'var(--text)',
    letterSpacing: '0.1em',
  },
  logoSub: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.65rem',
    color: 'var(--red)',
    letterSpacing: '0.2em',
    alignSelf: 'flex-end',
    marginBottom: '2px',
  },
  links: {
    display: 'flex',
    gap: '0.25rem',
    flex: 1,
  },
  link: {
    fontFamily: 'var(--font-display)',
    fontSize: '0.65rem',
    letterSpacing: '0.12em',
    color: 'var(--text-dim)',
    textDecoration: 'none',
    padding: '0.4rem 0.75rem',
    borderRadius: '3px',
    transition: 'color 0.2s',
  },
  linkActive: {
    color: 'var(--teal)',
    background: 'var(--teal-glow)',
  },
  auth: {
    marginLeft: 'auto',
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
  },
  profileBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    fontFamily: 'var(--font-display)',
    fontSize: '0.65rem',
    letterSpacing: '0.12em',
    color: 'var(--teal)',
    textDecoration: 'none',
    padding: '0.4rem 0.75rem',
  },
  profileIcon: {
    fontSize: '1rem',
  },
  hamburger: {
    display: 'none',
    background: 'none',
    border: 'none',
    padding: '0.25rem',
    marginLeft: '0.5rem',
    cursor: 'pointer',
  },
  hamburgerVisible: {
    display: 'block',
  },
  hidden: {
    display: 'none',
  },
  mobileMenu: {
    borderTop: '1px solid var(--border)',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  mobileLink: {
    fontFamily: 'var(--font-display)',
    fontSize: '0.75rem',
    letterSpacing: '0.15em',
    color: 'var(--text-dim)',
    textDecoration: 'none',
    padding: '0.75rem 1rem',
    borderBottom: '1px solid var(--border)',
    display: 'block',
  },
  mobileAuth: {
    marginTop: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
}