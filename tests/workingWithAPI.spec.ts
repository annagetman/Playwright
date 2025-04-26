import { test, expect, request } from '@playwright/test'
import tags from '../test-data/tags.json'

test.beforeEach( async ({page}) => {
    await page.route('*/**/api/tags', async route => {
        await route.fulfill({
            body: JSON.stringify(tags)
        })
    })

    await page.goto('https://conduit.bondaracademy.com/')
    // await page.getByText('Sign in').click()
    // await page.getByRole('textbox', {name: "Email"}).fill('hanna77@gmail.com')
    // await page.getByRole("textbox", {name: 'Password'}).fill('12345')
    // await page.getByRole('button').click()
})

test('has title', async ({page}) => {
    await page.route('*/**/api/articles*', async route => {
        const response = await route.fetch()

        const responseBody = await response.json()
        responseBody.articles[0].title = "This is a MOCK test title"
        responseBody.articles[0].description = "This is a MOCK description"

        await route.fulfill({
            body: JSON.stringify(responseBody)
     })
 })

await page.getByText('Global Feed').click()
    await expect(page.locator('.navbar-brand')).toHaveText('conduit');
    await expect(page.locator('app-article-list h1').first()).toContainText('This is a MOCK test title')
    await expect(page.locator('app-article-list p').first()).toContainText('This is a MOCK description')
});

test('delete article', async({page, request}) => {
    // const response = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
    //     data: {
    //         "user":{"email":"hanna77@gmail.com","password":"12345"}
    //     }
    // })
    // const responseBody = await response.json()
    // const accessToken = responseBody.user.token
   // console.log(responseBody.user.token)
   const articleResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles/', {
    data:{
        "article":{"title":"Test7","description":"Test8","body":"Test79","tagList":[]}
    }
    // headers:{
    //     Authoriation: `Token ${accessToken}`
    // }
   })
  // expect(articleResponse.status()).toEqual(201)
   
   await page.getByText('Global Feed').click()
   await page.getByText('Test7').click()
   await page.getByRole('button', {name: "Delete Article"}).first().click()
   await page.getByText('Global Feed').click()

   await expect(page.locator('app-article-list h1').first()).not.toContainText('Test7')
})

test('cteate article', async({page, request}) => {
    await page.getByText('New Article').click()
    await page.getByRole('textbox', {name:'Article title'}).fill('Playwright is awesome')
    await page.getByRole('textbox', {name: 'What\'s this article about?'}).fill('About the Playwright')
    await page.getByRole('textbox', {name:'Write your article (in markdown)'}).fill('We like to use playwright for automation')
    await page.getByRole('button', {name:'Publish Article'}).click()
    const articleResponse = await page.waitForResponse('https://conduit-api.bondaracademy.com/api/articles/')
    const articleresponseBody = await articleResponse.json()
    const slugId = articleresponseBody.article.slugId


    await expect(page.locator('.article-page h1')).toContainText('Playwright is awesome')
    await page.getByText('Home').click()
    await page.getByText('Global Feed').click()
    
    await expect(page.locator('app-article-list h1').first()).toContainText('Playwright is awesome')

    const response = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
        data: {
            "user":{"email":"hanna77@gmail.com","password":"12345"}
        }
    })

const responseBody = await response.json()
const accessToken = responseBody.user.token

const deleteArticleResponse = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${slugId}`)
  //expect(deleteArticleResponse.status()).toEqual(204)
})
