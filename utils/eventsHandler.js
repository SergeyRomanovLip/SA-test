function eventsHandler(request, response, next, clients) {
  const headers = {
    'Content-Type': 'text/event-stream',
    Connection: 'keep-alive',
    'Cache-Control': 'no-cache',
  }
  response.writeHead(200, headers)
  const data = `data: ${JSON.stringify({ message: 'Connected' })}\n\n`
  response.write(data)
  const clientId = Date.now()
  const newClient = {
    id: clientId,
    response,
  }
  clients.push(newClient)
  console.log(newClient.id + ' Connection opened')
  request.on('close', () => {
    console.log(`${clientId} Connection closed`)
    clients = clients.filter((client) => client.id !== clientId)
  })
}
