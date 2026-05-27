import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'

const SAMPLE_TOURNAMENTS = [
  {
    id: 'sample-1',
    title: 'NEXUS OPEN — VALORANT',
    game: 'Valorant',
    format: '5v5 Bracket',
    date: '2025-02-15',
    prize: '$500',
    entry_fee: 10,
    max_teams: 16,
    registered_teams: 9,
    status: 'open',
  },
  {
    id: 'sample-2',
    title: 'STREET FIGHTER INVITATIONAL',
    game: 'Street Fighter 6',
    format: '1v1 Double Elim',
    date: '2025-02-22',
    prize: '$200',
    entry_fee: 5,
    max_teams: 32,
    registered_teams: 18,
    status: 'open',
  },
  {
    id: 'sample-3',
    title: 'APEX LEGENDS SOLOS CUP',
    game: 'Apex Legends',
    format: 'Battle Royale Points',
    date: '2025-03-01',
    prize: '$350',
    entry_fee: 8,
    max_teams: 60,
    registered_teams: 60,
    status: 'full',
  },
  {
    id: 'sample-4',
    title: 'NEXUS MONTHLY — CS2',
    game: 'Counter-Strike 2',
    format: '5v5 Swiss',
    date: '2025-03-08',
    prize: '$750',
    entry_fee: 15,
    max_teams: 12,
    registered_teams: 3,
    status: 'open',
  },
]

