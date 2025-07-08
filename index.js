require('dotenv').config();
const express = require('express');
const Person = require('./models/person')

const app = express()

app.use(express.static('dist'));
app.use(express.json())

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(requestLogger)


let persons = []

app.get('/api/persons', (req, res) => {
    Person.find({}).then(people => {
        res.json(people);
    })
})

app.get('/info', (req, res) => {
    const message = `Phonebook has info for ${persons.length} people`;
    res.send(`${message} <br> ${new Date()}`);
})

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id)
        .then(person => res.json(person))
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndDelete(req.params.id)
        .then(result => { 
            return res.status(204).end();
        })
        .catch(error => next(error));
})

app.post('/api/persons', (req, res) => {
    const person = req.body

    if (!person.name){
        return res.status(400).json({
            error: 'name missing'
        })
    } else if (!person.number){
        return res.status(400).json({
            error: 'number missing'
        })
    }
 
    Person.findOne({ name: person.name }).then(existingPerson => {
        if (existingPerson) {
            return res.status(400).json({
                error: "person is already in phonebook",
            });
        }
        const newPerson = new Person({
            name: person.name,
            number: person.number
        });

        newPerson.save().then(savedPerson => {
            res.json(savedPerson);
        })
    })
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body
  
  Person.findById(request.params.id)
    .then(person => {
      if (!person) {
        return response.status(404).end();
      }

      person.name = name;
      person.number = number;

      return person.save().then(updatedPerson => response.json(updatedPerson))
    })
    .catch(error => next(error));
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler)

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})