const mongoose = require('mongoose')

if(process.argv.length < 3){
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
}

const password = process.argv[2]

const url= `mongodb+srv://bonzo990:<password>@cluster0.b4oud.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema= new mongoose.Schema({
    name: String, 
    number: Number
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
    name: 'John Doe',
    number: 1231-125123
})

person.save().then(result => {
    console.log('person added')
    mongoose.connection.close()
})