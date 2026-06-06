import { useState, useEffect } from 'react'
import personService from './services/persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [filter, setFilter] = useState('')
  const [newNumber, setNewNumber] = useState('')

  useEffect(() => {
    personService
      .getAll()
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()

    const exists = persons.some(
      person => person.name === newName
    )

    if (exists) {
  const person = persons.find(p => p.name === newName)

  const confirmUpdate = window.confirm(
    `${newName} is already added. Replace the old number with a new one?`
  )

  if (!confirmUpdate) return

  const updatedPerson = {
    ...person,
    number: newNumber
  }

  personService
    .update(person.id, updatedPerson)
    .then(response => {
      setPersons(
        persons.map(p =>
          p.id !== person.id ? p : response.data
        )
      )
      setNewName('')
      setNewNumber('')
    })

  return
}

    const personObject = {
      name: newName,
      number: newNumber
    }

    personService
      .create(personObject)
      .then(response => {
        setPersons(persons.concat(response.data))
        setNewName('')
        setNewNumber('')
      })
  }

  const deletePerson = (id) => {
    const person = persons.find(p => p.id === id)

    if (!person) return

    const confirmDelete = window.confirm(
      `Delete ${person.name}?`
    )

    if (confirmDelete) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id))
        })
    }
  }

  const personsToShow = persons.filter(person =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>

      <Filter
        filter={filter}
        handleFilterChange={(event) => setFilter(event.target.value)}
      />

      <h3>Add a new</h3>

      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={(event) => setNewName(event.target.value)}
        newNumber={newNumber}
        handleNumberChange={(event) => setNewNumber(event.target.value)}
      />

      <h3>Numbers</h3>

      <Persons
        persons={personsToShow}
        handleDelete={deletePerson}
      />
    </div>
  )
}

export default App