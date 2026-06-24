const { categories } = require('../../../utils/mockMenu')
const { getCustomerDishes } = require('../../../utils/mockDishStore')

const CART_STORAGE_KEY = 'mockCartItems'
const CART_EDIT_ITEM_KEY = 'mockCartEditItemKey'

Page({
  data: {
    store: {
      name: '巷口咖啡',
      tableNo: 'A03 桌',
      status: '营业中'
    },
    categories,
    dishes: [],
    activeCategoryId: categories[0].id,
    currentDishes: [],
    temperatureOptions: [],
    tasteOptions: [],
    selectedDish: null,
    selectedTemperature: '热',
    selectedTaste: '标准',
    detailQuantity: 1,
    editingCartKey: '',
    isEditingCartItem: false,
    showDishDetail: false,
    showCartPreview: false,
    cartItems: [],
    cartMap: {},
    cartCount: 0,
    cartTotal: 0
  },

  onLoad() {
    this.loadDishes()
  },

  onShow() {
    this.loadDishes()
  },

  loadDishes() {
    this.setData({
      dishes: getCustomerDishes()
    }, () => {
      this.loadCartItems()
    })
  },

  loadCartItems() {
    const cartItems = wx.getStorageSync(CART_STORAGE_KEY) || []

    this.setData({
      cartItems
    }, () => {
      this.refreshCartSummary()
      this.refreshCurrentDishes()
      this.openPendingEditDish()
    })
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
    this.openDishDetailById(id)
  },

  handleCloseDishDetail() {
    this.setData({
      showDishDetail: false,
      selectedDish: null,
      editingCartKey: '',
      isEditingCartItem: false
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
    const dish = this.data.dishes.find((item) => item.id === id)

    if (!dish) {
      return
    }

    this.addCartItem({
      dish,
      temperature: this.getDefaultTemperature(dish),
      taste: this.getDefaultTaste(dish),
      quantity: 1
    })
  },

  handleAddDetailToCart() {
    const {
      selectedDish,
      selectedTemperature,
      selectedTaste,
      detailQuantity,
      editingCartKey
    } = this.data

    if (!selectedDish) {
      return
    }

    if (editingCartKey) {
      this.updateCartItemSpec({
        originalKey: editingCartKey,
        dish: selectedDish,
        temperature: selectedTemperature,
        taste: selectedTaste,
        quantity: detailQuantity
      })
      this.handleCloseDishDetail()
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

  handleGoCartPage() {
    this.setData({
      showCartPreview: false
    })
    wx.navigateTo({
      url: '/pages/customer/cart/cart'
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
      existingItem.subtotal = Number((existingItem.quantity * existingItem.price).toFixed(2))
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
        subtotal: Number((quantity * dish.price).toFixed(2))
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
          subtotal: Number((quantity * item.price).toFixed(2))
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
    return dish.temperatureOptions && dish.temperatureOptions.length
      ? dish.temperatureOptions[0]
      : '常温'
  },

  getDefaultTaste(dish) {
    return dish.tasteOptions && dish.tasteOptions.length
      ? dish.tasteOptions[0]
      : '标准'
  },

  openPendingEditDish() {
    const itemKey = wx.getStorageSync(CART_EDIT_ITEM_KEY)

    if (!itemKey) {
      return
    }

    wx.removeStorageSync(CART_EDIT_ITEM_KEY)
    this.openCartItemEditor(itemKey)
  },

  openDishDetailById(id) {
    const selectedDish = this.data.dishes.find((dish) => dish.id === id)

    if (!selectedDish) {
      return
    }

    this.setData({
      activeCategoryId: selectedDish.categoryId,
      selectedDish,
      selectedTemperature: this.getDefaultTemperature(selectedDish),
      selectedTaste: this.getDefaultTaste(selectedDish),
      temperatureOptions: selectedDish.temperatureOptions || [],
      tasteOptions: selectedDish.tasteOptions || [],
      detailQuantity: 1,
      editingCartKey: '',
      isEditingCartItem: false,
      showDishDetail: true
    }, () => {
      this.refreshCurrentDishes()
    })
  },

  openCartItemEditor(itemKey) {
    const cartItem = this.data.cartItems.find((item) => item.key === itemKey)

    if (!cartItem) {
      wx.showToast({
        title: '该商品已不在购物车',
        icon: 'none'
      })
      return
    }

    const selectedDish = this.data.dishes.find((dish) => dish.id === cartItem.id)

    if (!selectedDish) {
      return
    }

    this.setData({
      activeCategoryId: selectedDish.categoryId,
      selectedDish,
      selectedTemperature: cartItem.temperature,
      selectedTaste: cartItem.taste,
      temperatureOptions: selectedDish.temperatureOptions || [],
      tasteOptions: selectedDish.tasteOptions || [],
      detailQuantity: cartItem.quantity,
      editingCartKey: itemKey,
      isEditingCartItem: true,
      showDishDetail: true
    }, () => {
      this.refreshCurrentDishes()
    })
  },

  updateCartItemSpec({ originalKey, dish, temperature, taste, quantity }) {
    const nextKey = this.createCartKey(dish.id, temperature, taste)
    const originalItem = this.data.cartItems.find((item) => item.key === originalKey)

    if (!originalItem) {
      return
    }

    let cartItems = this.data.cartItems.filter((item) => item.key !== originalKey)
    const existingItem = cartItems.find((item) => item.key === nextKey)

    if (existingItem) {
      existingItem.quantity += quantity
      existingItem.subtotal = Number((existingItem.quantity * existingItem.price).toFixed(2))
    } else {
      cartItems.push({
        key: nextKey,
        id: dish.id,
        name: dish.name,
        price: dish.price,
        image: dish.image,
        temperature,
        taste,
        specText: `${temperature} / ${taste}`,
        quantity,
        subtotal: Number((quantity * dish.price).toFixed(2))
      })
    }

    this.setData({
      cartItems
    }, () => {
      this.refreshCartSummary()
      this.refreshCurrentDishes()
      wx.showToast({
        title: '已更新口味',
        icon: 'none'
      })
    })
  },

  refreshCurrentDishes() {
    const { activeCategoryId, cartMap, dishes } = this.data
    const currentDishes = dishes
      .filter((dish) => dish.categoryId === activeCategoryId)
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
      cartTotal: Number(cartTotal.toFixed(2))
    })
    wx.setStorageSync(CART_STORAGE_KEY, cartItems)
  }
})
