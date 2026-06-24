const { categories } = require('../../../utils/mockMenu')
const { createDish } = require('../../../utils/mockDishStore')

const DEFAULT_TEMPERATURE_OPTIONS = ['热', '冰', '常温']
const DEFAULT_TASTE_OPTIONS = ['标准', '少糖', '无糖', '少冰', '去冰', '加浓']

Page({
  data: {
    categories,
    categoryNames: categories.map((item) => item.name),
    categoryIndex: 0,
    imageIndex: 0,
    imageOptions: [
      '/菜品图/菜品1图/菜品1_01.jpg',
      '/菜品图/菜品2图/菜品2_01.jpg',
      '/菜品图/菜品3图/菜品3_01.jpg',
      '/菜品图/菜品4图/菜品4_01.jpg'
    ],
    form: {
      name: '',
      description: '',
      price: '',
      tag: '',
      status: 'on_sale'
    },
    temperatureOptionItems: DEFAULT_TEMPERATURE_OPTIONS.map((name) => ({
      name,
      selected: true
    })),
    tasteOptionItems: DEFAULT_TASTE_OPTIONS.map((name) => ({
      name,
      selected: ['标准', '少糖', '无糖'].includes(name)
    }))
  },

  handleCategoryChange(event) {
    this.setData({
      categoryIndex: Number(event.detail.value)
    })
  },

  handleImageChange(event) {
    this.setData({
      imageIndex: Number(event.detail.value)
    })
  },

  handleInput(event) {
    const { field } = event.currentTarget.dataset

    this.setData({
      [`form.${field}`]: event.detail.value
    })
  },

  handleStatusTap(event) {
    this.setData({
      'form.status': event.currentTarget.dataset.status
    })
  },

  handleOptionTap(event) {
    const { type, name } = event.currentTarget.dataset
    const field = this.getOptionField(type)
    const optionItems = this.data[field].map((item) => (
      item.name === name
        ? { ...item, selected: !item.selected }
        : item
    ))

    this.setData({
      [field]: optionItems
    })
  },

  handleAddOption(event) {
    const { type } = event.currentTarget.dataset
    const field = this.getOptionField(type)

    wx.showModal({
      title: type === 'temperature' ? '新增温度选项' : '新增口味选项',
      editable: true,
      placeholderText: type === 'temperature' ? '例如 去冰' : '例如 加珍珠',
      confirmText: '添加',
      confirmColor: '#D77A32',
      success: (result) => {
        if (!result.confirm) {
          return
        }

        const name = `${result.content || ''}`.trim()

        if (!name) {
          this.showError('选项不能为空')
          return
        }

        if (this.data[field].some((item) => item.name === name)) {
          this.showError('选项已存在')
          return
        }

        this.setData({
          [field]: [
            ...this.data[field],
            {
              name,
              selected: true
            }
          ]
        })
      }
    })
  },

  handleSubmit() {
    const { form, categories, categoryIndex, imageOptions, imageIndex } = this.data
    const name = form.name.trim()
    const description = form.description.trim()
    const price = Number(form.price)
    const tag = form.tag.trim() || '新品'
    const temperatureOptions = this.getSelectedOptions('temperature')
    const tasteOptions = this.getSelectedOptions('taste')

    if (!name) {
      this.showError('请输入商品名称')
      return
    }

    if (!description) {
      this.showError('请输入商品简介')
      return
    }

    if (!price || price <= 0) {
      this.showError('请输入有效价格')
      return
    }

    if (!temperatureOptions.length) {
      this.showError('请至少填写一个温度选项')
      return
    }

    if (!tasteOptions.length) {
      this.showError('请至少填写一个口味选项')
      return
    }

    createDish({
      categoryId: categories[categoryIndex].id,
      name,
      description,
      price: Number(price.toFixed(2)),
      image: imageOptions[imageIndex],
      tag,
      status: form.status,
      temperatureOptions,
      tasteOptions
    })

    wx.showToast({
      title: '已上架商品',
      icon: 'none'
    })
    setTimeout(() => {
      wx.navigateBack()
    }, 500)
  },

  getOptionField(type) {
    return type === 'temperature' ? 'temperatureOptionItems' : 'tasteOptionItems'
  },

  getSelectedOptions(type) {
    return this.data[this.getOptionField(type)]
      .filter((item) => item.selected)
      .map((item) => item.name)
  },

  showError(title) {
    wx.showToast({
      title,
      icon: 'none'
    })
  }
})
