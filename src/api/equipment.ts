import request from '@/utils/request'

export interface equipmentParams { // 搜索用
    is_delete: boolean,
    serial_number:number,
    cname__icontains:string,
    model:string,
    status:string,
    charger:string
}

export interface postEquipmentType {
    serial_number:number,
    cname: string,
    model:string,
    status:string,
    performance:string,
    charger:string,
    price:number
    purchase_date:string,
    remark:string,
}

export const getEquipmentData = (params: equipmentParams) => { // 读 or 搜索用
  return request({
    method: 'GET',
    url: '/equipment_manage/equipment/',
    params
  }).then(res => { return res.data })
}

export const getEquipment = (id: string) => {
  return request({
    method: 'GET',
    url: `/equipment_manage/equipment/${id}`
  }).then(res => { return res.data })
}

export const updateEquipment = (id:string, data: postEquipmentType) => {
  return request({
    method: 'PATCH',
    url: `/equipment_manage/equipment/${id}`,
    data
  }).then(res => {
    return res.data
  }).catch((error) => {
    // console.log(error)
    return error
  })
}

export const createEquipment = (data: postEquipmentType) => {
  return request({
    method: 'POST',
    url: '/equipment_manage/equipment/',
    data
  }).then(res => {
    return res.data
  }).catch((error) => {
    // console.log(error)
    return error
  })
}

export const deletEquipment = (id:string) => {
  return request({
    method: 'PATCH',
    url: `/equipment_manage/equipment/${id}`,
    data: {
      is_delete: true
    }
  }).then(res => { return res.data })
}
