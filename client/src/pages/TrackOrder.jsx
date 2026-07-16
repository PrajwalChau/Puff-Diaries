import { useState } from 'react'
import axios from 'axios'
import Navbar from '../components/Navbar'
import { getFlavorStyle } from './Home'
import API_BASE from '../api'

const STATUSES = ['pending', 'verified', 'dispatched', 'delivered']
const LABELS = { pending: 'Order Placed', verified: 'Payment Verified', dispatched: 'Package Dispatched', delivered: 'Delivered' }
const DESCS = { pending: 'We have received your payment transfer screenshot', verified: 'Our team manually confirmed your payment', dispatched: 'Your package is on its way to KTM / local address', delivered: 'Order delivered successfully' }

export default function TrackOrder() {
  const [identifier, setIdentifier] = useState('')
  const [orders, setOrders] = useState([])
  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(false)

  const track = async (e) => {
    e.preventDefault()
    if (!identifier.trim()) return
    setLoading(true)
    try {
      const res = await axios.get(`${API_BASE}/api/orders/track?identifier=${encodeURIComponent(identifier.trim())}`)
      setOrders(res.data)
    } catch {
      setOrders([])
    }
    setSearched(true)
    setLoading(false)
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg-app)' }}>
      <Navbar />

      <div style={{ flex: 1, padding: '20px 16px', overflowY: 'auto', paddingBottom: '30px' }}>
        
        {/* Track Title */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--dark)' }}>Track Order</h1>
          <p style={{ fontSize: '0.8rem', color: 'var(--mid)' }}>Enter phone number or email to view status</p>
        </div>

        {/* Input Form */}
        <form onSubmit={track} style={{
          display: 'flex', gap: '8px', marginBottom: '28px'
        }}>
          <input
            className="input-field"
            type="text"
            placeholder="e.g. 9842195574 or email"
            value={identifier}
            onChange={e => setIdentifier(e.target.value)}
            style={{ flex: 1, height: '44px', border: '1.5px solid var(--border)', borderRadius: '14px' }}
          />
          <button
            type="submit"
            disabled={loading}
            className="primary-btn"
            style={{ width: '80px', height: '44px', borderRadius: '14px', flexShrink: 0, padding: 0 }}
          >
            {loading ? '...' : 'Track'}
          </button>
        </form>

        {/* Search Results */}
        {searched && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {orders.length === 0 ? (
              <div style={{
                textAlign: 'center', padding: '40px 10px', color: 'var(--mid)',
                background: 'var(--white)', borderRadius: '20px', boxShadow: 'var(--shadow-sm)',
                fontStyle: 'italic', fontSize: '0.82rem'
              }}>
                No orders found for this contact.
              </div>
            ) : (
              orders.map(order => {
                const statusIdx = STATUSES.indexOf(order.status)
                const prodStyle = getFlavorStyle(order.product?.flavour)
                return (
                  <div
                    key={order._id}
                    style={{
                      background: 'var(--white)', borderRadius: '24px', padding: '16px',
                      boxShadow: 'var(--shadow-sm)', border: '1.5px solid var(--border)'
                    }}
                  >
                    {/* Header info */}
                    <div style={{
                      display: 'flex', gap: '12px', alignItems: 'center',
                      borderBottom: '1.5px solid var(--border)', paddingBottom: '12px',
                      marginBottom: '16px'
                    }}>
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
                          fontSize: '0.8rem', fontWeight: '800', color: 'var(--dark)',
                          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                        }}>
                          {order.product?.name || 'Vape Pod'}
                        </h4>
                        <p style={{ fontSize: '0.7rem', color: 'var(--mid)', marginTop: '2px' }}>
                          Rs. {order.product?.price?.toLocaleString()} · {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Vertical Shipment Timeline Stepper */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingLeft: '8px', position: 'relative' }}>
                      
                      {/* Vertical line connector */}
                      <div style={{
                        position: 'absolute', top: '12px', bottom: '12px', left: '19px',
                        width: '2px', borderLeft: '2px dashed var(--border)'
                      }} />

                      {STATUSES.map((s, idx) => {
                        const done = idx <= statusIdx
                        return (
                          <div key={s} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', position: 'relative', zIndex: 2 }}>
                            {/* Circle badge */}
                            <div style={{
                              width: '24px', height: '24px', borderRadius: '50%',
                              background: done ? 'var(--primary)' : 'var(--white)',
                              border: done ? '2px solid var(--primary)' : '2px solid var(--light)',
                              color: 'var(--white)', display: 'flex', alignItems: 'center',
                              justifyContent: 'center', fontSize: '0.75rem', fontWeight: 'bold',
                              flexShrink: 0
                            }}>
                              {done ? (
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              ) : (
                                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--light)' }} />
                              )}
                            </div>

                            {/* Details text */}
                            <div style={{ flex: 1 }}>
                              <h4 style={{
                                fontSize: '0.8rem', fontWeight: '700',
                                color: done ? 'var(--dark)' : 'var(--light)'
                              }}>
                                {LABELS[s]}
                              </h4>
                              <p style={{
                                fontSize: '0.68rem', color: done ? 'var(--mid)' : 'var(--light)',
                                marginTop: '1px', lineHeight: '1.3'
                              }}>
                                {DESCS[s]}
                              </p>
                            </div>
                          </div>
                        )
                      })}

                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}

      </div>
    </div>
  )
}