import { useState } from 'react'
import { supabase } from '../lib/supabase'

const SAMPLE_LEADERS = [
  { rank: 1, username: 'NIGHTWULF_X',   wins: 47, losses: 8,  kd: 4.2, hours: 312, badge: '⚡', tier: 'NEXUS MEMBER' },
  { rank: 2, username: 'VIPER_ZERO',    wins: 43, losses: 11, kd: 3.8, hours: 280, badge: '🏆', tier: 'NEXUS MEMBER' },
  { rank: 3, username: 'KRYOS_88',      wins: 39, losses: 14, kd: 3.1, hours: 255, badge: '🔥', tier: 'NEXUS MEMBER' },
  { rank: 4, username: 'SHADE_PROTOCOL',wins: 35, losses: 15, kd: 2.9, hours: 198, badge: null, tier: 'ALL DAY' },
  { rank: 5, username: 'REAPER_SYN',    wins: 32, losses: 18, kd: 2.6, hours: 176, badge: null, tier: 'CASUAL' },
  { rank: 6, username: 'GHOST_FLUX',    wins: 28, losses: 20, kd: 2.3, hours: 154, badge: null, tier: 'NEXUS MEMBER' },
  { rank: 7, username: 'ECHO_7',        wins: 25, losses: 22, kd: 2.0, hours: 142, badge: null, tier: 'CASUAL' },
  { rank: 8, username: 'NEON_PULSE',    wins: 22, losses: 25, kd: 1.8, hours: 130, badge: null, tier: 'ALL DAY' },
  { rank: 9, username: 'PHANTOM_CODE',  wins: 19, losses: 27, kd: 1.6, hours: 118, badge: null, tier: 'CASUAL' },
  { rank: 10, username: 'ZERO_NEXUS',   wins: 17, losses: 30, kd: 1.4, hours: 105, badge: null, tier: 'CASUAL' },
]

const GAMES = ['ALL GAMES', 'VALORANT', 'CS2', 'APEX LEGENDS', 'SF6', 'WARZONE']

