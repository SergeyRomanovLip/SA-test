const { Schema, model, Types } = require('mongoose')
const Car = new Schema({
  fio: { type: String, required: true },
  phone: { type: String, required: true },
  orders: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Order',
    },
  ],
})

module.exports = model('Car', Car)
