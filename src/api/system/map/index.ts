import jsonp from '@/utils/jsonp'
import md5 from 'js-md5'

const key = 'ZEGBZ-VMVRJ-23SFU-KJ4BC-JR76V-DTBRH'
const sk = 'yGDPUXEbAlHnHXLOKcrHGDGMuz2ZdA9'
const output = 'jsonp'

// 关键词输入提醒
export function keywordSearch(params: any) {
  const url = '/ws/place/v1/suggestion/'
  const keyword = encodeURIComponent(params.keyword)
  const callback =
    `showKeyword_${new Date().getTime()}` +
    `${Math.random().toString().replace(/\D/g, '')}`
  const sn = md5(
    encodeURIComponent(
      `${url}?callback=${callback}&keyword=${keyword}&output=${output}&key=${key}${sk}`
    )
  )
  return jsonp(
    'https://apis.map.qq.com/ws/place/v1/suggestion/',
    {
      keyword,
      output,
      key,
      sn,
    },
    callback
  )
}

//根据经纬度转换地址
export function getDetailByLocation(params: any) {
  console.log(params)
  const url = '/ws/geocoder/v1/'
  const location = params.location
  const callback =
    `getAddress${new Date().getTime()}` +
    `${Math.random().toString().replace(/\D/g, '')}`
  const sn = md5(
    encodeURIComponent(
      `${url}?callback=${callback}&location=${location}&output=${output}&key=${key}${sk}`
    )
  )
  return jsonp(
    'https://apis.map.qq.com/ws/geocoder/v1/',
    {
      location,
      output,
      key,
      sn,
    },
    callback
  )
}
