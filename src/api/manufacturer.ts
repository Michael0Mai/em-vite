import request from '@/utils/request'

export interface manufacturerParams { // 搜索用
    is_delete: boolean,
    name__icontains:string,
    after_sales_charger__icontains:string,
    technical_support_charger__icontains:string
}

export interface manufacturerParam { // 搜索用
  is_delete: boolean,
  name:string
}

export interface postManufacturerType {
    name: string,
    web: string,
    after_sales_charger: string,
    after_sales_phone: string,
    technical_support_charger: string,
    technical_support_phone: string,
}

export const getManufacturerData = (params: manufacturerParams) => { // 读 or 搜索用
  return request({
    method: 'GET',
    url: '/equipment_manage/manufacturer/',
    params
  }).then(res => { return res.data })
}

export const searchManufacturerName = (params: manufacturerParam) => { // 读 or 搜索用
  return request({
    method: 'GET',
    url: '/equipment_manage/manufacturer_category/',
    params
  }).then(res => { return res.data })
}

export const getManufacturerNames = () => { // 读 or 搜索用
  return request({
    method: 'GET',
    url: '/equipment_manage/manufacturer_category/'
  }).then(res => { return res.data })
}

export const getManufacturer = (id: string) => {
  return request({
    method: 'GET',
    url: `/equipment_manage/manufacturer/${id}`
  }).then(res => { return res.data })
}

export const updateManufacturer = (id:string, data: postManufacturerType) => {
  return request({
    method: 'PATCH',
    url: `/equipment_manage/manufacturer/${id}`,
    data
  }).then(res => {
    return res.data
  }).catch((error) => {
    // console.log(error)
    return error
  })
}

export const createManufacturer = (data: postManufacturerType) => {
  return request({
    method: 'POST',
    url: '/equipment_manage/manufacturer/',
    data
  }).then(res => {
    return res.data
  }).catch((error) => {
    // console.log(error)
    return error
  })
}

export const deleteManufacturer = (id:string) => {
  return request({
    method: 'PATCH',
    url: `/equipment_manage/manufacturer/${id}`,
    data: {
      is_delete: true
    }
  }).then(res => { return res.data })
}
