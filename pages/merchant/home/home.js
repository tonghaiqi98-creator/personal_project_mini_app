const { getTodayStats } = require('../../../utils/mockOrderStore')

Page({
  data: {
    stats: {
      orderCount: 0,
      totalSales: 0,
      pendingCount: 0,
      acceptedCount: 0,
      completedCount: 0
    }
  },

  onShow() {
    this.setData({
      stats: getTodayStats()
    })
  },

  handleGoOrders() {
    wx.navigateTo({
      url: '/pages/merchant/orders/orders'
    })
  },

  handleGoDishes() {
    wx.navigateTo({
      url: '/pages/merchant/dishes/dishes'
    })
  },

  handleGoStats() {
    wx.navigateTo({
      url: '/pages/merchant/stats/stats'
    })
  }
})
