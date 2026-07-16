import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../App'
import API_BASE from '../api'

export default function Login() {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const res = await axios.post(`${API_BASE}/api/auth/login`, { identifier, password })
      login(res.data.user, res.data.token)
      navigate(res.data.user.isAdmin ? '/admin' : '/')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--white)', padding: '24px 20px', justifyContent: 'center' }}>
      
      {/* Back button to Home */}
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
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{
          width: '56px', height: '56px', borderRadius: '16px',
          background: 'var(--primary-light)', color: 'var(--primary)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '14px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          💨
        </div>
        <h2 style={{ fontSize: '1.45rem', fontWeight: '800', color: 'var(--dark)' }}>
          Welcome back
        </h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--mid)', marginTop: '4px' }}>
          Sign in to your Puff Diaries account
        </p>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        
        <div className="input-group">
          <label>Email or Phone Number</label>
          <input
            className="input-field"
            type="text"
            placeholder="e.g. 9842195574"
            value={identifier}
            onChange={e => setIdentifier(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label>Password</label>
          <input
            className="input-field"
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>

        {error && (
          <div style={{
            background: '#FDF1F5', border: '1px solid #FFD6E8', borderRadius: '12px',
            padding: '10px 14px', color: '#880E4F', fontSize: '0.75rem',
            fontWeight: '600', marginBottom: '16px'
          }}>
            {error}
          </div>
        )}

        <button
          className="primary-btn"
          type="submit"
          disabled={loading}
          style={{ height: '46px', marginTop: '12px' }}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      {/* Footer redirects */}
      <p style={{ textAlign: 'center', marginTop: '28px', fontSize: '0.82rem', color: 'var(--mid)' }}>
        Don't have an account?{' '}
        <Link to="/signup" style={{ color: 'var(--primary)', fontWeight: '700', textDecoration: 'none' }}>
          Sign up
        </Link>
      </p>

    </div>
  )
}