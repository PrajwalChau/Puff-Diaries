import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'
import { useAuth, useCart } from '../App'
import { getFlavorStyle } from './Home'
import API_BASE from '../api'

export default function ProductDetail() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { addToCart } = useCart()
  
  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [selectedNic, setSelectedNic] = useState('5%') // Default nic
  const [activeTab, setActiveTab] = useState('description')

  useEffect(() => {
    // Scroll container to top
    const container = document.querySelector('.phone-screen')
    if (container) container.scrollTo(0, 0)
    window.scrollTo(0, 0)
    
    axios.get(`${API_BASE}/api/products/${productId}`)
      .then(r => {
        setProduct(r.data)
        if (r.data.nicotine) {
          setSelectedNic(r.data.nicotine)
        }
      })
      .catch(() => navigate('/products'))
      
    axios.get(`${API_BASE}/api/products`)
      .then(r => setRelated(r.data.filter(p => p._id !== productId).slice(0, 4)))
      .catch(() => {})
  }, [productId, navigate])

  const handleAddToCart = () => {
    if (!product) return
    
    const itemToAdd = {
      ...product,
      nicotine: selectedNic,
      _id: `${product._id}_${selectedNic}` 
    }
    
    for (let i = 0; i < qty; i++) {
      addToCart(itemToAdd)
    }
    
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (!product) return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--white)' }}>
      <Navbar />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: '0.85rem', color: 'var(--light)', fontStyle: 'italic' }}>Loading flavor details...</div>
      </div>
    </div>
  )

  const style = getFlavorStyle(product.flavour)

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--white)' }}>
      <Navbar />

      <style>{`
        .detail-layout {
          display: flex;
          flex-direction: column;
        }
        .detail-media-column {
          width: 100%;
          height: 260px;
        }
        .detail-info-column {
          width: 100%;
          padding: 20px 16px;
        }
        .purchase-action-bar {
          position: fixed;
          bottom: 60px; /* Above bottom nav */
          left: 0;
          right: 0;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-top: 1.5px solid var(--border);
          padding: 10px 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          z-index: 99;
          box-shadow: 0 -4px 15px rgba(0,0,0,0.05);
        }
        .detail-screen-padding {
          padding-bottom: 140px;
        }
        @media (min-width: 769px) {
          .detail-layout {
            flex-direction: row !important;
            gap: 40px;
            align-items: stretch;
            margin-top: 20px;
          }
          .detail-media-column {
            width: 45% !important;
            height: 480px !important;
            border-radius: 28px;
          }
          .detail-info-column {
            width: 55% !important;
            flex: 1;
            padding: 0 !important;
          }
          .purchase-action-bar {
            position: static !important;
            background: transparent !important;
            backdrop-filter: none !important;
            border: none !important;
            padding: 0 !important;
            margin-top: 24px;
            z-index: 1 !important;
          }
          .detail-screen-padding {
            padding-bottom: 30px !important;
          }
        }
      `}</style>

      {/* Center content inside app-container on PC */}
      <div className="app-container detail-screen-padding" style={{ padding: '20px 16px', flex: 1 }}>
        
        {/* Back navigation */}
        <button
          onClick={() => navigate('/products')}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            fontSize: '0.82rem', fontWeight: 600, color: 'var(--mid)',
            background: 'transparent', border: 'none', cursor: 'pointer', padding: 0,
            marginBottom: '16px', outline: 'none'
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
          </svg>
          Back to Catalog
        </button>

        {/* Detail Layout Flex container (Split on PC, Stacked on Mobile) */}
        <div className="detail-layout">
          
          {/* Media Column (Left on PC) */}
          <div className="detail-media-column" style={{
            background: style.bg, position: 'relative',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '20px', overflow: 'hidden'
          }}>
            {/* Badge */}
            {product.badge && (
              <span style={{
                position: 'absolute', top: '16px', right: '16px',
                background: 'var(--primary)', color: 'var(--white)',
                fontSize: '0.62rem', fontWeight: '700', padding: '4px 10px',
                borderRadius: '12px', zIndex: 10, textTransform: 'uppercase',
                letterSpacing: '0.04em'
              }}>
                {product.badge}
              </span>
            )}

            {/* Product Image */}
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                style={{
                  maxHeight: '80%', maxWidth: '85%', objectFit: 'contain',
                  filter: 'drop-shadow(0 16px 32px rgba(0,0,0,0.12))',
                  animation: 'scaleUp 0.4s ease'
                }}
              />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <svg width="60" height="90" viewBox="0 0 100 150" fill="none">
                  <rect x="25" y="40" width="50" height="100" rx="15" fill={style.tag} opacity="0.25" />
                  <rect x="42" y="10" width="16" height="30" rx="4" fill={style.tag} opacity="0.25" />
                </svg>
                <span style={{ fontSize: '0.72rem', color: style.text, fontWeight: '600' }}>Authentic Pod</span>
              </div>
            )}
          </div>

          {/* Info Column (Right on PC) */}
          <div className="detail-info-column">
            {/* Flavor & Rating */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{
                fontSize: '0.72rem', fontWeight: '700', color: style.text,
                background: style.bg, padding: '4px 12px', borderRadius: '12px',
                textTransform: 'uppercase'
              }}>
                {product.flavour || 'Vape'}
              </span>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', fontWeight: '650', color: '#FFB020' }}>
                ★ 4.8 <span style={{ color: 'var(--light)', fontWeight: '400' }}>(124 reviews)</span>
              </div>
            </div>

            {/* Title */}
            <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--dark)', lineHeight: '1.25', marginBottom: '10px' }}>
              {product.name}
            </h1>

            {/* Price */}
            <div style={{ fontSize: '1.65rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '20px' }}>
              Rs. {product.price.toLocaleString()}
            </div>

            {/* Nicotine Selector */}
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--dark)', marginBottom: '8px' }}>Select Strength</h3>
              <div style={{ display: 'flex', gap: '8px' }}>
                {['2%', '5%'].map(nic => (
                  <button
                    key={nic}
                    onClick={() => setSelectedNic(nic)}
                    style={{
                      padding: '8px 18px', borderRadius: '14px',
                      border: selectedNic === nic ? '1.5px solid var(--primary)' : '1.5px solid var(--border)',
                      background: selectedNic === nic ? 'var(--primary-light)' : 'var(--white)',
                      color: selectedNic === nic ? 'var(--primary)' : 'var(--mid)',
                      fontSize: '0.82rem', fontWeight: '600', cursor: 'pointer',
                      transition: 'all 0.15s ease', outline: 'none'
                    }}
                  >
                    {nic} Nicotine
                  </button>
                ))}
              </div>
            </div>

            {/* Specs detail cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '24px' }}>
              {product.puffs && (
                <div style={{ background: '#F8F9FB', border: '1.5px solid var(--border)', borderRadius: '14px', padding: '12px 16px' }}>
                  <div style={{ fontSize: '0.65rem', fontWeight: '600', color: 'var(--light)', textTransform: 'uppercase', marginBottom: '2px' }}>Puff Capacity</div>
                  <div style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--dark)' }}>~{product.puffs} puffs</div>
                </div>
              )}
              <div style={{ background: '#F8F9FB', border: '1.5px solid var(--border)', borderRadius: '14px', padding: '12px 16px' }}>
                <div style={{ fontSize: '0.65rem', fontWeight: '600', color: 'var(--light)', textTransform: 'uppercase', marginBottom: '2px' }}>Quality Check</div>
                <div style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--dark)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4CAF50' }} />
                  100% Authentic
                </div>
              </div>
            </div>

            {/* Tabs details */}
            <div style={{ borderBottom: '1.5px solid var(--border)', display: 'flex', gap: '18px', marginBottom: '16px' }}>
              <button
                onClick={() => setActiveTab('description')}
                style={{
                  padding: '10px 4px', fontSize: '0.85rem', fontWeight: '700',
                  border: 'none', background: 'none', cursor: 'pointer',
                  borderBottom: activeTab === 'description' ? '2.5px solid var(--primary)' : '2.5px solid transparent',
                  color: activeTab === 'description' ? 'var(--primary)' : 'var(--mid)',
                  outline: 'none', transition: 'all 0.2s ease', textTransform: 'uppercase', letterSpacing: '0.02em'
                }}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab('related')}
                style={{
                  padding: '10px 4px', fontSize: '0.85rem', fontWeight: '700',
                  border: 'none', background: 'none', cursor: 'pointer',
                  borderBottom: activeTab === 'related' ? '2.5px solid var(--primary)' : '2.5px solid transparent',
                  color: activeTab === 'related' ? 'var(--primary)' : 'var(--mid)',
                  outline: 'none', transition: 'all 0.2s ease', textTransform: 'uppercase', letterSpacing: '0.02em'
                }}
              >
                Other Flavors
              </button>
            </div>

            {/* Description Tab panel */}
            {activeTab === 'description' && (
              <div style={{ fontSize: '0.85rem', color: 'var(--mid)', lineHeight: '1.6', animation: 'fadeIn 0.2s' }}>
                <p style={{ marginBottom: '14px' }}>
                  {product.description || `Experience the ultimate vaping satisfaction with ${product.name}. Carefully crafted to preserve rich flavor profiles and deliver smooth, massive cloud hits from the first puff to the last.`}
                </p>
                <ul style={{ paddingLeft: '16px', listStyleType: 'circle', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <li>Direct verification security code included on product box</li>
                  <li>Premium mesh coil technology for optimized vapor production</li>
                  <li>Discreet packaging and fast KTM delivery dispatch</li>
                </ul>
              </div>
            )}

            {/* Other flavors related tab panel */}
            {activeTab === 'related' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', animation: 'fadeIn 0.2s' }}>
                {related.length === 0 ? (
                  <div style={{ fontSize: '0.8rem', color: 'var(--light)', fontStyle: 'italic' }}>No other flavors available.</div>
                ) : (
                  related.map(p => {
                    const pStyle = getFlavorStyle(p.flavour)
                    return (
                      <div
                        key={p._id}
                        onClick={() => navigate(`/products/${p._id}`)}
                        style={{
                          display: 'flex', gap: '12px', padding: '10px', borderRadius: '16px',
                          border: '1.5px solid var(--border)', background: 'var(--white)',
                          cursor: 'pointer', alignItems: 'center'
                        }}
                      >
                        <div style={{
                          width: '44px', height: '44px', borderRadius: '10px',
                          background: pStyle.bg, display: 'flex', alignItems: 'center',
                          justifyContent: 'center', overflow: 'hidden', flexShrink: 0
                        }}>
                          {p.image ? (
                            <img src={p.image} alt="" style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
                          ) : (
                            <span style={{ fontSize: '1rem' }}>💨</span>
                          )}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <h4 style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--dark)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</h4>
                          <p style={{ fontSize: '0.72rem', color: 'var(--mid)' }}>Rs. {p.price.toLocaleString()}</p>
                        </div>
                        <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>→</span>
                      </div>
                    )
                  })
                )}
              </div>
            )}

            {/* Purchase actions (floats at bottom on mobile, inline static on PC!) */}
            <div className="purchase-action-bar">
              {/* Qty edit spinner */}
              <div style={{
                display: 'flex', alignItems: 'center', background: '#F0F1F5',
                borderRadius: '16px', overflow: 'hidden', height: '48px', flexShrink: 0
              }}>
                <button
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  style={{
                    width: '38px', height: '100%', background: 'none', border: 'none',
                    cursor: 'pointer', fontSize: '1.1rem', color: 'var(--dark)',
                    fontWeight: 'bold', outline: 'none'
                  }}
                >
                  -
                </button>
                <span style={{
                  width: '28px', textAlign: 'center', fontSize: '0.9rem',
                  fontWeight: '700', color: 'var(--dark)'
                }}>
                  {qty}
                </span>
                <button
                  onClick={() => setQty(q => q + 1)}
                  style={{
                    width: '38px', height: '100%', background: 'none', border: 'none',
                    cursor: 'pointer', fontSize: '1.1rem', color: 'var(--dark)',
                    fontWeight: 'bold', outline: 'none'
                  }}
                >
                  +
                </button>
              </div>

              {/* Add To Cart button */}
              <button
                onClick={handleAddToCart}
                className="primary-btn"
                style={{
                  flex: 1, height: '48px',
                  background: added ? '#4CAF50' : 'var(--primary)'
                }}
              >
                {added ? (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Added to Cart!
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" />
                      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                    </svg>
                    Add to Cart
                  </>
                )}
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  )
}