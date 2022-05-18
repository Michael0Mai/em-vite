import request from '@/utils/request'

// export interface statusParams { // 搜索用
//     is_delete: boolean,
//     name__icontains:string
// }

export interface statusParam { // 搜索用
  is_delete: boolean,
  status:string
}

export interface postStatus {
  status: string
}

export const getStatusData = (params: statusParam) => { // 读 or 搜索用
  return request({
    method: 'GET',
    url: '/equipment_manage/equipment_status/',
    params
  }).then(res => { return res.data })
}

export const searchStatusNames = (params: statusParam) => { // 读 or 搜索用
  return request({
    method: 'GET',
    url: '/equipment_manage/equipment_status/',
    params
  }).then(res => { return res.data })
}

export const getStatus = (id: string) => {
  return request({
    method: 'GET',
    url: `/equipment_manage/equipment_status/${id}`
  }).then(res => { return res.data })
}

export const updateStatus = (id:string, data: postStatus) => {
  return request({
    method: 'PATCH',
    url: `/equipment_manage/equipment_status/${id}`,
    data
  }).then(res => {
    return res.data
  }).catch((error) => {
    // console.log(error)
    return error
  })
}

export const createStatus = (data: postStatus) => {
  return request({
    method: 'POST',
    url: '/equipment_manage/equipment_status/',
    data
  }).then(res => {
    return res.data
  }).catch((error) => {
    // console.log(error)
    return error
  })
}

export const deletStatus = (id:string) => {
  return request({
    method: 'PATCH',
    url: `/equipment_manage/equipment_status/${id}`,
    data: {
      is_delete: true
    }
  }).then(res => { return res.data })
}
