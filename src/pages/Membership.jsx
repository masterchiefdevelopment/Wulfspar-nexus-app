import { Link } from 'react-router-dom'

const TIERS = [
  {
    id: 'casual',
    name: 'CASUAL',
    price: '$10',
    period: '/hr',
    tag: 'WALK-IN',
    color: 'var(--text)',
    features: [
      'Any available rig',
      'Standard support',
      'Access all titles',
      'Tournament eligible',
    ],
    excluded: ['Priority booking', 'Prime time discount', 'Member events', 'Locker storage'],
    cta: 'WALK IN',
    ctaLink: '/book',
    highlight: false,
  },
  {
    id: 'prime',
    name: 'PRIME PASS',
    price: '$35',
    period: '/hr after 5PM',
    tag: 'PRIME TIME',
    color: 'var(--red)',
    features: [
      'Premium rig access',
      'After 5PM access',
      'All casual benefits',
      'Weekend peak hours',
    ],
    excluded: ['Monthly savings', 'Priority booking', 'Member events'],
    cta: 'BOOK PRIME',
    ctaLink: '/book',
    highlight: false,
  },
  {
    id: 'all_day',
    name: 'ALL DAY',
    price: '$30',
    period: '/day',
    tag: 'BEST DAILY',
    color: 'var(--teal)',
    features: [
      'Open to close access',
      'Any rig, any time',
      'All titles included',
      'Best daily value',
      'Tournament eligible',
    ],
    excluded: ['Priority booking', 'Member events'],
    cta: 'GET PASS',
    ctaLink: '/book',
    highlight: false,
  },
  {
    id: 'member',
    name: 'NEXUS MEMBER',
    price: '$49',
    period: '+/month',
    tag: '⚡ BEST VALUE',
    color: 'var(--teal)',
    features: [
      'Unlimited monthly sessions',
      'Priority rig booking',
      'All-day & prime included',
      'Exclusive member events',
      'Personal locker storage',
      'Leaderboard badge',
      'Early tournament access',
      '10% merch & food discount',
    ],
    excluded: [],
    cta: 'JOIN NEXUS',
    ctaLink: '/register',
    highlight: true,
  },
]

const TIERS_COMPARE = [
  'Hourly Access',
  'All-Day Access',
  'Prime Time (5PM+)',
  'Priority Booking',
  'Member Events',
  'Locker Storage',
  'Leaderboard Badge',
  'Merch Discount',
]

const TIER_MATRIX = {
  casual:  [true,  false, false, false, false, false, false, false],
  prime:   [true,  false, true,  false, false, false, false, false],
  all_day: [true,  true,  true,  false, false, false, false, false],
  member:  [true,  true,  true,  true,  true,  true,  true,  true],
}

