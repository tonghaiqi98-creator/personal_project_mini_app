module.exports = ({ test, assert, helpers }) => {
  const { createWxMock, requireFresh } = helpers

  function setupOrderStore() {
    global.wx = createWxMock()
    return requireFresh('utils/mockOrderStore.js')
  }

  function makeOrder(overrides = {}) {
    const items = [
      {
        id: 'coffee-01',
        key: 'coffee-01_hot_standard',
        name: '美式咖啡',
        price: 20,
        quantity: 2,
        temperature: '热',
        taste: '标准',
        subtotal: 40
      },
      {
        id: 'dessert-01',
        key: 'dessert-01_normal_standard',
        name: '巴斯克芝士蛋糕',
        price: 26,
        quantity: 1,
        temperature: '常温',
        taste: '标准',
        subtotal: 26
      }
    ]
    const total = items.reduce((sum, item) => sum + item.subtotal, 0)

    return {
      orderNo: `TEST${Date.now()}`,
      storeId: 'store_001',
      store: {
        name: '巷口咖啡',
        tableNo: 'A03 桌'
      },
      tableNo: 'A03 桌',
      userId: 'test_user',
      items,
      cartCount: 3,
      totalAmount: total,
      cartTotal: total,
      remark: '少糖，餐具一份',
      status: 'paid',
      payStatus: 'paid',
      paidAt: Date.now(),
      createdAt: Date.now(),
      ...overrides
    }
  }

  test('order can be created from cart items', () => {
    const store = setupOrderStore()
    const order = makeOrder()

    store.saveOrder(order)
    const savedOrder = store.getOrder(order.orderNo)

    assert.strictEqual(savedOrder.orderNo, order.orderNo)
    assert.strictEqual(savedOrder.items.length, 2)
    assert.strictEqual(savedOrder.cartCount, 3)
  })

  test('order amount, table number and remark are preserved', () => {
    const store = setupOrderStore()
    const order = makeOrder()

    store.saveOrder(order)
    const savedOrder = store.getOrder(order.orderNo)

    assert.strictEqual(savedOrder.totalAmount, 66)
    assert.strictEqual(savedOrder.cartTotal, 66)
    assert.strictEqual(savedOrder.tableNo, 'A03 桌')
    assert.strictEqual(savedOrder.remark, '少糖，餐具一份')
  })

  test('mock paid order status is paid', () => {
    const store = setupOrderStore()
    const order = makeOrder()

    store.saveOrder(order)

    assert.strictEqual(store.getOrder(order.orderNo).status, 'paid')
    assert.strictEqual(store.getOrder(order.orderNo).payStatus, 'paid')
  })

  test('paid order can be accepted', () => {
    const store = setupOrderStore()
    const order = makeOrder()

    store.saveOrder(order)
    const updatedOrder = store.updateOrderStatus(order.orderNo, 'accepted')

    assert.strictEqual(updatedOrder.status, 'accepted')
    assert.strictEqual(typeof updatedOrder.acceptedAt, 'number')
  })

  test('accepted order can be completed', () => {
    const store = setupOrderStore()
    const order = makeOrder()

    store.saveOrder(order)
    store.updateOrderStatus(order.orderNo, 'accepted')
    const updatedOrder = store.updateOrderStatus(order.orderNo, 'completed')

    assert.strictEqual(updatedOrder.status, 'completed')
    assert.strictEqual(typeof updatedOrder.completedAt, 'number')
  })

  test('illegal order status transition is rejected', () => {
    const store = setupOrderStore()
    const order = makeOrder()

    store.saveOrder(order)
    const skippedOrder = store.updateOrderStatus(order.orderNo, 'completed')

    assert.strictEqual(skippedOrder, null)
    assert.strictEqual(store.getOrder(order.orderNo).status, 'paid')

    store.updateOrderStatus(order.orderNo, 'accepted')
    store.updateOrderStatus(order.orderNo, 'completed')
    const revertedOrder = store.updateOrderStatus(order.orderNo, 'accepted')

    assert.strictEqual(revertedOrder, null)
    assert.strictEqual(store.getOrder(order.orderNo).status, 'completed')
  })
}
