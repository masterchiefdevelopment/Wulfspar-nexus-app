import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'

export default function Profile() {
  const { user, profile, signOut } = useAuth()
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('bookings')

  useEffect(() => {
    if (!user) return
    fetchData()
  }, [user])

  async function fetchData() {
    setLoading(true)
    const [{ data: bData }, { data: rData }] = await Promise.all([
      supabase
        .from('bookings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20),
      supabase
        .from('tournament_registrations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10),
    ])

    setBookings(bData || [])
    setRegistrations(rData || [])
    setLoading(false)
  }

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  const stats = {
    totalSessions: bookings.length,
    totalSpent: bookings.reduce((sum, b) => sum + (b.total_price || 0), 0),
    tournaments: registrations.length,
  }

  const userName = profile?.username || user?.email?.split('@')[0] || 'OPERATOR'
  const accountTier = profile?.tier || 'CASUAL'
  const createdYear = user?.created_at ? new Date(user.created_at).getFullYear() : '—'

  function getSessionTypeColor(type) {
    if (type === 'prime') return 'var(--red)'
    if (type === 'allday') return 'var(--teal)'
    return 'var(--text-muted)'
  }

  return (
    <div>
      <div style={styles.header}>
        <div className="container">
          <div style={styles.profileTop}>
            <div style={styles.avatar}>
              <span style={styles.avatarChar}>{userName[0]?.toUpperCase() || 'O'}</span>
            </div>
            <div style={styles.profileInfo}>
              <div className="section-label">// OPERATOR PROFILE</div>
              <h1 style={styles.username}>{userName}</h1>
              <div style={styles.profileMeta}>
                <span style={styles.metaTag}>{accountTier}</span>
                {profile?.role === 'admin' && (
                  <span style={{ ...styles.metaTag, borderColor: 'var(--red)', color: 'var(--red)' }}>
                    ADMIN
                  </span>
                )}
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                  {user?.email}
                </span>
              </div>
            </div>
            <button
              className="btn-danger"
              onClick={handleSignOut}
              style={{ marginLeft: 'auto', alignSelf: 'flex-start', padding: '0.5rem 1.25rem', fontSize: '0.7rem' }}
            >
              SIGN OUT
            </button>
          </div>
        </div>
      </div>

      <div className="container">
        <div style={styles.statsGrid}>
          {[
            { label: 'SESSIONS', value: stats.totalSessions },
            { label: 'TOTAL SPENT', value: `$${stats.totalSpent}` },
            { label: 'TOURNAMENTS', value: stats.tournaments },
            { label: 'MEMBER SINCE', value: createdYear },
          ].map(({ label, value }) => (
            <div key={label} style={styles.statCard}>
              <span style={styles.statValue}>{value}</span>
              <span style={styles.statLabel}>{label}</span>
            </div>
          ))}
        </div>

        <div style={styles.tabs}>
          {[
            ['bookings', 'BOOKINGS'],
            ['tournaments', 'TOURNAMENTS'],
            ['settings', 'SETTINGS'],
          ].map(([id, label]) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              style={{
                ...styles.tab,
                borderBottom: activeTab === id ? '2px solid var(--teal)' : '2px solid transparent',
                color: activeTab === id ? 'var(--teal)' : 'var(--text-muted)',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {activeTab === 'bookings' && (
          <div style={styles.tabContent}>
            {loading ? (
              <div style={styles.loadingState}>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--teal)', letterSpacing: '0.2em' }}>
                  LOADING...
                </span>
              </div>
            ) : bookings.length === 0 ? (
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}>◈</div>
                <p style={styles.emptyText}>No sessions booked yet.</p>
                <button className="btn-primary" onClick={() => navigate('/book')}>
                  BOOK FIRST SESSION
                </button>
              </div>
            ) : (
              <div style={styles.list}>
                {bookings.map((b) => (
                  <div key={b.id} style={styles.bookingCard}>
                    <div>
                      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.4rem' }}>
                        <span style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.6rem',
                          letterSpacing: '0.15em',
                          padding: '0.15rem 0.5rem',
                          border: '1px solid',
                          borderColor: getSessionTypeColor(b.session_type),
                          borderRadius: '3px',
                          color: getSessionTypeColor(b.session_type),
                        }}>
                          {(b.session_type || 'casual').toUpperCase()}
                        </span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.1em', color: b.status === 'confirmed' ? 'var(--teal)' : 'var(--text-muted)' }}>
                          {(b.status || 'confirmed').toUpperCase()}
                        </span>
                      </div>
                      <div style={styles.bookingDate}>{b.date || 'N/A'} at {b.start_time || 'N/A'}</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                        ID: #{b.id?.slice(0, 8).toUpperCase()}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--teal)' }}>
                        ${b.total_price || 0}
                      </span>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                        {b.hours ? `${b.hours}hr` : 'all day'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'tournaments' && (
          <div style={styles.tabContent}>
            {registrations.length === 0 ? (
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}>🏆</div>
                <p style={styles.emptyText}>No tournament entries yet.</p>
                <button className="btn-primary" onClick={() => navigate('/tournaments')}>
                  VIEW TOURNAMENTS
                </button>
              </div>
            ) : (
              <div style={styles.list}>
                {registrations.map((r) => (
                  <div key={r.id} style={styles.bookingCard}>
                    <div>
                      <div style={styles.bookingDate}>{r.team_name}</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                        Discord: {r.contact_discord || 'N/A'}
                      </div>
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--teal)', letterSpacing: '0.1em' }}>
                      {(r.status || 'registered').toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div style={{ ...styles.tabContent, maxWidth: '480px' }}>
            <div style={styles.settingsSection}>
              <div className="section-label" style={{ marginBottom: '1rem' }}>// ACCOUNT INFO</div>
              {[
                ['EMAIL', user?.email],
                ['USERNAME', profile?.username || '—'],
                ['ROLE', profile?.role || 'user'],
                ['MEMBERSHIP', accountTier],
              ].map(([label, value]) => (
                <div key={label} style={styles.settingRow}>
                  <span style={styles.settingLabel}>{label}</span>
                  <span style={{ ...styles.settingValue, color: label === 'MEMBERSHIP' ? 'var(--teal)' : 'var(--text)' }}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '2rem', marginTop: '2rem' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                To upgrade your membership or update account details, visit the front desk or contact support.
              </p>
              <button className="btn-danger" onClick={handleSignOut}>SIGN OUT OF NEXUS</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  header: {
    padding: '3rem 0',
    borderBottom: '1px solid var(--border)',
    background: 'var(--bg-1)',
    marginBottom: '2.5rem',
  },
  profileTop: {
    display: 'flex',
    gap: '1.5rem',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  avatar: {
    width: '72px',
    height: '72px',
    borderRadius: '50%',
    border: '2px solid var(--teal)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--teal-glow)',
    flexShrink: 0,
  },
  avatarChar: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.8rem',
    fontWeight: 900,
    color: 'var(--teal)',
  },
  profileInfo: { flex: 1 },
  username: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.8rem',
    fontWeight: 900,
    letterSpacing: '0.05em',
    marginBottom: '0.5rem',
  },
  profileMeta: {
    display: 'flex',
    gap: '0.75rem',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  metaTag: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.6rem',
    letterSpacing: '0.15em',
    padding: '0.2rem 0.6rem',
    border: '1px solid var(--teal)',
    borderRadius: '3px',
    color: 'var(--teal)',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '1rem',
    marginBottom: '2.5rem',
  },
  statCard: {
    background: 'var(--bg-1)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    padding: '1.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  statValue: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.8rem',
    fontWeight: 900,
    color: 'var(--teal)',
  },
  statLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.6rem',
    color: 'var(--text-muted)',
    letterSpacing: '0.2em',
  },
  tabs: {
    display: 'flex',
    borderBottom: '1px solid var(--border)',
    marginBottom: '2rem',
  },
  tab: {
    fontFamily: 'var(--font-display)',
    fontSize: '0.7rem',
    letterSpacing: '0.15em',
    padding: '0.875rem 1.5rem',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    transition: 'color 0.2s',
  },
  tabContent: {
    minHeight: '300px',
    marginBottom: '4rem',
  },
  loadingState: {
    display: 'flex',
    justifyContent: 'center',
    padding: '4rem',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '4rem 1rem',
    gap: '1rem',
    textAlign: 'center',
  },
  emptyIcon: {
    fontSize: '3rem',
    color: 'var(--text-muted)',
  },
  emptyText: {
    color: 'var(--text-muted)',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.8rem',
    letterSpacing: '0.1em',
    marginBottom: '0.5rem',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  bookingCard: {
    background: 'var(--bg-1)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    padding: '1.25rem 1.5rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '1rem',
  },
  bookingDate: {
    fontFamily: 'var(--font-display)',
    fontSize: '0.9rem',
    letterSpacing: '0.05em',
    color: 'var(--text)',
    marginBottom: '0.25rem',
  },
  settingsSection: {
    background: 'var(--bg-1)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    padding: '1.5rem',
  },
  settingRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem 0',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
  },
  settingLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.65rem',
    color: 'var(--text-muted)',
    letterSpacing: '0.15em',
  },
  settingValue: {
    fontFamily: 'var(--font-body)',
    fontSize: '0.95rem',
  },
}
