const { Schema, model, Types } = require('mongoose')
const schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fname: { type: String, required: true },
  type: { type: String, required: true },
  position: { type: String, required: true },
  company: { type: String },
  avt: {
    data: Buffer,
    contentType: String
  },
  orders: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Order'
    }
  ]
})

module.exports = model('User', schema)
