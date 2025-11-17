import request from '@/utils/request'
import { AxiosRequestConfig } from 'axios'

// 支持传入额外的 axios 配置（例如 responseType: 'arraybuffer' 用于下载 xlsx）
export function getCommissionExportList(data: object, config?: AxiosRequestConfig) {
  return request({
    url: '/v1/cp/commission_export/',
    method: 'post',
    data,
    ...(config || {}),
  })
}
