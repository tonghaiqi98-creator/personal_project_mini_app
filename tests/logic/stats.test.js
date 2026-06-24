module.exports = ({ test, assert, helpers }) => {
  const { createWxMock, requireFresh } = helpers

  function setupStats() {
    global.wx = createWxMock()
    const store = requireFresh('utils/mockOrderStore.js')
    const today = Date.now()
    const yesterday = today - 24 * 60 * 60 * 1000

    const orders = [
      {
        orderNo: 'STAT001',
        status: 'paid',
        paidAt: today,
        cartTotal: 52,
        items: [
          { name: '美式咖啡', quantity: 2, price: 20 },
          { name: '巴斯克芝士蛋糕', quantity: 1, price: 12 }
        ]
      },
      {
        orderNo: 'STAT002',
        status: 'accepted',
        paidAt: today,
        cartTotal: 30,
        items: [
          { name: '美式咖啡', quantity: 1, price: 20 },
          { name: '茉莉奶绿', quantity: 1, price: 10 }
        ]
      },
      {
        orderNo: 'STAT003',
        status: 'completed',
        paidAt: today,
        cartTotal: 50,
        items: [
          { name: '烟熏鸡肉三明治', quantity: 2, price: 25 }
        ]
      },
      {
        orderNo: 'STAT004',
        status: 'cancelled',
        paidAt: today,
        cartTotal: 99,
        items: [
          { name: '不应计入商品', quantity: 9, price: 11 }
        ]
      },
      {
        orderNo: 'STAT005',
        status: 'paid',
        paidAt: yesterday,
        cartTotal: 100,
        items: [
          { name: '昨日商品', quantity: 5, price: 20 }
        ]
      }
    ]

    orders.forEach((order) => store.saveOrder(order))

    return store.getTodayStats()
  }

  test('stats counts today active orders', () => {
    const stats = setupStats()

    assert.strictEqual(stats.orderCount, 3)
  })

  test('stats calculates today sales amount', () => {
    const stats = setupStats()

    assert.strictEqual(stats.totalSales, 132)
  })

  test('stats counts pending orders', () => {
    const stats = setupStats()

    assert.strictEqual(stats.pendingCount, 1)
  })

  test('stats counts completed orders', () => {
    const stats = setupStats()

    assert.strictEqual(stats.completedCount, 1)
  })

  test('stats returns top 5 hot items', () => {
    const stats = setupStats()

    assert.ok(stats.topItems.length <= 5)
    assert.strictEqual(stats.topItems[0].name, '美式咖啡')
    assert.strictEqual(stats.topItems[0].quantity, 3)
    assert.ok(!stats.topItems.some((item) => item.name === '不应计入商品'))
    assert.ok(!stats.topItems.some((item) => item.name === '昨日商品'))
  })
}
