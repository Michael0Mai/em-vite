import request from '@/utils/request'

export interface typeParams { // 搜索用
    is_delete: boolean,
    name__icontains:string
}

export interface typeParam { // 搜索用
  is_delete: boolean,
  name:string
}

export interface postType {
    name: string
}

export const getTypeData = (params: typeParams) => { // 读 or 搜索用
  return request({
    method: 'GET',
    url: '/equipment_manage/equipment_type/',
    params
  }).then(res => { return res.data })
}

export const searchTypeNames = (params: typeParam) => { // 搜索用
  return request({
    method: 'GET',
    url: '/equipment_manage/equipment_type_category/',
    params
  }).then(res => { return res.data })
}

export const getTypeNames = () => { // 读
  return request({
    method: 'GET',
    url: '/equipment_manage/equipment_type_category/',
  }).then(res => { return res.data })
}

export const getType = (id: string) => {
  return request({
    method: 'GET',
    url: `/equipment_manage/equipment_type/${id}`
  }).then(res => { return res.data })
}

export const updateType = (id:string, data: postType) => {
  return request({
    method: 'PATCH',
    url: `/equipment_manage/equipment_type/${id}`,
    data
  }).then(res => {
    return res.data
  }).catch((error) => {
    // console.log(error)
    return error
  })
}

export const createType = (data: postType) => {
  return request({
    method: 'POST',
    url: '/equipment_manage/equipment_type/',
    data
  }).then(res => {
    return res.data
  }).catch((error) => {
    // console.log(error)
    return error
  })
}

export const deletType = (id:string) => {
  return request({
    method: 'PATCH',
    url: `/equipment_manage/equipment_type/${id}`,
    data: {
      is_delete: true
    }
  }).then(res => { return res.data })
}
