const logger = require('./logger')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const requestLogger = (request, response, next) => {
    const { method, path, body, headers } = request

    // Create a sanitized copy of the body
    const sanitizedBody = { ...body }
    if (sanitizedBody.password) {
        sanitizedBody.password = '***' // Mask password
    } else if(sanitizedBody.newPassword) {
        sanitizedBody.newPassword = '***' // Mask password
    }

    // Log sanitized information
    logger.info('Method', method)
    logger.info('Path', path)
    logger.info('Body', sanitizedBody)
    // logger.info('Headers', headers) // Optionally log headers, avoid sensitive information
    logger.info('---')
    next()
}

const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        return authorization.substring(7)
    }
    return null
}

const decodedToken = request => {
    return jwt.verify(request.token, process.env.SECRET)
}

const tokenExtractor = (request, response, next) => {
    request.token = getTokenFrom(request)
    logger.info('token', request.token)
    next()
}

const userExtractor = async (request, response, next) => {
    request.user = await User.findById(decodedToken(request).id)
    logger.info('user', request.user.toString())
    next()
}

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
    logger.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }
    next(error)
}

module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler,
    tokenExtractor,
    userExtractor
}