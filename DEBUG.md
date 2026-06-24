# Debug Report — 扫码点餐小程序

> 审查日期：2026-06-24
> 审查范围：全项目（顾客端 + 商家端 + 数据层 + 全局架构）

---

## Bug #1 🔴 菜单页菜品详情弹窗 — 温度和口味选项不渲染

**文件**：`pages/customer/menu/menu.js`
**严重度**：🔴 Critical — UI 功能阻断

**现象**：点击菜单页的菜品 → 弹出详情弹窗 → 温度和口味选项区域完全空白。

**根因**：`data` 中 `temperatureOptions` 和 `tasteOptions` 初始化为空数组，`openDishDetailById()` 打开弹窗时没有把选中菜品的 options 同步进去。

```js
// menu.js line 18-19 — 永远是空数组
data: {
    temperatureOptions: [],
    tasteOptions: [],
}

// menu.js openDishDetailById — 缺少同步
this.setData({
    activeCategoryId: selectedDish.categoryId,
    selectedDish,
    // ❌ 缺少这两行：
    // temperatureOptions: selectedDish.temperatureOptions,
    // tasteOptions: selectedDish.tasteOptions,
    ...
})
```

**修复方向**：在 `openDishDetailById()` 和 `openCartItemEditor()` 的 `setData` 中加上从 `selectedDish` 读取 options 的逻辑。同时也要在 `handleTemperatureTap` / `handleTasteTap` 中考虑默认值是否在选项中。

**涉及文件**：
- `pages/customer/menu/menu.js` — 需修改 `openDishDetailById`、`openCartItemEditor`
- `pages/customer/menu/menu.js` — `getDefaultTemperature` 应改为取 dish.temperatureOptions[0] 而非硬编码

---

## Bug #2 🔴 订单时间戳格式不一致

**文件**：`utils/mockOrderStore.js`
**严重度**：🔴 Medium — 数据质量

**现象**：同一个 order 对象里混用两种时间格式。

```js
// order-confirm.js 创建时 — number timestamp
{
    paidAt: Date.now(),          // 1719234567890
    createdAt: Date.now()        // 1719234567890
}

// mockOrderStore.js updateOrderStatus — ISO string
const now = new Date().toISOString()  // "2026-06-24T08:00:00.000Z"
{
    acceptedAt: now,    // ISO string ❌
    completedAt: now    // ISO string ❌
}
```

**修复方向**：将 `mockOrderStore.js` 第 31 行的 `new Date().toISOString()` 改为 `Date.now()`，统一用 number timestamp。

**涉及文件**：
- `utils/mockOrderStore.js` — 第 31 行，`const now = new Date().toISOString()` → `const now = Date.now()`

---

## Bug #3 🔴 `app.js` 应用入口完全为空

**文件**：`app.js`
**严重度**：🔴 Low (当前可跑，长期技术债)

**现象**：

```js
App({})
```

缺失：
- `onLaunch` 生命周期函数 — 小程序冷启动初始化
- `globalData` — 全局共享数据（当前门店 ID、桌号等）
- CloudBase 初始化 — `wx.cloud.init({ env: '...' })`

**修复方向**：

```js
App({
  onLaunch() {
    // 后续接入 CloudBase 时取消注释
    // wx.cloud.init({ env: 'your-env-id' })
  },
  globalData: {
    storeId: 'store_001',
    storeName: '巷口咖啡'
  }
})
```

---

## Bug #4 🟡 `updateOrderStatus` 不校验状态转换合法性

**文件**：`utils/mockOrderStore.js` — `updateOrderStatus` 函数
**严重度**：🟡 Medium — 业务逻辑

**现象**：商家可以直接把 `paid` 订单标记为 `completed`（跳过 `accepted`），也可以重复完成一个已完成订单。

**期望行为**（PRD 第 8.2 节）：

```
paid → accepted → completed
paid → cancelled（本期可暂不做）
```

**修复方向**：在 `updateOrderStatus` 开头加状态机校验：

```js
const VALID_TRANSITIONS = {
  paid: ['accepted', 'cancelled'],
  accepted: ['completed']
  // completed 和 cancelled 不允许再变更
}

function updateOrderStatus(orderNo, status) {
  const order = getOrders().find(o => o.orderNo === orderNo)
  if (!order) return null
  
  const allowed = VALID_TRANSITIONS[order.status] || []
  if (!allowed.includes(status)) {
    return null  // 非法转换
  }
  // ... 继续更新
}
```

**涉及文件**：`utils/mockOrderStore.js`

---

## Bug #5 🟡 `handleQuickAddDish` 默认规格可能与菜品动态选项不匹配

