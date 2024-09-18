const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: String,
    userEmail: String,
    isActive: { type: Boolean, default: true },
    passwordHash: String,
    date: Date,
    hours: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hour'
    }],
})



userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.passwordHash
    }
})

const User = mongoose.model('User', userSchema)

module.exports = User