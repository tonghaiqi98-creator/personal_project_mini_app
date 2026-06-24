Page({
  data: {
    store: {
      name: '巷口咖啡',
      tableNo: 'A03 桌',
      status: '营业中',
      businessHours: '09:00 - 21:00'
    },
    notice: '欢迎扫码点餐，下单后请等待店员送餐',
    recommendations: [
      {
        id: 'latte',
        name: '燕麦拿铁',
        description: '醇厚咖啡融合燕麦奶，口感顺滑',
        price: '28',
        tag: '人气'
      },
      {
        id: 'salad',
        name: '牛油果鸡胸沙拉',
        description: '清爽轻食搭配低脂鸡胸，适合午餐',
        price: '36',
        tag: '轻食'
      },
      {
        id: 'cake',
        name: '焦糖海盐蛋糕',
        description: '微咸焦糖奶油，搭配下午茶刚好',
        price: '22',
        tag: '推荐'
      }
    ]
  },

  handleStartOrder() {
    wx.navigateTo({
      url: '/pages/customer/menu/menu'
    })
  },

  handleOrderHistory() {
    wx.navigateTo({
      url: '/pages/customer/order-history/order-history'
    })
  },

  handleMerchantEntry() {
    wx.navigateTo({
      url: '/pages/merchant/home/home'
    })
  }
})
