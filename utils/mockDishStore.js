const { categories, dishes } = require('./mockMenu')

const DISH_OVERRIDES_KEY = 'mockDishOverrides'
const CUSTOM_DISHES_KEY = 'mockCustomDishes'

function getOverrides() {
  return wx.getStorageSync(DISH_OVERRIDES_KEY) || {}
}

function saveOverrides(overrides) {
  wx.setStorageSync(DISH_OVERRIDES_KEY, overrides)
}

function getCustomDishes() {
  return wx.getStorageSync(CUSTOM_DISHES_KEY) || []
}

function saveCustomDishes(customDishes) {
  wx.setStorageSync(CUSTOM_DISHES_KEY, customDishes)
}

function normalizeDish(dish, overrides = {}) {
  const override = overrides[dish.id] || {}
  const category = categories.find((item) => item.id === dish.categoryId)

  const mergedDish = {
    ...dish,
    ...override,
    categoryName: category ? category.name : ''
  }

  return {
    ...mergedDish,
    temperatureOptionsText: (mergedDish.temperatureOptions || []).join(' / '),
    tasteOptionsText: (mergedDish.tasteOptions || []).join(' / '),
    temperatureOptionsInputText: (mergedDish.temperatureOptions || []).join(','),
    tasteOptionsInputText: (mergedDish.tasteOptions || []).join(',')
  }
}

function getDishes() {
  const overrides = getOverrides()
  const baseDishes = dishes.map((dish) => normalizeDish(dish, overrides))
  const customDishes = getCustomDishes().map((dish) => normalizeDish(dish, overrides))

  return [...baseDishes, ...customDishes]
}

function getCustomerDishes() {
  return getDishes().filter((dish) => dish.status === 'on_sale')
}

function updateDishStatus(id, status) {
  const customDishes = getCustomDishes()
  const customIndex = customDishes.findIndex((dish) => dish.id === id)

  if (customIndex >= 0) {
    customDishes[customIndex] = {
      ...customDishes[customIndex],
      status,
      updatedAt: Date.now()
    }
    saveCustomDishes(customDishes)
    return
  }

  const overrides = getOverrides()

  overrides[id] = {
    ...(overrides[id] || {}),
    status
  }
  saveOverrides(overrides)
}

function updateDishPrice(id, price) {
  const customDishes = getCustomDishes()
  const customIndex = customDishes.findIndex((dish) => dish.id === id)

  if (customIndex >= 0) {
    customDishes[customIndex] = {
      ...customDishes[customIndex],
      price,
      updatedAt: Date.now()
    }
    saveCustomDishes(customDishes)
    return
  }

  const overrides = getOverrides()

  overrides[id] = {
    ...(overrides[id] || {}),
    price
  }
  saveOverrides(overrides)
}

function updateDishFields(id, fields) {
  const customDishes = getCustomDishes()
  const customIndex = customDishes.findIndex((dish) => dish.id === id)

  if (customIndex >= 0) {
    customDishes[customIndex] = {
      ...customDishes[customIndex],
      ...fields,
      updatedAt: Date.now()
    }
    saveCustomDishes(customDishes)
    return
  }

  const overrides = getOverrides()

  overrides[id] = {
    ...(overrides[id] || {}),
    ...fields
  }
  saveOverrides(overrides)
}

function createDish(dishPayload) {
  const now = Date.now()
  const customDishes = getCustomDishes()
  const dish = {
    id: `custom_${now}`,
    storeId: 'store_001',
    sales: 0,
    sort: customDishes.length + 1000,
    createdAt: now,
    updatedAt: now,
    ...dishPayload
  }

  saveCustomDishes([dish, ...customDishes])
  return dish
}

module.exports = {
  getDishes,
  getCustomerDishes,
  updateDishStatus,
  updateDishPrice,
  updateDishFields,
  createDish
}
