const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
  const emptyList = []

  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0,
    },
  ]

  const listWithManyBlogs = [
    {
      title: 'Blog 1',
      likes: 5,
    },
    {
      title: 'Blog 2',
      likes: 10,
    },
    {
      title: 'Blog 3',
      likes: 7,
    },
  ]

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })

  test('of empty list is zero', () => {
    const result = listHelper.totalLikes(emptyList)
    assert.strictEqual(result, 0)
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(listWithManyBlogs)
    assert.strictEqual(result, 22)
  })
})

describe('favorite blog', () => {
  const blogs = [
    {
      title: 'Blog 1',
      author: 'Author 1',
      likes: 5,
    },
    {
      title: 'Blog 2',
      author: 'Author 2',
      likes: 12,
    },
    {
      title: 'Blog 3',
      author: 'Author 3',
      likes: 7,
    },
  ]

  test('returns the blog with most likes', () => {
    const result = listHelper.favoriteBlog(blogs)

    assert.deepStrictEqual(result, {
      title: 'Blog 2',
      author: 'Author 2',
      likes: 12,
    })
  })
})

describe('most blogs', () => {
  const blogs = [
    {
      title: 'Blog 1',
      author: 'Robert C. Martin',
      likes: 7,
    },
    {
      title: 'Blog 2',
      author: 'Robert C. Martin',
      likes: 5,
    },
    {
      title: 'Blog 3',
      author: 'Edsger W. Dijkstra',
      likes: 12,
    },
    {
      title: 'Blog 4',
      author: 'Robert C. Martin',
      likes: 10,
    },
  ]

  test('returns author with most blogs', () => {
    const result = listHelper.mostBlogs(blogs)

    assert.deepStrictEqual(result, {
      author: 'Robert C. Martin',
      blogs: 3,
    })
  })
})
describe('most likes', () => {
  const blogs = [
    {
      title: 'Blog 1',
      author: 'Edsger W. Dijkstra',
      likes: 7,
    },
    {
      title: 'Blog 2',
      author: 'Robert C. Martin',
      likes: 5,
    },
    {
      title: 'Blog 3',
      author: 'Edsger W. Dijkstra',
      likes: 10,
    },
    {
      title: 'Blog 4',
      author: 'Robert C. Martin',
      likes: 1,
    },
  ]

  test('returns author with most likes', () => {
    const result = listHelper.mostLikes(blogs)

    assert.deepStrictEqual(result, {
      author: 'Edsger W. Dijkstra',
      likes: 17,
    })
  })
})