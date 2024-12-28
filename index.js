require('dotenv').config()
const multer = require('multer')

const cors = require('cors')
const express = require('express')
const bodyParser = require('body-parser')

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

app.listen(PORT, () => {
  console.log(`server running on PORT: ${PORT}`)
})
