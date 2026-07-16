const express = require('express')
const cors = require('cors')
const cloudinary = require('cloudinary').v2
require('dotenv').config()

const app = express()
const allowedOrigins = [
  process.env.CLIENT_URL,
  'https://puffdiaries.vercel.app'
].filter(Boolean)

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true)
    
    const isLocalhost = /^http:\/\/localhost:\d+$/.test(origin)
    if (isLocalhost || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}))
app.use(express.json())

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Import Supabase configuration to verify setup on startup
require('./config/supabase')

app.use('/api/auth', require('./routes/auth'))
app.use('/api/products', require('./routes/products'))
app.use('/api/orders', require('./routes/orders'))

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err)
  res.status(500).json({
    message: err.message || 'Internal Server Error',
    error: err.stack
  })
})

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})