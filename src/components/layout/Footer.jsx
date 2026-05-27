import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div className="container">
        <div style={styles.grid}>
          <div>
            <div style={styles.brand}>
              <span style={{ color: 'var(--teal)' }}>⬡</span> WULFSPAR NEXUS
            </div>
            <p style={styles.tagline}>Where champions are forged.</p>
          </div>
          <div>
            <div style={styles.colTitle}>NAVIGATE</div>
            {[
              ['/', 'Home'],
              ['/book', 'Book Session'],
              ['/membership', 'Membership'],
              ['/leaderboard', 'Leaderboard'],
            ].map(([to, label]) => (
              <Link key={to} to={to} style={styles.footerLink}>{label}</Link>
            ))}
          </div>
          <div>
            <div style={styles.colTitle}>COMPETE</div>
            {[
              ['/tournaments', 'Tournaments'],
              ['/leaderboard', 'Leaderboard'],
              ['/register', 'Create Account'],
            ].map(([to, label]) => (
              <Link key={to} to={to} style={styles.footerLink}>{label}</Link>
            ))}
          </div>
          <div>
            <div style={styles.colTitle}>HOURS</div>
            <p style={styles.hours}>Mon–Thu: 10am – 12am</p>
            <p style={styles.hours}>Fri–Sat: 10am – 3am</p>
            <p style={styles.hours}>Sun: 12pm – 10pm</p>
            <p style={{ ...styles.hours, color: 'var(--red)', marginTop: '0.5rem' }}>
              Prime Time after 5PM
            </p>
          </div>
        </div>
        <div style={styles.bottom}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            © 2025 WULFSPAR NEXUS // ALL RIGHTS RESERVED
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--teal)' }}>
            SYS:ONLINE ◉
          </span>
        </div>
      </div>
    </footer>
  )
}

const styles = {
  footer: {
    background: 'var(--bg-1)',
    borderTop: '1px solid var(--border)',
    padding: '3rem 0 1.5rem',
    marginTop: '4rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: '2rem',
    marginBottom: '2rem',
  },
  brand: {
    fontFamily: 'var(--font-display)',
    fontWeight: 900,
    fontSize: '1rem',
    letterSpacing: '0.1em',
    marginBottom: '0.5rem',
  },
  tagline: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.7rem',
    color: 'var(--text-muted)',
    letterSpacing: '0.1em',
  },
  colTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: '0.65rem',
    letterSpacing: '0.2em',
    color: 'var(--teal)',
    marginBottom: '0.75rem',
  },
  footerLink: {
    display: 'block',
    fontFamily: 'var(--font-body)',
    fontSize: '0.9rem',
    color: 'var(--text-dim)',
    textDecoration: 'none',
    marginBottom: '0.35rem',
    transition: 'color 0.2s',
  },
  hours: {
    fontSize: '0.85rem',
    color: 'var(--text-dim)',
    marginBottom: '0.25rem',
  },
  bottom: {
    borderTop: '1px solid var(--border)',
    paddingTop: '1.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem',
  },
}
