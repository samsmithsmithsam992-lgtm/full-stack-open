const middleware = require('../utils/middleware')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', {
      username: 1,
      name: 1,
    })

  response.json(blogs)
})

blogsRouter.post(
  '/',
  middleware.userExtractor,
  async (request, response) => {
  try {
    if (!request.token) {
      return response.status(401).json({
        error: 'token missing',
      })
    }

   const user = request.user

    const blog = new Blog({
      ...request.body,
      likes: request.body.likes || 0,
      user: user._id,
    })

    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
} catch (error) {
  console.log('POST ERROR:', error)

  response.status(400).json({
    error: error.message,
  })
}
})

blogsRouter.delete(
  '/:id',
  middleware.userExtractor,
  async (request, response) => {
    const blog = await Blog.findById(request.params.id)

    if (!blog) {
      return response.status(404).end()
    }

    if (blog.user.toString() !== request.user.id.toString()) {
      return response.status(401).json({
        error: 'only creator can delete a blog',
      })
    }

    await Blog.findByIdAndDelete(request.params.id)

    response.status(204).end()
  }
)

blogsRouter.put('/:id', async (request, response) => {
  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    request.body,
    { new: true }
  )

  response.json(updatedBlog)
})

module.exports = blogsRouter