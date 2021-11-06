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

module.exports = model('Order', Order)
