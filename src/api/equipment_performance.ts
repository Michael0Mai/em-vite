import request from '@/utils/request'

// export interface performanceParams { // 搜索用
//     is_delete: boolean,
//     name__icontains:string
// }

export interface performanceParam { // 搜索用
  is_delete: boolean,
  performance:string
}

export interface postPerformance {
  performance: string
}

export const getPerformanceData = (params: performanceParam) => { // 读 or 搜索用
  return request({
    method: 'GET',
    url: '/equipment_manage/equipment_performance/',
    params
  }).then(res => { return res.data })
}

export const searchPerformanceNames = (params: performanceParam) => { // 读 or 搜索用
  return request({
    method: 'GET',
    url: '/equipment_manage/equipment_performance/',
    params
  }).then(res => { return res.data })
}

export const getPerformance = (id: string) => {
  return request({
    method: 'GET',
    url: `/equipment_manage/equipment_performance/${id}`
  }).then(res => { return res.data })
}

export const updatePerformance = (id:string, data: postPerformance) => {
  return request({
    method: 'PATCH',
    url: `/equipment_manage/equipment_performance/${id}`,
    data
  }).then(res => {
    return res.data
  }).catch((error) => {
    // console.log(error)
    return error
  })
}

export const createPerformance = (data: postPerformance) => {
  return request({
    method: 'POST',
    url: '/equipment_manage/equipment_performance/',
    data
  }).then(res => {
    return res.data
  }).catch((error) => {
    // console.log(error)
    return error
  })
}

export const deletPerformance = (id:string) => {
  return request({
    method: 'PATCH',
    url: `/equipment_manage/equipment_performance/${id}`,
    data: {
      is_delete: true
    }
  }).then(res => { return res.data })
}
