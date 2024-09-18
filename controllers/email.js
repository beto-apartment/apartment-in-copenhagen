const express = require('express')
const sendEmail = require('../utils/email')

const router = express.Router()

router.post('/', async (req, res) => {
  const { to, subject, message } = req.body

  try {
    await sendEmail(to, subject, message)
    res.status(200).send('Email sent successfully')
  } catch (error) {
    console.error('Error sending email:', error)
    res.status(500).send('Error sending email')
  }
})

module.exports = router
