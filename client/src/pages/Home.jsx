import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'
import { useAuth, useCart } from '../App'
import API_BASE from '../api'

const API = `${API_BASE}/api`

const PROMOS = [
  {
    title: 'New Arrivals Collection',
    subtitle: 'Get the latest authentic premium disposable flavors in Kathmandu.',
    discount: '100% Authentic',
    btnText: 'Shop Catalog',
    path: '/products',
    bg: 'linear-gradient(135deg, #8C52FF 0%, #B582FF 100%)',
    vapeColor: '#FFFFFF'
  },
  {
    title: 'Fast Dispatch Delivery',
    subtitle: 'Order your favorite flavors and get free shipping across KTM (for orders over Rs. 3000).',
    discount: 'Free Shipping Available',
    btnText: 'Browse Flavors',
    path: '/products',
    bg: 'linear-gradient(135deg, #FF5A79 0%, #FF8C9F 100%)',
    vapeColor: '#FFFFFF'
  }
]

export function getFlavorStyle(flavour) {
  const f = (flavour || '').toLowerCase()
  if (f.includes('mint') || f.includes('cool') || f.includes('menthol') || f.includes('spearmint')) {
    return { bg: '#EBF7F2', tag: '#2E7D32', text: '#1B5E20', dot: '#4CAF50' }
  }
  if (f.includes('straw') || f.includes('berry') || f.includes('watermelon') || f.includes('grape') || f.includes('peach') || f.includes('cherry')) {
    return { bg: '#FDF1F5', tag: '#C2185B', text: '#880E4F', dot: '#E91E63' }
  }
  if (f.includes('mango') || f.includes('lemon') || f.includes('orange') || f.includes('banana') || f.includes('pineapple') || f.includes('citrus')) {
    return { bg: '#FEF6EA', tag: '#E65100', text: '#5D4037', dot: '#FF9800' }
  }
  if (f.includes('blue') || f.includes('ice') || f.includes('pod') || f.includes('soda') || f.includes('cola')) {
    return { bg: '#F3EFFF', tag: '#8C52FF', text: '#4A148C', dot: '#8C52FF' }
  }
  return { bg: '#F5F5F7', tag: '#5F6065', text: '#1F2025', dot: '#9E9E9E' }
}

/* ─── Build dynamic categories from product data ─── */
function buildCategories(products) {
  // Count products per unique flavour value
  const flavourMap = {}
  products.forEach(p => {
    const flav = (p.flavour || '').trim()
    if (!flav) return
    const key = flav // keep original casing
    if (!flavourMap[key]) flavourMap[key] = { label: key, count: 0 }
    flavourMap[key].count++
  })

  // Sort by count descending so the most popular flavours come first
  const sorted = Object.values(flavourMap).sort((a, b) => b.count - a.count)

  // Prepend the "All" entry
  return [
    { label: 'All Flavours', value: '', count: products.length },
    ...sorted.map(s => ({ label: s.label, value: s.label, count: s.count }))
  ]
}

