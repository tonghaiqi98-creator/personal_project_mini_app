module.exports = ({ test, assert, helpers }) => {
  const { createWxMock, loadPage } = helpers
  const { dishes } = require('../../utils/mockMenu')

  function setupMenuPage() {
    const wxMock = createWxMock()
    const page = loadPage('pages/customer/menu/menu.js', wxMock)
    page.setData({
      dishes,
      activeCategoryId: dishes[0].categoryId,
      cartItems: []
    })
    page.refreshCartSummary()
    page.refreshCurrentDishes()

    return { page, wxMock }
  }

  test('cart adds one dish', () => {
    const { page } = setupMenuPage()
    const dish = dishes[0]

    page.addCartItem({
      dish,
      temperature: dish.temperatureOptions[0],
      taste: dish.tasteOptions[0],
      quantity: 1
    })

    assert.strictEqual(page.data.cartItems.length, 1)
    assert.strictEqual(page.data.cartItems[0].id, dish.id)
    assert.strictEqual(page.data.cartCount, 1)
    assert.strictEqual(page.data.cartTotal, dish.price)
  })

  test('cart merges repeated same dish and spec', () => {
    const { page } = setupMenuPage()
    const dish = dishes[0]
    const payload = {
      dish,
      temperature: dish.temperatureOptions[0],
      taste: dish.tasteOptions[0],
      quantity: 1
    }

    page.addCartItem(payload)
    page.addCartItem(payload)

    assert.strictEqual(page.data.cartItems.length, 1)
    assert.strictEqual(page.data.cartItems[0].quantity, 2)
    assert.strictEqual(page.data.cartCount, 2)
    assert.strictEqual(page.data.cartTotal, Number((dish.price * 2).toFixed(2)))
  })

  test('cart quantity can increase and decrease', () => {
    const { page } = setupMenuPage()
    const dish = dishes[0]

    page.addCartItem({
      dish,
      temperature: dish.temperatureOptions[0],
      taste: dish.tasteOptions[0],
      quantity: 1
    })

    const key = page.data.cartItems[0].key
    page.changeCartItemQuantity(key, 1)
    assert.strictEqual(page.data.cartItems[0].quantity, 2)

    page.changeCartItemQuantity(key, -1)
    assert.strictEqual(page.data.cartItems[0].quantity, 1)
  })

  test('cart removes item when quantity reaches zero', () => {
    const { page } = setupMenuPage()
    const dish = dishes[0]

    page.addCartItem({
      dish,
      temperature: dish.temperatureOptions[0],
      taste: dish.tasteOptions[0],
      quantity: 1
    })

    page.changeCartItemQuantity(page.data.cartItems[0].key, -1)

    assert.strictEqual(page.data.cartItems.length, 0)
    assert.strictEqual(page.data.cartCount, 0)
    assert.strictEqual(page.data.cartTotal, 0)
  })

  test('cart clears all items', () => {
    const { page, wxMock } = setupMenuPage()

    page.addCartItem({
      dish: dishes[0],
      temperature: dishes[0].temperatureOptions[0],
      taste: dishes[0].tasteOptions[0],
      quantity: 2
    })
    page.handleClearCart()

    assert.deepStrictEqual(page.data.cartItems, [])
    assert.strictEqual(page.data.cartCount, 0)
    assert.strictEqual(page.data.cartTotal, 0)
    assert.deepStrictEqual(wxMock.getStorageSync('mockCartItems'), [])
  })

  test('cart preview item opens dish detail for spec editing', () => {
    const { page } = setupMenuPage()
    const dish = dishes[0]

    page.addCartItem({
      dish,
      temperature: dish.temperatureOptions[1],
      taste: dish.tasteOptions[1],
      quantity: 2
    })
    page.setData({
      showCartPreview: true
    })
    page.handleCartPreviewItemTap({
      currentTarget: {
        dataset: {
          key: page.data.cartItems[0].key
        }
      }
    })

    assert.strictEqual(page.data.showCartPreview, false)
    assert.strictEqual(page.data.showDishDetail, true)
    assert.strictEqual(page.data.isEditingCartItem, true)
    assert.strictEqual(page.data.selectedDish.id, dish.id)
    assert.strictEqual(page.data.selectedTemperature, dish.temperatureOptions[1])
    assert.strictEqual(page.data.selectedTaste, dish.tasteOptions[1])
    assert.strictEqual(page.data.detailQuantity, 2)
  })

  test('cart calculates total count and amount', () => {
    const { page } = setupMenuPage()

    page.addCartItem({
      dish: dishes[0],
      temperature: dishes[0].temperatureOptions[0],
      taste: dishes[0].tasteOptions[0],
      quantity: 2
    })
    page.addCartItem({
      dish: dishes[1],
      temperature: dishes[1].temperatureOptions[0],
      taste: dishes[1].tasteOptions[0],
      quantity: 3
    })

    const expectedTotal = Number((dishes[0].price * 2 + dishes[1].price * 3).toFixed(2))

    assert.strictEqual(page.data.cartCount, 5)
    assert.strictEqual(page.data.cartTotal, expectedTotal)
  })
}
