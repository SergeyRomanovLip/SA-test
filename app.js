const express = require('express')
var cors = require('cors')
const app = express()
const ip = require('./utils/checkIp')
const path = require('path')

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/track', require('./routes/track.routes'))
app.use('/api/data', require('./routes/doc.routes'))

if (process.env.NODE_ENV === 'production') {
  app.use('/', express.static(path.join(__dirname, 'client', 'build')))
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })
}

const mongoose = require('mongoose')
const config = require('config')
const PORT = config.get('port') || 5000

async function start() {
  try {
    await mongoose.connect(config.get('mongoUri'), {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    app.listen(PORT, () => console.log(`App has been started on ${PORT}, ${ip()}`))
  } catch (e) {
    console.log('Server ERROR', e.message)
    process.exit(1)
  }
}

start()
