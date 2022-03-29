require('dotenv').config()
const mongoose = require('mongoose')
// eslint-disable-next-line no-undef
const url = process.env.MONGODB_URI
let uniqueValidator = require('mongoose-unique-validator')

// mongoose.set('useFindAndModify', false)
// mongoose.set('useCreateIndex', true)

mongoose
    .connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('connected to MongoDB')
    })

    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: [3, 'Name must be at least 3 characters long'],
        required: true,
        unique: true
    },
    number: {
        type: String,
        minlength: [8, 'Number must have at least 8 characters'],
        required: true,
    },
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    },
})

personSchema.plugin(uniqueValidator)

module.exports = mongoose.model('Person', personSchema)