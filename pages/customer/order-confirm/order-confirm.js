const ORDER_HISTORY_KEY = 'mockOrderHistory'

Page({
  data: {
    store: {
      name: '巷口咖啡',
      tableNo: 'A03 桌'
    },
    items: [],
    cartCount: 0,
    cartTotal: 0,
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
      cartTotal: draft.cartTotal || 0,
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
      storeId: 'store_001',
      store: this.data.store,
      tableNo: this.data.store.tableNo,
      userId: 'demo_user',
      items: this.data.items,
      cartCount: this.data.cartCount,
      totalAmount: Number(this.data.cartTotal),
      cartTotal: Number(this.data.cartTotal),
      remark: this.data.remark,
      status: 'paid',
      payStatus: 'paid',
      paidAt: Date.now(),
      createdAt: Date.now()
    }

    wx.setStorageSync('mockLatestOrder', paidOrder)
    this.saveOrderToHistory(paidOrder)

    wx.removeStorageSync('mockCartItems')
    wx.removeStorageSync('mockCartDraft')
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
