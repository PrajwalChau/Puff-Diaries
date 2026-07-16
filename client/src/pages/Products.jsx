import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'
import { useAuth, useCart } from '../App'
import { getFlavorStyle } from './Home'
import API_BASE from '../api'

export default function Products() {
  const [products, setProducts] = useState([])
  const [searchVal, setSearchVal] = useState('')
  const [sort, setSort] = useState('newest')
  const [filters, setFilters] = useState({ flavours: [], maxPrice: 5000, puffs: [], nicotine: [] })
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { addToCart } = useCart()

  // Load query params on startup
  useEffect(() => {
    const flavour = searchParams.get('flavour')
    const search = searchParams.get('search')
    
    if (flavour) {
      setFilters(f => ({ ...f, flavours: [flavour] }))
    }
    if (search) {
      setSearchVal(search)
    }
  }, [searchParams])

  useEffect(() => {
    axios.get(`${API_BASE}/api/products`)
      .then(r => setProducts(r.data))
      .catch(() => {})
  }, [])

  const toggleFilter = (key, val) => {
    setFilters(f => ({
      ...f,
      [key]: f[key].includes(val) ? f[key].filter(x => x !== val) : [...f[key], val]
    }))
  }

  const clearAllFilters = () => {
    setFilters({ flavours: [], maxPrice: 5000, puffs: [], nicotine: [] })
    setSearchVal('')
    setSearchParams({})
  }

  const filtered = products
    .filter(p => {
      if (searchVal && !p.name?.toLowerCase().includes(searchVal.toLowerCase()) && !p.flavour?.toLowerCase().includes(searchVal.toLowerCase())) return false
      if (p.price > filters.maxPrice) return false
      if (filters.flavours.length && !filters.flavours.some(f => p.flavour?.toLowerCase().includes(f.toLowerCase()))) return false
      if (filters.puffs.length && !filters.puffs.some(pf => p.puffs?.includes(pf))) return false
      if (filters.nicotine.length && !filters.nicotine.some(n => p.nicotine?.includes(n))) return false
      return true
    })
    .sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price
      if (sort === 'price-desc') return b.price - a.price
      return new Date(b.createdAt) - new Date(a.createdAt)
    })

  const availableFlavours = ['Menthol', 'Strawberry', 'Mango', 'Blueberry', 'Watermelon', 'Grape']
  const availablePuffs = ['3k', '5k', '18k', '25k', '30k', '35k']
  const availableNics = ['2%', '5%']

  // Split responsive grid for catalog (3 columns on desktop when filter bar is visible)
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '14px',
    flex: 1
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg-app)', position: 'relative' }}>
      <Navbar />

      <style>{`
        .catalog-layout {
          display: flex;
          flex-direction: column;
        }
        .desktop-filter-sidebar {
          display: none;
        }
        .mobile-filter-trigger {
          display: flex;
        }
        .products-grid {
          grid-template-columns: repeat(2, 1fr) !important;
        }
        @media (min-width: 769px) {
          .catalog-layout {
            flex-direction: row !important;
            gap: 28px;
            align-items: flex-start;
          }
          .desktop-filter-sidebar {
            display: block !important;
            width: 260px;
            flex-shrink: 0;
            background: var(--white);
            border-radius: 24px;
            padding: 24px 20px;
            box-shadow: var(--shadow-sm);
            border: 1.5px solid var(--border);
            position: sticky;
            top: 90px;
          }
          .mobile-filter-trigger {
            display: none !important;
          }
          .products-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
      `}</style>

      {/* Center in app-container */}
      <div className="app-container" style={{ padding: '24px 16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        
        {/* Title and Mobile filter trigger */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--dark)' }}>Vape Catalog</h1>
            <p style={{ fontSize: '0.8rem', color: 'var(--mid)' }}>Showing {filtered.length} authentic items</p>
          </div>

          <button
            onClick={() => setIsFilterOpen(true)}
            className="mobile-filter-trigger"
            style={{
              background: 'var(--white)', border: '1.5px solid var(--border)',
              borderRadius: '12px', padding: '8px 14px', fontSize: '0.78rem',
              fontWeight: '600', color: 'var(--dark)',
              alignItems: 'center', gap: '6px', cursor: 'pointer', boxShadow: 'var(--shadow-sm)',
              outline: 'none', WebkitTapHighlightColor: 'transparent'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            Filters {(filters.flavours.length + filters.puffs.length + filters.nicotine.length > 0) && `(${filters.flavours.length + filters.puffs.length + filters.nicotine.length})`}
          </button>
        </div>

        {/* Inline Search / Sort Bar */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
          <div style={{
            flex: 1, display: 'flex', alignItems: 'center', background: '#F0F1F5',
            borderRadius: '12px', padding: '0 12px', height: '44px'
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--mid)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="text"
              placeholder="Search catalog..."
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              style={{
                border: 'none', background: 'transparent', outline: 'none',
                fontFamily: 'var(--sans)', fontSize: '0.85rem', color: 'var(--dark)',
                width: '100%'
              }}
            />
          </div>

          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            style={{
              padding: '0 10px', border: '1.5px solid var(--border)', borderRadius: '12px',
              fontFamily: 'var(--sans)', fontSize: '0.82rem', fontWeight: '500',
              color: 'var(--dark)', background: 'var(--white)', outline: 'none',
              cursor: 'pointer', height: '44px', boxShadow: 'var(--shadow-sm)'
            }}
          >
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low-High</option>
            <option value="price-desc">Price: High-Low</option>
          </select>
        </div>

        {/* Catalog Layout Split (Sidebar on PC, Grid on PC / Mobile) */}
        <div className="catalog-layout">
          
          {/* ── DESKTOP FILTER SIDEBAR (Hidden on Mobile) ── */}
          <aside className="desktop-filter-sidebar">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', paddingBottom: '12px', borderBottom: '1px dashed var(--border)' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: '800' }}>Filters</h3>
              <button
                onClick={clearAllFilters}
                style={{ background: 'none', border: 'none', color: '#FF5A79', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer' }}
              >
                Clear all
              </button>
            </div>

            {/* Price Filter */}
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--dark)', marginBottom: '6px' }}>Price Range</h4>
              <input
                type="range" min="500" max="5000" step="100"
                value={filters.maxPrice}
                onChange={e => setFilters(f => ({ ...f, maxPrice: Number(e.target.value) }))}
                style={{ width: '100%', accentColor: 'var(--primary)', marginBottom: '4px' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--mid)' }}>
                <span>Rs. 500</span>
                <span style={{ fontWeight: '700', color: 'var(--primary)' }}>Up to Rs. {filters.maxPrice.toLocaleString()}</span>
              </div>
            </div>

            {/* Flavor Filter */}
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--dark)', marginBottom: '8px' }}>Flavors</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {availableFlavours.map(opt => {
                  const active = filters.flavours.includes(opt)
                  return (
                    <button
                      key={opt}
                      onClick={() => toggleFilter('flavours', opt)}
                      style={{
                        padding: '5px 12px', borderRadius: '12px', border: active ? '1.5px solid var(--primary)' : '1.5px solid var(--border)',
                        background: active ? 'var(--primary-light)' : 'var(--white)',
                        color: active ? 'var(--primary)' : 'var(--mid)',
                        fontSize: '0.75rem', fontWeight: active ? '600' : '500', cursor: 'pointer',
                        transition: 'all 0.15s ease', outline: 'none'
                      }}
                    >
                      {opt}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Puff Filter */}
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--dark)', marginBottom: '8px' }}>Puffs</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {availablePuffs.map(opt => {
                  const active = filters.puffs.includes(opt)
                  return (
                    <button
                      key={opt}
                      onClick={() => toggleFilter('puffs', opt)}
                      style={{
                        padding: '5px 12px', borderRadius: '12px', border: active ? '1.5px solid var(--primary)' : '1.5px solid var(--border)',
                        background: active ? 'var(--primary-light)' : 'var(--white)',
                        color: active ? 'var(--primary)' : 'var(--mid)',
                        fontSize: '0.75rem', fontWeight: active ? '600' : '500', cursor: 'pointer',
                        transition: 'all 0.15s ease', outline: 'none'
                      }}
                    >
                      {opt} puffs
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Nicotine Filter */}
            <div>
              <h4 style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--dark)', marginBottom: '8px' }}>Nicotine</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {availableNics.map(opt => {
                  const active = filters.nicotine.includes(opt)
                  return (
                    <button
                      key={opt}
                      onClick={() => toggleFilter('nicotine', opt)}
                      style={{
                        padding: '5px 12px', borderRadius: '12px', border: active ? '1.5px solid var(--primary)' : '1.5px solid var(--border)',
                        background: active ? 'var(--primary-light)' : 'var(--white)',
                        color: active ? 'var(--primary)' : 'var(--mid)',
                        fontSize: '0.75rem', fontWeight: active ? '600' : '500', cursor: 'pointer',
                        transition: 'all 0.15s ease', outline: 'none'
                      }}
                    >
                      {opt} nic
                    </button>
                  )
                })}
              </div>
            </div>
          </aside>

          {/* ── PRODUCTS GRID ── */}
          {filtered.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '60px 20px', color: 'var(--mid)',
              fontFamily: 'var(--sans)', fontSize: '0.85rem', flex: 1
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>💨</div>
              No products match your filters.<br />
              <button
                onClick={clearAllFilters}
                style={{
                  background: 'none', border: 'none', color: 'var(--primary)',
                  fontWeight: '600', fontSize: '0.8rem', cursor: 'pointer', marginTop: '10px'
                }}
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="products-grid" style={gridStyle}>
              {filtered.map(p => {
                const style = getFlavorStyle(p.flavour)
                return (
                  <div
                    key={p._id}
                    onClick={() => navigate(`/products/${p._id}`)}
                    style={{
                      background: 'var(--white)', borderRadius: '24px', overflow: 'hidden',
                      boxShadow: 'var(--shadow-sm)', cursor: 'pointer', display: 'flex',
                      flexDirection: 'column', position: 'relative', border: '1px solid rgba(0,0,0,0.01)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    
                    {/* Image block */}
                    <div style={{
                      height: '140px', background: style.bg, display: 'flex',
                      alignItems: 'center', justifyContent: 'center', position: 'relative',
                      overflow: 'hidden', padding: '10px'
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
                        <div style={{
                          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px'
                        }}>
                          <svg width="40" height="60" viewBox="0 0 100 150" fill="none">
                            <rect x="25" y="40" width="50" height="100" rx="12" fill={style.tag} opacity="0.3" />
                            <rect x="42" y="15" width="16" height="25" rx="3" fill={style.tag} opacity="0.3" />
                          </svg>
                        </div>
                      )}

                      {/* Flavor badge */}
                      <span style={{
                        position: 'absolute', top: '8px', left: '8px',
                        background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(5px)',
                        color: style.text, fontSize: '0.58rem', fontWeight: '700',
                        padding: '3px 8px', borderRadius: '12px'
                      }}>
                        {p.flavour || 'Original'}
                      </span>
                    </div>

                    {/* Content */}
                    <div style={{ padding: '12px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        {/* Rating & Puffs */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.68rem', fontWeight: '700', color: '#FFB020' }}>
                            ★ <span style={{ color: 'var(--mid)', fontWeight: '500' }}>4.8</span>
                          </span>
                          {p.puffs && (
                            <span style={{ fontSize: '0.62rem', color: 'var(--mid)', background: '#F0F1F5', padding: '1.5px 5px', borderRadius: '6px', fontWeight: '600' }}>
                              {p.puffs} puffs
                            </span>
                          )}
                        </div>

                        {/* Name */}
                        <h3 style={{
                          fontSize: '0.82rem', fontWeight: '700', color: 'var(--dark)',
                          lineHeight: '1.3', marginBottom: '6px', height: '34px',
                          overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical'
                        }}>
                          {p.name}
                        </h3>
                      </div>

                      {/* Pricing */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--dark)' }}>
                          Rs. {p.price.toLocaleString()}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            addToCart(p)
                          }}
                          style={{
                            width: '30px', height: '30px', borderRadius: '50%',
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
              })}
            </div>
          )}

        </div>

      </div>

      {/* MOBILE-ONLY FILTER DRAWER */}
      {isFilterOpen && (
        <>
          <div
            onClick={() => setIsFilterOpen(false)}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
              zIndex: 990, animation: 'fadeIn 0.25s ease'
            }}
          />

          <div style={{
            position: 'fixed', bottom: 0, left: 0, right: 0,
            background: 'var(--white)', borderTopLeftRadius: '28px', borderTopRightRadius: '28px',
            padding: '24px 20px', zIndex: 995, boxShadow: '0 -10px 40px rgba(0,0,0,0.15)',
            maxHeight: '85%', overflowY: 'auto', display: 'flex', flexDirection: 'column',
            animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) both'
          }}>
            <div style={{
              width: '40px', height: '5px', borderRadius: '3px', background: '#E4E5EB',
              alignSelf: 'center', marginBottom: '20px'
            }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '750', color: 'var(--dark)' }}>Filter & Sort</h3>
              <button
                onClick={clearAllFilters}
                style={{
                  background: 'none', border: 'none', color: '#FF5A79',
                  fontWeight: '600', fontSize: '0.8rem', cursor: 'pointer'
                }}
              >
                Clear all
              </button>
            </div>

            {/* Price Filter */}
            <div style={{ marginBottom: '22px' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--dark)', marginBottom: '8px' }}>Price Range</h4>
              <input
                type="range" min="500" max="5000" step="100"
                value={filters.maxPrice}
                onChange={e => setFilters(f => ({ ...f, maxPrice: Number(e.target.value) }))}
                style={{ width: '100%', accentColor: 'var(--primary)', marginBottom: '6px' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--mid)' }}>
                <span>Rs. 500</span>
                <span style={{ fontWeight: '700', color: 'var(--primary)' }}>Up to Rs. {filters.maxPrice.toLocaleString()}</span>
              </div>
            </div>

            {/* Flavor Options pills */}
            <div style={{ marginBottom: '22px' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--dark)', marginBottom: '10px' }}>Flavors</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {availableFlavours.map(opt => {
                  const active = filters.flavours.includes(opt)
                  return (
                    <button
                      key={opt}
                      onClick={() => toggleFilter('flavours', opt)}
                      style={{
                        padding: '6px 14px', borderRadius: '16px', border: active ? '1.5px solid var(--primary)' : '1.5px solid var(--border)',
                        background: active ? 'var(--primary-light)' : 'var(--white)',
                        color: active ? 'var(--primary)' : 'var(--mid)',
                        fontSize: '0.78rem', fontWeight: active ? '600' : '500', cursor: 'pointer',
                        transition: 'all 0.15s ease', outline: 'none', WebkitTapHighlightColor: 'transparent'
                      }}
                    >
                      {opt}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Puffs count pills */}
            <div style={{ marginBottom: '22px' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--dark)', marginBottom: '10px' }}>Puffs count</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {availablePuffs.map(opt => {
                  const active = filters.puffs.includes(opt)
                  return (
                    <button
                      key={opt}
                      onClick={() => toggleFilter('puffs', opt)}
                      style={{
                        padding: '6px 14px', borderRadius: '16px', border: active ? '1.5px solid var(--primary)' : '1.5px solid var(--border)',
                        background: active ? 'var(--primary-light)' : 'var(--white)',
                        color: active ? 'var(--primary)' : 'var(--mid)',
                        fontSize: '0.78rem', fontWeight: active ? '600' : '500', cursor: 'pointer',
                        transition: 'all 0.15s ease', outline: 'none', WebkitTapHighlightColor: 'transparent'
                      }}
                    >
                      {opt} puffs
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Nicotine content pills */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--dark)', marginBottom: '10px' }}>Nicotine strength</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {availableNics.map(opt => {
                  const active = filters.nicotine.includes(opt)
                  return (
                    <button
                      key={opt}
                      onClick={() => toggleFilter('nicotine', opt)}
                      style={{
                        padding: '6px 14px', borderRadius: '16px', border: active ? '1.5px solid var(--primary)' : '1.5px solid var(--border)',
                        background: active ? 'var(--primary-light)' : 'var(--white)',
                        color: active ? 'var(--primary)' : 'var(--mid)',
                        fontSize: '0.78rem', fontWeight: active ? '600' : '500', cursor: 'pointer',
                        transition: 'all 0.15s ease', outline: 'none', WebkitTapHighlightColor: 'transparent'
                      }}
                    >
                      {opt} nicotine
                    </button>
                  )
                })}
              </div>
            </div>

            <button
              onClick={() => setIsFilterOpen(false)}
              className="primary-btn"
              style={{ padding: '12px' }}
            >
              Apply Filters
            </button>
          </div>
        </>
      )}
    </div>
  )
}