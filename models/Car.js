const { Schema, model, Types } = require('mongoose')
const Car = new Schema({
  number: { type: String, required: true },
  orders: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Order'
    }
  ]
})

module.exports = model('Car', Car)
