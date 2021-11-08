const { Schema, model, Types } = require('mongoose')

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
      required: true,
    },
    state: { type: String, required: true },
    car: {
      type: String,
    },
    uid: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { autoIndex: true }
)
Order.post('save', function (doc, next) {
  const clients = require('../app')
  if (doc.state === 'created') {
    clients.forEach(({ id, response }) => {
      const data = `data: ${JSON.stringify({ message: `Создан новый заказ № ${doc.number}` })}\n\n`
      response.write(data)
    })
  } else if (doc.state === 'finished') {
    clients.forEach(({ id, response }) => {
      const data = `data: ${JSON.stringify({ message: `Заказ № ${doc.number} завершен` })}\n\n`
      response.write(data)
    })
  }

  next()
})

module.exports = model('Order', Order)
