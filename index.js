const express = require('express');
const morgan = require('morgan');

const app = express()

morgan.token('body', (req) => {
    return JSON.stringify(req.body);
})

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(express.json())
//app.use(requestLogger)
app.use(morgan(':method :url :status :res[content-length] - :response-time ms - body: :body'));
app.use(express.static('dist'));

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (req, res) => {
    res.json(persons);
})

app.get('/info', (req, res) => {
    const message = `Phonebook has info for ${persons.length} people`;
    res.send(`${message} <br> ${new Date()}`);
})

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    const person = persons.find(p => p.id === id);

    if (!person){
        res.status(404).end();
    } else {
        res.json(person);
    }
    
    
})

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    persons = persons.filter(person => person.id !== id)
    res.status(204).end();
})

app.post('/api/persons', (req, res) => {
    const person = req.body
    if (persons.find(p => p.name === person.name)){
        return res.status(400).json({
            error: "person is already in phonebook"
        })
    }
    if (!person.name){
        return res.status(400).json({
            error: 'name missing'
        })
    } else if (!person.number){
        return res.status(400).json({
            error: 'number missing'
        })
    }
    person.id = String(Math.floor(Math.random() * 10000000000));
    persons = persons.concat(person);
    res.json(person);
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})