require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const Person = require('./models/Person')


app.use(express.static('build'))
app.use(express.json())
app.use(cors())
morgan.token('custom', (req) => {
  return 'POST' === req.method ? JSON.stringify(req.body) : ' '
})
app.use(morgan(
  ':method :url :status :res[content-length] - :response-time ms :custom'
))

// let persons = [
//     { 
//       "id": 1,
//       "name": "Arto Hellas", 
//       "number": "040-123456"
//     },
//     { 
//       "id": 2,
//       "name": "Ada Lovelace", 
//       "number": "39-44-5323523"
//     },
//     { 
//       "id": 3,
//       "name": "Dan Abramov", 
//       "number": "12-43-234345"
//     },
//     { 
//       "id": 4,
//       "name": "Mary Poppendieck", 
//       "number": "39-23-6423122"
//     }
// ]

//get json data of phonebook entries (3.1)
app.get('/api/persons',(req,res) => {
	Person
		.find({})
		.then(persons => {
			res.json(persons)
		})
})

//get an info page(3.2)
app.get('/info', async (req,res) => {
	let date = new Date()
	let persons = await Person.find({})
	res.send(`Phonebook has info for ${persons.length} people <br><br> ${date}`)
})

//get a single person
app.get('/api/persons/:id', (req,res,next) => {
	Person
		.findById(req.params.id)
		.then(person => {
			if(person){
				res.json(person)
			}
			else{
				res.status(404).end()
			}
		})
		.catch(error => next(error))
})

//delete a person
app.delete('/api/persons/:id', (req,res,next) => {
	Person
		.findByIdAndRemove(req.params.id)
		.then(() => {
			res.status(204).end()
		})
		.catch(error => next(error))
})

//generate a random id for new persons
const generateId = () => {
  const maxId = persons.length > 0
  ? Math.max(...persons.map(n => n.id))
  : 0
  return maxId + 1  
}

//add a person to the server
app.post('/api/persons',(req,res,next) => {
	const body = req.body
	if(!body.name || !body.number){
		res.status(400).json({
			error: 'Name or Number Missing'
		})
	}
	else
	{
		let person = new Person({
			name : body.name,
			number: body.number,
		})

		person
			.save()
			.then(savedPerson => {
				return savedPerson.toJSON()
			})
			.then(savedandFormattedPerson => res.json(savedandFormattedPerson))
			.catch(error => next(error))
	}
})

//update the number of an existing person
app.put('/api/persons/:id',(req,res,next) => {
	Person
		.findOneAndUpdate({ _id:req.params.id },req.body,{
			new:true,
			runValidators:true
		})
		.then((result) => {
			res.json(result)
		})
		.catch((error) => next(error))
})


const unknownEndpoint = (req,res) => {
	res.status(404).send({ error: 'Unknown Endpoint' })
}
//handler of requests with unknown endpoint
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
	console.error(error.message)

	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'Malformatted ID' })
	}
	else if (error.name === 'ValidationError'){
		return response.status(400).json({ error: error.message })
	}
	next(error)
}
//last loaded middleware handles requests that lead to errors
app.use(errorHandler)

const PORT = process.env.PORT 
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})