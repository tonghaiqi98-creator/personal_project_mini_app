const ORDER_HISTORY_KEY = 'mockOrderHistory'

Page({
  data: {
    order: null,
    hasOrder: false,
    statusText: '待商家接单',
    paidTimeText: ''
  },

  onLoad(options) {
    this.loadOrder(options && options.orderNo)
  },

  loadOrder(orderNo) {
    const history = wx.getStorageSync(ORDER_HISTORY_KEY) || []
    const order = orderNo
      ? history.find((item) => item.orderNo === orderNo)
      : wx.getStorageSync('mockLatestOrder')

    if (!order) {
      this.setData({
        order: null,
        hasOrder: false
      })
      return
    }

    this.setData({
      order,
      hasOrder: true,
      statusText: this.getStatusText(order.status),
      paidTimeText: this.formatTime(order.paidAt)
    })
  },

  getStatusText(status) {
    const statusMap = {
      paid: '待商家接单',
      accepted: '商家已接单',
      completed: '订单已完成',
      cancelled: '订单已取消'
    }

    return statusMap[status] || '未知状态'
  },

  onShow() {
    this.loadOrder()
  },

  formatTime(value) {
    if (!value) {
      return ''
    }

    const date = new Date(value)
    const pad = (number) => `${number}`.padStart(2, '0')

    return `${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
  },

  handleBackToMenu() {
    wx.redirectTo({
      url: '/pages/customer/menu/menu'
    })
  },

  handleBackHome() {
    wx.reLaunch({
      url: '/pages/customer/home/home'
    })
  },

  handleGoHistory() {
    wx.navigateTo({
      url: '/pages/customer/order-history/order-history'
    })
  }
})
