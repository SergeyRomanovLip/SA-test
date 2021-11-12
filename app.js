const express = require('express')
const cors = require('cors')
const url = require('url')
const app = express()
const ip = require('./utils/checkIp')
const path = require('path')
let clients = []
function getClients() {
  console.log(clients)
  return clients
}
exports.getClients = getClients

function eventsHandler(request, response, next) {
  const headers = {
    'Content-Type': 'text/event-stream',
    Connection: 'keep-alive',
    'Cache-Control': 'no-cache',
  }
  response.writeHead(200, headers)
  response.write(`data: ${JSON.stringify({ message: 'Вы подключены к серверу LWM', state: 'connect' })}\n\n`)

  const reqData = url.parse(request.url, true).query
  const clientId = Date.now()
  const newClient = {
    id: reqData.uid,
    fname: reqData.fname,
    company: reqData.company,
    position: reqData.position,
    response,
  }
  clients.push(newClient)
  clients.forEach((client) => {
    if (client.id !== newClient.id) {
      client.response.write(
        `data: ${JSON.stringify({
          message: `${newClient.fname || newClient.company} подключился к серверу LWM`,
          state: 'alive',
        })}\n\n`
      )
    }
  })

  console.log(newClient.fname + ' Connected')
  let interval = setInterval(() => {
    console.log(`${newClient.fname} keep`)
    response.write(`data: ${JSON.stringify({ state: 'alive' })}\n\n`)
  }, 10000)
  request.on('close', () => {
    console.log(`${newClient.fname} Connection closed`)
    clearInterval(interval)
    clients = clients.filter((client) => client.id !== clientId)
  })
}

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/track', require('./routes/track.routes'))
app.use('/api/data', require('./routes/doc.routes'))
app.get('/sseupdate', eventsHandler)

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
      useUnifiedTopology: true,
    })
    app.listen(PORT, () => console.log(`App has been started on ${PORT}, ${ip()}`))
  } catch (e) {
    console.log('Server ERROR', e.message)
    process.exit(1)
  }
}

start()
