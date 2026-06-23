# 云函数接口清单

## getMenu

用途：获取门店菜单、分类和菜品列表。

入参：

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| store_id | string | 是 | 门店 ID |
| table_id | string | 否 | 桌台 ID，用于回显桌号 |

出参：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| store | object | 门店信息 |
| table | object | 桌台信息 |
| categories | array | 分类列表 |
| dishes | array | 菜品列表 |

## createOrder

用途：顾客提交订单并生成订单记录。

入参：

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| store_id | string | 是 | 门店 ID |
| table_id | string | 是 | 桌台 ID |
| remark | string | 否 | 顾客备注 |
| items | array | 是 | 菜品列表，包含 dish_id 和 quantity |

出参：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| order_id | string | 订单 ID |
| order_no | string | 订单编号 |
| total_amount | number | 订单金额 |
| status | string | 订单状态，初始为 pending_payment |

## getMerchantOrders

用途：商家获取今日订单列表。

入参：

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| store_id | string | 是 | 门店 ID |
| status | string | 否 | 订单状态筛选 |
| date | string | 否 | 日期，默认今日 |

出参：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| orders | array | 订单列表，包含桌号、金额、状态、下单时间 |

## updateOrderStatus

用途：商家更新订单状态。

入参：

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| order_id | string | 是 | 订单 ID |
| action | string | 是 | pay_success、accept、complete、cancel |

出参：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| order_id | string | 订单 ID |
| status | string | 更新后的订单状态 |
| updated_at | date | 更新时间 |

状态规则：

- pay_success：pending_payment 更新为 paid。
- accept：paid 更新为 accepted。
- complete：accepted 更新为 completed。
- cancel：允许 pending_payment 或 paid 更新为 cancelled。

## getStats

用途：获取商家今日统计数据。

入参：

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| store_id | string | 是 | 门店 ID |
| date | string | 否 | 日期，默认今日 |

出参：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| order_count | number | 今日订单数 |
| completed_order_count | number | 今日已完成订单数 |
| total_sales | number | 今日销售额 |
| pending_count | number | 待接单订单数 |

## 接口边界

- 第一版接口只服务单门店。
- 第一版支付成功由模拟动作触发，不调用微信支付。
- 第一版不提供配送接口。
- 第一版不提供会员接口。
- 第一版不提供库存接口。
- 第一版不提供打印机接口。

