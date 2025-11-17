import request from '@/utils/request'
import { AnyAaaaRecord } from 'dns'


export function getPrintTemplateList(data: object) {
  return request({
    url: '/v1/cp/org_print_template_list/',
    method: 'post',
    data,
  })
}

export function addPrintTemplate(data: object) {
  return request({
    url: '/v1/cp/org/org_print_template/new/',
    method: 'post',
    data,
  })
}


export function getPrintTemplateDetail(data: any) {
  return request({
    url: `/v1/cp/org_print_template_list/${data.id}/`,
    method: 'get',
    params: {},
  })
}


export function delPrintTemplate(data: any) {
  return request({
    url: '/v1/cp/org_print_template/',
    method: 'post',
    data: {
      id: data.id,
      operation: 'del'
    }
  })
}

export function updatePrintTemplate(data: any) {
  return request({
    url: `/v1/cp/org_print_template/${data.id}/`,
    method: 'post',
    data,
  })
}
