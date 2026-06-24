const ORDER_HISTORY_KEY = 'mockOrderHistory'

Page({
  data: {
    orders: [],
    hasOrders: false
  },

  onShow() {
    this.loadOrders()
  },

  loadOrders() {
    const history = wx.getStorageSync(ORDER_HISTORY_KEY) || []
    const orders = history.map((order) => ({
      ...order,
      statusText: this.getStatusText(order.status),
      timeText: this.formatTime(order.paidAt),
      summaryText: this.getSummaryText(order.items)
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
  },

  getStatusText(status) {
    const statusMap = {
      paid: '待商家接单',
      accepted: '商家已接单',
      completed: '订单已完成',
      cancelled: '已取消'
    }

    return statusMap[status] || '待商家接单'
  },

  getSummaryText(items = []) {
    return items
      .slice(0, 3)
      .map((item) => `${item.name} x${item.quantity}`)
      .join('、')
  },

  formatTime(value) {
    if (!value) {
      return ''
    }

    const date = new Date(value)
    const pad = (number) => `${number}`.padStart(2, '0')

    return `${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
  }
})
