import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const STATS = [
  { value: '48', label: 'Gaming Rigs' },
  { value: '4K', label: 'Displays' },
  { value: '24/7', label: 'Support' },
  { value: '360Hz', label: 'Refresh Rate' },
]

const FEATURES = [
  { icon: '⚡', title: 'High Performance', desc: 'RTX 4090 rigs, 360Hz monitors, sub-1ms response time.' },
  { icon: '🎮', title: 'All Genres', desc: 'FPS, MOBA, Battle Royale, Fighting — we run every title.' },
  { icon: '🏆', title: 'Weekly Tournaments', desc: 'Compete for cash prizes and rank on our global leaderboard.' },
  { icon: '◈', title: 'VIP Membership', desc: 'Priority booking, discounts, and exclusive member-only events.' },
]

export default function Home() {
  const { user } = useAuth()

  return (
    <div>
      {/* Hero */}
      <section style={styles.hero}>
        <div style={styles.heroGrid} />
        <div style={styles.heroGlow} />
        <div className="container" style={styles.heroContent}>
          <div style={styles.heroEyebrow}>
            <span style={styles.eyebrowDot} />
            <span style={styles.eyebrowText}>NOW ONLINE // SEASON 7</span>
            <span style={styles.eyebrowDot} />
          </div>
          <h1 style={styles.heroTitle}>
            <span style={styles.heroTitleLine1}>WULFSPAR</span>
            <span style={styles.heroTitleLine2}>NEXUS</span>
          </h1>
          <p style={styles.heroSub}>
            The premier cyberpunk gaming arena. Dominate the grid.<br />
            Own the leaderboard. Leave a legacy.
          </p>
          <div style={styles.heroCTA}>
            <Link to="/book" className="btn-primary" style={{ fontSize: '0.8rem', padding: '1rem 2.5rem' }}>
              ▶ BOOK SESSION
            </Link>
            <Link to="/membership" className="btn-ghost" style={{ fontSize: '0.8rem', padding: '1rem 2.5rem' }}>
              VIEW MEMBERSHIP
            </Link>
          </div>
          {/* Stats bar */}
          <div style={styles.statsBar}>
            {STATS.map(({ value, label }) => (
              <div key={label} style={styles.statItem}>
                <span style={styles.statValue}>{value}</span>
                <span style={styles.statLabel}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Strip */}
      <section style={styles.pricingStrip}>
        <div className="container">
          <div style={styles.pricingGrid}>
            {[
              { rate: '$10/hr', label: 'CASUAL', color: 'var(--text)' },
              { rate: '$35/hr', label: 'PRIME TIME', sub: 'After 5PM', color: 'var(--red)' },
              { rate: '$30/day', label: 'ALL DAY', sub: 'Open to Close', color: 'var(--teal)' },
              { rate: '$49+/mo', label: 'MEMBERSHIP', sub: 'Best Value', color: 'var(--teal)' },
            ].map(({ rate, label, sub, color }) => (
              <div key={label} style={styles.priceCard}>
                <span style={{ ...styles.priceRate, color }}>{rate}</span>
                <span style={styles.priceLabel}>{label}</span>
                {sub && <span style={styles.priceSub}>{sub}</span>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={styles.features}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div className="section-label">// WHY NEXUS</div>
            <h2 className="page-title">BUILT FOR<br /><span style={{ color: 'var(--teal)' }}>COMPETITORS</span></h2>
          </div>
          <div style={styles.featuresGrid}>
            {FEATURES.map(({ icon, title, desc }) => (
              <div key={title} className="card" style={styles.featureCard}>
                <span style={styles.featureIcon}>{icon}</span>
                <h3 style={styles.featureTitle}>{title}</h3>
                <p style={styles.featureDesc}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section style={styles.ctaBanner}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="section-label">// READY TO PLAY</div>
          <h2 style={styles.ctaTitle}>YOUR SESSION<br />AWAITS</h2>
          <p style={styles.ctaDesc}>
            Walk-ins welcome. Reservations guaranteed.
          </p>
          <Link to={user ? '/book' : '/register'} className="btn-primary" style={{ fontSize: '0.85rem', padding: '1.1rem 3rem' }}>
            {user ? '▶ BOOK NOW' : '▶ CREATE ACCOUNT & BOOK'}
          </Link>
        </div>
      </section>
    </div>
  )
}

const styles = {
  hero: {
    minHeight: '90vh',
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  heroGrid: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `
      linear-gradient(rgba(0,245,212,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,245,212,0.04) 1px, transparent 1px)
    `,
    backgroundSize: '60px 60px',
    maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
  },
  heroGlow: {
    position: 'absolute',
    top: '30%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '600px',
    height: '400px',
    background: 'radial-gradient(ellipse, rgba(0,245,212,0.08) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  heroContent: {
    position: 'relative',
    zIndex: 1,
    padding: '6rem 1rem',
  },
  heroEyebrow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '1.5rem',
  },
  eyebrowDot: {
    width: '6px',
    height: '6px',
    background: 'var(--teal)',
    borderRadius: '50%',
    boxShadow: '0 0 8px var(--teal)',
    display: 'inline-block',
  },
  eyebrowText: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.7rem',
    color: 'var(--teal)',
    letterSpacing: '0.25em',
  },
  heroTitle: {
    fontFamily: 'var(--font-display)',
    lineHeight: 0.9,
    marginBottom: '1.5rem',
  },
  heroTitleLine1: {
    display: 'block',
    fontSize: 'clamp(3rem, 12vw, 8rem)',
    fontWeight: 900,
    color: 'var(--text)',
    letterSpacing: '-0.02em',
  },
  heroTitleLine2: {
    display: 'block',
    fontSize: 'clamp(3rem, 12vw, 8rem)',
    fontWeight: 900,
    color: 'var(--teal)',
    letterSpacing: '-0.02em',
    textShadow: '0 0 40px rgba(0,245,212,0.4)',
    WebkitTextStroke: '1px rgba(0,245,212,0.5)',
  },
  heroSub: {
    fontSize: '1.1rem',
    color: 'var(--text-dim)',
    marginBottom: '2.5rem',
    maxWidth: '480px',
    lineHeight: 1.7,
  },
  heroCTA: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
    marginBottom: '4rem',
  },
  statsBar: {
    display: 'flex',
    gap: '2rem',
    flexWrap: 'wrap',
    borderTop: '1px solid var(--border)',
    paddingTop: '2rem',
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.2rem',
  },
  statValue: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.8rem',
    fontWeight: 900,
    color: 'var(--teal)',
  },
  statLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.65rem',
    color: 'var(--text-muted)',
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
  },
  pricingStrip: {
    background: 'var(--bg-1)',
    borderTop: '1px solid var(--border)',
    borderBottom: '1px solid var(--border)',
    padding: '2rem 0',
  },
  pricingGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '0',
  },
  priceCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '1.5rem 1rem',
    borderRight: '1px solid var(--border)',
    gap: '0.2rem',
  },
  priceRate: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.4rem',
    fontWeight: 700,
  },
  priceLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.65rem',
    color: 'var(--text-muted)',
    letterSpacing: '0.2em',
  },
  priceSub: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.85rem',
    color: 'var(--text-muted)',
  },
  features: {
    padding: '6rem 0',
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '1.5rem',
  },
  featureCard: {
    padding: '2rem',
  },
  featureIcon: {
    fontSize: '2rem',
    display: 'block',
    marginBottom: '1rem',
  },
  featureTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: '0.9rem',
    letterSpacing: '0.08em',
    color: 'var(--text)',
    marginBottom: '0.75rem',
  },
  featureDesc: {
    fontSize: '0.95rem',
    color: 'var(--text-dim)',
    lineHeight: 1.6,
  },
  ctaBanner: {
    padding: '6rem 0',
    background: 'var(--bg-1)',
    borderTop: '1px solid var(--border)',
    position: 'relative',
    overflow: 'hidden',
  },
  ctaTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: 'clamp(2rem, 6vw, 4rem)',
    fontWeight: 900,
    color: 'var(--text)',
    marginBottom: '1rem',
    letterSpacing: '-0.02em',
  },
  ctaDesc: {
    color: 'var(--text-dim)',
    fontSize: '1.1rem',
    marginBottom: '2.5rem',
  },
}
