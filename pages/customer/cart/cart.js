const CART_STORAGE_KEY = 'mockCartItems'
const CART_EDIT_ITEM_KEY = 'mockCartEditItemKey'

Page({
  data: {
    store: {
      name: '巷口咖啡',
      tableNo: 'A03 桌'
    },
    cartItems: [],
    cartCount: 0,
    cartTotal: '0.00',
    hasItems: false
  },

  onShow() {
    this.loadCartItems()
  },

  loadCartItems() {
    const cartItems = wx.getStorageSync(CART_STORAGE_KEY) || []
    this.updateCart(cartItems)
  },

  handleItemTap(event) {
    const { key } = event.currentTarget.dataset

    wx.setStorageSync(CART_EDIT_ITEM_KEY, key)
    wx.navigateBack({
      fail: () => {
        wx.navigateTo({
          url: '/pages/customer/menu/menu'
        })
      }
    })
  },

  noop() {},

  handleQuantityMinus(event) {
    this.changeQuantity(event.currentTarget.dataset.key, -1)
  },

  handleQuantityPlus(event) {
    this.changeQuantity(event.currentTarget.dataset.key, 1)
  },

  handleRemoveItem(event) {
    const { key } = event.currentTarget.dataset
    const cartItems = this.data.cartItems.filter((item) => item.key !== key)

    this.updateCart(cartItems)
  },

  handleClearCart() {
    if (!this.data.cartItems.length) {
      return
    }

    wx.showModal({
      title: '清空购物车',
      content: '确认清空当前已选商品吗？',
      confirmText: '清空',
      confirmColor: '#D77A32',
      success: (result) => {
        if (!result.confirm) {
          return
        }

        this.updateCart([])
      }
    })
  },

  handleContinueOrder() {
    wx.navigateBack({
      fail: () => {
        wx.navigateTo({
          url: '/pages/customer/menu/menu'
        })
      }
    })
  },

  handleCheckout() {
    if (!this.data.cartCount) {
      wx.showToast({
        title: '请先选择商品',
        icon: 'none'
      })
      return
    }

    wx.setStorageSync('mockCartDraft', this.buildCartDraft())
    wx.navigateTo({
      url: '/pages/customer/order-confirm/order-confirm'
    })
  },

  changeQuantity(key, step) {
    const cartItems = this.data.cartItems
      .map((item) => {
        if (item.key !== key) {
          return item
        }

        const quantity = item.quantity + step

        if (quantity <= 0) {
          return null
        }

        return {
          ...item,
          quantity,
          subtotal: (quantity * item.price).toFixed(2)
        }
      })
      .filter(Boolean)

    this.updateCart(cartItems)
  },

  updateCart(cartItems) {
    let cartCount = 0
    let cartTotal = 0

    cartItems.forEach((item) => {
      cartCount += item.quantity
      cartTotal += item.quantity * item.price
    })

    wx.setStorageSync(CART_STORAGE_KEY, cartItems)
    this.setData({
      cartItems,
      cartCount,
      cartTotal: cartTotal.toFixed(2),
      hasItems: cartItems.length > 0
    })
  },

  buildCartDraft() {
    const { store, cartItems, cartCount, cartTotal } = this.data
    const items = cartItems.map((item) => ({
      id: item.id,
      key: item.key,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: item.quantity,
      temperature: item.temperature,
      taste: item.taste,
      specText: item.specText,
      subtotal: item.subtotal
    }))

    return {
      store,
      items,
      cartCount,
      cartTotal
    }
  }
})
