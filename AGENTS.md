# 轻量堂食扫码点餐小程序开发说明

## 一、项目定位

本项目是一个「轻量堂食扫码点餐微信小程序 Demo」。

目标不是开发一个完整餐饮 SaaS，而是先做出一个可以演示、可以复用、可以作为后续客户交付模板的 MVP。

第一版重点是跑通核心闭环：

顾客扫码进入 → 浏览菜单 → 加入购物车 → 确认订单 → 模拟支付成功 → 商家端接单 → 商家完成订单 → 查看简单营业统计。

## 二、技术路线

本项目使用：

* 微信原生小程序
* 原生 WXML / WXSS / JS
* 微信云开发 CloudBase
* 第一阶段先使用本地 Mock 数据
* 后续再接入云数据库和云函数

第一版不要使用：

* Vue / React / Taro / UniApp
* 第三方 UI 组件库
* 独立 Node.js 后端
* 独立 Web 管理后台
* 真实微信支付
* 复杂构建工具

## 三、MVP 功能范围

### 本期要做

顾客端：

* 门店首页
* 桌号识别展示
* 菜单分类展示
* 菜品列表展示
* 商品加购
* 购物车
* 确认订单
* 模拟支付
* 订单详情
* 订单状态查看

商家端：

* 商家首页
* 今日数据概览
* 订单列表
* 接单
* 完成订单
* 菜品上下架
* 简单销售统计

数据能力：

* 本地 Mock 菜单数据
* 后续接 CloudBase 云数据库
* 后续接云函数创建订单、更新订单状态、读取统计数据

## 四、第一版明确不做

第一版不要开发以下功能：

* 真实微信支付
* 退款
* 配送
* 外卖
* 骑手系统
* 会员系统
* 储值卡
* 积分
* 优惠券
* 库存系统
* 打印机
* 多门店
* 分账
* 复杂权限系统
* 菜品图片上传
* 复杂规格管理
* 独立 Web 后台
* 数据大屏
* 营销活动系统

除非用户明确要求，否则不要主动添加这些功能。

## 五、开发原则

### 1. 小步提交

每次只完成一个明确任务，不要一次性开发完整系统。

优先顺序：

1. 项目文档
2. 最小可运行骨架
3. 首页视觉
4. 菜单页 Mock
5. 购物车
6. 确认订单
7. 模拟支付
8. 商家订单管理
9. 云开发接入
10. 简单统计

### 2. 先 Mock，后数据库

在顾客端流程没有跑通前，不要急着接 CloudBase。

优先用本地 Mock 数据完成页面和交互。

### 3. 先闭环，后美化

页面需要干净、清晰、真实，但不要为了视觉效果引入复杂组件库。

优先保证流程可用。

### 4. 不要擅自扩大需求

如果任务是“开发菜单页”，就只开发菜单页。

不要顺手开发订单页、商家端、支付、数据库。

### 5. 每次改动后说明变更

每次完成任务后，必须说明：

* 修改了哪些文件
* 新增了哪些文件
* 实现了哪些功能
* 如何在微信开发者工具中验证
* 当前遗留 TODO
* 下一步建议

## 六、视觉风格

项目整体视觉方向：

* 干净
* 轻量
* 现代
* 卡片式
* 圆角
* 留白充足
* 适合咖啡店、轻食店、奶茶店、小餐馆

建议色值：

* 主色：#D77A32
* 辅助色：#FFB26B
* 背景色：#F7F7F7
* 卡片色：#FFFFFF
* 主文字：#222222
* 次文字：#777777
* 边框色：#EEEEEE

页面要求：

* 不要贴边，左右保留 24rpx 到 32rpx 间距
* 卡片圆角建议 24rpx
* 按钮高度适合移动端点击
* 价格信息要突出
* 底部操作栏要考虑 iPhone 安全区域
* 顾客端要有真实门店质感
* 商家端要清楚、工具化、高效率

## 七、页面规划

### 顾客端页面

1. 首页 `pages/index/index`

用途：

* 展示门店信息
* 展示桌号
* 展示营业状态
* 展示公告
* 入口：开始点餐

2. 菜单页 `pages/menu/menu`

用途：

* 左侧分类
* 右侧菜品
* 加入购物车
* 底部购物车栏

3. 购物车页 `pages/cart/cart`

用途：

* 查看已选商品
* 调整数量
* 清空购物车
* 去确认订单

4. 确认订单页 `pages/order-confirm/order-confirm`

用途：

* 展示桌号
* 展示商品明细
* 填写备注
* 模拟支付

5. 订单详情页 `pages/order-detail/order-detail`

用途：

* 展示订单状态
* 展示商品明细
* 展示下单时间
* 展示桌号

### 商家端页面

1. 商家首页 `pages/merchant-home/merchant-home`

用途：

* 今日订单数
* 今日营业额
* 待处理订单
* 进入订单管理

2. 商家订单页 `pages/merchant-orders/merchant-orders`

