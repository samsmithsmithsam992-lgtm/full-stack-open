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
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })

    setTimeout(() => {
      setNotification(null)
    }, 3000)
  }

  const addPerson = (event) => {
    event.preventDefault()

    const exists = persons.some(
      person => person.name === newName
    )

    if (exists) {
      const person = persons.find(p => p.name === newName)

      const confirmUpdate = window.confirm(
        `${newName} is already added. Replace the old number?`
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
          showNotification(`Updated ${newName}`, 'success')
        })
        .catch(error => {
          showNotification(
            `Information of ${newName} has already been removed from server`,
            'error'
          )

          setPersons(persons.filter(p => p.id !== person.id))
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
    showNotification(`Added ${newName}`, 'success')
  })
  .catch(error => {
    showNotification(error.response.data.error, 'error')
 })
  }

  const deletePerson = (id) => {
    const person = persons.find(p => p.id === id)

    if (!person) return

    if (window.confirm(`Delete ${person.name}?`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id))
          showNotification(`Deleted ${person.name}`, 'success')
        })
        .catch(error => {
          showNotification(
            `Information of ${person.name} was already removed from server`,
            'error'
          )

          setPersons(persons.filter(p => p.id !== id))
        })
    }
  }

  const personsToShow = persons.filter(person =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div>
      {notification && (
        <div className={notification.type}>
          {notification.message}
        </div>
      )}

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