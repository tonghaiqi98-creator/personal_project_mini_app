const ORDER_HISTORY_KEY = 'mockOrderHistory'
const LATEST_ORDER_KEY = 'mockLatestOrder'

function getOrders() {
  return wx.getStorageSync(ORDER_HISTORY_KEY) || []
}

function saveOrders(orders) {
  wx.setStorageSync(ORDER_HISTORY_KEY, orders)
}

function saveOrder(order) {
  const orders = getOrders()
  const nextOrders = [order, ...orders.filter((item) => item.orderNo !== order.orderNo)]

  saveOrders(nextOrders.slice(0, 50))
  wx.setStorageSync(LATEST_ORDER_KEY, order)
}

function getOrder(orderNo) {
  if (!orderNo) {
    return wx.getStorageSync(LATEST_ORDER_KEY)
  }

  return getOrders().find((order) => order.orderNo === orderNo)
}

function updateOrderStatus(orderNo, status) {
  const orders = getOrders()
  let updatedOrder = null
  const now = new Date().toISOString()

  const nextOrders = orders.map((order) => {
    if (order.orderNo !== orderNo) {
      return order
    }

    updatedOrder = {
      ...order,
      status,
      acceptedAt: status === 'accepted' ? now : order.acceptedAt,
      completedAt: status === 'completed' ? now : order.completedAt
    }

    return updatedOrder
  })

  if (!updatedOrder) {
    return null
  }

  saveOrders(nextOrders)

  const latestOrder = wx.getStorageSync(LATEST_ORDER_KEY)
  if (latestOrder && latestOrder.orderNo === orderNo) {
    wx.setStorageSync(LATEST_ORDER_KEY, updatedOrder)
  }

  return updatedOrder
}

function getStatusText(status) {
  const statusMap = {
    paid: '待商家接单',
    accepted: '制作中',
    completed: '已完成',
    cancelled: '已取消'
  }

  return statusMap[status] || '待商家接单'
}

function formatTime(value) {
  if (!value) {
    return ''
  }

  const date = new Date(value)
  const pad = (number) => `${number}`.padStart(2, '0')

  return `${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function getOrderSummary(items = []) {
  return items
    .slice(0, 3)
    .map((item) => `${item.name} x${item.quantity}`)
    .join('、')
}

function getTodayStats() {
  const orders = getOrders()
  const today = new Date().toDateString()
  const todayOrders = orders.filter((order) => {
    if (!order.paidAt) {
      return false
    }

    return new Date(order.paidAt).toDateString() === today
  })

  const activeOrders = todayOrders.filter((order) => order.status !== 'cancelled')
  const topMap = {}

  activeOrders.forEach((order) => {
    order.items.forEach((item) => {
      if (!topMap[item.name]) {
        topMap[item.name] = {
          name: item.name,
          quantity: 0,
          amount: 0
        }
      }

      topMap[item.name].quantity += item.quantity
      topMap[item.name].amount += item.quantity * item.price
    })
  })

  return {
    orderCount: activeOrders.length,
    pendingCount: activeOrders.filter((order) => order.status === 'paid').length,
    acceptedCount: activeOrders.filter((order) => order.status === 'accepted').length,
    completedCount: activeOrders.filter((order) => order.status === 'completed').length,
    totalSales: Number(activeOrders.reduce((sum, order) => sum + Number(order.cartTotal || 0), 0).toFixed(2)),
    topItems: Object.values(topMap)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5)
      .map((item) => ({
        ...item,
        amount: Number(item.amount.toFixed(2))
      }))
  }
}

module.exports = {
  getOrders,
  saveOrder,
  getOrder,
  updateOrderStatus,
  getStatusText,
  formatTime,
  getOrderSummary,
  getTodayStats
}
