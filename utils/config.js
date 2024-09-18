require('dotenv').config()

const PORT = process.env.PORT
const MONGODB_URI = process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development' ? process.env.TEST_MONGODB_URI : process.env.MONGODB_URI

const EMAIL_USER = process.env.EMAIL_USER
const EMAIL_PASS = process.env.EMAIL_PASS

const FRONTEND_URL = process.env.FRONTEND_URL

module.exports = {
    MONGODB_URI,
    PORT,
    EMAIL_USER,
    EMAIL_PASS,
    FRONTEND_URL
}