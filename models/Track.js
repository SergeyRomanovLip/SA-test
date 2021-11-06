const { Schema, model, Types } = require('mongoose')

const track = new Schema(
  {
    user: { type: String },
    orderId: { type: String },
    region: { type: Object },
    coords: { type: Object }
  },
  { autoIndex: true }
)

module.exports = model('Track', track)
