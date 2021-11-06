const { Router } = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const Track = require('../models/Track')
const router = Router()

router.post('/add', async (req, res) => {
  try {
    const { location, user } = req.body

    const track = new Track({ user: user, orderId: '5567', region: location.region, coords: location.coords })
    await track.save()
    console.log('Запись сделана')
  } catch (e) {
    res.status(500).json({ message: e })
    console.error(e)
  }
})

module.exports = router
