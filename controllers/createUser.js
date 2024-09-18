const bcrypt = require('bcrypt')
const createUsersRouter = require('express').Router()
const User = require('../models/user')

createUsersRouter.post('/', async (request, response) => {
    const { username, password } = request.body

    const existingUser = await User.findOne({ username })

    if (existingUser) {
        return response.status(400).json({ error: 'username must be unique' })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        username,
        passwordHash,
    })

    const savedUser = await user.save()

    response.json(savedUser)
})

createUsersRouter.post('/changePassword', async (request, response) => {
    const { userEmail, newPassword } = request.body

    const user = await User.findOne({ userEmail })

    if (user) {
        try {
            const saltRounds = 10
            const passwordHash = await bcrypt.hash(newPassword, saltRounds)
            user.passwordHash = passwordHash
            const updatedUser = await user.save()
            response.json(updatedUser)
        } catch (error) {
            response.status(400).json({ error: error.message })
        }
    } else {
        return response.status(400).json({ error: 'User not found' })
    }
})

createUsersRouter.post('/changeEmail', async (request, response) => {
    const { userEmail, newEmail } = request.body

    const user = await User.findOne({ userEmail })

    if (user) {
        try {
            user.userEmail = newEmail
            const updatedUser = await user.save()
            response.json(updatedUser)
        } catch (error) {
            response.status(400).json({ error: error.message })
        }
    } else {
        return response.status(400).json({ error: 'User not found' })
    }
})

module.exports = createUsersRouter