用途：

* 查看新订单
* 接单
* 完成订单
* 查看订单详情

3. 菜品管理页 `pages/merchant-dishes/merchant-dishes`

用途：

* 查看菜品列表
* 上架 / 下架
* 修改价格

4. 统计页 `pages/merchant-stats/merchant-stats`

用途：

* 今日订单数
* 今日营业额
* 热销商品 Top 5

## 八、数据模型规划

第一版后续接 CloudBase 时，使用以下集合。

### stores

门店信息。

核心字段：

* _id
* name
* logo
* address
* phone
* businessHours
* status
* announcement
* createdAt
* updatedAt

### tables

桌号信息。

核心字段：

* _id
* storeId
* tableNo
* qrCode
* status
* createdAt

### categories

菜品分类。

核心字段：

* _id
* storeId
* name
* sort
* status
* createdAt

### dishes

菜品信息。

核心字段：

* _id
* storeId
* categoryId
* name
* description
* price
* image
* tag
* sales
* status
* sort
* createdAt
* updatedAt

### orders

订单主表。

核心字段：

* _id
* storeId
* tableNo
* userId
* status
* totalAmount
* remark
* payStatus
* createdAt
* updatedAt

### order_items

订单明细。

核心字段：

* _id
* orderId
* dishId
* dishName
* price
* quantity
* options
* subtotal

### merchant_users

商家用户。

核心字段：

* _id
* storeId
* openid
* role
* name
* status
* createdAt

## 九、订单状态

第一版订单状态先保持简单：

* `paid`：已支付，等待商家接单
* `accepted`：商家已接单 / 制作中
* `completed`：已完成
* `cancelled`：已取消

第一版使用模拟支付，提交订单后直接进入 `paid` 状态。

不要在第一版增加复杂状态，例如退款中、已退款、配送中、待评价等。

## 十、云函数规划

后续接 CloudBase 时，规划以下云函数。

### getMenu

用途：

读取当前门店的菜单分类和菜品。

入参：

* storeId

出参：

* categories
* dishes

### createOrder

用途：

创建订单。

入参：

* storeId
* tableNo
* items
* totalAmount
* remark

出参：

* orderId
* status

### getMerchantOrders

用途：

商家端读取订单列表。

入参：

* storeId
* status

出参：

* orders

### updateOrderStatus

用途：

更新订单状态。

入参：

* orderId
* status

出参：

* success

### getStats

用途：

读取今日统计数据。

入参：

* storeId
* date

出参：

* todayOrderCount
* todayRevenue
* pendingOrderCount
* completedOrderCount
* topDishes

## 十一、代码约束

### 文件结构

尽量保持结构清晰：

```text
/
├── app.js
├── app.json
├── app.wxss
├── pages/
├── components/
├── utils/
├── cloudfunctions/
├── docs/
├── AGENTS.md
└── README.md
```

### 样式

* 全局通用样式写在 `app.wxss`
* 页面私有样式写在对应页面的 `.wxss`
* 不要在多个页面重复定义完全相同的基础样式
* 尽量复用全局卡片、按钮、价格、标题等样式

### 命名

* 页面目录使用小写和连字符
* 云函数使用小驼峰
* 数据字段使用小驼峰
* 状态值使用英文字符串

### 注释

必要时添加简洁注释，但不要写大量无意义注释。

## 十二、测试要求

每完成一个阶段，需要至少验证：

* 微信开发者工具是否编译成功
* 控制台是否有明显报错
* 页面是否能正常进入
* 核心按钮是否能点击
* 数据是否正确展示
* 金额计算是否正确
* 页面底部是否被安全区域遮挡

菜单页需要验证：

* 分类切换正常
* 商品展示正常
* 点击加购后数量增加
* 总金额计算正确
* 空购物车不能结算

订单页需要验证：

* 商品明细正确
* 桌号正确
* 备注正确
* 模拟支付后生成订单
* 订单详情展示正确

商家端需要验证：

* 新订单能展示
* 接单后状态变化
* 完成后状态变化
* 统计数据能更新

## 十三、与用户沟通方式

完成任务后，不要只说“已完成”。

必须输出：

1. 本次完成内容
2. 修改文件列表
3. 运行或验证方法
4. 注意事项
5. 下一步建议

如果发现需求不清晰，先指出风险，再给出推荐方案。

如果发现当前任务可能导致需求扩大，先停止并提醒用户确认。

## 十四、当前开发阶段建议

当前推荐阶段顺序：

1. 创建或完善项目文档
2. 修复最小可运行小程序骨架
3. 建立首页 UI 风格
4. 开发菜单页 Mock 版本
5. 开发购物车和确认订单
6. 开发模拟支付和订单详情
7. 开发商家订单管理
8. 接入 CloudBase 数据库
9. 接入云函数
10. 开发简单统计
11. 整理 Demo 和交付材料

不要跳步开发复杂功能。
