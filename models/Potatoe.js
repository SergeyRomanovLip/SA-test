const { Schema, model, Types } = require('mongoose')
const Potatoe = new Schema({
  title: { type: String, required: true },
  params: { type: Object },
  orders: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Order'
    }
  ]
})

module.exports = model('Potatoe', Potatoe)
