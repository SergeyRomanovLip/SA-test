const { Router } = require('express')
const auth = require('../middleware/auth.middleware')
const Order = require('../models/Order')
const Car = require('../models/Car')
const Potatoe = require('../models/Potatoe')
const User = require('../models/User')
const router = Router()

router.post('/user', auth, async (req, res) => {
  try {
    const { userId } = req.body
    const user = await User.findOne({ userId })
    if (!user) {
      return res.status(500).json({ message: 'Что то пошло не так' })
    }
    res.status(201).json({ message: 'Данные о пользователе получены', data: { user } })
  } catch (e) {
    res.status(500).json({ message: e })
    console.error(e)
  }
})

router.post('/create', auth, async (req, res) => {
  try {
    const { userId } = req.body
    const user = await User.findOne({ userId })
    if (!user.type === 'logistiks') {
      return res.status(500).json({ message: 'Что то пошло не так' })
    }

    res.status(201).json({ message: 'Данные о пользователе получены', data: { user } })
  } catch (e) {
    res.status(500).json({ message: e })
    console.error(e)
  }
})

router.post('/farmers', auth, async (req, res) => {
  try {
    const allFarmers = await User.find({ type: 'farm' })
    res.json(allFarmers)
  } catch (e) {
    res.status(500).json({ message: e })
    console.error(e)
  }
})

router.post('/potatoes', auth, async (req, res) => {
  try {
    const allPotatoes = await Potatoe.find()
    res.json(allPotatoes)
  } catch (e) {
    res.status(500).json({ message: e })
    console.error(e)
  }
})

router.post('/orders', auth, async (req, res) => {
  try {
    let allOrders = await Order.find().populate(['potatoes', 'farm', 'uid'])

    allOrders = allOrders.map((el) => {
      return {
        _id: el._id,
        car: el.car,
        creationDate: el.creationDate,
        deliverDate: el.deliverDate,
        farm: { fname: el.farm.fname, company: el.farm.company, position: el.farm.position, _id: el.farm._id },
        potatoes: { title: el.potatoes.title, _id: el.potatoes._id },
        state: el.state,
        uid: { fname: el.uid.fname, company: el.uid.company, position: el.uid.position, _id: el.uid._id },
        loadedDate: el.loadedDate,
        finishDate: el.finishDate,
        number: el.number,
        quantity: el.quantity
      }
    })
    res.json(allOrders)
  } catch (e) {
    res.status(500).json({ message: e })
    console.error(e)
  }
})

router.post('/addpot', auth, async (req, res) => {
  try {
    const { title } = req.body
    const candidate = await Potatoe.findOne({ title })
    if (!candidate) {
      const potato = new Potatoe({ title })
      await potato.save()
      res.status(201).json({ message: 'Новая номенклатура добавлена' })
    }
    res.status(500).json({ message: 'Такая номенклатура уже есть' })
  } catch (e) {
    res.status(500).json({ message: e })
    console.error(e)
  }
})

router.post('/addorder', auth, async (req, res) => {
  try {
    const { type, potatoe, date, uid, quantity } = req.body

    const number = await Order.countDocuments()
    if ((type, potatoe, date, uid, quantity)) {
      const order = new Order({
        number: number + 1,
        farm: type,
        deliverDate: new Date(date),
        creationDate: Date.now(),
        potatoes: potatoe,
        state: 'created',
        uid: uid,
        quantity: quantity
      })
      await order.save()
      res.status(201).json({ message: 'Новый заказ сделан' })
    }
    res.status(500).json({ message: 'ERROR ERROR' })
  } catch (e) {
    res.status(500).json({ message: e })
    console.error(e)
  }
})

router.post('/addcartoorder', auth, async (req, res) => {
  try {
    const { _id, car } = req.body

    if ((_id, car)) {
      const order = await Order.findOneAndUpdate({ _id }, { car, state: 'car_defined' }, { new: true })
      await order.save()
      res.status(201).json({ message: 'Заявка обновлена, автомобиль добавлен' })
    }
    res.status(500).json({ message: 'ERROR ERROR' })
  } catch (e) {
    res.status(500).json({ message: e })
    console.error(e)
  }
})

router.post('/cancelorder', auth, async (req, res) => {
  try {
    const { _id, callback } = req.body

    if (_id) {
      const order = await Order.findOneAndUpdate({ _id }, { state: 'canceled' }, { new: true })
      await order.save()
      res.status(201).json({ message: 'Заявка отменена' })
    }
    res.status(500).json({ message: 'ERROR ERROR' })
  } catch (e) {
    res.status(500).json({ message: e })
    console.error(e)
  }
})

router.post('/orderloaded', auth, async (req, res) => {
  try {
    const { _id } = req.body

    if (_id) {
      const order = await Order.findOneAndUpdate({ _id }, { state: 'loaded', loadedDate: Date.now() }, { new: true })
      await order.save()
      res.status(201).json({ message: 'Машина загружена' })
    }
    res.status(500).json({ message: 'ERROR ERROR' })
  } catch (e) {
    res.status(500).json({ message: e })
    console.error(e)
  }
})

router.post('/orderfinish', auth, async (req, res) => {
  try {
    const { _id } = req.body
    if (_id) {
      const order = await Order.findOneAndUpdate({ _id }, { state: 'finished', finishDate: Date.now() }, { new: true })
      await order.save()
      res.status(201).json({ message: 'Заявка закрыта' })
    }
    res.status(500).json({ message: 'ERROR ERROR' })
  } catch (e) {
    res.status(500).json({ message: e })
    console.error(e)
  }
})

module.exports = router
