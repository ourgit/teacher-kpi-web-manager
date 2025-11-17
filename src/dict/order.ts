//配送类型
export const deliveryType = [{
  value: 1,
  label: '自提'
}, {
  value: 2,
  label: '同城配送'
}, {
  value: 3,
  label: '堂食'
}, {
  value: 4,
  label: '邮寄'
}]


/** 格式化配送类型**/
export function formatDeliveryType(val: number) {
  const type = deliveryType.find(item => item.value === val)
  return type ? type.label : ''
}


//订单来源
export const orderSource = [{
  value: 1,
  label: '门店'
}, {
  value: 2,
  label: '小程序'
}, {
  value: 3,
  label: '美团'
}, {
  value: 4,
  label: '饿了么'
}]


/** 格式化订单来源**/
export function formatOrderSource(val: number) {
  const type = orderSource.find(item => item.value === val)
  return type ? type.label : ''
}
