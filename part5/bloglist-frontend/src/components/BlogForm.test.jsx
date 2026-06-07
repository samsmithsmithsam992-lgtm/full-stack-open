import { render, fireEvent } from '@testing-library/react'
import { test, expect, vi } from 'vitest'
import BlogForm from './BlogForm'

test('calls event handler with correct details when a new blog is created', () => {
  const createBlog = vi.fn()

  const { container } = render(
    <BlogForm createBlog={createBlog} />
  )

  const inputs = container.querySelectorAll('input')

  fireEvent.change(inputs[0], {
    target: { value: 'Testing blog' }
  })

  fireEvent.change(inputs[1], {
    target: { value: 'Sam' }
  })

  fireEvent.change(inputs[2], {
    target: { value: 'https://test.com' }
  })

  const form = container.querySelector('form')

  fireEvent.submit(form)

  expect(createBlog.mock.calls).toHaveLength(1)

  expect(createBlog.mock.calls[0][0]).toEqual({
    title: 'Testing blog',
    author: 'Sam',
    url: 'https://test.com'
  })
})