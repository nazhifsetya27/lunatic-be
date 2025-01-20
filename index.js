require('dotenv').config()
const multer = require('multer')
const { rateLimit } = require('express-rate-limit')

const cors = require('cors')
const express = require('express')
const bodyParser = require('body-parser')
const { Request } = require('./src/helper')

const app = express()

const PORT = process.env.PORT || 4000

const upload = multer({
  limits: { fileSize: 50 * 1024 * 1024 }, // Set file size limit if necessary
  storage: multer.memoryStorage(), // Store files in memory for testing
})

app.use(
  cors({
    origin: true,
    credentials: true,
  })
)
app.options('*', cors())

// coming soon

// const limiter = rateLimit({
//   windowMs: 1 * 60 * 1000, // 15 minutes
//   limit: 60, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
//   standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
//   legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
//   keyGenerator: (req, res) => req.header('authorization'),
//   skip: (req, res) => req.header('skip-key') == '95628431235',
//   handler: (req, res, next, options) => {
//     Request.error(res, 'You can only make 60 requests every minutes.')
//   },
// })

// app.use(limiter)
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json({ limit: '50mb', extended: true }))
app.use(
  bodyParser.urlencoded({
    limit: '50mb',
    extended: true,
    parameterLimit: 50000,
  })
)
app.use(bodyParser.text({ limit: '200mb' }))
app.use(upload.any()) // This will handle all form-data file uploads

app.use('/public', express.static('public'))

app.get('/', (req, res) => {
  res.json('service lunatic BE is running')
})

// NOTE : Add your routes here
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

app.listen(PORT, () => {
  console.log(`server running on PORT: ${PORT}`)
})
