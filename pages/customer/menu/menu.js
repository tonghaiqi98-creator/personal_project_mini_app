const { categories, dishes } = require('../../../utils/mockMenu')

Page({
  data: {
    store: {
      name: '巷口咖啡',
      tableNo: 'A03 桌',
      status: '营业中'
    },
    categories,
    activeCategoryId: categories[0].id,
    currentDishes: [],
    temperatureOptions: ['热', '冰', '常温'],
    tasteOptions: ['标准', '少糖', '无糖'],
    selectedDish: null,
    selectedTemperature: '热',
    selectedTaste: '标准',
    detailQuantity: 1,
    showDishDetail: false,
    showCartPreview: false,
    cartItems: [],
    cartMap: {},
    cartCount: 0,
    cartTotal: '0.00'
  },

  onLoad() {
    this.refreshCurrentDishes()
  },

  handleCategoryTap(event) {
    const { id } = event.currentTarget.dataset

    if (id === this.data.activeCategoryId) {
      return
    }

    this.setData({
      activeCategoryId: id
    }, () => {
      this.refreshCurrentDishes()
    })
  },

  handleDishTap(event) {
    const { id } = event.currentTarget.dataset
    const selectedDish = dishes.find((dish) => dish.id === id)

    if (!selectedDish) {
      return
    }

    this.setData({
      selectedDish,
      selectedTemperature: this.getDefaultTemperature(selectedDish),
      selectedTaste: '标准',
      detailQuantity: 1,
      showDishDetail: true
    })
  },

  handleCloseDishDetail() {
    this.setData({
      showDishDetail: false,
      selectedDish: null
    })
  },

  handleTemperatureTap(event) {
    this.setData({
      selectedTemperature: event.currentTarget.dataset.value
    })
  },

  handleTasteTap(event) {
    this.setData({
      selectedTaste: event.currentTarget.dataset.value
    })
  },

  handleDetailQuantityMinus() {
    if (this.data.detailQuantity <= 1) {
      return
    }

    this.setData({
      detailQuantity: this.data.detailQuantity - 1
    })
  },

  handleDetailQuantityPlus() {
    this.setData({
      detailQuantity: this.data.detailQuantity + 1
    })
  },

  handleQuickAddDish(event) {
    const { id } = event.currentTarget.dataset
    const dish = dishes.find((item) => item.id === id)

    if (!dish) {
      return
    }

    this.addCartItem({
      dish,
      temperature: this.getDefaultTemperature(dish),
      taste: '标准',
      quantity: 1
    })
  },

  handleAddDetailToCart() {
    const { selectedDish, selectedTemperature, selectedTaste, detailQuantity } = this.data

    if (!selectedDish) {
      return
    }

    this.addCartItem({
      dish: selectedDish,
      temperature: selectedTemperature,
      taste: selectedTaste,
      quantity: detailQuantity
    })
    this.handleCloseDishDetail()
  },

  handleCartBarTap() {
    if (!this.data.cartCount) {
      wx.showToast({
        title: '请先选择商品',
        icon: 'none'
      })
      return
    }

    this.setData({
      showCartPreview: true
    })
  },

  handleCloseCartPreview() {
    this.setData({
      showCartPreview: false
    })
  },

  handleCartItemMinus(event) {
    this.changeCartItemQuantity(event.currentTarget.dataset.key, -1)
  },

  handleCartItemPlus(event) {
    this.changeCartItemQuantity(event.currentTarget.dataset.key, 1)
  },

  handleCartItemRemove(event) {
    this.removeCartItem(event.currentTarget.dataset.key)
  },

  handleClearCart() {
    this.setData({
      cartItems: [],
      showCartPreview: false
    }, () => {
      this.refreshCartSummary()
      this.refreshCurrentDishes()
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

  buildCartDraft() {
    const { cartItems, cartCount, cartTotal, store } = this.data
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
  },

  addCartItem({ dish, temperature, taste, quantity }) {
    const key = this.createCartKey(dish.id, temperature, taste)
    const cartItems = this.data.cartItems.map((item) => ({ ...item }))
    const existingItem = cartItems.find((item) => item.key === key)

    if (existingItem) {
      existingItem.quantity += quantity
      existingItem.subtotal = (existingItem.quantity * existingItem.price).toFixed(2)
    } else {
      cartItems.push({
        key,
        id: dish.id,
        name: dish.name,
        price: dish.price,
        image: dish.image,
        temperature,
        taste,
        specText: `${temperature} / ${taste}`,
        quantity,
        subtotal: (quantity * dish.price).toFixed(2)
      })
    }

    this.setData({
      cartItems
    }, () => {
      this.refreshCartSummary()
      this.refreshCurrentDishes()
    })
  },

  changeCartItemQuantity(key, step) {
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

    this.setData({
      cartItems,
      showCartPreview: cartItems.length > 0
    }, () => {
      this.refreshCartSummary()
      this.refreshCurrentDishes()
    })
  },

  removeCartItem(key) {
    const cartItems = this.data.cartItems.filter((item) => item.key !== key)

    this.setData({
      cartItems,
      showCartPreview: cartItems.length > 0
    }, () => {
      this.refreshCartSummary()
      this.refreshCurrentDishes()
    })
  },

  createCartKey(dishId, temperature, taste) {
    return `${dishId}_${temperature}_${taste}`
  },

  getDefaultTemperature(dish) {
    return dish.categoryId === 'light-food' || dish.categoryId === 'dessert' ? '常温' : '热'
  },

  refreshCurrentDishes() {
    const { activeCategoryId, cartMap } = this.data
    const currentDishes = dishes
      .filter((dish) => dish.categoryId === activeCategoryId && dish.status === 'on_sale')
      .map((dish) => ({
        ...dish,
        cartCount: cartMap[dish.id] || 0
      }))

    this.setData({
      currentDishes
    })
  },

  refreshCartSummary() {
    const { cartItems } = this.data
    let cartCount = 0
    let cartTotal = 0
    const cartMap = {}

    cartItems.forEach((item) => {
      cartCount += item.quantity
      cartTotal += item.quantity * item.price
      cartMap[item.id] = (cartMap[item.id] || 0) + item.quantity
    })

    this.setData({
      cartMap,
      cartCount,
      cartTotal: cartTotal.toFixed(2)
    })
  }
})
