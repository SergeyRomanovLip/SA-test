class Clients {
  constructor() {
    this.clients = []
  }
  push(clnt) {
    this.clients.push(clnt)
    console.log(`${clnt.fname} connected`)
  }
  get() {
    return this.clients
  }
  remove(id) {
    this.clients.filter((client) => client.id !== id)
    console.log(`${id} gone`)
  }
}

module.exports = Clients
