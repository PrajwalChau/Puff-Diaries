import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../App'
import Navbar from '../components/Navbar'
import API_BASE from '../api'

export default function Admin() {
  const { token } = useAuth()
  const navigate = useNavigate()
  
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [activeTab, setActiveTab] = useState('orders')
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', image: '', flavour: '', puffs: '', nicotine: '', badge: '' })
  const [imageFile, setImageFile] = useState(null)
  const [loading, setLoading] = useState(true)

  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    axios.get(`${API_BASE}/api/orders`, { headers })
      .then(res => {
        setOrders(res.data)
        setLoading(false)
      })
      .catch(() => {
        navigate('/')
        setLoading(false)
      })
      
    axios.get(`${API_BASE}/api/products`)
      .then(res => setProducts(res.data))
      .catch(() => {})
  }, [token, navigate])

  const updateStatus = async (id, status) => {
    try {
      await axios.patch(`${API_BASE}/api/orders/${id}`, { status }, { headers })
      setOrders(orders.map(o => o._id === id ? { ...o, status } : o))
    } catch {
      alert('Failed to update status')
    }
  }

  const addProduct = async () => {
    if (!newProduct.name || !newProduct.price) return alert('Product Name and Price are required')
    try {
      const formData = new FormData()
      Object.keys(newProduct).forEach(key => {
        if (newProduct[key]) formData.append(key, newProduct[key])
      })
      if (imageFile) formData.append('image', imageFile)

      const res = await axios.post(`${API_BASE}/api/products`, formData, { 
        headers: { ...headers, 'Content-Type': 'multipart/form-data' }
      })
      setProducts([...products, res.data])
      setNewProduct({ name: '', description: '', price: '', image: '', flavour: '', puffs: '', nicotine: '', badge: '' })
      setImageFile(null)
      alert('Product added successfully!')
    } catch (error) {
      console.error(error)
      const backendError = error.response?.data?.error || error.response?.data?.message || 'Failed to add product'
      alert('Error: ' + backendError)
    }
  }

  const deleteProduct = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    try {
      await axios.delete(`${API_BASE}/api/products/${id}`, { headers })
      setProducts(products.filter(p => p._id !== id))
    } catch {
      alert('Failed to delete product')
    }
  }

  const statusColors = { pending: '#E65100', verified: '#0288D1', dispatched: '#8C52FF', delivered: '#388E3C' }
  const statusBgs = { pending: '#FEF6EA', verified: '#E0F2FE', dispatched: '#F3EFFF', delivered: '#EBF7F2' }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg-app)' }}>
      <Navbar />

      <div style={{ flex: 1, padding: '20px 16px', overflowY: 'auto', paddingBottom: '30px' }}>
        
        {/* Title */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h1 style={{ fontSize: '1.45rem', fontWeight: '800', color: 'var(--dark)' }}>Admin Panel</h1>
            <p style={{ fontSize: '0.8rem', color: 'var(--mid)' }}>Manage orders & catalog</p>
          </div>
        </div>

        {/* Tab Toggle buttons */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          {['orders', 'products'].map(t => {
            const active = activeTab === t
            const pendingOrders = orders.filter(o => o.status === 'pending').length
            return (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                style={{
                  flex: 1, padding: '10px', borderRadius: '16px', border: 'none',
                  background: active ? 'var(--primary)' : 'var(--white)',
                  color: active ? 'var(--white)' : 'var(--mid)',
                  fontSize: '0.82rem', fontWeight: '700', cursor: 'pointer',
                  boxShadow: active ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                  transition: 'all 0.2s', outline: 'none', textTransform: 'capitalize'
                }}
              >
                {t} {t === 'orders' && pendingOrders > 0 ? `(${pendingOrders} pending)` : ''}
              </button>
            )
          })}
        </div>

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '20px', color: 'var(--light)', fontStyle: 'italic', fontSize: '0.85rem' }}>
                Loading orders...
              </div>
            ) : orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px', color: 'var(--light)', fontStyle: 'italic', fontSize: '0.85rem' }}>
                No orders placed yet.
              </div>
            ) : (
              orders.map(o => (
                <div
                  key={o._id}
                  style={{
                    background: 'var(--white)', borderRadius: '24px', padding: '16px',
                    boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)',
                    display: 'flex', flexDirection: 'column', gap: '12px'
                  }}
                >
                  {/* Customer and basic info */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h3 style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--dark)' }}>{o.customerName}</h3>
                      <p style={{ fontSize: '0.75rem', color: 'var(--mid)', marginTop: '2px' }}>{o.phone} · {o.address}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: '600', marginTop: '6px' }}>
                        {o.product?.name || 'Vape Device'} (Rs. {o.product?.price})
                      </p>
                    </div>

                    <span style={{
                      background: statusBgs[o.status] || '#F0F1F5',
                      color: statusColors[o.status] || 'var(--mid)',
                      fontSize: '0.62rem', fontWeight: '750', textTransform: 'uppercase',
                      padding: '4px 10px', borderRadius: '12px'
                    }}>
                      {o.status}
                    </span>
                  </div>

                  {/* Actions & Payment proof link */}
                  <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    borderTop: '1px dashed var(--border)', paddingTop: '10px', marginTop: '4px'
                  }}>
                    {o.paymentScreenshot ? (
                      <a
                        href={o.paymentScreenshot} target="_blank" rel="noreferrer"
                        style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: '700', textDecoration: 'underline' }}
                      >
                        Receipt Proof ↗
                      </a>
                    ) : (
                      <span style={{ fontSize: '0.72rem', color: 'var(--light)' }}>No receipt uploaded</span>
                    )}

                    {/* State change triggers */}
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {o.status === 'pending' && (
                        <button
                          onClick={() => updateStatus(o._id, 'verified')}
                          style={{
                            background: '#EBF7F2', border: 'none', borderRadius: '10px',
                            color: '#388E3C', padding: '6px 12px', fontSize: '0.7rem',
                            fontWeight: '700', cursor: 'pointer', outline: 'none'
                          }}
                        >
                          Verify Payment
                        </button>
                      )}
                      {o.status === 'verified' && (
                        <button
                          onClick={() => updateStatus(o._id, 'dispatched')}
                          style={{
                            background: 'var(--primary-light)', border: 'none', borderRadius: '10px',
                            color: 'var(--primary)', padding: '6px 12px', fontSize: '0.7rem',
                            fontWeight: '700', cursor: 'pointer', outline: 'none'
                          }}
                        >
                          Ship Package
                        </button>
                      )}
                      {o.status === 'dispatched' && (
                        <button
                          onClick={() => updateStatus(o._id, 'delivered')}
                          style={{
                            background: '#F0F1F5', border: 'none', borderRadius: '10px',
                            color: 'var(--dark)', padding: '6px 12px', fontSize: '0.7rem',
                            fontWeight: '700', cursor: 'pointer', outline: 'none'
                          }}
                        >
                          Complete Delivery
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* PRODUCTS TAB */}
        {activeTab === 'products' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Create Product card */}
            <div style={{
              background: 'var(--white)', borderRadius: '24px', padding: '16px',
              boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)'
            }}>
              <h3 style={{ fontSize: '0.85rem', fontWeight: '850', color: 'var(--dark)', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                Add New Product
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label>Product Name</label>
                  <input
                    className="input-field" type="text" placeholder="e.g. Elf Bar Ultra"
                    value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                  />
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label>Price (Rs.)</label>
                    <input
                      className="input-field" type="number" placeholder="e.g. 2500"
                      value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                    />
                  </div>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label>Flavor Category</label>
                    <input
                      className="input-field" type="text" placeholder="e.g. Mint, Fruits"
                      value={newProduct.flavour} onChange={e => setNewProduct({ ...newProduct, flavour: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label>Puff Count</label>
                    <input
                      className="input-field" type="text" placeholder="e.g. 5000"
                      value={newProduct.puffs} onChange={e => setNewProduct({ ...newProduct, puffs: e.target.value })}
                    />
                  </div>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label>Nicotine Strength</label>
                    <input
                      className="input-field" type="text" placeholder="e.g. 5%"
                      value={newProduct.nicotine} onChange={e => setNewProduct({ ...newProduct, nicotine: e.target.value })}
                    />
                  </div>
                </div>

                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label>Badge Highlight</label>
                  <input
                    className="input-field" type="text" placeholder="e.g. New, Best Seller"
                    value={newProduct.badge} onChange={e => setNewProduct({ ...newProduct, badge: e.target.value })}
                  />
                </div>

                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label>Product Image</label>
                  <input
                    className="input-field" type="file" accept="image/*"
                    onChange={e => setImageFile(e.target.files[0])}
                    style={{ padding: '9px 12px' }}
                  />
                </div>

                <div className="input-group" style={{ marginBottom: '10px' }}>
                  <label>Product Description</label>
                  <textarea
                    className="input-field" rows="3" placeholder="Enter product characteristics..."
                    value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                    style={{ resize: 'none' }}
                  />
                </div>

                <button onClick={addProduct} className="primary-btn" style={{ height: '44px' }}>
                  Add Product to Catalog
                </button>
              </div>
            </div>

            {/* List and edit products */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--dark)' }}>Current Catalog ({products.length})</h3>
              
              {products.map(p => (
                <div
                  key={p._id}
                  style={{
                    background: 'var(--white)', borderRadius: '20px', padding: '12px',
                    boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                    {p.image ? (
                      <img src={p.image} alt="" style={{ width: '42px', height: '42px', borderRadius: '8px', objectFit: 'contain' }} />
                    ) : (
                      <span style={{ fontSize: '1.25rem' }}>💨</span>
                    )}
                    <div style={{ minWidth: 0 }}>
                      <h4 style={{
                        fontSize: '0.8rem', fontWeight: '800', color: 'var(--dark)',
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                      }}>{p.name}</h4>
                      <p style={{ fontSize: '0.7rem', color: 'var(--mid)', marginTop: '2px' }}>
                        Rs. {p.price?.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteProduct(p._id)}
                    style={{
                      background: '#FDF1F5', border: 'none', borderRadius: '12px',
                      color: '#880E4F', padding: '6px 12px', fontSize: '0.72rem',
                      fontWeight: '700', cursor: 'pointer', outline: 'none'
                    }}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>

          </div>
        )}

      </div>
    </div>
  )
}