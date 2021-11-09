const { Schema, model, Types } = require('mongoose')
const { getClients } = require('../app')

const Order = new Schema(
  {
    number: { type: String },
    quantity: { type: String },
    farm: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    deliverDate: { type: Date, required: true },
    loadedDate: { type: Date },
    creationDate: { type: Date, required: true },
    finishDate: { type: Date },
    potatoes: {
      type: Schema.Types.ObjectId,
      ref: 'Potatoe',
      required: true
    },
    state: { type: String, required: true },
    car: {
      type: String
    },
    uid: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { autoIndex: true }
)
Order.post('save', async function (doc, next) {
  setTimeout(() => {
    if (doc.state === 'created') {
      getClients().forEach(({ id, response }) => {
        const data = `data: ${JSON.stringify({ message: `Создан новый заказ № ${doc.number}`, update: 'orders' })}\n\n`
        response.write(data)
      })
    }
    if (doc.state === 'car_defined') {
      getClients().forEach(({ id, response }) => {
        const data = `data: ${JSON.stringify({ message: `На заказ № ${doc.number} назначена машина`, update: 'orders' })}\n\n`
        response.write(data)
      })
    }
    if (doc.state === 'loaded') {
      getClients().forEach(({ id, response }) => {
        const data = `data: ${JSON.stringify({ message: `Заказ № ${doc.number} загружен`, update: 'orders' })}\n\n`
        response.write(data)
      })
    }
    if (doc.state === 'canceled') {
      getClients().forEach(({ id, response }) => {
        const data = `data: ${JSON.stringify({ message: `Заказ № ${doc.number} отменен`, update: 'orders' })}\n\n`
        response.write(data)
      })
    }
    if (doc.state === 'finished') {
      getClients().forEach(({ id, response }) => {
        const data = `data: ${JSON.stringify({ message: `Заказ № ${doc.number} завершен`, update: 'orders' })}\n\n`
        response.write(data)
      })
    }
  }, 100)

  next()
})

module.exports = model('Order', Order)
