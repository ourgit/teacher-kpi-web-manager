//用户类型
export const userType = [{
  value: 1,
  label: '普通用户'
}, {
  value: 10,
  label: '营业员'
}, {
  value: 20,
  label: '店长'
}, {
  value: 30,
  label: '老板'
}]


/** 格式化用户类型**/
export function formatUserType(val: number) {
  const type = userType.find(item => item.value === val)
  return type ? type.label : ''
}

