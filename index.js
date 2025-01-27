require('dotenv').config()
const multer = require('multer')
const cors = require('cors')
const express = require('express')
const bodyParser = require('body-parser')
const { Server } = require('socket.io')
const http = require('http')

const app = express()
const server = http.createServer(app) // Create HTTP server for Express and Socket.IO
global.io = new Server(server, {
  cors: {
    origin: true,
    credentials: true,
  },
})

// Middleware
app.use(cors({ origin: true, credentials: true }))
app.use(express.json())
app.use(bodyParser.json({ limit: '50mb', extended: true }))
app.use(
  bodyParser.urlencoded({
    limit: '50mb',
    extended: true,
    parameterLimit: 50000,
  })
)
app.use(bodyParser.text({ limit: '200mb' }))
app.use('/public', express.static('public'))

// File upload handling
const UPLOAD_TEMP_PATH = 'public/uploads/temp/'
const upload = multer({ dest: UPLOAD_TEMP_PATH })
exports.UPLOAD_TEMP_PATH = UPLOAD_TEMP_PATH
app.use(upload.any())

// Debug Middleware
app.use((req, res, next) => {
  console.log(`HTTP Request: ${req.method} ${req.url}`)
  if (req.path === '/socket.io') {
    console.log('Request hitting /socket.io')
  }
  next()
})

// Routes
app.get('/', (req, res) => {
  res.json('service lunatic BE is running')
})

app.use('/auth', require('./src/modules/auth/auth.routes'))
app.use(
  '/storage-management',
  require('./src/modules/storage-management/storage-management.routes')
)
app.use('/asset', require('./src/modules/asset/asset.routes'))
app.use('/user', require('./src/modules/user/user.routes'))
app.use('/settings', require('./src/modules/settings/settings.routes'))
app.use('/option', require('./src/modules/option/option.routes'))
app.use(
  '/stock-adjustment',
  require('./src/modules/stock-adjustment/stock-adjustment.routes')
)
app.use(
  '/stock-adjustment-inventory',
  require('./src/modules/stock-adjustment-inventory/stock-adjustment-inventory.routes')
)

app.use('/approval', require('./src/modules/approval/approval.routes'))
app.use('/dashboard', require('./src/modules/dashboard/dashboard.routes'))

// Socket.IO Connection
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id)

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id)
  })
})

// Start the server
const PORT = process.env.PORT || 4000
server.listen(PORT, () => {
  console.log(`Server running on PORT: ${PORT}`)
})
