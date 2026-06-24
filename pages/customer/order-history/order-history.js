const {
  getOrders,
  getStatusText,
  formatTime,
  getOrderSummary
} = require('../../../utils/mockOrderStore')

Page({
  data: {
    orders: [],
    hasOrders: false
  },

  onShow() {
    this.loadOrders()
  },

  loadOrders() {
    const orders = getOrders().map((order) => ({
      ...order,
      statusText: getStatusText(order.status),
      timeText: formatTime(order.paidAt),
      summaryText: getOrderSummary(order.items)
    }))

    this.setData({
      orders,
      hasOrders: orders.length > 0
    })
  },

  handleOrderTap(event) {
    const { orderNo } = event.currentTarget.dataset

    wx.navigateTo({
      url: `/pages/customer/order-detail/order-detail?orderNo=${orderNo}`
    })
  },

  handleStartOrder() {
    wx.navigateTo({
      url: '/pages/customer/menu/menu'
    })
  }
})
