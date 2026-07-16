import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'
import { useCart, useAuth } from '../App'
import { getFlavorStyle } from './Home'
import API_BASE from '../api'

export default function Cart() {
  const { cartItems, removeFromCart, updateQty, clearCart, cartCount } = useCart()
  const { user, token } = useAuth()
  const navigate = useNavigate()
  
  const [step, setStep] = useState(1) // Step 1: Cart Items, Step 2: Shipping & Payment
  const [form, setForm] = useState({ customerName: user?.name || '', phone: user?.phone || '', address: '' })
  const [screenshot, setScreenshot] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [qrOpen, setQrOpen] = useState(false)

  const itemsTotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0)
  const deliveryFee = itemsTotal >= 3000 ? 0 : 150
  const grandTotal = itemsTotal + deliveryFee

  const handleFile = e => {
    const file = e.target.files[0]
    setScreenshot(file)
    if (file) setPreview(URL.createObjectURL(file))
  }

  const handleNextStep = () => {
    if (!user) {
      navigate('/login')
    } else {
      setStep(2)
    }
  }

  const handleSubmit = async () => {
    if (!form.customerName || !form.phone || !form.address) {
      alert('Please fill out all billing & delivery details')
      return
    }
    if (!screenshot) {
      alert('Please upload your payment screenshot to verify transaction')
      return
    }
    
    setLoading(true)
    try {
      for (const item of cartItems) {
        const data = new FormData()
        data.append('customerName', form.customerName)
        data.append('phone', form.phone)
        data.append('address', form.address)
        data.append('product', item.id || item._id.split('_')[0])
        data.append('screenshot', screenshot)
        
        await axios.post(`${API_BASE}/api/orders`, data, {
          headers: { Authorization: `Bearer ${token}` }
        })
      }
      setSubmitted(true)
      clearCart()
    } catch (e) {
      alert('Failed to place order. Please try again.')
    }
    setLoading(false)
  }

  if (submitted) return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--white)' }}>
      <Navbar />
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: '20px', padding: '40px 16px', textAlign: 'center'
      }}>
        <div style={{
          width: '72px', height: '72px', borderRadius: '50%',
          background: '#EBF7F2', color: '#4CAF50',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: '800', color: 'var(--dark)' }}>Order Received!</h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--mid)', marginTop: '8px', lineHeight: '1.5', maxWidth: '280px' }}>
            We are verifying your transfer. We will dispatch your package shortly.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', maxWidth: '240px', marginTop: '10px' }}>
          <button onClick={() => navigate('/account')} className="primary-btn">
            Track Orders
          </button>
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'none', border: '1.5px solid var(--border)', borderRadius: '16px',
              padding: '12px', fontSize: '0.85rem', fontWeight: '600', color: 'var(--dark)',
              cursor: 'pointer'
            }}
          >
            Back to Shop
          </button>
        </div>
      </div>
    </div>
  )

  if (cartItems.length === 0) return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--white)' }}>
      <Navbar />
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', padding: '60px 16px', textAlign: 'center'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '14px' }}>🛒</div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--dark)' }}>Your cart is empty</h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--mid)', marginTop: '6px', marginBottom: '24px', maxWidth: '240px' }}>
          Looks like you haven't added any vape pod flavors yet.
        </p>
        <button onClick={() => navigate('/products')} className="primary-btn" style={{ maxWidth: '200px' }}>
          Browse Catalog
        </button>
      </div>
    </div>
  )

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg-app)', position: 'relative' }}>
      <Navbar />

      <style>{`
        .checkout-layout {
          display: flex;
          flex-direction: column;
        }
        .checkout-main-col {
          width: 100%;
        }
        .checkout-side-col {
          display: none; /* Summary columns display statically on PC side bar */
        }
        .mobile-step2-block {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-top: 20px;
        }
        .desktop-checkout-block {
          display: none;
        }
        .cart-floating-bar {
          position: fixed;
          bottom: 60px; /* Above bottom nav */
          left: 0;
          right: 0;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-top: 1.5px solid var(--border);
          padding: 16px 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          z-index: 99;
          box-shadow: 0 -10px 30px rgba(0,0,0,0.06);
          border-radius: 24px 24px 0 0;
        }
        .cart-screen-padding {
          padding-bottom: 180px !important;
        }
        
        @media (max-width: 480px) {
          .cart-item-card {
            padding: 12px !important;
            gap: 10px !important;
          }
          .cart-item-title {
            font-size: 0.8rem !important;
            white-space: normal !important;
            line-height: 1.3;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }
          .cart-item-price {
            font-size: 0.85rem !important;
          }
        }

        @media (min-width: 769px) {
          .checkout-layout {
            flex-direction: row !important;
            gap: 28px;
            align-items: flex-start;
            margin-top: 10px;
          }
          .checkout-main-col {
            width: 58% !important;
            flex-shrink: 0;
          }
          .checkout-side-col {
            display: flex !important;
            flex-direction: column;
            gap: 16px;
            width: 42% !important;
            flex: 1;
            position: sticky;
            top: 90px;
          }
          .desktop-checkout-block {
            display: flex;
            flex-direction: column;
            gap: 16px;
          }
          .mobile-step2-block {
            display: none !important;
          }
          .cart-floating-bar {
            display: none !important;
          }
          .cart-screen-padding {
            padding-bottom: 30px !important;
          }
        }
      `}</style>

      {/* QR Code Magnifier Overlay */}
      {qrOpen && (
        <div
          onClick={() => setQrOpen(false)}
          style={{
            position: 'absolute', inset: 0, zIndex: 9999,
            background: 'rgba(0,0,0,0.65)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', padding: '20px',
            animation: 'fadeIn 0.2s ease'
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: 'var(--white)', borderRadius: '24px', padding: '20px',
              maxWidth: '320px', width: '100%', display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: '14px', boxShadow: 'var(--shadow-lg)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: '800' }}>Grand Total: Rs. {grandTotal.toLocaleString()}</span>
              <button
                onClick={() => setQrOpen(false)}
                style={{
                  width: '28px', height: '28px', borderRadius: '50%', border: 'none',
                  background: '#F0F1F5', fontSize: '0.9rem', fontWeight: 'bold', cursor: 'pointer'
                }}
              >
                ×
              </button>
            </div>
            <img
              src="/qr.png"
              alt="Payment QR"
              style={{ width: '220px', height: '220px', objectFit: 'contain', borderRadius: '14px', border: '1.5px solid var(--border)' }}
            />
            <p style={{ fontSize: '0.72rem', color: 'var(--mid)', textAlign: 'center', lineHeight: '1.4' }}>
              Scan with eSewa, Khalti, or Mobile Banking app to complete Rs. {grandTotal.toLocaleString()} payment.
            </p>
          </div>
        </div>
      )}

      {/* Main scrolling viewport centered in app-container */}
      <div className="app-container cart-screen-padding" style={{ padding: '20px 16px', flex: 1 }}>
        
        {/* Step Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          {step === 2 && (
            <button
              onClick={() => setStep(1)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', color: 'var(--dark)', padding: '4px'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
              </svg>
            </button>
          )}
          <h1 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--dark)' }}>
            {step === 1 ? 'Shopping Cart' : 'Checkout Details'}
          </h1>
        </div>

        {/* Layout split */}
        <div className="checkout-layout">
          
          {/* ── LEFT COLUMN (Main) ── */}
          <div className="checkout-main-col">
            {step === 1 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--mid)' }}>Items Review ({cartCount})</span>
                  <button
                    onClick={clearCart}
                    style={{ background: 'none', border: 'none', color: '#FF5A79', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer' }}
                  >
                    Clear Cart
                  </button>
                </div>

                {/* Cart lists */}
                {cartItems.map((item) => {
                  const itemStyle = getFlavorStyle(item.flavour)
                  return (
                    <div
                      key={item._id}
                      className="cart-item-card"
                      style={{
                        background: 'var(--white)', borderRadius: '20px', padding: '14px',
                        display: 'flex', gap: '14px', alignItems: 'center',
                        boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)'
                      }}
                    >
                      <div style={{
                        width: '56px', height: '56px', borderRadius: '12px',
                        background: itemStyle.bg, display: 'flex', alignItems: 'center',
                        justifyContent: 'center', flexShrink: 0, overflow: 'hidden'
                      }}>
                        {item.image ? (
                          <img src={item.image} alt="" style={{ width: '90%', height: '90%', objectFit: 'contain' }} />
                        ) : (
                          <span style={{ fontSize: '1.25rem' }}>💨</span>
                        )}
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h3 className="cart-item-title" style={{
                          fontSize: '0.85rem', fontWeight: '750', color: 'var(--dark)',
                          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                        }}>
                          {item.name}
                        </h3>
                        <div style={{ display: 'flex', gap: '6px', marginTop: '2px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.65rem', color: itemStyle.text, fontWeight: '700' }}>
                            {item.nicotine || '5% Nic'}
                          </span>
                          {item.puffs && (
                            <span style={{ fontSize: '0.65rem', color: 'var(--mid)', background: '#F0F1F5', padding: '0 5px', borderRadius: '4px' }}>
                              {item.puffs} puffs
                            </span>
                          )}
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px', flexShrink: 0 }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--dark)' }}>
                          Rs. {(item.price * item.qty).toLocaleString()}
                        </span>
                        
                        <div style={{ display: 'flex', alignItems: 'center', background: '#F0F1F5', borderRadius: '10px', height: '26px' }}>
                          <button
                            onClick={() => item.qty === 1 ? removeFromCart(item._id) : updateQty(item._id, item.qty - 1)}
                            style={{ width: '24px', border: 'none', background: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.9rem' }}
                          >
                            -
                          </button>
                          <span style={{ fontSize: '0.78rem', fontWeight: '700', minWidth: '14px', textAlign: 'center' }}>
                            {item.qty}
                          </span>
                          <button
                            onClick={() => updateQty(item._id, item.qty + 1)}
                            style={{ width: '24px', border: 'none', background: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.9rem' }}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={() => removeFromCart(item._id)}
                        style={{
                          background: 'none', border: 'none', color: 'var(--light)',
                          padding: '6px', cursor: 'pointer', outline: 'none'
                        }}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    </div>
                  )
                })}
              </div>
            ) : (
              // Step 2: Shipping details (Left column on PC, Main column on Mobile)
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ background: 'var(--white)', borderRadius: '24px', padding: '20px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)' }}>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--dark)', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Shipping Information</h3>
                  <div className="input-group">
                    <label>Receiver Full Name</label>
                    <input
                      className="input-field" type="text" placeholder="e.g. Prajwal Shrestha"
                      value={form.customerName} onChange={e => setForm({ ...form, customerName: e.target.value })}
                    />
                  </div>
                  <div className="input-group">
                    <label>Phone Number</label>
                    <input
                      className="input-field" type="tel" placeholder="e.g. 9842195574"
                      value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                    />
                  </div>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label>Delivery Address</label>
                    <input
                      className="input-field" type="text" placeholder="e.g. Hasanpur, Ward-9, Dhangadhi"
                      value={form.address} onChange={e => setForm({ ...form, address: e.target.value })}
                    />
                  </div>
                </div>

                {/* Mobile-only Step 2 Blocks (Payment QR & Screenshot upload) */}
                <div className="mobile-step2-block">
                  <div style={{
                    background: 'var(--white)', borderRadius: '24px', padding: '16px',
                    boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)',
                    textAlign: 'center'
                  }}>
                    <h3 style={{ fontSize: '0.85rem', fontWeight: '750', color: 'var(--dark)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Scan & Pay</h3>
                    <p style={{ fontSize: '0.68rem', color: 'var(--mid)', marginBottom: '12px' }}>Click QR image to enlarge</p>
                    <div onClick={() => setQrOpen(true)} style={{ width: '130px', height: '130px', margin: '0 auto 10px', borderRadius: '16px', overflow: 'hidden', border: '1.5px solid var(--border)', cursor: 'pointer' }}>
                      <img src="/qr.png" alt="Payment QR" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    </div>
                    <div style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--primary)' }}>Rs. {grandTotal.toLocaleString()}</div>
                  </div>

                  <div style={{ background: 'var(--white)', borderRadius: '24px', padding: '16px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)' }}>
                    <h3 style={{ fontSize: '0.85rem', fontWeight: '750', color: 'var(--dark)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Verify Transaction</h3>
                    <label style={{ display: 'block', background: '#F8F9FB', border: '2px dashed var(--border)', borderRadius: '16px', padding: '20px 10px', textAlign: 'center', cursor: 'pointer' }}>
                      <input type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
                      {preview ? <img src={preview} alt="preview" style={{ maxHeight: '110px', borderRadius: '10px', objectFit: 'contain', margin: '0 auto' }} />
                        : <div><div style={{ fontSize: '1.4rem', color: 'var(--light)', marginBottom: '4px' }}>📸</div><div style={{ fontSize: '0.72rem', color: 'var(--mid)' }}>Upload Transfer Screenshot</div></div>}
                    </label>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* ── RIGHT COLUMN (PC Side, Sticky Summary & Actions) ── */}
          <aside className="checkout-side-col">
            <div style={{ background: 'var(--white)', borderRadius: '24px', padding: '20px', border: '1.5px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--dark)', marginBottom: '14px' }}>Order Summary</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8rem', color: 'var(--mid)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Items Subtotal</span>
                  <span style={{ color: 'var(--dark)', fontWeight: '600' }}>Rs. {itemsTotal.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Delivery Fee</span>
                  <span style={{ color: 'var(--dark)', fontWeight: '600' }}>{deliveryFee === 0 ? 'FREE' : `Rs. ${deliveryFee}`}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.92rem', color: 'var(--dark)', fontWeight: '800', marginTop: '6px', paddingTop: '8px', borderTop: '1px dashed var(--border)' }}>
                  <span>Grand Total</span>
                  <span style={{ color: 'var(--primary)' }}>Rs. {grandTotal.toLocaleString()}</span>
                </div>
              </div>

              {step === 1 && (
                <button onClick={handleNextStep} className="primary-btn" style={{ height: '44px', marginTop: '16px' }}>
                  Proceed to Checkout
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>
              )}
            </div>

            {/* PC-only Step 2 Blocks (Payment QR & Screenshot upload in right side panel!) */}
            {step === 2 && (
              <div className="desktop-checkout-block" style={{ width: '100%' }}>
                
                {/* QR payment code */}
                <div style={{ background: 'var(--white)', borderRadius: '24px', padding: '20px', border: '1.5px solid var(--border)', boxShadow: 'var(--shadow-sm)', textAlign: 'center' }}>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--dark)', marginBottom: '12px' }}>Scan & Pay Grand Total</h3>
                  
                  <div onClick={() => setQrOpen(true)} style={{ width: '140px', height: '140px', margin: '0 auto 10px', borderRadius: '16px', overflow: 'hidden', border: '1.5px solid var(--border)', cursor: 'pointer' }}>
                    <img src="/qr.png" alt="Payment QR" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </div>
                  
                  <div style={{ fontSize: '1.05rem', fontWeight: '850', color: 'var(--primary)' }}>
                    Rs. {grandTotal.toLocaleString()}
                  </div>
                  <p style={{ fontSize: '0.72rem', color: 'var(--light)', marginTop: '2px' }}>eSewa · Khalti · Banking Transfer</p>
                </div>

                {/* Screenshot verify */}
                <div style={{ background: 'var(--white)', borderRadius: '24px', padding: '20px', border: '1.5px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--dark)', marginBottom: '12px' }}>Upload Payment Proof</h3>
                  
                  <label style={{ display: 'block', background: '#F8F9FB', border: '2px dashed var(--border)', borderRadius: '16px', padding: '20px 10px', textAlign: 'center', cursor: 'pointer' }}>
                    <input type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
                    {preview ? <img src={preview} alt="preview" style={{ maxHeight: '110px', borderRadius: '10px', objectFit: 'contain', margin: '0 auto' }} />
                      : <div><div style={{ fontSize: '1.4rem', color: 'var(--light)', marginBottom: '4px' }}>📸</div><div style={{ fontSize: '0.72rem', color: 'var(--mid)' }}>Click to upload screenshot</div></div>}
                  </label>

                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="primary-btn"
                    style={{ height: '44px', marginTop: '16px', background: loading ? 'var(--light)' : 'var(--primary)' }}
                  >
                    {loading ? 'Processing Order...' : 'Confirm Payment & Order'}
                  </button>
                </div>

              </div>
            )}
          </aside>

        </div>

      </div>

      {/* ── MOBILE FLOATING ACTION DRAWER (Hidden on PC) ── */}
      <div className="cart-floating-bar">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.75rem', color: 'var(--mid)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Subtotal</span>
            <span style={{ color: 'var(--dark)', fontWeight: '600' }}>Rs. {itemsTotal.toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Delivery Fee</span>
            <span style={{ color: 'var(--dark)', fontWeight: '600' }}>{deliveryFee === 0 ? 'FREE' : `Rs. ${deliveryFee}`}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--dark)', fontWeight: '750', marginTop: '2px', paddingTop: '4px', borderTop: '1px dashed var(--border)' }}>
            <span>Grand Total</span>
            <span style={{ color: 'var(--primary)' }}>Rs. {grandTotal.toLocaleString()}</span>
          </div>
        </div>

        {step === 1 ? (
          <button onClick={handleNextStep} className="primary-btn" style={{ height: '46px' }}>
            Proceed to Checkout
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="primary-btn"
            style={{ height: '46px', background: loading ? 'var(--light)' : 'var(--primary)' }}
          >
            {loading ? 'Processing Order...' : 'Confirm Payment & Order'}
          </button>
        )}
      </div>

    </div>
  )
}