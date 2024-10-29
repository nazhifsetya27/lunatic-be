require('dotenv').config()

const cors = require('cors')
const express = require('express')

const PORT = process.env.PORT || 4000

const app = express()

app.use(
  cors({
    origin: 'http://localhost:3010',
  })
)

app.get('/', (req, res) => {
  res.json('service lunatic BE is running')
})

app.listen(PORT, () => {
  console.log(`server running on PORT: ${PORT}`)
})
