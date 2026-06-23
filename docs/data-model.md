# 数据模型

## stores 门店集合

用于保存单门店基础信息。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| _id | string | 门店 ID |
| name | string | 门店名称 |
| logo | string | 门店 Logo 图片地址 |
| phone | string | 联系电话 |
| address | string | 门店地址 |
| business_hours | string | 营业时间 |
| status | string | 门店状态：open、closed |
| created_at | date | 创建时间 |
| updated_at | date | 更新时间 |

## tables 桌台集合

用于保存堂食桌号和二维码参数。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| _id | string | 桌台 ID |
| store_id | string | 所属门店 ID |
| table_no | string | 桌号，例如 A01 |
| qr_scene | string | 二维码参数 |
| status | string | 桌台状态：enabled、disabled |
| created_at | date | 创建时间 |
| updated_at | date | 更新时间 |

## categories 菜品分类集合

用于保存菜单分类。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| _id | string | 分类 ID |
| store_id | string | 所属门店 ID |
| name | string | 分类名称 |
| sort_order | number | 排序值 |
| status | string | 状态：enabled、disabled |
| created_at | date | 创建时间 |
| updated_at | date | 更新时间 |

## dishes 菜品集合

用于保存菜品信息。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| _id | string | 菜品 ID |
| store_id | string | 所属门店 ID |
| category_id | string | 所属分类 ID |
| name | string | 菜品名称 |
| image | string | 菜品图片地址 |
| description | string | 菜品简介 |
| price | number | 售价，单位元 |
| unit | string | 单位，例如份 |
| status | string | 状态：on_sale、off_sale |
| sort_order | number | 排序值 |
| created_at | date | 创建时间 |
| updated_at | date | 更新时间 |

## orders 订单集合

用于保存订单主信息。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| _id | string | 订单 ID |
| order_no | string | 订单编号 |
| store_id | string | 所属门店 ID |
| table_id | string | 桌台 ID |
| table_no | string | 桌号冗余字段 |
| status | string | pending_payment、paid、accepted、completed、cancelled |
| total_amount | number | 订单总金额 |
| remark | string | 顾客备注 |
| paid_at | date | 模拟支付成功时间 |
| accepted_at | date | 商家接单时间 |
| completed_at | date | 完成时间 |
| created_at | date | 创建时间 |
| updated_at | date | 更新时间 |

## order_items 订单明细集合

用于保存订单中的菜品明细。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| _id | string | 明细 ID |
| order_id | string | 订单 ID |
| dish_id | string | 菜品 ID |
| dish_name | string | 下单时菜品名称 |
| dish_image | string | 下单时菜品图片 |
| price | number | 下单时单价 |
| quantity | number | 数量 |
| subtotal | number | 小计金额 |
| created_at | date | 创建时间 |

## merchant_users 商家用户集合

用于保存商家端可访问用户。

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| _id | string | 商家用户 ID |
| store_id | string | 所属门店 ID |
| openid | string | 微信 openid |
| name | string | 用户姓名 |
| role | string | 角色：owner、staff |
| status | string | 状态：enabled、disabled |
| created_at | date | 创建时间 |
| updated_at | date | 更新时间 |

## 数据边界

- 第一版只支持一个门店。
- 第一版不记录会员信息。
- 第一版不记录库存数量。
- 第一版不记录配送地址。
- 第一版不保存真实支付流水。
- 第一版不保存打印任务。

