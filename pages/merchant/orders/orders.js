const {
  getOrders,
  updateOrderStatus,
  getStatusText,
  formatTime,
  getOrderSummary
} = require('../../../utils/mockOrderStore')

Page({
  data: {
    tabs: [
      { status: 'paid', label: '新订单' },
      { status: 'accepted', label: '制作中' },
      { status: 'completed', label: '已完成' }
    ],
    activeStatus: 'paid',
    orders: [],
    filteredOrders: [],
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

    const filteredOrders = orders.filter((order) => order.status === this.data.activeStatus)

    this.setData({
      orders,
      filteredOrders,
      hasOrders: filteredOrders.length > 0
    })
  },

  handleTabTap(event) {
    this.setData({
      activeStatus: event.currentTarget.dataset.status
    }, () => {
      this.loadOrders()
    })
  },

  handleAccept(event) {
    this.updateStatus(event.currentTarget.dataset.orderNo, 'accepted', '已接单')
  },

  handleComplete(event) {
    this.updateStatus(event.currentTarget.dataset.orderNo, 'completed', '已完成')
  },

  updateStatus(orderNo, status, message) {
    const updatedOrder = updateOrderStatus(orderNo, status)

    if (!updatedOrder) {
      wx.showToast({
        title: '订单不存在',
        icon: 'none'
      })
      return
    }

    wx.showToast({
      title: message,
      icon: 'none'
    })
    this.loadOrders()
  }
})
