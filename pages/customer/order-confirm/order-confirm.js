const ORDER_HISTORY_KEY = 'mockOrderHistory'

Page({
  data: {
    store: {
      name: '巷口咖啡',
      tableNo: 'A03 桌'
    },
    items: [],
    cartCount: 0,
    cartTotal: '0.00',
    remark: '',
    hasItems: false
  },

  onLoad() {
    this.loadCartDraft()
  },

  loadCartDraft() {
    const draft = wx.getStorageSync('mockCartDraft') || {}
    const items = draft.items || []

    this.setData({
      store: draft.store || this.data.store,
      items,
      cartCount: draft.cartCount || 0,
      cartTotal: draft.cartTotal || '0.00',
      hasItems: items.length > 0
    })
  },

  handleRemarkInput(event) {
    this.setData({
      remark: event.detail.value
    })
  },

  handleBackToMenu() {
    wx.navigateBack()
  },

  handleMockPay() {
    if (!this.data.hasItems) {
      wx.showToast({
        title: '请先返回菜单选择商品',
        icon: 'none'
      })
      return
    }

    const paidOrder = {
      orderNo: `MOCK${Date.now()}`,
      store: this.data.store,
      items: this.data.items,
      cartCount: this.data.cartCount,
      cartTotal: this.data.cartTotal,
      remark: this.data.remark,
      status: 'paid',
      paidAt: new Date().toISOString()
    }

    wx.setStorageSync('mockLatestOrder', paidOrder)
    this.saveOrderToHistory(paidOrder)
    wx.showModal({
      title: '模拟支付成功',
      content: '订单已生成，即将进入订单详情页。',
      showCancel: false,
      confirmText: '查看订单',
      success: () => {
        wx.redirectTo({
          url: '/pages/customer/order-detail/order-detail'
        })
      }
    })
  },

  saveOrderToHistory(order) {
    const history = wx.getStorageSync(ORDER_HISTORY_KEY) || []
    const nextHistory = [order, ...history.filter((item) => item.orderNo !== order.orderNo)]

    wx.setStorageSync(ORDER_HISTORY_KEY, nextHistory.slice(0, 50))
  }
})
