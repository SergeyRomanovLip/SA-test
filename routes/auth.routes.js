const { Router } = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const User = require('../models/User')
const router = Router()

router.post('/register', async (req, res) => {
  try {
    const { email, password, fname, type, position, company, avt } = req.body
    const candidate = await User.findOne({ email })
    if (candidate) {
      return res.status(400).json({ message: 'Такой пользователь уже существует' })
    }
    const hashedPassword = await bcrypt.hash(password, 1)
    const user = new User({ email, password: hashedPassword, fname, type, position, company, avt })
    await user.save()
    res.status(201).json({ message: 'Пользователь создан' })
  } catch (e) {
    res.status(500).json({ message: e })
    console.error(e)
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: 'Такого пользователя не существует, зарегистрируйтесь' })
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Пароль не верный' })
    }
    console.log(user.type)
    const token = jwt.sign({ userId: user.id }, config.get('jwtSecret'), { expiresIn: '3h' })
    res.json({
      token,
      userId: user.id,
      expire: new Date(Date.now() + 2 * (60 * 60 * 1000)),
      type: user.type,
      message: 'Добро пожаловать',
      fname: user.fname,
      company: user.company,
      position: user.position
    })
  } catch (e) {}
})

module.exports = router

// [check('email', 'Некорректный email').isEmail(), check('password', 'Минимальная длина пароля 6 символов').isLength({ min: 6 })]
// const errors = validationResult(req)

// if (!errors.isEmpty()) {
//   console.log('Некорректные данные при регистрации')
//   return res.status(400).json({ errors: errors.array(), message: 'Некорректные данные при регистрации' })
// }
