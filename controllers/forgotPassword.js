const forgotPasswordRouter = require('express').Router()
const jwt = require('jsonwebtoken')
// utils
const sendEmail = require('../utils/email')
// models
const User = require('../models/user')

// send email con link para recuperar password
forgotPasswordRouter.post('/', async (request, response) => {
    try {
        const { userEmail } = request.body
        const user = await User.findOne({ userEmail })
        if (user) {
            const userForToken = {
                username: user.username,
                id: user._id,
            }
            const token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: '1h' })
            const to = userEmail
            const subject = 'Password Reset'
            const message = `You requested a password reset. Go back to the app and paste the following token to reset your password. Token:\n\n${token}`
            await sendEmail(to, subject, message)
            return response.status(200).json({ message: 'Password reset email sent' })
        } else {
            return response.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        return response.status(500).json({ error: 'Something went wrong' })
    }
})

module.exports = forgotPasswordRouter