export default function Home() {
  const [products, setProducts] = useState([])
  const [searchVal, setSearchVal] = useState('')
  const [selectedCat, setSelectedCat] = useState('')
  const [promoIdx, setPromoIdx] = useState(0)
  const [animKey, setAnimKey] = useState(0) // triggers card entrance animation
  const navigate = useNavigate()
  const { user } = useAuth()
  const { addToCart } = useCart()
  const promoTimer = useRef(null)
  const catScrollRef = useRef(null)

  useEffect(() => {
    axios.get(`${API}/products`)
      .then(r => setProducts(r.data))
      .catch(() => {})
  }, [])

  // Auto scroll promos
  useEffect(() => {
    promoTimer.current = setInterval(() => {
      setPromoIdx(prev => (prev + 1) % PROMOS.length)
    }, 4500)
    return () => clearInterval(promoTimer.current)
  }, [])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchVal.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchVal.trim())}`)
    }
  }

  // Build categories dynamically from products
  const categories = buildCategories(products)

  // When category changes, bump the animation key
  const handleCatChange = (val) => {
    setSelectedCat(val)
    setAnimKey(k => k + 1)
  }

  // Filter products by selected flavour category
  const filteredProducts = products.filter(p => {
    if (!selectedCat) return true
    return (p.flavour || '').toLowerCase() === selectedCat.toLowerCase()
  })

  // Group filtered products by flavour for "All" view
  const groupedByFlavour = {}
  filteredProducts.forEach(p => {
    const key = (p.flavour || 'Other').trim() || 'Other'
    if (!groupedByFlavour[key]) groupedByFlavour[key] = []
    groupedByFlavour[key].push(p)
  })
  // Sort groups by size (largest first)
  const groupEntries = Object.entries(groupedByFlavour).sort((a, b) => b[1].length - a[1].length)

  // For specific category view, show up to 12 items
  const displayedProducts = selectedCat ? filteredProducts.slice(0, 12) : null

  // Section title
  const sectionTitle = selectedCat ? `${selectedCat} Flavours` : 'All Flavours'
  const sectionCount = selectedCat ? filteredProducts.length : products.length

  /* ─── Product Card Component (reusable) ─── */
  const ProductCard = ({ p, idx }) => {
    const fs = getFlavorStyle(p.flavour)
    return (
      <div
        onClick={() => navigate(`/products/${p._id}`)}
        className="home-product-card"
        style={{
          background: 'var(--white)', borderRadius: '24px', overflow: 'hidden',
          boxShadow: 'var(--shadow-sm)', cursor: 'pointer', display: 'flex',
          flexDirection: 'column', position: 'relative', border: '1px solid rgba(0,0,0,0.01)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          animation: `cardFadeUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 0.05}s both`
        }}
      >
        {/* Flavor Pastel Background & Image container */}
        <div style={{
          height: '150px', background: fs.bg, display: 'flex',
          alignItems: 'center', justifyContent: 'center', position: 'relative',
          overflow: 'hidden', padding: '12px'
        }}>
          {p.image ? (
            <img
              src={p.image}
              alt={p.name}
              style={{
                width: '100%', height: '100%', objectFit: 'contain',
                filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.1))'
              }}
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
              <svg width="40" height="60" viewBox="0 0 100 150" fill="none">
                <rect x="25" y="40" width="50" height="100" rx="12" fill={fs.tag} opacity="0.3" />
                <rect x="42" y="15" width="16" height="25" rx="3" fill={fs.tag} opacity="0.3" />
              </svg>
            </div>
          )}

          {/* Flavor badge tag */}
          <span style={{
            position: 'absolute', top: '8px', left: '8px',
            background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(5px)',
            color: fs.text, fontSize: '0.58rem', fontWeight: '700',
            padding: '3px 8px', borderRadius: '12px'
          }}>
            {p.flavour || 'Original'}
          </span>
        </div>

        {/* Card Content Details */}
        <div style={{ padding: '14px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            {/* Rating & Puff count */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.72rem', fontWeight: '700', color: '#FFB020' }}>
                ★ <span style={{ color: 'var(--mid)', fontWeight: '500' }}>4.8</span>
              </span>
              {p.puffs && (
                <span style={{ fontSize: '0.65rem', color: 'var(--mid)', background: '#F0F1F5', padding: '1.5px 5px', borderRadius: '6px', fontWeight: '600' }}>
                  {p.puffs} puffs
                </span>
              )}
            </div>

            {/* Title */}
            <h3 style={{
              fontSize: '0.88rem', fontWeight: '700', color: 'var(--dark)',
              lineHeight: '1.3', marginBottom: '8px', height: '34px',
              overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical'
            }}>
              {p.name}
            </h3>
          </div>

          {/* Price & Add to Cart button */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
            <span style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--dark)' }}>
              Rs. {p.price.toLocaleString()}
            </span>
            
            {/* Purple circular Add button */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                addToCart(p)
              }}
              style={{
                width: '32px', height: '32px', borderRadius: '50%',
                background: 'var(--primary)', color: '#fff', border: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', boxShadow: '0 4px 10px rgba(140,82,255,0.3)',
                fontSize: '1rem', fontWeight: 'bold', outline: 'none',
                WebkitTapHighlightColor: 'transparent'
              }}
            >
              +
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg-app)' }}>
      <Navbar />

      <style>{`
        .promo-banner {
          height: 150px;
        }
        @media (min-width: 769px) {
          .promo-banner {
            height: 220px;
          }
        }
        .popular-header-text {
          font-size: 1.15rem;
        }
        @media (min-width: 769px) {
          .popular-header-text {
            font-size: 1.4rem;
          }
        }
        @keyframes cardFadeUp {
          from { opacity: 0; transform: translateY(18px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .home-product-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(140,82,255,0.12) !important;
        }
        .cat-pill-scroll::-webkit-scrollbar {
          display: none;
        }
        .cat-pill {
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .cat-pill:hover {
          transform: translateY(-1px);
        }
        .cat-pill:active {
          transform: scale(0.96);
        }
        .flavour-section-header {
          animation: cardFadeUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
      `}</style>

      {/* Center layout inside app-container for PC */}
      <div className="app-container" style={{ padding: '24px 16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        
        {/* Welcome Header */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--mid)', fontWeight: '500', marginBottom: '4px' }}>
            {user ? `Welcome back, ${user.name.split(' ')[0]} 👋` : 'Welcome to Puff Diaries 👋'}
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--dark)', lineHeight: '1.2' }}>
            Find your best <span style={{ color: 'var(--primary)' }}>vape flavour</span>
          </h1>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} style={{
          display: 'flex', alignItems: 'center', background: '#F0F1F5',
          borderRadius: '16px', padding: '0 16px', height: '48px', marginBottom: '24px',
          boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.03)'
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--mid)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '10px' }}>
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            placeholder="Search flavor, brand..."
            value={searchVal}
            onChange={e => setSearchVal(e.target.value)}
            style={{
              border: 'none', background: 'transparent', outline: 'none',
              fontFamily: 'var(--sans)', fontSize: '0.9rem', color: 'var(--dark)',
              width: '100%'
            }}
          />
        </form>

        {/* Promo Swiper banner */}
        <div className="promo-banner" style={{ position: 'relative', borderRadius: '24px', overflow: 'hidden', marginBottom: '28px', boxShadow: 'var(--shadow-md)' }}>
          {PROMOS.map((promo, idx) => (
            <div key={idx} style={{
              position: 'absolute', inset: 0, background: promo.bg, padding: '24px',
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              opacity: idx === promoIdx ? 1 : 0, zIndex: idx === promoIdx ? 2 : 1,
              transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
              pointerEvents: idx === promoIdx ? 'auto' : 'none', color: '#fff'
            }}>
              <div>
                <span style={{
                  background: 'rgba(255,255,255,0.2)', padding: '4px 12px',
                  borderRadius: '20px', fontSize: '0.65rem', fontWeight: '700',
                  textTransform: 'uppercase', letterSpacing: '0.05em'
                }}>{promo.discount}</span>
                <h3 style={{ fontSize: '1.45rem', fontWeight: '800', marginTop: '10px', lineHeight: '1.2' }}>{promo.title}</h3>
                <p style={{ fontSize: '0.82rem', opacity: '0.9', marginTop: '4px', maxWidth: '75%' }}>{promo.subtitle}</p>
              </div>
              <button
                onClick={() => navigate(promo.path)}
                style={{
                  background: '#fff', color: 'var(--dark)', border: 'none',
                  padding: '8px 18px', borderRadius: '12px', fontSize: '0.8rem',
                  fontWeight: '700', alignSelf: 'flex-start', cursor: 'pointer'
                }}
              >
                {promo.btnText}
              </button>

              {/* Decorative vape SVG outline */}
              <div style={{ position: 'absolute', right: '30px', bottom: '15px', opacity: 0.15 }}>
                <svg width="100" height="150" viewBox="0 0 100 150" fill="none">
                  <rect x="25" y="40" width="50" height="100" rx="15" fill={promo.vapeColor} />
                  <rect x="42" y="10" width="16" height="30" rx="4" fill={promo.vapeColor} />
                </svg>
              </div>
            </div>
          ))}

          {/* Dots Indicator */}
          <div style={{ position: 'absolute', bottom: '15px', right: '24px', display: 'flex', gap: '5px', zIndex: 10 }}>
            {PROMOS.map((_, idx) => (
              <div
                key={idx}
                onClick={() => setPromoIdx(idx)}
                style={{
                  width: idx === promoIdx ? '18px' : '6px', height: '6px', borderRadius: '3px',
                  background: '#fff', opacity: idx === promoIdx ? 1 : 0.4,
                  cursor: 'pointer', transition: 'all 0.3s'
                }}
              />
            ))}
          </div>
        </div>

        {/* ── Dynamic Flavour Category Pills ── */}
        <div style={{ marginBottom: '28px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: '750', color: 'var(--dark)', marginBottom: '14px' }}>
            Shop by Flavour
          </h2>
          <div
            ref={catScrollRef}
            className="cat-pill-scroll"
            style={{
              display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '8px',
              scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch',
              msOverflowStyle: 'none', scrollbarWidth: 'none'
            }}
          >
            {categories.map(cat => {
              const active = selectedCat === cat.value
              const fs = cat.value ? getFlavorStyle(cat.value) : null
              return (
                <button
                  key={cat.label}
                  className="cat-pill"
                  onClick={() => handleCatChange(cat.value)}
                  style={{
                    flexShrink: 0, padding: '10px 18px', borderRadius: '24px',
                    border: active ? '2px solid transparent' : '1.5px solid var(--border)',
                    background: active
                      ? (fs ? `linear-gradient(135deg, ${fs.dot}22, ${fs.dot}44)` : 'var(--primary)')
                      : 'var(--white)',
                    color: active
                      ? (fs ? fs.text : 'var(--white)')
                      : 'var(--mid)',
                    fontSize: '0.82rem', fontWeight: active ? '700' : '600', cursor: 'pointer',
                    boxShadow: active ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                    display: 'flex', alignItems: 'center', gap: '8px',
                    outline: 'none', WebkitTapHighlightColor: 'transparent'
                  }}
                >
                  {/* Colored dot indicator */}
                  {fs && (
                    <span style={{
                      width: '8px', height: '8px', borderRadius: '50%',
                      background: fs.dot, flexShrink: 0,
                      boxShadow: active ? `0 0 6px ${fs.dot}88` : 'none'
                    }} />
                  )}
                  {!fs && active && (
                    <span style={{
                      width: '8px', height: '8px', borderRadius: '50%',
                      background: '#fff', flexShrink: 0
                    }} />
                  )}
                  {cat.label}
                  {/* Product count badge */}
                  <span style={{
                    fontSize: '0.65rem', fontWeight: '700',
                    background: active ? 'rgba(255,255,255,0.5)' : '#F0F1F5',
                    color: active ? (fs ? fs.text : '#fff') : 'var(--light)',
                    padding: '1px 7px', borderRadius: '10px', minWidth: '20px',
                    textAlign: 'center'
                  }}>
                    {cat.count}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* ── Products Section ── */}
        <div style={{ marginBottom: '20px' }} key={animKey}>
          
          {/* Section Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h2 className="popular-header-text" style={{ fontWeight: '750', color: 'var(--dark)' }}>
                {sectionTitle}
              </h2>
              <p style={{ fontSize: '0.75rem', color: 'var(--mid)', marginTop: '2px' }}>
                {sectionCount} {sectionCount === 1 ? 'product' : 'products'} available
              </p>
            </div>
            <button
              onClick={() => navigate(selectedCat ? `/products?flavour=${encodeURIComponent(selectedCat)}` : '/products')}
              style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer' }}
            >
              See all →
            </button>
          </div>

          {products.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '40px 10px', color: 'var(--mid)',
              background: 'var(--white)', borderRadius: '20px', boxShadow: 'var(--shadow-sm)',
              fontStyle: 'italic', fontSize: '0.85rem'
            }}>
              Loading flavor collections...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '40px 10px', color: 'var(--mid)',
              background: 'var(--white)', borderRadius: '20px', boxShadow: 'var(--shadow-sm)',
              fontSize: '0.85rem'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>💨</div>
              No products in this flavour category.
              <br />
              <button
                onClick={() => handleCatChange('')}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '600', fontSize: '0.8rem', cursor: 'pointer', marginTop: '10px' }}
              >
                Browse all flavours
              </button>
            </div>
          ) : selectedCat ? (
            /* ── Single Category Grid ── */
            <div className="responsive-grid">
              {displayedProducts.map((p, idx) => (
                <ProductCard key={p._id} p={p} idx={idx} />
              ))}
            </div>
          ) : (
            /* ── "All" view: grouped by flavour with section headers ── */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              {groupEntries.map(([flavourName, items], groupIdx) => {
                const fs = getFlavorStyle(flavourName)
                return (
                  <div key={flavourName} className="flavour-section-header" style={{ animationDelay: `${groupIdx * 0.08}s` }}>
                    {/* Flavour Group Header */}
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '10px',
                      marginBottom: '14px', paddingBottom: '10px',
                      borderBottom: `2px solid ${fs.dot}30`
                    }}>
                      <span style={{
                        width: '10px', height: '10px', borderRadius: '50%',
                        background: fs.dot, flexShrink: 0,
                        boxShadow: `0 0 8px ${fs.dot}55`
                      }} />
                      <h3 style={{
                        fontSize: '1rem', fontWeight: '750', color: fs.text,
                        flex: 1
                      }}>
                        {flavourName}
                      </h3>
                      <span style={{
                        fontSize: '0.7rem', fontWeight: '700', color: fs.tag,
                        background: `${fs.dot}18`, padding: '3px 10px', borderRadius: '12px'
                      }}>
                        {items.length} {items.length === 1 ? 'item' : 'items'}
                      </span>
                      <button
                        onClick={() => handleCatChange(flavourName)}
                        style={{
                          background: 'none', border: 'none', color: 'var(--primary)',
                          fontWeight: '600', fontSize: '0.75rem', cursor: 'pointer',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        View all →
                      </button>
                    </div>

                    {/* Products Grid (limit 4 per group in "All" view) */}
                    <div className="responsive-grid">
                      {items.slice(0, 4).map((p, idx) => (
                        <ProductCard key={p._id} p={p} idx={idx + groupIdx * 2} />
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Informative footer promo block */}
        <div style={{
          background: 'var(--white)', borderRadius: '24px', padding: '18px 24px',
          boxShadow: 'var(--shadow-sm)', border: '1.5px solid var(--border)',
          marginTop: '20px', display: 'flex',
          alignItems: 'center', gap: '14px', cursor: 'pointer'
        }} onClick={() => navigate('/about')}>
          <div style={{
            width: '46px', height: '46px', borderRadius: '12px',
            background: 'var(--primary-light)', color: 'var(--primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
              <path d="m9 12 2 2 4-4"/>
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <h4 style={{ fontSize: '0.88rem', fontWeight: '750', color: 'var(--dark)' }}>100% Authentic Vapes</h4>
            <p style={{ fontSize: '0.75rem', color: 'var(--mid)', lineHeight: '1.3' }}>
              We source directly from manufacturers. Zero fakes. Check our story.
            </p>
          </div>
          <span style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '1rem' }}>→</span>
        </div>

      </div>
    </div>
  )
}