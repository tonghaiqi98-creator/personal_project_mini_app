const categories = [
  { id: 'hot', name: '热销推荐' },
  { id: 'coffee', name: '咖啡' },
  { id: 'milk-tea', name: '奶茶' },
  { id: 'light-food', name: '轻食' },
  { id: 'dessert', name: '甜品' }
]

const rawDishes = [
  {
    id: 'hot-01',
    categoryId: 'hot',
    name: '燕麦拿铁',
    description: '醇厚咖啡搭配燕麦奶，口感顺滑不厚重',
    price: 28,
    image: '/菜品图/菜品1图/菜品1_01.jpg',
    tag: '人气',
    sales: 126,
    status: 'on_sale'
  },
  {
    id: 'hot-02',
    categoryId: 'hot',
    name: '招牌奶茶',
    description: '经典红茶底，奶香自然，甜度适中',
    price: 18,
    image: '/菜品图/菜品2图/菜品2_01.jpg',
    tag: '招牌',
    sales: 168,
    status: 'on_sale'
  },
  {
    id: 'hot-03',
    categoryId: 'hot',
    name: '牛油果鸡胸沙拉',
    description: '清爽蔬菜搭配低脂鸡胸，适合作为轻午餐',
    price: 36,
    image: '/菜品图/菜品3图/菜品3_01.jpg',
    tag: '轻食',
    sales: 89,
    status: 'on_sale'
  },
  {
    id: 'hot-04',
    categoryId: 'hot',
    name: '焦糖海盐蛋糕',
    description: '焦糖奶油带微咸风味，适合搭配咖啡',
    price: 22,
    image: '/菜品图/菜品4图/菜品4_01.jpg',
    tag: '推荐',
    sales: 74,
    status: 'on_sale'
  },

  {
    id: 'coffee-01',
    categoryId: 'coffee',
    name: '美式咖啡',
    description: '干净清爽的黑咖啡，保留咖啡豆原始香气',
    price: 20,
    image: '/菜品图/菜品1图/菜品1_02.jpg',
    tag: '经典',
    sales: 98,
    status: 'on_sale'
  },
  {
    id: 'coffee-02',
    categoryId: 'coffee',
    name: '拿铁咖啡',
    description: '浓缩咖啡加入鲜奶，奶香和咖啡香平衡',
    price: 26,
    image: '/菜品图/菜品1图/菜品1_03.jpg',
    tag: '热销',
    sales: 112,
    status: 'on_sale'
  },
  {
    id: 'coffee-03',
    categoryId: 'coffee',
    name: '焦糖玛奇朵',
    description: '焦糖风味明显，口感甜润，适合下午饮用',
    price: 30,
    image: '/菜品图/菜品1图/菜品1_04.jpg',
    tag: '甜香',
    sales: 67,
    status: 'on_sale'
  },
  {
    id: 'coffee-04',
    categoryId: 'coffee',
    name: '冷萃咖啡',
    description: '低温慢萃，酸苦柔和，入口更清爽',
    price: 32,
    image: '/菜品图/菜品1图/菜品1_05.jpg',
    tag: '冰饮',
    sales: 53,
    status: 'on_sale'
  },

  {
    id: 'milk-tea-01',
    categoryId: 'milk-tea',
    name: '茉莉奶绿',
    description: '茉莉茶香清新，奶味轻盈，适合少糖',
    price: 18,
    image: '/菜品图/菜品2图/菜品2_02.jpg',
    tag: '清爽',
    sales: 91,
    status: 'on_sale'
  },
  {
    id: 'milk-tea-02',
    categoryId: 'milk-tea',
    name: '珍珠奶茶',
    description: '黑糖珍珠软糯，茶底醇厚，经典不出错',
    price: 21,
    image: '/菜品图/菜品2图/菜品2_03.jpg',
    tag: '经典',
    sales: 143,
    status: 'on_sale'
  },
  {
    id: 'milk-tea-03',
    categoryId: 'milk-tea',
    name: '乌龙厚乳茶',
    description: '乌龙茶底搭配厚乳，茶香和奶香更浓',
    price: 24,
    image: '/菜品图/菜品2图/菜品2_04.jpg',
    tag: '厚乳',
    sales: 76,
    status: 'on_sale'
  },
  {
    id: 'milk-tea-04',
    categoryId: 'milk-tea',
    name: '芋泥波波奶茶',
    description: '绵密芋泥搭配小料，口感丰富有饱腹感',
    price: 26,
    image: '/菜品图/菜品2图/菜品2_05.jpg',
    tag: '小料',
    sales: 84,
    status: 'on_sale'
  },

  {
    id: 'light-food-01',
    categoryId: 'light-food',
    name: '烟熏鸡肉三明治',
    description: '全麦吐司夹烟熏鸡肉和新鲜蔬菜',
    price: 32,
    image: '/菜品图/菜品3图/菜品3_02.jpg',
    tag: '饱腹',
    sales: 62,
    status: 'on_sale'
  },
  {
    id: 'light-food-02',
    categoryId: 'light-food',
    name: '金枪鱼轻食卷',
    description: '金枪鱼搭配生菜和酱汁，清爽不油腻',
    price: 34,
    image: '/菜品图/菜品3图/菜品3_03.jpg',
    tag: '低脂',
    sales: 48,
    status: 'on_sale'
  },
  {
    id: 'light-food-03',
    categoryId: 'light-food',
    name: '凯撒鸡肉沙拉',
    description: '罗马生菜、鸡胸肉和面包丁的经典组合',
    price: 35,
    image: '/菜品图/菜品3图/菜品3_04.jpg',
    tag: '轻食',
    sales: 59,
    status: 'on_sale'
  },
  {
    id: 'light-food-04',
    categoryId: 'light-food',
    name: '番茄牛肉贝果',
    description: '贝果夹牛肉、番茄和芝士，适合早午餐',
    price: 38,
    image: '/菜品图/菜品3图/菜品3_05.jpg',
    tag: '新品',
    sales: 36,
    status: 'on_sale'
  },

  {
    id: 'dessert-01',
    categoryId: 'dessert',
    name: '巴斯克芝士蛋糕',
    description: '芝士香气浓郁，表层微焦，口感绵密',
    price: 26,
    image: '/菜品图/菜品4图/菜品4_02.jpg',
    tag: '招牌',
    sales: 82,
    status: 'on_sale'
  },
  {
    id: 'dessert-02',
    categoryId: 'dessert',
    name: '提拉米苏杯',
    description: '咖啡酒香与奶油层次分明，入口轻盈',
    price: 24,
    image: '/菜品图/菜品4图/菜品4_03.jpg',
    tag: '咖啡味',
    sales: 57,
    status: 'on_sale'
  },
  {
    id: 'dessert-03',
    categoryId: 'dessert',
    name: '抹茶红豆卷',
    description: '抹茶微苦搭配红豆甜香，层次干净',
    price: 23,
    image: '/菜品图/菜品4图/菜品4_04.jpg',
    tag: '茶香',
    sales: 46,
    status: 'on_sale'
  },
  {
    id: 'dessert-04',
    categoryId: 'dessert',
    name: '可颂布丁',
    description: '可颂烘烤后吸满蛋奶液，外脆内软',
    price: 25,
    image: '/菜品图/菜品4图/菜品4_05.jpg',
    tag: '下午茶',
    sales: 39,
    status: 'on_sale'
  }
]

function getDefaultTemperatureOptions(categoryId) {
  if (categoryId === 'light-food' || categoryId === 'dessert') {
    return ['常温']
  }

  return ['热', '冰', '常温']
}

function getDefaultTasteOptions(categoryId) {
  if (categoryId === 'light-food') {
    return ['标准', '少酱', '不要酱']
  }

  if (categoryId === 'dessert') {
    return ['标准', '少甜']
  }

  return ['标准', '少糖', '无糖']
}

const dishes = rawDishes.map((dish) => ({
  ...dish,
  temperatureOptions: getDefaultTemperatureOptions(dish.categoryId),
  tasteOptions: getDefaultTasteOptions(dish.categoryId)
}))

module.exports = {
  categories,
  dishes
}
