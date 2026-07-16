import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../App'
import Navbar from '../components/Navbar'
import { getFlavorStyle } from './Home'
import API_BASE from '../api'

const STATUSES = ['pending', 'verified', 'dispatched', 'delivered']
const STATUS_LABELS = { pending: 'Placed', verified: 'Verified', dispatched: 'Dispatched', delivered: 'Delivered' }
const STATUS_COLORS = { pending: '#E65100', verified: '#0288D1', dispatched: '#8C52FF', delivered: '#388E3C' }
const STATUS_BG = { pending: '#FEF6EA', verified: '#E0F2FE', dispatched: '#F3EFFF', delivered: '#EBF7F2' }

export default function Account() {
  const { user, token, logout } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeSubTab, setActiveSubTab] = useState('all') // 'all' or 'active'
  const [expandedOrder, setExpandedOrder] = useState(null)

  useEffect(() => {
    if (!token) return
    axios.get(`${API_BASE}/api/orders/mine`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => {
        setOrders(r.data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [token])

  const activeOrders = orders.filter(o => ['pending', 'verified', 'dispatched'].includes(o.status))
  const completedOrders = orders.filter(o => o.status === 'delivered')

  const handleLogoutClick = () => {
    logout()
    navigate('/')
  }

  const displayedOrders = activeSubTab === 'active' ? activeOrders : orders

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg-app)' }}>
      <Navbar />

      {/* Main scrollable body */}
      <div style={{ flex: 1, padding: '20px 16px', overflowY: 'auto', paddingBottom: '30px' }}>
        
        {/* User Card Overview */}
        <div style={{
          background: 'var(--white)', borderRadius: '24px', padding: '20px',
          boxShadow: 'var(--shadow-sm)', border: '1px solid rgba(0,0,0,0.01)',
          display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px'
        }}>
          {/* Avatar badge */}
          <div style={{
            width: '60px', height: '60px', borderRadius: '50%',
            background: 'var(--primary-light)', color: 'var(--primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.6rem', fontWeight: '800', border: '2px solid var(--primary)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--dark)' }}>
              {user?.name}
            </h2>
            <p style={{ fontSize: '0.72rem', color: 'var(--mid)', marginTop: '2px' }}>
              {user?.phone || user?.email || 'Registered Customer'}
            </p>
          </div>

          <button
            onClick={handleLogoutClick}
            style={{
              background: '#FDF1F5', border: 'none', borderRadius: '12px',
              color: '#880E4F', padding: '8px 12px', fontSize: '0.72rem',
              fontWeight: '700', cursor: 'pointer', outline: 'none'
            }}
          >
            Log Out
          </button>
        </div>

        {/* Quick Stats Grid */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px',
          marginBottom: '28px'
        }}>
          <div style={{ background: 'var(--white)', borderRadius: '16px', padding: '12px', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--dark)' }}>{orders.length}</div>
            <div style={{ fontSize: '0.62rem', color: 'var(--light)', fontWeight: '600', textTransform: 'uppercase', marginTop: '2px' }}>Total Orders</div>
          </div>
          <div style={{ background: 'var(--white)', borderRadius: '16px', padding: '12px', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--primary)' }}>{activeOrders.length}</div>
            <div style={{ fontSize: '0.62rem', color: 'var(--light)', fontWeight: '600', textTransform: 'uppercase', marginTop: '2px' }}>In Progress</div>
          </div>
          <div style={{ background: 'var(--white)', borderRadius: '16px', padding: '12px', textAlign: 'center', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#388E3C' }}>{completedOrders.length}</div>
            <div style={{ fontSize: '0.62rem', color: 'var(--light)', fontWeight: '600', textTransform: 'uppercase', marginTop: '2px' }}>Delivered</div>
          </div>
        </div>

        {/* Tab Selection */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1.5px solid var(--border)', marginBottom: '16px', paddingBottom: '4px' }}>
          <button
            onClick={() => setActiveSubTab('all')}
            style={{
              background: 'none', border: 'none', padding: '8px 4px',
              fontSize: '0.82rem', fontWeight: '700', cursor: 'pointer',
              color: activeSubTab === 'all' ? 'var(--primary)' : 'var(--mid)',
              borderBottom: activeSubTab === 'all' ? '2px solid var(--primary)' : '2px solid transparent',
              outline: 'none', transition: 'all 0.15s'
            }}
          >
            All Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveSubTab('active')}
            style={{
              background: 'none', border: 'none', padding: '8px 4px',
              fontSize: '0.82rem', fontWeight: '700', cursor: 'pointer',
              color: activeSubTab === 'active' ? 'var(--primary)' : 'var(--mid)',
              borderBottom: activeSubTab === 'active' ? '2px solid var(--primary)' : '2px solid transparent',
              outline: 'none', transition: 'all 0.15s'
            }}
          >
            Active Tracking ({activeOrders.length})
          </button>
        </div>

        {/* Order History Listing */}
        <div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--light)', fontStyle: 'italic', fontSize: '0.85rem' }}>
              Fetching order log...
            </div>
          ) : displayedOrders.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '40px 10px', color: 'var(--mid)',
              background: 'var(--white)', borderRadius: '20px', boxShadow: 'var(--shadow-sm)',
              fontSize: '0.82rem'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📦</div>
              No orders found here.<br />
              <button
                onClick={() => navigate('/products')}
                style={{
                  background: 'none', border: 'none', color: 'var(--primary)',
                  fontWeight: '700', fontSize: '0.8rem', cursor: 'pointer', marginTop: '10px'
                }}
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {displayedOrders.map(order => {
                const prodStyle = getFlavorStyle(order.product?.flavour)
                const isExpanded = expandedOrder === order._id
                return (
                  <div
                    key={order._id}
                    onClick={() => setExpandedOrder(isExpanded ? null : order._id)}
                    style={{
                      background: 'var(--white)', borderRadius: '20px', padding: '14px',
                      boxShadow: 'var(--shadow-sm)', cursor: 'pointer',
                      border: isExpanded ? '1.5px solid var(--primary)' : '1px solid var(--border)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {/* Basic Item Block */}
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <div style={{
                        width: '46px', height: '46px', borderRadius: '10px',
                        background: prodStyle.bg, display: 'flex', alignItems: 'center',
                        justifyContent: 'center', flexShrink: 0
                      }}>
                        {order.product?.image ? (
                          <img src={order.product.image} alt="" style={{ width: '85%', height: '85%', objectFit: 'contain' }} />
                        ) : (
                          <span style={{ fontSize: '1.25rem' }}>💨</span>
                        )}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h4 style={{
                          fontSize: '0.82rem', fontWeight: '800', color: 'var(--dark)',
                          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                        }}>
                          {order.product?.name || 'Vape device'}
                        </h4>
                        <p style={{ fontSize: '0.7rem', color: 'var(--mid)', marginTop: '2px' }}>
                          Rs. {order.product?.price?.toLocaleString()} · {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      {/* Status Indicator pill */}
                      <span style={{
                        background: STATUS_BG[order.status] || '#F0F1F5',
                        color: STATUS_COLORS[order.status] || 'var(--mid)',
                        fontSize: '0.62rem', fontWeight: '750', textTransform: 'uppercase',
                        padding: '4px 10px', borderRadius: '12px'
                      }}>
                        {STATUS_LABELS[order.status]}
                      </span>
                    </div>

                    {/* Expandable Order Billing & Verification info */}
                    {isExpanded && (
                      <div style={{
                        marginTop: '12px', paddingTop: '12px', borderTop: '1px dashed var(--border)',
                        display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.75rem',
                        color: 'var(--mid)', animation: 'fadeIn 0.2s ease'
                      }}>
                        <div>
                          <span style={{ fontWeight: '700', color: 'var(--dark)' }}>Receiver Name:</span> {order.customerName}
                        </div>
                        <div>
                          <span style={{ fontWeight: '700', color: 'var(--dark)' }}>Phone Number:</span> {order.phone}
                        </div>
                        <div>
                          <span style={{ fontWeight: '700', color: 'var(--dark)' }}>Address:</span> {order.address}
                        </div>
                        {order.paymentScreenshot && (
                          <div style={{ marginTop: '4px' }}>
                            <span style={{ fontWeight: '700', color: 'var(--dark)' }}>Payment:</span>{' '}
                            <a
                              href={order.paymentScreenshot} target="_blank" rel="noreferrer"
                              style={{ color: 'var(--primary)', fontWeight: '700', textDecoration: 'underline' }}
                              onClick={e => e.stopPropagation()}
                            >
                              View Payment Receipt ↗
                            </a>
                          </div>
                        )}
                      </div>
                    )}

                  </div>
                )
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}