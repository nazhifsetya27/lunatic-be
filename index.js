require('dotenv').config()

const cors = require('cors')
const express = require('express')
const bodyParser = require('body-parser')

const app = express()

const PORT = process.env.PORT || 4000

app.use(
  cors({
    origin: 'http://localhost:3010',
  })
)

app.use(express.json())

// parse requests of content-type - application/x-www-form-urlencoded
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

app.get('/', (req, res) => {
  res.json('service lunatic BE is running')
})

// NOTE : Add your routes here
app.use('/auth', require('./src/modules/auth/auth.routes'))

app.listen(PORT, () => {
  console.log(`server running on PORT: ${PORT}`)
})
