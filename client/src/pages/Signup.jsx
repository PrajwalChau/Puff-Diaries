import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../App'
import API_BASE from '../api'

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    
    // Validations: requires name, password, and at least email or phone
    if (!form.email && !form.phone) {
      setError('Please provide at least an email address or a phone number')
      setLoading(false)
      return
    }
    
    try {
      const res = await axios.post(`${API_BASE}/api/auth/signup`, form)
      login(res.data.user, res.data.token)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create account. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--white)', padding: '24px 20px', justifyContent: 'center' }}>
      
      {/* Back button */}
      <button
        onClick={() => navigate('/')}
        style={{
          position: 'absolute', top: '16px', left: '16px',
          width: '36px', height: '36px', borderRadius: '50%',
          background: '#F0F1F5', border: 'none', display: 'flex',
          alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          outline: 'none', WebkitTapHighlightColor: 'transparent'
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
        </svg>
      </button>

      {/* Brand Header */}
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div style={{
          width: '56px', height: '56px', borderRadius: '16px',
          background: 'var(--primary-light)', color: 'var(--primary)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '10px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          💨
        </div>
        <h2 style={{ fontSize: '1.45rem', fontWeight: '800', color: 'var(--dark)' }}>
          Create account
        </h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--mid)', marginTop: '2px' }}>
          Join us to track orders and reorder quickly
        </p>
      </div>

      {/* Signup Form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        
        <div className="input-group">
          <label>Full Name</label>
          <input
            className="input-field"
            type="text"
            placeholder="e.g. Prajwal Shrestha"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>

        <div className="input-group">
          <label>Email Address <span style={{ color: 'var(--light)', fontWeight: 'normal' }}>(Optional)</span></label>
          <input
            className="input-field"
            type="email"
            placeholder="e.g. name@domain.com"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div className="input-group">
          <label>Phone Number <span style={{ color: 'var(--light)', fontWeight: 'normal' }}>(Optional)</span></label>
          <input
            className="input-field"
            type="tel"
            placeholder="e.g. 9842195574"
            value={form.phone}
            onChange={e => setForm({ ...form, phone: e.target.value })}
          />
        </div>

        <div className="input-group">
          <label>Password</label>
          <input
            className="input-field"
            type="password"
            placeholder="Create password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            required
          />
        </div>

        {error && (
          <div style={{
            background: '#FDF1F5', border: '1px solid #FFD6E8', borderRadius: '12px',
            padding: '10px 14px', color: '#880E4F', fontSize: '0.75rem',
            fontWeight: '600', marginBottom: '12px'
          }}>
            {error}
          </div>
        )}

        <button
          className="primary-btn"
          type="submit"
          disabled={loading}
          style={{ height: '46px', marginTop: '10px' }}
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>

      {/* Redirect footer */}
      <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.82rem', color: 'var(--mid)' }}>
        Already have an account?{' '}
        <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '700', textDecoration: 'none' }}>
          Sign in
        </Link>
      </p>

    </div>
  )
}