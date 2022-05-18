import request from '@/utils/request'
import { LoginResponse } from './types'

// export const login = (data:{
//     username:string
//     password:string
// }) => {
//   return request({
//     method: 'POST',
//     url: '/token/',
//     data
//   }).catch((error) => {
//     // console.log(error)
//     return error
//   })
// }

export const login = (data:{
    username:string
    password:string
}) => {
  return request<LoginResponse>({
    method: 'POST',
    url: '/token/',
    data
  })
}
