import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../App'
import { useCart } from '../App'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()
  const { cartCount } = useCart()

  const links = [
    { path: '/', label: 'Home' },
    { path: '/products', label: 'Products' },
    { path: '/about', label: 'About Us' },
    { path: '/contact', label: 'Contact Us' }
  ]

  return (
    <>
      <style>{`
        .mobile-header {
          display: flex;
        }
        .desktop-header {
          display: none;
        }
        @media (min-width: 769px) {
          .mobile-header {
            display: none !important;
          }
          .desktop-header {
            display: flex !important;
          }
        }
        
        .desktop-nav-link {
          font-size: 0.88rem;
          font-weight: 500;
          color: var(--mid);
          text-decoration: none;
          padding: 8px 16px;
          border-radius: 12px;
          transition: all 0.2s ease;
        }
        .desktop-nav-link:hover, .desktop-nav-link.active {
          color: var(--primary);
          background: var(--primary-light);
          font-weight: 600;
        }
      `}</style>

      {/* ── MOBILE HEADER (Hidden on PC) ── */}
      <header className="mobile-header" style={{
        alignItems: 'center', justifyContent: 'space-between',
        height: '56px', padding: '0 16px', background: 'var(--white)',
        borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 100,
        flexShrink: 0
      }}>
        {/* Left: Profile / Login shortcut */}
        <button onClick={() => navigate(user ? '/account' : '/login')} style={{
          background: 'none', border: 'none', cursor: 'pointer', display: 'flex',
          alignItems: 'center', justifyContent: 'center', padding: 0, outline: 'none',
          WebkitTapHighlightColor: 'transparent'
        }}>
          {user ? (
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%',
              background: 'var(--primary-light)', color: 'var(--primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.85rem', fontWeight: '700', border: '1.5px solid var(--primary)'
            }}>
              {user.name[0].toUpperCase()}
            </div>
          ) : (
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%',
              background: '#F0F0F3', color: 'var(--mid)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1.5px solid var(--border)'
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
          )}
        </button>

        {/* Center: Brand logo */}
        <Link to="/" style={{
          fontFamily: 'var(--sans)', fontSize: '1.25rem', fontWeight: '800',
          color: 'var(--dark)', letterSpacing: '-0.02em', textDecoration: 'none',
          display: 'flex', alignItems: 'center', gap: '3px'
        }}>
          Puff<span style={{ color: 'var(--primary)' }}>Diaries</span>
        </Link>

        {/* Right: Quick actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {user?.isAdmin && (
            <button onClick={() => navigate('/admin')} style={{
              background: 'var(--primary-light)', border: 'none', borderRadius: '12px',
              color: 'var(--primary)', padding: '5px 10px', fontSize: '0.7rem',
              fontWeight: '700', cursor: 'pointer', outline: 'none',
              WebkitTapHighlightColor: 'transparent'
            }}>
              Admin
            </button>
          )}
          
          <button onClick={() => navigate('/about')} style={{
            background: 'none', border: 'none', cursor: 'pointer', color: 'var(--mid)',
            padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            outline: 'none', WebkitTapHighlightColor: 'transparent'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </button>
        </div>
      </header>

      {/* ── DESKTOP HEADER (Visible on PC) ── */}
      <header className="desktop-header" style={{
        alignItems: 'center', justifyContent: 'space-between',
        height: '68px', background: 'var(--white)',
        borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 100,
        flexShrink: 0, padding: '0 40px'
      }}>
        {/* Left: Brand logo */}
        <Link to="/" style={{
          fontFamily: 'var(--sans)', fontSize: '1.45rem', fontWeight: '850',
          color: 'var(--dark)', letterSpacing: '-0.02em', textDecoration: 'none',
          display: 'flex', alignItems: 'center', gap: '4px'
        }}>
          Puff<span style={{ color: 'var(--primary)' }}>Diaries</span>
        </Link>

        {/* Center: Desktop links */}
        <nav style={{ display: 'flex', gap: '10px' }}>
          {links.map(l => {
            const active = location.pathname === l.path || (l.path === '/products' && location.pathname.startsWith('/products'))
            return (
              <Link
                key={l.path}
                to={l.path}
                className={`desktop-nav-link ${active ? 'active' : ''}`}
              >
                {l.label}
              </Link>
            )
          })}
        </nav>

        {/* Right: User actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          
          {/* Admin panel link */}
          {user?.isAdmin && (
            <button
              onClick={() => navigate('/admin')}
              style={{
                background: 'var(--primary-light)', border: 'none', borderRadius: '12px',
                color: 'var(--primary)', padding: '6px 14px', fontSize: '0.8rem',
                fontWeight: '700', cursor: 'pointer', outline: 'none'
              }}
            >
              Admin Panel
            </button>
          )}

          {/* Cart triggers */}
          <Link to="/cart" style={{
            position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: '40px', height: '40px', borderRadius: '12px', background: '#F8F9FB',
            color: 'var(--mid)', textDecoration: 'none', transition: 'all 0.2s', border: '1px solid var(--border)'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="8" cy="21" r="1" />
              <circle cx="19" cy="21" r="1" />
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
            </svg>
            {cartCount > 0 && (
              <span style={{
                position: 'absolute', top: '-4px', right: '-4px',
                background: '#FF5A79', color: '#fff', fontSize: '0.62rem',
                fontWeight: '800', minWidth: '16px', height: '16px', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '1.5px solid #fff', padding: '0 3px'
              }}>
                {cartCount}
              </span>
            )}
          </Link>

          {/* User Profile avatar or login buttons */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={() => navigate('/account')}
                style={{
                  background: 'var(--white)', border: '1.5px solid var(--border)',
                  borderRadius: '12px', padding: '6px 14px', fontSize: '0.85rem',
                  fontWeight: '600', color: 'var(--dark)', cursor: 'pointer',
                  boxShadow: 'var(--shadow-sm)', outline: 'none', display: 'flex',
                  alignItems: 'center', gap: '6px'
                }}
              >
                <div style={{
                  width: '20px', height: '20px', borderRadius: '50%',
                  background: 'var(--primary)', color: 'var(--white)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.68rem', fontWeight: '800'
                }}>
                  {user.name[0].toUpperCase()}
                </div>
                {user.name.split(' ')[0]}
              </button>
              
              <button
                onClick={() => { logout(); navigate('/') }}
                style={{
                  background: 'none', border: 'none', color: '#FF5A79',
                  fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer', outline: 'none'
                }}
              >
                Log Out
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => navigate('/login')}
                style={{
                  background: 'none', border: 'none', color: 'var(--mid)',
                  fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer', padding: '6px 12px'
                }}
              >
                Log In
              </button>
              <button
                onClick={() => navigate('/signup')}
                style={{
                  background: 'var(--primary)', border: 'none', borderRadius: '12px',
                  color: 'var(--white)', padding: '8px 18px', fontSize: '0.85rem',
                  fontWeight: '600', cursor: 'pointer', boxShadow: 'var(--shadow-sm)'
                }}
              >
                Sign Up
              </button>
            </div>
          )}

        </div>
      </header>
    </>
  )
}