const {
  getDishes,
  updateDishStatus,
  updateDishPrice,
  updateDishFields
} = require('../../../utils/mockDishStore')

const DEFAULT_TEMPERATURE_OPTIONS = ['热', '冰', '常温']
const DEFAULT_TASTE_OPTIONS = ['标准', '少糖', '无糖', '少冰', '去冰', '加浓']

Page({
  data: {
    dishes: [],
    onSaleCount: 0,
    offSaleCount: 0,
    showOptionEditor: false,
    editingDishId: '',
    editingFieldName: '',
    optionEditorTitle: '',
    optionItems: []
  },

  onShow() {
    this.loadDishes()
  },

  handleGoCreate() {
    wx.navigateTo({
      url: '/pages/merchant/dish-create/dish-create'
    })
  },

  loadDishes() {
    const dishes = getDishes()

    this.setData({
      dishes,
      onSaleCount: dishes.filter((dish) => dish.status === 'on_sale').length,
      offSaleCount: dishes.filter((dish) => dish.status === 'off_sale').length
    })
  },

  handleToggleStatus(event) {
    const { id, status } = event.currentTarget.dataset
    const nextStatus = status === 'on_sale' ? 'off_sale' : 'on_sale'

    updateDishStatus(id, nextStatus)
    this.loadDishes()
    wx.showToast({
      title: nextStatus === 'on_sale' ? '已上架' : '已下架',
      icon: 'none'
    })
  },

  handleEditPrice(event) {
    const { id, price } = event.currentTarget.dataset

    wx.showModal({
      title: '修改价格',
      editable: true,
      placeholderText: '输入新价格',
      content: `${price}`,
      confirmText: '保存',
      confirmColor: '#D77A32',
      success: (result) => {
        if (!result.confirm) {
          return
        }

        const nextPrice = Number(result.content)

        if (!nextPrice || nextPrice <= 0) {
          wx.showToast({
            title: '请输入有效价格',
            icon: 'none'
          })
          return
        }

        updateDishPrice(id, Number(nextPrice.toFixed(2)))
        this.loadDishes()
      }
    })
  },

  handleEditDescription(event) {
    const { id, description } = event.currentTarget.dataset

    wx.showModal({
      title: '修改简介',
      editable: true,
      placeholderText: '输入菜品简介',
      content: description || '',
      confirmText: '保存',
      confirmColor: '#D77A32',
      success: (result) => {
        if (!result.confirm) {
          return
        }

        const nextDescription = `${result.content || ''}`.trim()

        if (!nextDescription) {
          wx.showToast({
            title: '简介不能为空',
            icon: 'none'
          })
          return
        }

        updateDishFields(id, {
          description: nextDescription
        })
        this.loadDishes()
      }
    })
  },

  handleEditTemperatureOptions(event) {
    const { id } = event.currentTarget.dataset
    const dish = this.data.dishes.find((item) => item.id === id)

    this.openOptionEditor({
      id,
      title: '修改温度选项',
      fieldName: 'temperatureOptions',
      currentOptions: dish ? dish.temperatureOptions : [],
      presetOptions: DEFAULT_TEMPERATURE_OPTIONS
    })
  },

  handleEditTasteOptions(event) {
    const { id } = event.currentTarget.dataset
    const dish = this.data.dishes.find((item) => item.id === id)

    this.openOptionEditor({
      id,
      title: '修改口味选项',
      fieldName: 'tasteOptions',
      currentOptions: dish ? dish.tasteOptions : [],
      presetOptions: DEFAULT_TASTE_OPTIONS
    })
  },

  openOptionEditor({ id, title, fieldName, currentOptions, presetOptions }) {
    const mergedOptions = [...presetOptions]

    currentOptions.forEach((option) => {
      if (!mergedOptions.includes(option)) {
        mergedOptions.push(option)
      }
    })

    this.setData({
      showOptionEditor: true,
      editingDishId: id,
      editingFieldName: fieldName,
      optionEditorTitle: title,
      optionItems: mergedOptions.map((name) => ({
        name,
        selected: currentOptions.includes(name)
      }))
    })
  },

  handleCloseOptionEditor() {
    this.setData({
      showOptionEditor: false,
      editingDishId: '',
      editingFieldName: '',
      optionEditorTitle: '',
      optionItems: []
    })
  },

  handleOptionTap(event) {
    const { name } = event.currentTarget.dataset
    const optionItems = this.data.optionItems.map((item) => (
      item.name === name
        ? { ...item, selected: !item.selected }
        : item
    ))

    this.setData({
      optionItems
    })
  },

  handleAddOption() {
    wx.showModal({
      title: '新增选项',
      editable: true,
      placeholderText: '例如 加珍珠',
      confirmText: '添加',
      confirmColor: '#D77A32',
      success: (result) => {
        if (!result.confirm) {
          return
        }

        const name = `${result.content || ''}`.trim()

        if (!name) {
          wx.showToast({
            title: '选项不能为空',
            icon: 'none'
          })
          return
        }

        if (this.data.optionItems.some((item) => item.name === name)) {
          wx.showToast({
            title: '选项已存在',
            icon: 'none'
          })
          return
        }

        this.setData({
          optionItems: [
            ...this.data.optionItems,
            {
              name,
              selected: true
            }
          ]
        })
      }
    })
  },

  handleSaveOptions() {
    const options = this.data.optionItems
      .filter((item) => item.selected)
      .map((item) => item.name)

    if (!options.length) {
      wx.showToast({
        title: '至少保留一个选项',
        icon: 'none'
      })
      return
    }

    updateDishFields(this.data.editingDishId, {
      [this.data.editingFieldName]: options
    })

    this.handleCloseOptionEditor()
    this.loadDishes()
    wx.showToast({
      title: '已保存选项',
      icon: 'none'
    })
  }
})
