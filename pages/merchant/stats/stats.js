const { getTodayStats } = require('../../../utils/mockOrderStore')

Page({
  data: {
    stats: {
      orderCount: 0,
      totalSales: 0,
      pendingCount: 0,
      acceptedCount: 0,
      completedCount: 0,
      topItems: []
    },
    hasTopItems: false
  },

  onShow() {
    const stats = getTodayStats()

    this.setData({
      stats,
      hasTopItems: stats.topItems.length > 0
    })
  }
})
