const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
    const { username, password } = request.body

    const user = await User
        .findOne({ username })
        .populate('hours', { month: 1, days: 1, monthHours: 1, date: 1 })
        // populat hours so login data has all the user hours

    const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(password, user.passwordHash)

    if (!(user && passwordCorrect)) {
        return response.status(401).json({
            error: 'invalid username or password'
        })
    }

    const userForToken = {
        username: user.username,
        id: user._id,
    }

    const token = jwt.sign(userForToken, process.env.SECRET)

    console.log('user id', user._id)

    response
        .status(200)
        .send({ token, username: user.username, hours: user.hours, id: user._id, email: user.userEmail })
        // id was used to get all this user data. now it's not needed anymore
        // becouse we populate the hours
})

module.exports = loginRouter