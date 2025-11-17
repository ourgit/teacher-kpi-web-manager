/** 格式化金额**/
export function parseMoney(e: any) {
  let flag = false
  if (e < 0) {
    flag = true
    e = -e
  }
  e = (e < 10 ? '0' + e : e) || 0
  const arr = String(e).split('').reverse()
  let tmp = [] as any
  arr.forEach((item, index, arr) => {
    tmp.push(item)
    if (index === 1) {
      tmp.push('.')
      if (index === arr.length - 1) {
        tmp.push('0')
      }
    } else if (
      (index - 1) % 3 === 0 &&
      index !== arr.length - 1 &&
      arr[index + 1] !== '-'
    ) {
      tmp.push(',')
    }
  })
  if (Number(tmp[0]) === 0 && Number(tmp[1]) === 0) {
    tmp = tmp.slice(3)
  } else if (Number(tmp[0]) === 0 && tmp[2] === '.') {
    tmp = tmp.slice(1)
  }
  let data = tmp.reverse().join('')
  if (flag) {
    data = '-' + data
  }
  return data
}

/** 格式化销量**/
export function formatVolume(num: number) {
  return num >= 1e4 ? (num / 1e4).toFixed(1) + '万' : num
}

/** 格式化订单状态**/
export function formatOrderStatus(status: number) {
  let statusName = ''
  switch (status) {
    case 1:
      statusName = '待支付'
      break
    case 3:
      statusName = '已支付'
      break
    case 4:
      statusName = '寄售中'
      break
    case 5:
      statusName = '已上链'
      break
    case 7:
      statusName = '已售出'
      break
    case -1:
      statusName = '过期失效'
      break
    case -4:
      statusName = '已取消订单'
      break
    default:
      statusName = '未知'
  }
  return statusName
}


/** 格式化提现状态订**/
export function formatWithdrawStatus(status: number) {
  let statusName = ''
  switch (status) {
    case 0:
      statusName = '申请中'
      break
    case 1:
      statusName = '已同意'
      break
    case 2:
      statusName = '已转帐'
      break
    case 3:
      statusName = '审核不通过'
      break
    case -1:
      statusName = '拒绝'
      break
    default:
      statusName = '未知'
  }
  return statusName
}