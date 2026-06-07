import { vi } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import { test, expect } from 'vitest'
import '@testing-library/jest-dom'
import Blog from './Blog'

test('renders title and author but not url or likes by default', () => {
  const blog = {
    title: 'Testing blog',
    author: 'Sam',
    url: 'https://test.com',
    likes: 5,
    user: {
      username: 'root'
    }
  }

  const { container } = render(
    <Blog
      blog={blog}
      updateBlog={() => {}}
      removeBlog={() => {}}
      user={{ username: 'root' }}
    />
  )

  expect(container).toHaveTextContent('Testing blog')
  expect(container).toHaveTextContent('Sam')

  const details = container.querySelectorAll('div')[2]

  expect(details).toHaveStyle('display: none')
})
test('shows url and likes when view button is clicked', () => {
  const blog = {
    title: 'Testing blog',
    author: 'Sam',
    url: 'https://test.com',
    likes: 5,
    user: {
      username: 'root'
    }
  }

  const { container } = render(
    <Blog
      blog={blog}
      updateBlog={() => {}}
      removeBlog={() => {}}
      user={{ username: 'root' }}
    />
  )

  const button = container.querySelector('button')

  fireEvent.click(button)

  expect(container).toHaveTextContent('https://test.com')
  expect(container).toHaveTextContent('likes 5')
})
test('if like button is clicked twice, event handler is called twice', () => {
  const blog = {
    title: 'Testing blog',
    author: 'Sam',
    url: 'https://test.com',
    likes: 5,
    user: {
      username: 'root'
    }
  }

  const mockHandler = vi.fn()

  const { container } = render(
    <Blog
      blog={blog}
      updateBlog={mockHandler}
      removeBlog={() => {}}
      user={{ username: 'root' }}
    />
  )

  const viewButton = container.querySelector('button')
  fireEvent.click(viewButton)

  const likeButton = container.querySelectorAll('button')[2]

  fireEvent.click(likeButton)
  fireEvent.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})