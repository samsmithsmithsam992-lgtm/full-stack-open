import { useState } from 'react'

const Blog = ({ blog, updateBlog, removeBlog, user }) => {
  console.log(blog)
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const hideWhenVisible = {
    display: visible ? 'none' : ''
  }

  const showWhenVisible = {
    display: visible ? '' : 'none'
  }
const handleLike = () => {
  const updatedBlog = {
    ...blog,
    likes: blog.likes + 1,
    user: blog.user?.id || blog.user
  }

  updateBlog(updatedBlog)
}
const handleRemove = () => {
  if (window.confirm(`Remove blog ${blog.title}?`)) {
    removeBlog(blog.id)
  }
}
  return (
    <div className="blog" style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={() => setVisible(true)} style={hideWhenVisible}>
          view
        </button>

        <button onClick={() => setVisible(false)} style={showWhenVisible}>
          hide
        </button>
      </div>

      <div style={showWhenVisible}>
        <div>{blog.url}</div>

        <div>
          likes {blog.likes}
          <button onClick={handleLike}>like</button>
        </div>

        <div>{blog.author}</div>

{blog.user && user && blog.user.username === user.username && (
  <button onClick={handleRemove}>
    remove
  </button>
)}
      </div>
    </div>
  )
}

export default Blog