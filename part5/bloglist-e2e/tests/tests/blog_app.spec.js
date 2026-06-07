const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')

    await request.post('http://localhost:3003/api/users', {
      data: {
        username: 'root',
        name: 'Superuser',
        password: 'secret'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('Log in to application')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByRole('textbox').first().fill('root')
      await page.getByRole('textbox').nth(1).fill('secret')

      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('Superuser logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByRole('textbox').first().fill('root')
      await page.getByRole('textbox').nth(1).fill('wrongpassword')

      await page.getByRole('button', { name: 'login' }).click()

      await expect(
        page.getByText('wrong username or password')
      ).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByRole('textbox').first().fill('root')
      await page.getByRole('textbox').nth(1).fill('secret')

      await page.getByRole('button', { name: 'login' }).click()
    })
    test('blogs are ordered according to likes', async ({ page }) => {
  await page.getByRole('button', { name: 'create new blog' }).click()

  let inputs = page.getByRole('textbox')

  await inputs.nth(0).fill('Blog One')
  await inputs.nth(1).fill('Sam')
  await inputs.nth(2).fill('https://one.com')

  await page.getByRole('button', { name: 'create' }).click()

  await page.getByRole('button', { name: 'view' }).click()

  await page.getByRole('button', { name: 'like' }).click()

  await page.getByRole('button', { name: 'like' }).click()

  await page.waitForTimeout(1000)

  const blogs = await page.locator('.blog').allTextContents()

  expect(blogs[0]).toContain('Blog One')
})
    test('only creator sees delete button', async ({ page, request }) => {
  // create blog as root
  await page.getByRole('button', { name: 'create new' }).click()

  const inputs = page.getByRole('textbox')

  await inputs.nth(0).fill('Creator Blog')
  await inputs.nth(1).fill('Sam')
  await inputs.nth(2).fill('https://creator.com')

  await page.getByRole('button', { name: 'create' }).click()

  // create second user
  await request.post('http://localhost:3003/api/users', {
    data: {
      username: 'other',
      name: 'Other User',
      password: 'secret'
    }
  })

  // logout
  await page.getByRole('button', { name: 'logout' }).click()

  // login as second user
  await page.getByRole('textbox').first().fill('other')
  await page.getByRole('textbox').nth(1).fill('secret')

  await page.getByRole('button', { name: 'login' }).click()

  await page.getByRole('button', { name: 'view' }).click()

  await expect(
    page.getByRole('button', { name: 'remove' })
  ).not.toBeVisible()
})

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'create new' }).click()

      const inputs = page.getByRole('textbox')

      await inputs.nth(0).fill('Playwright Blog')
      await inputs.nth(1).fill('Sam')
      await inputs.nth(2).fill('https://playwright.com')

      await page.getByRole('button', { name: 'create' }).click()

      await expect(page.getByText('Playwright Blog')).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await page.getByRole('button', { name: 'create new' }).click()

      const inputs = page.getByRole('textbox')

      await inputs.nth(0).fill('Like Blog')
      await inputs.nth(1).fill('Sam')
      await inputs.nth(2).fill('https://like.com')

      await page.getByRole('button', { name: 'create' }).click()

      await page.getByRole('button', { name: 'view' }).click()

      await page.getByRole('button', { name: 'like' }).click()

      await page.getByRole('button', { name: 'like' }).click()

await expect(page.getByText(/likes/i)).toBeVisible()
    })

    test('a user can delete a blog', async ({ page }) => {
      page.on('dialog', dialog => dialog.accept())

      await page.getByRole('button', { name: 'create new' }).click()

      const inputs = page.getByRole('textbox')

      await inputs.nth(0).fill('Delete Blog')
      await inputs.nth(1).fill('Sam')
      await inputs.nth(2).fill('https://delete.com')

      await page.getByRole('button', { name: 'create' }).click()

      await page.getByRole('button', { name: 'view' }).click()

      await page.getByRole('button', { name: 'remove' }).click()

      await expect(page.getByText('Delete Blog')).not.toBeVisible()
    })
  })
})