export default function Membership() {
  return (
    <div>
      <div style={styles.header}>
        <div className="container">
          <div className="section-label">// MEMBERSHIP TIERS</div>
          <h1 className="page-title">CHOOSE YOUR<br /><span style={{ color: 'var(--teal)' }}>ACCESS LEVEL</span></h1>
          <p style={styles.headerSub}>From casual drop-ins to full Nexus membership. Pick your battle station.</p>
        </div>
      </div>

      {/* Tier Cards */}
      <section className="container" style={styles.tiersSection}>
        <div style={styles.tiersGrid}>
          {TIERS.map(tier => (
            <div
              key={tier.id}
              style={{
                ...styles.tierCard,
                borderColor: tier.highlight ? 'var(--teal)' : 'var(--border)',
                background: tier.highlight
                  ? 'linear-gradient(160deg, var(--bg-2) 0%, rgba(0,245,212,0.04) 100%)'
                  : 'var(--bg-1)',
                transform: tier.highlight ? 'translateY(-8px)' : 'none',
              }}
            >
              {tier.highlight && (
                <div style={styles.popularBadge}>⚡ MOST POPULAR</div>
              )}
              <div style={styles.tierTag}>
                <span style={{ color: tier.color }}>{tier.tag}</span>
              </div>
              <div style={styles.tierName}>{tier.name}</div>
              <div style={styles.tierPricing}>
                <span style={{ ...styles.tierPrice, color: tier.color }}>{tier.price}</span>
                <span style={styles.tierPeriod}>{tier.period}</span>
              </div>

              <div style={styles.featureList}>
                {tier.features.map(f => (
                  <div key={f} style={styles.featureItem}>
                    <span style={{ color: 'var(--teal)' }}>✓</span>
                    <span>{f}</span>
                  </div>
                ))}
                {tier.excluded.map(f => (
                  <div key={f} style={{ ...styles.featureItem, opacity: 0.35 }}>
                    <span>✕</span>
                    <span style={{ textDecoration: 'line-through' }}>{f}</span>
                  </div>
                ))}
              </div>

              <Link
                to={tier.ctaLink}
                className={tier.highlight ? 'btn-primary' : 'btn-ghost'}
                style={{ display: 'block', textAlign: 'center', marginTop: 'auto' }}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison Table */}
      <section style={styles.compareSection}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div className="section-label">// FEATURE COMPARISON</div>
            <h2 className="page-title" style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)' }}>FULL BREAKDOWN</h2>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>FEATURE</th>
                  {TIERS.map(t => (
                    <th key={t.id} style={{ ...styles.th, color: t.color }}>{t.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TIERS_COMPARE.map((feature, i) => (
                  <tr key={feature} style={{ background: i % 2 === 0 ? 'var(--bg-1)' : 'transparent' }}>
                    <td style={styles.td}>{feature}</td>
                    {TIERS.map(t => (
                      <td key={t.id} style={{
                        ...styles.td,
                        textAlign: 'center',
                        color: TIER_MATRIX[t.id][i] ? 'var(--teal)' : 'var(--text-muted)',
                      }}>
                        {TIER_MATRIX[t.id][i] ? '✓' : '—'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container" style={styles.faqSection}>
        <div className="section-label">// COMMON QUESTIONS</div>
        <h2 className="page-title" style={{ marginBottom: '2rem', fontSize: 'clamp(1.5rem, 4vw, 2.5rem)' }}>FAQ</h2>
        {[
          ['Can I cancel my membership?', 'Yes. Cancel anytime — your access continues until the end of the billing cycle.'],
          ['Does membership include prime time?', 'Full Nexus membership includes all hours, including prime time after 5PM.'],
          ['Can I share a session?', 'Sessions are per-person. Each player needs their own booking or membership.'],
          ['What hardware do rigs run?', 'All rigs run RTX 4090 GPUs, 360Hz monitors, and mechanical keyboards.'],
        ].map(([q, a]) => (
          <div key={q} style={styles.faqItem}>
            <div style={styles.faqQ}>{q}</div>
            <div style={styles.faqA}>{a}</div>
          </div>
        ))}
      </section>
    </div>
  )
}

const styles = {
  header: {
    padding: '4rem 0 3rem',
    borderBottom: '1px solid var(--border)',
    background: 'var(--bg-1)',
    marginBottom: '4rem',
  },
  headerSub: {
    color: 'var(--text-dim)',
    fontSize: '1.1rem',
    marginTop: '1rem',
    maxWidth: '480px',
  },
  tiersSection: {
    marginBottom: '5rem',
  },
  tiersGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '1.5rem',
    alignItems: 'start',
  },
  tierCard: {
    border: '1px solid',
    borderRadius: '12px',
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    position: 'relative',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  popularBadge: {
    position: 'absolute',
    top: '-12px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'var(--teal)',
    color: 'var(--bg)',
    fontFamily: 'var(--font-display)',
    fontSize: '0.6rem',
    letterSpacing: '0.15em',
    padding: '0.25rem 1rem',
    borderRadius: '20px',
    whiteSpace: 'nowrap',
  },
  tierTag: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.65rem',
    letterSpacing: '0.2em',
  },
  tierName: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.1rem',
    fontWeight: 700,
    letterSpacing: '0.08em',
  },
  tierPricing: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '0.4rem',
  },
  tierPrice: {
    fontFamily: 'var(--font-display)',
    fontSize: '2.5rem',
    fontWeight: 900,
  },
  tierPeriod: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.7rem',
    color: 'var(--text-muted)',
  },
  featureList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    flex: 1,
    marginBottom: '0.5rem',
  },
  featureItem: {
    display: 'flex',
    gap: '0.6rem',
    fontSize: '0.9rem',
    color: 'var(--text-dim)',
    alignItems: 'flex-start',
  },
  compareSection: {
    background: 'var(--bg-1)',
    borderTop: '1px solid var(--border)',
    borderBottom: '1px solid var(--border)',
    padding: '4rem 0',
    marginBottom: '4rem',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: '600px',
  },
  th: {
    fontFamily: 'var(--font-display)',
    fontSize: '0.65rem',
    letterSpacing: '0.15em',
    padding: '1rem 1.5rem',
    textAlign: 'left',
    borderBottom: '1px solid var(--border)',
    color: 'var(--text-dim)',
  },
  td: {
    padding: '0.875rem 1.5rem',
    fontSize: '0.9rem',
    color: 'var(--text-dim)',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
  },
  faqSection: {
    maxWidth: '720px',
    marginBottom: '5rem',
  },
  faqItem: {
    borderBottom: '1px solid var(--border)',
    paddingBottom: '1.5rem',
    marginBottom: '1.5rem',
  },
  faqQ: {
    fontFamily: 'var(--font-display)',
    fontSize: '0.9rem',
    letterSpacing: '0.05em',
    color: 'var(--text)',
    marginBottom: '0.5rem',
  },
  faqA: {
    fontSize: '0.95rem',
    color: 'var(--text-dim)',
    lineHeight: 1.7,
  },
}
