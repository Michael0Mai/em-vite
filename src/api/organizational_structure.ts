import request from '@/utils/request'
import type {
  departmentParams,
  departmentType,
  postdepartmentType,
  staffParams,
  postStaffType
} from './types'

export const getStaffData = (params:staffParams) => {
  return request({
    method: 'GET',
    url: '/organizational_structure/staff/',
    params
  }).then(res => { return res.data })
}

export const getStaffNames = () => {
  return request({
    method: 'GET',
    url: '/organizational_structure/staff_category/'
  }).then(res => { return res.data })
}

export const getStaff = (id: string) => {
  return request({
    method: 'GET',
    url: `/organizational_structure/staff/${id}`
  }).then(res => { return res.data })
}

export const updateStaff = (id:string, data: postStaffType) => {
  return request({
    method: 'PATCH',
    url: `/organizational_structure/staff/${id}`,
    data
  }).then(res => {
    return res.data
  }).catch((error) => {
    // console.log(error)
    return error
  })
}

export const createStaff = (data: postStaffType) => {
  return request({
    method: 'POST',
    url: '/organizational_structure/staff/',
    data
  }).then(res => {
    return res.data
  }).catch((error) => {
    // console.log(error)
    return error
  })
}


export const deletStaff = (id:string) => {
  return request({
    method: 'PATCH',
    url: `/organizational_structure/staff/${id}`,
    data: {
      is_delete: true
    }
  }).then(res => { return res.data })
}

// =============================================

export const getDepartmentData = (params: departmentParams) => {
  return request({
    method: 'GET',
    url: '/organizational_structure/department/',
    params
  }).then(res => { return res.data })
}

export const getDepartment = (id: string) => {
  return request({
    method: 'GET',
    url: `/organizational_structure/department/${id}`
  }).then(res => { return res.data })
}

export const createDepartment = (data: postdepartmentType) => {
  return request({
    method: 'POST',
    url: '/organizational_structure/department/',
    data
  }).then(res => {
    return res.data
  }).catch((error) => {
    // console.log(error)
    return error
  })
}

export const updateDepartmentAll = (id:string, data: postdepartmentType) => {
  return request({
    method: 'PUT',
    url: `/organizational_structure/department/${id}`,
    data
  }).then(res => {
    return res.data
  }).catch((error) => {
    // console.log(error)
    return error
  })
}

export const updateDepartment = (id:string, data: postdepartmentType) => {
  return request({
    method: 'PATCH',
    url: `/organizational_structure/department/${id}`,
    data
  }).then(res => {
    return res.data
  }).catch((error) => {
    // console.log(error)
    return error
  })
}

export const deletDepartment = (id:string) => {
  return request({
    method: 'PATCH',
    url: `/organizational_structure/department/${id}`,
    data: {
      is_delete: true
    }
  }).then(res => { return res.data })
}
