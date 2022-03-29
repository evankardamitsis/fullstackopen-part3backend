const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')

app.use(express.static('build'))
app.use(express.json())
app.use(cors())
morgan.token('custom', (req) => {
  return 'POST' === req.method ? JSON.stringify(req.body) : ' '
})
app.use(morgan(
  ':method :url :status :res[content-length] - :response-time ms :custom'
))

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

//get json data of phonebook entries (3.1)
app.get('/api/persons', (request, response) => {
    response.json(persons)
} )

//get an info page(3.2)
app.get('/info', (request,response) => {
    const entries = persons.length
    const currentDate = new Date().toLocaleString()
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    response.send(`
    <p>Phonebook has info for ${entries} people</p>
    <p>${currentDate} (${timezone})</p>
    `)
    console.log(Date.now())
    
})

//get a single person
app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  
  if(person){
    response.json(person)
  } else {
    response.status(404).end()
  }
})

//delete a person
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

//generate a random id for new persons
const generateId = () => {
  const maxId = persons.length > 0
  ? Math.max(...persons.map(n => n.id))
  : 0
  return maxId + 1  
}

//add a person to the server
app.post('/api/persons', (request, response) => {
  const { name, number } = request.body

  if(!name || !number){
    return response.status(400).json({
      error: 'The name or number is missing'
    })
  }

  const nameExists = person.name.findOne({name:name})
  if(nameExists){
    return response.status(400).json({
      error: 'The person already exists'
    })
  }

  const person = {
    name,
    number,
    id: generateId()
  }

  persons = persons.concat(person)

  response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})