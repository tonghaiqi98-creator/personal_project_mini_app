Page({
  data: {
    order: null,
    hasOrder: false,
    statusText: '待商家接单',
    paidTimeText: ''
  },

  onLoad() {
    this.loadLatestOrder()
  },

  loadLatestOrder() {
    const order = wx.getStorageSync('mockLatestOrder')

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
      completed: '订单已完成'
    }

    return statusMap[status] || '待商家接单'
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
  }
})
