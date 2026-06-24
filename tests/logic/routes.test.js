const fs = require('fs')
const path = require('path')

module.exports = ({ test, assert, helpers }) => {
  const { projectRoot, readJson } = helpers
  const appConfig = readJson('app.json')
  const pageExtensions = ['.js', '.wxml', '.wxss', '.json']
  const oldPaths = [
    'pages/index',
    'pages/menu',
    'pages/cart',
    'pages/order-confirm',
    'pages/order-detail',
    'pages/merchant-home',
    'pages/merchant-orders',
    'pages/merchant-dishes',
    'pages/merchant-stats'
  ]

  test('app.json registers at least one page', () => {
    assert.ok(Array.isArray(appConfig.pages))
    assert.ok(appConfig.pages.length > 0)
  })

  test('registered page paths exist', () => {
    appConfig.pages.forEach((pagePath) => {
      const pageDir = path.join(projectRoot, path.dirname(pagePath))

      assert.ok(fs.existsSync(pageDir), `page directory not found: ${pagePath}`)
    })
  })

  test('registered pages contain js wxml wxss and json files', () => {
    appConfig.pages.forEach((pagePath) => {
      pageExtensions.forEach((extension) => {
        const filePath = path.join(projectRoot, `${pagePath}${extension}`)

        assert.ok(fs.existsSync(filePath), `page file not found: ${pagePath}${extension}`)
      })
    })
  })

  test('old page paths do not exist', () => {
    oldPaths.forEach((oldPath) => {
      assert.ok(!fs.existsSync(path.join(projectRoot, oldPath)), `old path should not exist: ${oldPath}`)
    })
  })

  test('customer and merchant page paths follow current convention', () => {
    appConfig.pages.forEach((pagePath) => {
      assert.ok(
        pagePath.startsWith('pages/customer/') || pagePath.startsWith('pages/merchant/'),
        `page path does not follow convention: ${pagePath}`
      )
    })
    assert.strictEqual(appConfig.pages[0], 'pages/customer/home/home')
  })
}
