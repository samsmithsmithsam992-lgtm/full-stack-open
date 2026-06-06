const { test, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')

const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})

  await api.post('/api/users').send({
    username: 'root',
    name: 'Superuser',
    password: 'secret',
  })
})

test('creation succeeds with a fresh username', async () => {
  const usersAtStart = await User.find({})

  const newUser = {
    username: 'mluukkai',
    name: 'Matti Luukkainen',
    password: 'salainen',
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(201)

  const usersAtEnd = await User.find({})

  assert.strictEqual(
    usersAtEnd.length,
    usersAtStart.length + 1
  )
})

test('creation fails with short username', async () => {
  const newUser = {
    username: 'ab',
    name: 'Test User',
    password: 'secret',
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
})

test('creation fails with short password', async () => {
  const newUser = {
    username: 'validuser',
    name: 'Test User',
    password: 'ab',
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
})

after(async () => {
  await mongoose.connection.close()
})