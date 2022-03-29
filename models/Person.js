const mongoose = require('mongoose')
const url = process.env.MONGODB_URI
let uniqueValidator = require('mongoose-unique-validator')

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
mongoose.set('useCreateIndex', true)

module.exports = mongoose.model('Person', personSchema)