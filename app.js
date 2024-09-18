const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const middleware = require('./utils/middleware')


// replace routers
// ---------------
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const createUsersRouter = require('./controllers/createUser')
const emailRouter = require('./controllers/email')
const forgotPasswordRouter = require('./controllers/forgotPassword')
// ---------------

const hoursRouter = require('./controllers/hours')


const logger = require('./utils/logger')
const mongoose = require('mongoose')

const sanitizeMongoUri = (uri) => {
    const parsedUri = new URL(uri)
    // Replace userinfo (username:password) with '***'
    if (parsedUri.username || parsedUri.password) {
        parsedUri.username = '***'
        parsedUri.password = '***'
    }
    return parsedUri.toString()
}

const sanitizedUri = sanitizeMongoUri(config.MONGODB_URI)
logger.info('Connecting to', sanitizedUri)

mongoose.set('strictQuery', true)

mongoose
    .connect(config.MONGODB_URI)
    .then(() => {
        logger.info('connected to MongoDB')
    })
    .catch((error) => {
        logger.error('error connecting to MongoDB', error.message)
    })

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use((req, res, next) => {
    if (req.path === '/favicon.ico') {
        return res.status(204).end() // No Content status
    }
    next()
})
app.use(middleware.requestLogger)


app.use('/api/login', loginRouter)  // declare this first to avoid token problems
app.use('/api/createUser', createUsersRouter)    // declare this first to avoid token problems
app.use('/api/forgotPassword', forgotPasswordRouter)
app.use('/api/sendEmail', emailRouter)

app.use(middleware.tokenExtractor)
app.use(middleware.userExtractor)

app.use('/api/hours', hoursRouter)
app.use('/api/users', usersRouter)


app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
