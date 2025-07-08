const mongoose = require('mongoose');
require('dotenv').config();

// if (process.argv.length < 3){
//     console.log('give password as argument');
//     process.exit(1);
// } 

// const password = process.argv[2];

const url = process.env.MONGODB_URI

mongoose.set('strictQuery', false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Person = mongoose.model('Person', personSchema);
module.exports = Person;

// if (process.argv.length < 4) {
//     console.log("phonebook:");
//     Person.find({}).then(result => {
//         result.forEach(note => console.log(note));
//         mongoose.connection.close()
//     })
// } else if (process.argv.length === 5) {
//     const newName = process.argv[3];
//     const newNumber = process.argv[4];

//     const newPerson = Person({
//         name: newName,
//         number: newNumber,
//     })

//     newPerson.save().then(result => {
//         console.log(`added ${result.name} number ${result.number} to phonebook`);
//         mongoose.connection.close();
//     })
// } else {
//     console.log('invalid number of arguments');
//     mongoose.connection.close();
// }