**文件**：`pages/customer/menu/menu.js`
**严重度**：🟡 Low-Medium

**现象**：快捷加购（点 + 按钮）时，温度和口味用硬编码默认值：

```js
temperature: this.getDefaultTemperature(dish)  // 硬编码返回 '热' 或 '常温'
taste: this.getDefaultTaste(dish)              // 需确认方法是否存在
```

如果某菜品的 `temperatureOptions` 是 `['冰', '去冰']`（不包含 `'热'`），默认值就不在可选项中。

**修复方向**：`getDefaultTemperature` 和 `getDefaultTaste` 改为取菜品 `temperatureOptions[0]` / `tasteOptions[0]`。

**涉及文件**：`pages/customer/menu/menu.js`

---

## Bug #6 🟡 `handleClearCart` 隐式依赖副作用清 Storage

**文件**：`pages/customer/menu/menu.js`
**严重度**：🟡 Low — 代码健壮性

**现象**：

```js
handleClearCart() {
  this.setData({ cartItems: [], showCartPreview: false }, () => {
    this.refreshCartSummary()  // 副作用：里面会 wx.setStorageSync(CART_STORAGE_KEY, [])
    this.refreshCurrentDishes()
  })
}
```

清空购物车的逻辑依赖 `refreshCartSummary` 的副作用来写 Storage。功能上正确，但不够显式。

**修复方向**：在 `handleClearCart` 中显式清除 Storage：

```js
wx.removeStorageSync(CART_STORAGE_KEY)
// 或
wx.setStorageSync(CART_STORAGE_KEY, [])
```

**涉及文件**：`pages/customer/menu/menu.js`

---

## 全局架构待办

| 项目 | 状态 | 说明 |
|---|---|---|
| `app.wxss` 全局样式 | ✅ 已完成 | `app-card`, `app-btn-primary`, `app-price` 等 7 个全局类已定义 |
| `app.js` 初始化 | ❌ 待做 | Bug #3 |
| 数据层抽取 | ✅ 已完成 | `mockDishStore` + `mockOrderStore` |
| 顾客端闭环 | ✅ 可运行 | Bug #1 修完后完全闭环 |
| 商家端闭环 | ✅ 可运行 | 接单/完成/菜品管理/统计均已实现 |
| CloudBase 接入 | ❌ 未开始 | 当前纯本地 Storage |
| 旧 `pages/index/` 清理 | ❌ 待办 | 死代码需删除 |
| `project.private.config.json` 入 .gitignore | ❌ 待办 | 私有配置不应提交 |

codex reply:

我读了 mini app/DEBUG.md 并核对了代码，结论如下：

   DEBUG 项                                 是否存在    结论
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  ━━━━━━━━━━  ━━━━━━━━━━━━━━━━━━━━━━━━━
   Bug #1 菜单弹窗口味/温度不显示                 否    已不存在，mini app/
                                                        pages/customer/menu/
                                                        menu.js 里已经把
                                                        temperatureOptions /
                                                        tasteOptions 写入弹窗数
                                                        据
  ───────────────────────────────────────  ──────────  ─────────────────────────
   Bug #2 时间格式不一致                          是    mini app/utils/
                                                        mockOrderStore.js 里更
                                                        新状态用的是 new
                                                        Date().toISOString()，
                                                        而下单时间是 Date.now()
  ───────────────────────────────────────  ──────────  ─────────────────────────
   Bug #3 app.js 为空                             是    mini app/app.js 目前仍
                                                        是最小 App({})
  ───────────────────────────────────────  ──────────  ─────────────────────────
   Bug #4 订单状态缺少流转校验                    是    updateOrderStatus 可以
                                                        把订单直接改成任意状态
  ───────────────────────────────────────  ──────────  ─────────────────────────
   Bug #5 快速加购默认规格不匹配动态选项          否    已不存在，快速加购会从
                                                        菜品自身的选项取默认值
  ───────────────────────────────────────  ──────────  ─────────────────────────
   Bug #6 清空购物车依赖副作用                    是    功能上可用，但代码确实
                                                        依赖
                                                        refreshCartSummary() 顺
                                                        带清空本地缓存，不够直
                                                        接
  ───────────────────────────────────────  ──────────  ─────────────────────────
   旧页面目录清理                                 否    当前没有发现旧的 pages/
                                                        index、pages/menu 目录
  ───────────────────────────────────────  ──────────  ─────────────────────────
   project.private.config.json 忽略               是    mini app/.gitignore 目
                                                        前没有忽略该文件

  当前只是确认问题，没有修改代码。建议下一步优先修复 Bug #2、#4、#6，这三个会影
  响后续订单状态和商家端流程的稳定性。
