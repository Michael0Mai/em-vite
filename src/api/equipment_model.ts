import request from '@/utils/request'

export interface modelParams { // 搜索用
    is_delete: boolean,
    name__icontains:string,
    cname__icontains:string,
    equipment_type:string,
    manufacturer:string
}

export interface modelParam { // 搜索用
  is_delete: boolean,
  name:string
}

export interface postModelType {
    name: string,
    cname: string,
    equipment_type:string,
    manufacturer:string
}

export const getModelData = (params: modelParams) => { // 读 or 搜索用
  return request({
    method: 'GET',
    url: '/equipment_manage/equipment_model/',
    params
  }).then(res => { return res.data })
}

export const searchModelName = (params: modelParam) => { // 搜索用
  return request({
    method: 'GET',
    url: '/equipment_manage/equipment_model_category/',
    params
  }).then(res => { return res.data })
}

export const getModelNames = () => { // 读 or 搜索用
  return request({
    method: 'GET',
    url: '/equipment_manage/equipment_model_category/'
  }).then(res => { return res.data })
}

export const getModel = (id: string) => {
  return request({
    method: 'GET',
    url: `/equipment_manage/equipment_model/${id}`
  }).then(res => { return res.data })
}

export const updateModel = (id:string, data: postModelType) => {
  return request({
    method: 'PATCH',
    url: `/equipment_manage/equipment_model/${id}`,
    data
  }).then(res => {
    return res.data
  }).catch((error) => {
    // console.log(error)
    return error
  })
}

export const createModel = (data: postModelType) => {
  return request({
    method: 'POST',
    url: '/equipment_manage/equipment_model/',
    data
  }).then(res => {
    return res.data
  }).catch((error) => {
    // console.log(error)
    return error
  })
}

export const deletModel = (id:string) => {
  return request({
    method: 'PATCH',
    url: `/equipment_manage/equipment_model/${id}`,
    data: {
      is_delete: true
    }
  }).then(res => { return res.data })
}
