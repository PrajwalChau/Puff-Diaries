import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { createContext, useContext, useState, useCallback } from 'react'
import Home from './pages/Home'
import Products from './pages/Products'
import OrderForm from './pages/OrderForm'
import TrackOrder from './pages/TrackOrder'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Account from './pages/Account'
import Admin from './pages/Admin'
import AboutUs from './pages/AboutUsPage'
import ContactUs from './pages/Contactus'
import Cart from './pages/Cart'
import ProductDetail from './pages/Productdetail'

export const AuthContext = createContext(null)
export const CartContext = createContext(null)
export function useAuth() { return useContext(AuthContext) }
export function useCart() { return useContext(CartContext) }

function PrivateRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" />
}
function AdminRoute({ children }) {
  const { user } = useAuth()
  return user?.isAdmin ? children : <Navigate to="/" />
}

function BottomNavigation() {
  const location = useLocation()
  const navigate = useNavigate()
  const { cartCount } = useCart()
  
  const tabs = [
    {
      path: '/',
      label: 'Home',
      icon: (active) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? 'var(--primary)' : 'none'} stroke={active ? 'var(--primary)' : 'var(--mid)'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      )
    },
    {
      path: '/products',
      label: 'Shop',
      icon: (active) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? 'var(--primary)' : 'none'} stroke={active ? 'var(--primary)' : 'var(--mid)'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect width="7" height="9" x="3" y="3" rx="1" />
          <rect width="7" height="5" x="14" y="3" rx="1" />
          <rect width="7" height="9" x="14" y="12" rx="1" />
          <rect width="7" height="5" x="3" y="16" rx="1" />
        </svg>
      )
    },
    {
      path: '/cart',
      label: 'Cart',
      icon: (active) => (
        <div style={{ position: 'relative' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? 'var(--primary)' : 'none'} stroke={active ? 'var(--primary)' : 'var(--mid)'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="8" cy="21" r="1" />
            <circle cx="19" cy="21" r="1" />
            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
          </svg>
          {cartCount > 0 && (
            <span style={{
              position: 'absolute', top: '-6px', right: '-8px',
              background: '#FF5A79', color: '#fff', fontSize: '0.62rem',
              fontWeight: '700', minWidth: '15px', height: '15px', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '0 3px', border: '1.5px solid #fff'
            }}>
              {cartCount}
            </span>
          )}
        </div>
      )
    },
    {
      path: '/account',
      label: 'Profile',
      icon: (active) => (
        <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? 'var(--primary)' : 'none'} stroke={active ? 'var(--primary)' : 'var(--mid)'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      )
    }
  ]

  return (
    <>
      <style>{`
        .bottom-nav-container {
          display: flex;
        }
        @media (min-width: 769px) {
          .bottom-nav-container {
            display: none !important;
          }
        }
      `}</style>
      <div className="bottom-nav-container" style={{
        justifyContent: 'space-around', alignItems: 'center',
        background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(20px)',
        borderTop: '1.5px solid var(--border)', height: '60px',
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
        paddingBottom: 'env(safe-area-inset-bottom)'
      }}>
        {tabs.map(tab => {
          const active = location.pathname === tab.path || (tab.path === '/products' && location.pathname.startsWith('/products'))
          return (
            <button key={tab.path} onClick={() => navigate(tab.path)} style={{
              background: 'none', border: 'none', display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: '4px', cursor: 'pointer', flex: 1, padding: '4px 0',
              outline: 'none', WebkitTapHighlightColor: 'transparent'
            }}>
              {tab.icon(active)}
              <span style={{
                fontSize: '0.65rem', fontWeight: active ? '600' : '500',
                color: active ? 'var(--primary)' : 'var(--mid)',
                transition: 'color 0.2s ease'
              }}>
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </>
  )
}

export default function App() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('volt_user')) } catch { return null }
  })
  const [token, setToken] = useState(() => localStorage.getItem('volt_token') || null)
  const [cartItems, setCartItems] = useState([])
  const [cartToast, setCartToast] = useState(null)
  
  const location = useLocation()

  const login = (userData, tokenData) => {
    setUser(userData)
    setToken(tokenData)
    localStorage.setItem('volt_user', JSON.stringify(userData))
    localStorage.setItem('volt_token', tokenData)
  }
  const logout = () => {
    setUser(null); setToken(null)
    localStorage.removeItem('volt_user')
    localStorage.removeItem('volt_token')
  }

  const addToCart = useCallback((product) => {
    setCartItems(prev => {
      const exists = prev.find(i => i._id === product._id)
      if (exists) return prev.map(i => i._id === product._id ? { ...i, qty: i.qty + 1 } : i)
      return [...prev, { ...product, qty: 1 }]
    })
    setCartToast(product)
    setTimeout(() => setCartToast(null), 3000)
  }, [])

  const removeFromCart = useCallback((id) => {
    setCartItems(prev => prev.filter(i => i._id !== id))
  }, [])

  const updateQty = useCallback((id, qty) => {
    if (qty < 1) return
    setCartItems(prev => prev.map(i => i._id === id ? { ...i, qty } : i))
  }, [])

  const clearCart = useCallback(() => setCartItems([]), [])

  const cartCount = cartItems.reduce((s, i) => s + i.qty, 0)

  // Hide the bottom navigation on specific pages
  const hideBottomNav = ['/login', '/signup'].includes(location.pathname) || location.pathname.startsWith('/order/')

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      <CartContext.Provider value={{ cartItems, cartCount, addToCart, removeFromCart, updateQty, clearCart }}>
        
        <style>{`
          .app-viewport {
            padding-bottom: 60px;
          }
          @media (min-width: 769px) {
            .app-viewport {
              padding-bottom: 0px !important;
            }
          }
        `}</style>

        {/* Responsive view container */}
        <div className="phone-mockup-wrapper">
          <div className="phone-screen app-viewport" style={{ paddingBottom: hideBottomNav ? '0' : undefined }}>
            
            {/* Cart Toast Notification (relative to screen, fits top-right on PC) */}
            {cartToast && (
              <div style={{
                position: 'fixed', top: '70px', right: '16px', zIndex: 9999,
                background: '#fff', border: '1.5px solid var(--border)',
                borderRadius: '16px', padding: '12px 16px',
                boxShadow: 'var(--shadow-lg)',
                display: 'flex', alignItems: 'center', gap: '12px',
                animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) both',
                maxWidth: '300px'
              }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '10px',
                  background: 'var(--primary-light)', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'
                }}>
                  {cartToast.image
                    ? <img src={cartToast.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--primary)"><path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2zm-14.83-3h14.83l1.68-8H5.21L4.17 3H1v2h2l3.6 7.59L5.25 15c-.16.28-.25.61-.25.96C5 17.1 5.9 18 7 18h13v-2H7.42c-.13 0-.25-.11-.25-.25l.03-.12.9-1.63z"/></svg>
                  }
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--dark)', marginBottom: '1px' }}>
                    Added to cart!
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--mid)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '180px' }}>
                    {cartToast.name}
                  </div>
                </div>
              </div>
            )}

            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/order/:productId" element={<PrivateRoute><OrderForm /></PrivateRoute>} />
              <Route path="/track" element={<TrackOrder />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/account" element={<PrivateRoute><Account /></PrivateRoute>} />
              <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/products/:productId" element={<ProductDetail />} />
            </Routes>

            {/* Bottom Tab Navigation Bar (Mobile-only) */}
            {!hideBottomNav && <BottomNavigation />}

          </div>
        </div>

      </CartContext.Provider>
    </AuthContext.Provider>
  )
}