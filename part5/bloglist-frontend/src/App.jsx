import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs => {
      setBlogs(blogs)
    })
  }, [])

  useEffect(() => {
    const loggedUserJSON =
      window.localStorage.getItem('loggedBlogappUser')

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username,
        password
      })

      setUser(user)
      blogService.setToken(user.token)

      window.localStorage.setItem(
        'loggedBlogappUser',
        JSON.stringify(user)
      )

      setUsername('')
      setPassword('')

      setMessage('login successful')

      setTimeout(() => {
        setMessage(null)
      }, 5000)
    } catch (exception) {
      setMessage('wrong username or password')

      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }
const handleLogout = () => {
  window.localStorage.removeItem('loggedBlogappUser')
  setUser(null)
}
 const addBlog = async (blogObject) => {
  const returnedBlog = await blogService.create(blogObject)

  setBlogs(blogs.concat(returnedBlog))

  setMessage('a new blog added')

  setTimeout(() => {
    setMessage(null)
  }, 5000)
}

const updateBlog = async (updatedBlog) => {
  const returnedBlog = await blogService.update(
    updatedBlog.id,
    updatedBlog
  )

  setBlogs(
    blogs.map(blog =>
      blog.id === returnedBlog.id ? returnedBlog : blog
    )
  )
}
const removeBlog = async (id) => {
  await blogService.remove(id)

  setBlogs(
    blogs.filter(blog => blog.id !== id)
  )
}
  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>

        {message && <div>{message}</div>}

        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>

          <div>
            password
            <input
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>

          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>

      {message && <div>{message}</div>}

      <p>
        {user.name} logged in
        <button onClick={handleLogout}>logout</button>
      </p>

      <Togglable>
        <h3>create new</h3>
        <BlogForm createBlog={addBlog} />
      </Togglable>

   {[...blogs]
  .sort((a, b) => b.likes - a.likes)
  .map(blog => (
<Blog
  key={blog.id}
  blog={blog}
  updateBlog={updateBlog}
  removeBlog={removeBlog}
  user={user}
/>
  ))}
    </div>
  )
}

export default App