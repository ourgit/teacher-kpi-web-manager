//用户类型
export const driverType = [{
  value: 1,
  label: '全日制'
}, {
  value: 2,
  label: '非全日制'
}, {
  value: 3,
  label: '兼职'
}, {
  value: 4,
  label: '临时'
}]


/** 格式化用户类型**/
export function formatDriverType(val: number) {
  const type = driverType.find(item => item.value === val)
  return type ? type.label : ''
}

