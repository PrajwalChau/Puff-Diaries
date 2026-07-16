const router = require('express').Router()
const Order = require('../models/Order')
const auth = require('../middleware/auth')
const supabase = require('../config/supabase')
const multer = require('multer')

// ✅ Memory storage — Vercel filesystem is read-only
const upload = multer({ storage: multer.memoryStorage() })

// public: track by phone or email
router.get('/track', async (req, res) => {
  const { identifier } = req.query
  if (!identifier) return res.json([])
  const User = require('../models/User')
  const user = await User.findOne({ $or: [{ email: identifier }, { phone: identifier }] })
  if (!user) return res.json([])
  const orders = await Order.find({ user: user._id }).populate('product').sort({ createdAt: -1 })
  res.json(orders)
})

// logged in: my orders
router.get('/mine', auth, async (req, res) => {
  const orders = await Order.find({ user: req.user.id }).populate('product').sort({ createdAt: -1 })
  res.json(orders)
})

// admin: all orders
router.get('/', auth, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: 'Admins only' })
  const orders = await Order.find()
    .populate('product')
    .populate('user', 'name email phone')
    .sort({ createdAt: -1 })
  res.json(orders)
})

// place order (must be logged in)
router.post('/', auth, upload.single('screenshot'), async (req, res) => {
  try {
    let screenshotUrl = ''
    if (req.file) {
      const fileExt = req.file.originalname.split('.').pop()
      const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${fileExt}`
      
      const { data, error } = await supabase.storage
        .from('receipts')
        .upload(fileName, req.file.buffer, {
          contentType: req.file.mimetype,
          upsert: false
        })
        
      if (error) {
        console.error('Supabase upload error:', error)
        return res.status(500).json({ message: 'Error uploading receipt to storage', error: error.message })
      }
      
      const { data: publicUrlData } = supabase.storage.from('receipts').getPublicUrl(fileName)
      screenshotUrl = publicUrlData.publicUrl
    }
    const order = await Order.create({
      ...req.body,
      user: req.user.id,
      paymentScreenshot: screenshotUrl
    })
    res.json(order)
  } catch (err) {
    console.error('Order creation error:', err)
    res.status(500).json({ message: 'Error creating order', error: err.message })
  }
})

// admin: update status
router.patch('/:id', auth, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: 'Admins only' })
  const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true })
  res.json(order)
})

module.exports = router