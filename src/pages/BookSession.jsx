import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'

const SESSION_TYPES = [
  { id: 'casual', label: 'CASUAL HOURLY', rate: '$10/hr', desc: 'Standard access, any rig', color: 'var(--text)' },
  { id: 'prime',  label: 'PRIME TIME',    rate: '$35/hr', desc: 'After 5PM — premium experience', color: 'var(--red)' },
  { id: 'allday', label: 'ALL DAY PASS',  rate: '$30/day', desc: 'Open to close, one flat rate', color: 'var(--teal)' },
]

function getHourlyRate(type, hours) {
  if (type === 'allday') return 30
  const baseRate = type === 'prime' ? 35 : 10
  return baseRate * hours
}

export default function BookSession() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    session_type: 'casual',
    date: '',
    start_time: '',
    hours: 2,
    rig_preference: 'any',
    notes: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [bookingId, setBookingId] = useState(null)

  // Auth wall — not logged in
  if (!user) {
    return (
      <div className="container" style={styles.authWall}>
        <div className="section-label">// ACCESS REQUIRED</div>
        <h2 style={styles.authTitle}>LOGIN TO BOOK</h2>
        <p style={{ color: 'var(--text-dim)', marginBottom: '2rem' }}>
          You need an account to reserve a session.
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button className="btn-primary" onClick={() => navigate('/login')}>LOGIN</button>
          <button className="btn-ghost" onClick={() => navigate('/register')}>CREATE ACCOUNT</button>
        </div>
      </div>
    )
  }

  const selectedType = SESSION_TYPES.find(t => t.id === form.session_type)
  const total = getHourlyRate(form.session_type, form.hours)

  function set(key, val) {
    setForm(prev => ({ ...prev, [key]: val }))
  }

  async function handleSubmit() {
    setLoading(true)
    setError(null)
    try {
      const { data, error: err } = await supabase
        .from('bookings')
        .insert([{
          user_id: user.id,
          session_type: form.session_type,
          date: form.date,
          start_time: form.start_time,
          hours: form.session_type === 'allday' ? null : form.hours,
          rig_preference: form.rig_preference,
          notes: form.notes,
          total_price: total,
          status: 'confirmed',
        }])
        .select()
        .single()

      if (err) throw err
      setBookingId(data.id)
      setSuccess(true)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  // Success screen
  if (success) {
    return (
      <div className="container" style={styles.success}>
        <div style={styles.successIcon}>✓</div>
        <div className="section-label">// BOOKING CONFIRMED</div>
        <h2 style={styles.successTitle}>SESSION LOCKED IN</h2>
        <p style={{ color: 'var(--text-dim)', marginBottom: '0.5rem' }}>
          Booking ID: <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--teal)' }}>
            #{bookingId?.slice(0, 8).toUpperCase()}
          </span>
        </p>
        <p style={{ color: 'var(--text-dim)', marginBottom: '2rem' }}>
          {form.date} at {form.start_time} — {selectedType?.label}
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button className="btn-primary" onClick={() => navigate('/profile')}>
            VIEW MY BOOKINGS
          </button>
          <button className="btn-ghost" onClick={() => {
            setSuccess(false)
            setStep(1)
            setForm({ session_type: 'casual', date: '', start_time: '', hours: 2, rig_preference: 'any', notes: '' })
          }}>
            BOOK ANOTHER
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div style={styles.header}>
        <div className="container">
          <div className="section-label">// SESSION BOOKING</div>
          <h1 className="page-title">RESERVE<br /><span style={{ color: 'var(--teal)' }}>YOUR RIG</span></h1>
        </div>
      </div>

      <div className="container">
        {/* Step indicator */}
        <div style={styles.steps}>
          {['SELECT TYPE', 'SCHEDULE', 'CONFIRM'].map((label, i) => (
            <div key={label} style={styles.stepItem}>
              <div style={{
                ...styles.stepCircle,
                background: step > i + 1 ? 'var(--teal)' : step === i + 1 ? 'var(--teal-glow)' : 'transparent',
                borderColor: step >= i + 1 ? 'var(--teal)' : 'var(--border)',
                color: step >= i + 1 ? 'var(--teal)' : 'var(--text-muted)',
              }}>
                {step > i + 1 ? '✓' : i + 1}
              </div>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6rem',
                color: step >= i + 1 ? 'var(--teal)' : 'var(--text-muted)',
                letterSpacing: '0.15em',
              }}>
                {label}
              </span>
              {i < 2 && (
                <div style={{
                  flex: 1,
                  height: '1px',
                  background: step > i + 1 ? 'var(--teal)' : 'var(--border)',
                }} />
              )}
            </div>
          ))}
        </div>

        <div style={styles.formBox}>

          {/* Step 1: Session Type */}
          {step === 1 && (
            <div>
              <h3 style={styles.stepTitle}>SELECT SESSION TYPE</h3>
              <div style={styles.typeGrid}>
                {SESSION_TYPES.map(type => (
                  <button
                    key={type.id}
                    onClick={() => set('session_type', type.id)}
                    style={{
                      ...styles.typeCard,
                      borderColor: form.session_type === type.id ? type.color : 'var(--border)',
                      background: form.session_type === type.id
                        ? `rgba(${type.color === 'var(--teal)' ? '0,245,212' : type.color === 'var(--red)' ? '255,45,85' : '232,232,240'},0.05)`
                        : 'var(--bg-2)',
                    }}
                  >
                    <span style={{ ...styles.typeRate, color: type.color }}>{type.rate}</span>
                    <span style={styles.typeLabel}>{type.label}</span>
                    <span style={styles.typeDesc}>{type.desc}</span>
                  </button>
                ))}
              </div>

              {form.session_type !== 'allday' && (
                <div style={styles.field}>
                  <label style={styles.label}>HOURS</label>
                  <div style={styles.hoursRow}>
                    {[1, 2, 3, 4, 6, 8].map(h => (
                      <button
                        key={h}
                        onClick={() => set('hours', h)}
                        style={{
                          ...styles.hourBtn,
                          borderColor: form.hours === h ? 'var(--teal)' : 'var(--border)',
                          color: form.hours === h ? 'var(--teal)' : 'var(--text-dim)',
                          background: form.hours === h ? 'var(--teal-glow)' : 'transparent',
                        }}
                      >
                        {h}h
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div style={styles.totalRow}>
                <span style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                  ESTIMATED TOTAL
                </span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', color: 'var(--teal)' }}>
                  ${total}
                </span>
              </div>

              <button
                className="btn-primary"
                onClick={() => setStep(2)}
                style={{ width: '100%', padding: '1rem' }}
              >
                CONTINUE →
              </button>
            </div>
          )}

          {/* Step 2: Schedule */}
          {step === 2 && (
            <div>
              <h3 style={styles.stepTitle}>SCHEDULE YOUR SESSION</h3>
              <div style={styles.field}>
                <label style={styles.label}>DATE</label>
                <input
                  type="date"
                  value={form.date}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={e => set('date', e.target.value)}
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>START TIME</label>
                <input
                  type="time"
                  value={form.start_time}
                  onChange={e => set('start_time', e.target.value)}
                />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>RIG PREFERENCE</label>
                <select
                  value={form.rig_preference}
                  onChange={e => set('rig_preference', e.target.value)}
                >
                  <option value="any">Any Available</option>
                  <option value="fps">FPS Optimized</option>
                  <option value="ultra">Ultra Wide Setup</option>
                  <option value="vr">VR Station</option>
                  <option value="streaming">Streaming Setup</option>
                </select>
              </div>
              <div style={styles.field}>
                <label style={styles.label}>NOTES (OPTIONAL)</label>
                <textarea
                  rows={3}
                  value={form.notes}
                  onChange={e => set('notes', e.target.value)}
                  placeholder="Any special requests..."
                  style={{ resize: 'vertical' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  className="btn-ghost"
                  onClick={() => setStep(1)}
                  style={{ flex: 1, padding: '1rem' }}
                >
                  ← BACK
                </button>
                <button
                  className="btn-primary"
                  onClick={() => setStep(3)}
                  disabled={!form.date || !form.start_time}
                  style={{ flex: 2, padding: '1rem', opacity: (!form.date || !form.start_time) ? 0.5 : 1 }}
                >
                  REVIEW →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Confirm */}
          {step === 3 && (
            <div>
              <h3 style={styles.stepTitle}>CONFIRM BOOKING</h3>
              <div style={styles.summaryCard}>
                {[
                  ['TYPE',     selectedType?.label],
                  ['DATE',     form.date],
                  ['TIME',     form.start_time],
                  ['DURATION', form.session_type === 'allday' ? 'All Day' : `${form.hours} hour${form.hours > 1 ? 's' : ''}`],
                  ['RIG',      form.rig_preference.toUpperCase()],
                ].map(([key, val]) => (
                  <div key={key} style={styles.summaryRow}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.15em' }}>
                      {key}
                    </span>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', color: 'var(--text)' }}>
                      {val}
                    </span>
                  </div>
                ))}
                <div style={{ ...styles.summaryRow, borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: '0.5rem' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.8rem', letterSpacing: '0.1em', color: 'var(--text-dim)' }}>
                    TOTAL
                  </span>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'var(--teal)' }}>
                    ${total}
                  </span>
                </div>
              </div>

              {error && (
                <p style={{ color: 'var(--red)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', marginBottom: '1rem' }}>
                  ERROR: {error}
                </p>
              )}

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  className="btn-ghost"
                  onClick={() => setStep(2)}
                  style={{ flex: 1, padding: '1rem' }}
                >
                  ← EDIT
                </button>
                <button
                  className="btn-primary"
                  onClick={handleSubmit}
                  disabled={loading}
                  style={{ flex: 2, padding: '1rem', opacity: loading ? 0.7 : 1 }}
                >
                  {loading ? 'PROCESSING...' : '▶ CONFIRM BOOKING'}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

const styles = {
  header: {
    padding: '4rem 0 2rem',
    borderBottom: '1px solid var(--border)',
    marginBottom: '3rem',
    background: 'var(--bg-1)',
  },
  authWall: {
    padding: '8rem 1rem',
    textAlign: 'center',
  },
  authTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: '2.5rem',
    fontWeight: 900,
    marginBottom: '1rem',
  },
  steps: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '3rem',
    maxWidth: '600px',
  },
  stepItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    flex: 1,
  },
  stepCircle: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    border: '1px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.75rem',
    flexShrink: 0,
  },
  formBox: {
    maxWidth: '600px',
    marginBottom: '4rem',
  },
  stepTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.1rem',
    letterSpacing: '0.1em',
    color: 'var(--teal)',
    marginBottom: '2rem',
  },
  typeGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: '1rem',
    marginBottom: '2rem',
  },
  typeCard: {
    padding: '1.5rem',
    border: '1px solid',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
    textAlign: 'left',
  },
  typeRate: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.4rem',
    fontWeight: 700,
  },
  typeLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.65rem',
    color: 'var(--text)',
    letterSpacing: '0.15em',
  },
  typeDesc: {
    fontSize: '0.8rem',
    color: 'var(--text-muted)',
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
  hoursRow: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
  },
  hourBtn: {
    padding: '0.5rem 1rem',
    border: '1px solid',
    borderRadius: '4px',
    background: 'transparent',
    fontFamily: 'var(--font-display)',
    fontSize: '0.75rem',
    cursor: 'pointer',
    transition: 'all 0.2s',
    letterSpacing: '0.05em',
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem',
    background: 'var(--bg-2)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    marginBottom: '1.5rem',
  },
  summaryCard: {
    background: 'var(--bg-2)',
    border: '1px solid var(--border)',
    borderRadius: '8px',
    padding: '1.5rem',
    marginBottom: '2rem',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.75rem',
  },
  success: {
    padding: '8rem 1rem',
    textAlign: 'center',
  },
  successIcon: {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    border: '2px solid var(--teal)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2rem',
    color: 'var(--teal)',
    margin: '0 auto 2rem',
    boxShadow: '0 0 30px var(--teal-glow)',
  },
  successTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: '2.5rem',
    fontWeight: 900,
    color: 'var(--teal)',
    marginBottom: '1rem',
  },
}