export default function Leaderboard() {
  const [leaders] = useState(SAMPLE_LEADERS)
  const [activeGame, setActiveGame] = useState('ALL GAMES')
  const [sortBy, setSortBy] = useState('wins')

  const sorted = [...leaders]
    .sort((a, b) => b[sortBy] - a[sortBy])
    .map((p, i) => ({ ...p, rank: i + 1 }))

  function getRankStyle(rank) {
    if (rank === 1) return { color: '#FFD700', glow: 'rgba(255,215,0,0.3)' }
    if (rank === 2) return { color: '#C0C0C0', glow: 'rgba(192,192,192,0.2)' }
    if (rank === 3) return { color: '#CD7F32', glow: 'rgba(205,127,50,0.2)' }
    return { color: 'var(--text-muted)', glow: 'transparent' }
  }

  return (
    <div>
      <div style={styles.header}>
        <div className="container">
          <div className="section-label">// GLOBAL RANKINGS</div>
          <h1 className="page-title">LEADER<br /><span style={{ color: 'var(--teal)' }}>BOARD</span></h1>
          <p style={styles.headerSub}>
            Season 7 standings. Updated weekly. Top players earn priority booking and exclusive events.
          </p>
        </div>
      </div>

      <div className="container">
        {/* Top 3 Podium */}
        <div style={styles.podium}>
          {sorted.slice(0, 3).map((p, i) => {
            const { color, glow } = getRankStyle(i + 1)
            const isFirst = i === 0
            return (
              <div
                key={p.username}
                style={{
                  ...styles.podiumCard,
                  borderColor: color,
                  order: i === 0 ? 2 : i === 1 ? 1 : 3,
                  transform: isFirst ? 'translateY(-20px)' : 'none',
                  boxShadow: `0 0 30px ${glow}`,
                }}
              >
                <div style={{ ...styles.podiumRank, color }}>
                  {i === 0 ? '👑' : i === 1 ? '🥈' : '🥉'}
                </div>
                <div style={styles.podiumUsername}>{p.username}</div>
                <div style={styles.podiumWins}>
                  <span style={{ color, fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 900 }}>
                    {p.wins}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '0.15em' }}>
                    WINS
                  </span>
                </div>
                <div style={styles.podiumKD}>KD {p.kd}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--teal)', letterSpacing: '0.1em' }}>
                  {p.tier}
                </div>
              </div>
            )
          })}
        </div>

        {/* Filters */}
        <div style={styles.filters}>
          <div style={styles.gameFilter}>
            {GAMES.map(g => (
              <button
                key={g}
                onClick={() => setActiveGame(g)}
                style={{
                  ...styles.filterBtn,
                  borderColor: activeGame === g ? 'var(--teal)' : 'var(--border)',
                  color: activeGame === g ? 'var(--teal)' : 'var(--text-muted)',
                  background: activeGame === g ? 'var(--teal-glow)' : 'transparent',
                }}
              >
                {g}
              </button>
            ))}
          </div>
          <div style={styles.sortRow}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)' }}>SORT:</span>
            {[[ 'wins', 'WINS'], ['kd', 'K/D'], ['hours', 'HOURS']].map(([key, label]) => (
              <button
                key={key}
                onClick={() => setSortBy(key)}
                style={{
                  ...styles.sortBtn,
                  color: sortBy === key ? 'var(--teal)' : 'var(--text-muted)',
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Full Table */}
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['RANK', 'PLAYER', 'WINS', 'LOSSES', 'K/D', 'HOURS', 'TIER'].map(h => (
                  <th key={h} style={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map(p => {
                const { color } = getRankStyle(p.rank)
                return (
                  <tr
                    key={p.username}
                    style={{
                      ...styles.row,
                      background: p.rank <= 3
                        ? `rgba(${p.rank === 1 ? '255,215,0' : p.rank === 2 ? '192,192,192' : '205,127,50'},0.03)`
                        : 'transparent',
                    }}
                  >
                    <td style={{ ...styles.td, color, fontFamily: 'var(--font-display)', fontWeight: 700 }}>
                      #{p.rank}
                    </td>
                    <td style={styles.td}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {p.badge && <span>{p.badge}</span>}
                        <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.85rem', letterSpacing: '0.05em' }}>
                          {p.username}
                        </span>
                      </div>
                    </td>
                    <td style={{ ...styles.td, color: 'var(--teal)', fontFamily: 'var(--font-display)', fontWeight: 700 }}>
                      {p.wins}
                    </td>
                    <td style={{ ...styles.td, color: 'var(--text-muted)' }}>{p.losses}</td>
                    <td style={styles.td}>{p.kd}</td>
                    <td style={{ ...styles.td, color: 'var(--text-muted)' }}>{p.hours}h</td>
                    <td style={styles.td}>
                      <span style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.6rem',
                        letterSpacing: '0.1em',
                        padding: '0.2rem 0.5rem',
                        border: '1px solid',
                        borderColor: p.tier === 'NEXUS MEMBER' ? 'var(--teal)' : 'var(--border)',
                        borderRadius: '3px',
                        color: p.tier === 'NEXUS MEMBER' ? 'var(--teal)' : 'var(--text-muted)',
                      }}>
                        {p.tier}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
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
    maxWidth: '520px',
  },
  podium: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    marginBottom: '3rem',
    flexWrap: 'wrap',
    alignItems: 'flex-end',
  },
  podiumCard: {
    background: 'var(--bg-1)',
    border: '1px solid',
    borderRadius: '10px',
    padding: '1.5rem',
    textAlign: 'center',
    minWidth: '160px',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
    alignItems: 'center',
    flex: '1 1 160px',
    maxWidth: '220px',
  },
  podiumRank: {
    fontSize: '2rem',
    marginBottom: '0.25rem',
  },
  podiumUsername: {
    fontFamily: 'var(--font-display)',
    fontSize: '0.8rem',
    letterSpacing: '0.1em',
  },
  podiumWins: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  podiumKD: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.7rem',
    color: 'var(--text-muted)',
  },
  filters: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  gameFilter: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
  },
  filterBtn: {
    padding: '0.4rem 0.75rem',
    border: '1px solid',
    borderRadius: '4px',
    background: 'transparent',
    fontFamily: 'var(--font-display)',
    fontSize: '0.6rem',
    letterSpacing: '0.1em',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  sortRow: {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
  },
  sortBtn: {
    background: 'none',
    border: 'none',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.65rem',
    letterSpacing: '0.1em',
    cursor: 'pointer',
    padding: '0.2rem 0.5rem',
    transition: 'color 0.2s',
  },
  tableWrap: {
    overflowX: 'auto',
    marginBottom: '4rem',
    border: '1px solid var(--border)',
    borderRadius: '8px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: '600px',
  },
  th: {
    fontFamily: 'var(--font-display)',
    fontSize: '0.6rem',
    letterSpacing: '0.15em',
    padding: '1rem 1.25rem',
    textAlign: 'left',
    color: 'var(--text-muted)',
    background: 'var(--bg-2)',
  },
  row: {
    borderBottom: '1px solid rgba(255,255,255,0.04)',
    transition: 'background 0.15s',
  },
  td: {
    padding: '1rem 1.25rem',
    fontSize: '0.9rem',
    color: 'var(--text)',
  },
}
