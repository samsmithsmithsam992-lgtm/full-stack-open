const { test, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const api = supertest(app)

let token

async function getToken() {
  await User.deleteMany({})

  await api.post('/api/users').send({
    username: 'root',
    name: 'Superuser',
    password: 'secret',
  })

  const loginResponse = await api
    .post('/api/login')
    .send({
      username: 'root',
      password: 'secret',
    })

  token = loginResponse.body.token
}

test('blogs are returned as json', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.ok(response.body.length >= 1)
})

test('blogs have id property', async () => {
  const response = await api.get('/api/blogs')

  assert.ok(response.body[0].id)
})

test('a valid blog can be added', async () => {
  await getToken()

  const newBlog = {
    title: 'Testing blog',
    author: 'Sam',
    url: 'https://test.com',
    likes: 5,
  }

  const blogsAtStart = await api.get('/api/blogs')
  const initialLength = blogsAtStart.body.length

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)

  const blogsAtEnd = await api.get('/api/blogs')

  assert.strictEqual(
    blogsAtEnd.body.length,
    initialLength + 1
  )
})

test('if likes is missing, it defaults to 0', async () => {
  await getToken()

  const newBlog = {
    title: 'No likes blog',
    author: 'Sam',
    url: 'https://nolikes.com',
  }

  const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)

  assert.strictEqual(response.body.likes, 0)
})

test('blog without url is not added', async () => {
  await getToken()

  const newBlog = {
    title: 'Missing URL',
    author: 'Sam',
    likes: 5,
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400)
})

test('blog without title is not added', async () => {
  await getToken()

  const newBlog = {
    author: 'Sam',
    url: 'https://test.com',
    likes: 5,
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400)
})
after(async () => {
  await mongoose.connection.close()
})