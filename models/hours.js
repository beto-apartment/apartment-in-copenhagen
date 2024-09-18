const mongoose = require('mongoose')

// const hourSchema = new mongoose.Schema({
//     grid: [{
//         row: [{
//             startWork: {
//                 type: Number,
//                 required: true
//             },
//             endWork: {
//                 type: Number,
//                 required: true
//             },
//             totalNormal: Number,
//             totalSpecial: Number
//         }],
//     }],
//     user: {
//         type:mongoose.Schema.Types.ObjectId,
//         ref: 'User'
//     }
// })

const hourSchema = new mongoose.Schema({
    month: String,
    days: [{
        dayNumber: {
            type: String,
            // required: true
        },
        holiday: Boolean,
        jobDescription: String,
        startWorkA: {
            type: String,
            // required: true
        },
        endWorkA: {
            type: String,
            // required: true
        },
        startWorkB: {
            type: String,
            // required: true
        },
        endWorkB: {
            type: String,
            // required: true
        },
        totalHours: {}
    }],

    monthHours: {},

    date: Date,
    
    user: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

hourSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Hour', hourSchema)