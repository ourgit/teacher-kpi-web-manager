import request from '@/utils/request'

/**
 * 获取支付方式列表
 */
export function getPayMethodList(params?: object) {
  return new Promise((resolve) => {
    request({
      url: '/v1/tk/pay_method_list/',
      method: 'get',
      params,
    }).then((data) => {
      resolve(data)
    })
  })
}

/**
 * 添加支付方式
 */
export function addPayMethod(data: object) {
  return request({
    url: '/v1/tk/pay_method/new/',
    method: 'post',
    data,
  })
}

//删除支付方式
export function delPayMethod(data: any) {
  return request({
    url: '/v1/tk/pay_method/',
    method: 'post',
    data: {
      id: data.id,
      operation: 'del',
    },
  })
}