export default function Tournaments() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [tournaments] = useState(SAMPLE_TOURNAMENTS)
  const [registering, setRegistering] = useState(null)
  const [form, setForm] = useState({ team_name: '', contact_discord: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  function getStatusColor(status) {
    if (status === 'open') return 'var(--teal)'
    if (status === 'full') return 'var(--red)'
    return 'var(--text-muted)'
  }

  function handleRegister(tournament) {
    if (!user) {
      navigate('/login')
      return
    }
    setRegistering(tournament)
    setError(null)
  }

  async function submitRegistration() {
    if (!form.team_name) {
      setError('Team name required')
      return
    }
    setLoading(true)
    try {
      const { error: err } = await supabase
        .from('tournament_registrations')
        .insert([
          {
            user_id: user.id,
            tournament_id: registering.id,
            team_name: form.team_name,
            contact_discord: form.contact_discord,
            status: 'registered',
          },
        ])
      if (err) throw err
      setSuccess(registering.title)
      setRegistering(null)
      setForm({ team_name: '', contact_discord: '' })
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div style={styles.header}>
        <div className="container">
          <div className="section-label">// TOURNAMENT SYSTEM</div>
          <h1 className="page-title">COMPETE &<br /><span style={{ color: 'var(--red)' }}>CONQUER</span></h1>
          <p style={styles.headerSub}>
            Weekly tournaments across all major titles. Cash prizes. Real stakes. Built-in leaderboard integration.
          </p>
        </div>
      </div>

      <div className="container">
        {success && (
          <div style={styles.successBanner}>
            <span style={{ color: 'var(--teal)' }}>✓ REGISTERED:</span>&nbsp;{success} — Check your profile for details.
            <button
              onClick={() => setSuccess(null)}
              style={{ marginLeft: '1rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              ✕
            </button>
          </div>
        )}

        <div style={styles.tournamentList}>
          {tournaments.map((t) => {
            const spotsLeft = t.max_teams - t.registered_teams
            const fillPct = (t.registered_teams / t.max_teams) * 100

            return (
              <div key={t.id} style={styles.tournamentCard}>
                <div style={styles.cardLeft}>
                  <div style={styles.statusRow}>
                    <span
                      style={{
                        ...styles.statusBadge,
                        borderColor: getStatusColor(t.status),
                        color: getStatusColor(t.status),
                      }}
                    >
                      {t.status.toUpperCase()}
                    </span>
                    <span style={styles.gameTag}>{t.game}</span>
                  </div>
                  <h2 style={styles.tournTitle}>{t.title}</h2>
                  <div style={styles.metaRow}>
                    {[
                      ['📅', t.date],
                      ['🎮', t.format],
                      ['💰', `$${t.entry_fee} entry`],
                    ].map(([icon, val]) => (
                      <span key={val} style={styles.metaItem}>
                        <span>{icon}</span> {val}
                      </span>
                    ))}
                  </div>
                  <div style={styles.progressSection}>
                    <div style={styles.progressLabel}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                        {t.registered_teams}/{t.max_teams} TEAMS
                      </span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: t.status === 'full' ? 'var(--red)' : 'var(--teal)' }}>
                        {t.status === 'full' ? 'FULL' : `${spotsLeft} SPOTS LEFT`}
                      </span>
                    </div>
                    <div style={styles.progressBar}>
                      <div
                        style={{
                          height: '100%',
                          width: `${fillPct}%`,
                          background: t.status === 'full' ? 'var(--red)' : 'var(--teal)',
                          borderRadius: '2px',
                          transition: 'width 0.3s',
                          boxShadow: t.status === 'full' ? '0 0 8px var(--red-glow)' : '0 0 8px var(--teal-glow)',
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div style={styles.cardRight}>
                  <div style={styles.prizeBox}>
                    <span style={styles.prizeLabel}>PRIZE POOL</span>
                    <span style={styles.prizeAmount}>{t.prize}</span>
                  </div>
                  <button
                    className={t.status === 'full' ? 'btn-ghost' : 'btn-primary'}
                    disabled={t.status === 'full'}
                    onClick={() => handleRegister(t)}
                    style={{ opacity: t.status === 'full' ? 0.5 : 1, width: '100%' }}
                  >
                    {t.status === 'full' ? 'FULL' : user ? 'REGISTER' : 'LOGIN TO REGISTER'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {registering && (
        <div style={styles.modal} onClick={(e) => { if (e.target === e.currentTarget) setRegistering(null) }}>
          <div style={styles.modalBox}>
            <div style={styles.modalHeader}>
              <div>
                <div className="section-label">// REGISTRATION</div>
                <h3 style={styles.modalTitle}>{registering.title}</h3>
              </div>
              <button onClick={() => setRegistering(null)} style={styles.closeBtn}>✕</button>
            </div>

            <div style={styles.field}>
              <label style={styles.label}>TEAM / PLAYER NAME *</label>
              <input
                type="text"
                placeholder="Enter your team or player name"
                value={form.team_name}
                onChange={(e) => setForm((f) => ({ ...f, team_name: e.target.value }))}
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>DISCORD HANDLE</label>
              <input
                type="text"
                placeholder="username#1234"
                value={form.contact_discord}
                onChange={(e) => setForm((f) => ({ ...f, contact_discord: e.target.value }))}
              />
            </div>

            <div style={styles.entryNote}>
              <span style={{ color: 'var(--text-muted)' }}>Entry fee:</span>
              <span style={{ color: 'var(--teal)', fontFamily: 'var(--font-display)' }}>
                ${registering.entry_fee} — collected at front desk
              </span>
            </div>

            {error && (
              <p style={{ color: 'var(--red)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', marginBottom: '1rem' }}>
                ⚠ {error}
              </p>
            )}

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn-ghost" onClick={() => setRegistering(null)} style={{ flex: 1 }}>
                CANCEL
              </button>
              <button
                className="btn-primary"
                onClick={submitRegistration}
                disabled={loading}
                style={{ flex: 2, opacity: loading ? 0.7 : 1 }}
              >
                {loading ? 'REGISTERING...' : '▶ CONFIRM ENTRY'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const styles = {
  header: {
    padding: '4rem 0 3rem',
    borderBottom: '1px solid var(--border)',
    background: 'var(--bg-1)',
    marginBottom: '3rem',
  },
  headerSub: {
    color: 'var(--text-dim)',
    fontSize: '1.05rem',
    marginTop: '1rem',
    maxWidth: '500px',
  },
  successBanner: {
    background: 'rgba(0,245,212,0.08)',
    border: '1px solid var(--teal)',
    borderRadius: '6px',
    padding: '1rem 1.5rem',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.8rem',
    color: 'var(--text)',
    letterSpacing: '0.05em',
    marginBottom: '2rem',
    display: 'flex',
    alignItems: 'center',
  },
  tournamentList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
    marginBottom: '4rem',
  },
  tournamentCard: {
    background: 'var(--bg-1)',
    border: '1px solid var(--border)',
    borderRadius: '10px',
    padding: '1.75rem',
    display: 'flex',
    gap: '2rem',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    position: 'relative',
    overflow: 'hidden',
  },
  cardLeft: {
    flex: 1,
    minWidth: '240px',
  },
  cardRight: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    minWidth: '160px',
    alignItems: 'flex-end',
  },
  statusRow: {
    display: 'flex',
    gap: '0.75rem',
    alignItems: 'center',
    marginBottom: '0.75rem',
  },
  statusBadge: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.6rem',
    letterSpacing: '0.2em',
    padding: '0.2rem 0.6rem',
    border: '1px solid',
    borderRadius: '3px',
  },
  gameTag: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.65rem',
    color: 'var(--text-muted)',
    letterSpacing: '0.1em',
  },
  tournTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.1rem',
    fontWeight: 700,
    letterSpacing: '0.05em',
    marginBottom: '0.75rem',
  },
  metaRow: {
    display: 'flex',
    gap: '1.25rem',
    flexWrap: 'wrap',
    marginBottom: '1.25rem',
  },
  metaItem: {
    fontSize: '0.85rem',
    color: 'var(--text-dim)',
    display: 'flex',
    gap: '0.35rem',
    alignItems: 'center',
  },
  progressSection: {
    maxWidth: '400px',
  },
  progressLabel: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.4rem',
  },
  progressBar: {
    height: '4px',
    background: 'var(--bg-3)',
    borderRadius: '2px',
    overflow: 'hidden',
  },
  prizeBox: {
    textAlign: 'right',
  },
  prizeLabel: {
    display: 'block',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.6rem',
    letterSpacing: '0.2em',
    color: 'var(--text-muted)',
    marginBottom: '0.2rem',
  },
  prizeAmount: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.8rem',
    fontWeight: 900,
    color: 'var(--teal)',
  },
  modal: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.85)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '1rem',
  },
  modalBox: {
    background: 'var(--bg-1)',
    border: '1px solid var(--border)',
    borderRadius: '12px',
    padding: '2rem',
    width: '100%',
    maxWidth: '480px',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '2rem',
  },
  modalTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: '1rem',
    letterSpacing: '0.05em',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    fontSize: '1.2rem',
    cursor: 'pointer',
    padding: '0.25rem',
  },
  field: {
    marginBottom: '1.5rem',
  },
  label: {
    display: 'block',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.65rem',
    color: 'var(--teal)',
    letterSpacing: '0.2em',
    marginBottom: '0.5rem',
  },
  entryNote: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '1rem',
    background: 'var(--bg-2)',
    border: '1px solid var(--border)',
    borderRadius: '6px',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.8rem',
    marginBottom: '1.5rem',
  },
}
