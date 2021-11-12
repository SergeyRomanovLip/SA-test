const { Router } = require('express')
const auth = require('../middleware/auth.middleware')
const Order = require('../models/Order')
const Car = require('../models/Car')
const Potatoe = require('../models/Potatoe')
const User = require('../models/User')
const { ObjectId } = require('bson')
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
  }
})

router.post('/farmers', auth, async (req, res) => {
  try {
    const allFarmers = await User.find({ type: 'farm' })
    res.json(allFarmers)
  } catch (e) {
    res.status(500).json({ message: e })
  }
})

router.post('/potatoes', auth, async (req, res) => {
  try {
    const allPotatoes = await Potatoe.find()
    res.json(allPotatoes)
  } catch (e) {
    res.status(500).json({ message: e })
  }
})

router.post('/orders', auth, async (req, res) => {
  let filters = {}
  req.body.options &&
    Object.keys(req.body.options).forEach((key) => {
      if (req.body?.options[key]?.length > 0) {
        filters[key] = { $in: req.body.options[key] }
      }
    })

  const user = await User.findOne({ _id: req.body.userId })

  if (user.type !== 'logisticks' && req.body.options) {
    filters.farm.$in = [user._id.toString()]
  }

  console.log(filters)

  try {
    let allOrders = await Order.find({ ...filters }).populate(['potatoes', 'farm', 'uid', 'car'])
    allOrders = allOrders.map((el) => {
      return {
        _id: el._id,
        car: el.carNumber,
        driver: { phone: el.car?.phone, fio: el.car?.fio },
        creationDate: el.creationDate,
        deliverDate: el.deliverDate,
        farm: { fname: el.farm.fname, company: el.farm.company, position: el.farm.position, _id: el.farm._id },
        potatoes: { title: el.potatoes.title, _id: el.potatoes._id },
        state: el.state,
        uid: { fname: el.uid.fname, company: el.uid.company, position: el.uid.position, _id: el.uid._id },
        loadedDate: el.loadedDate,
        finishDate: el.finishDate,
        number: el.number,
        quantity: el.quantity,
      }
    })
    res.json(allOrders)
  } catch (e) {
    res.status(500).json({ message: e })
  }
})

router.post('/addpot', auth, async (req, res) => {
  try {
    const { title } = req.body
    const candidate = await Potatoe.findOne({ title })
    if (!candidate) {
      const potato = new Potatoe({ title })
      await potato.save()
      return res.status(201).json({ message: 'Новая номенклатура добавлена' })
    }
    res.status(500).json({ message: 'Такая номенклатура уже есть' })
  } catch (e) {
    res.status(500).json({ message: e })
  }
})

router.post('/addorder', auth, async (req, res) => {
  try {
    const { type, potatoe, date, uid } = req.body

    const number = await Order.countDocuments()
    if ((type, potatoe, date, uid)) {
      const order = new Order({
        number: number + 1,
        farm: type,
        deliverDate: new Date(date),
        creationDate: Date.now(),
        potatoes: potatoe,
        state: 'created',
        uid: uid,
      })
      await order.save()
      return res.status(201).json({ message: 'Новый заказ сделан' })
    }
  } catch (e) {
    res.status(500).json({ message: e })
    console.error(e)
  }
})

router.post('/addcartoorder', auth, async (req, res) => {
  try {
    const { _id, car } = req.body
    const candidate = await Car.findOne({ phone: car.phone })

    let newCarId = null
    if (!candidate) {
      const newCar = new Car({ fio: car.fio, phone: car.phone })
      await newCar.save()
      const writtenDriver = await Car.findOne({ phone: car.phone })
      newCarId = writtenDriver._id
    } else {
      newCarId = candidate._id
    }

    if (newCarId) {
      const order = await Order.findOneAndUpdate(
        { _id },
        { car: newCarId, carNumber: car.number, state: 'car_defined' },
        { new: true }
      )
      const driver = await Car.findOneAndUpdate({ _id: newCarId }, { $push: { orders: _id } }, { new: true })
      await order.save()
      await driver.save()
      return res.status(201).json({ message: 'Заявка обновлена, автомобиль добавлен' })
    } else {
      throw new Error('Не получилось добавить автомобиль к заказу, попробуйте еще раз')
    }
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
      return res.status(201).json({ message: 'Заявка отменена' })
    }
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
      return res.status(201).json({ message: 'Машина загружена' })
    }
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
      return res.status(201).json({ message: 'Заявка закрыта' })
    }
  } catch (e) {
    res.status(500).json({ message: e })
    console.error(e)
  }
})

module.exports = router
