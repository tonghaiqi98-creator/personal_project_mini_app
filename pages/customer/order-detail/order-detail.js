const { getOrder, getStatusText, formatTime } = require('../../../utils/mockOrderStore')

Page({
  data: {
    order: null,
    hasOrder: false,
    statusText: '待商家接单',
    paidTimeText: '',
    orderNo: ''
  },

  onLoad(options) {
    this.setData({
      orderNo: options && options.orderNo ? options.orderNo : ''
    })
    this.loadOrder()
  },

  loadOrder() {
    const order = getOrder(this.data.orderNo)

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
      statusText: getStatusText(order.status),
      paidTimeText: formatTime(order.paidAt)
    })
  },

  onShow() {
    this.loadOrder()
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
