const router = require('express').Router()
const Product = require('../models/Product')
const auth = require('../middleware/auth')

router.get('/', async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 })
  res.json(products)
})

// ⚠️ /recent MUST come before /:id — otherwise Express treats "recent" as an _id param
router.get('/recent', async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 }).limit(4)
  res.json(products)
})

router.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id)
  res.json(product)
})

const multer = require('multer')
const supabase = require('../config/supabase')
const upload = multer({ storage: multer.memoryStorage() })

router.post('/', auth, upload.single('image'), async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: 'Admins only' })
  
  try {
    let imageUrl = req.body.image || ''
    
    // If a file is uploaded, upload to Supabase storage
    if (req.file) {
      const fileExt = req.file.originalname.split('.').pop()
      const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${fileExt}`
      
      const { data, error } = await supabase.storage
        .from('products')
        .upload(fileName, req.file.buffer, {
          contentType: req.file.mimetype,
          upsert: false
        })
        
      if (error) {
        console.error('Supabase upload error:', error)
        return res.status(500).json({ message: 'Error uploading image to storage', error: error.message })
      }
      
      const { data: publicUrlData } = supabase.storage.from('products').getPublicUrl(fileName)
      imageUrl = publicUrlData.publicUrl
    }
    
    const productData = { ...req.body, image: imageUrl }
    const product = await Product.create(productData)
    res.json(product)
  } catch (error) {
    console.error('Product creation error:', error)
    res.status(500).json({ message: 'Error creating product', error: error.message })
  }
})

router.put('/:id', auth, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: 'Admins only' })
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
  res.json(product)
})

router.delete('/:id', auth, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ message: 'Admins only' })
  await Product.findByIdAndDelete(req.params.id)
  res.json({ success: true })
})

module.exports = router