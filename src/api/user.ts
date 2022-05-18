import request from '@/utils/request'

export const getUserData = () => {
  return request({
    method: 'GET',
    url: '/users/current_user/'
  }).then(res => { return res.data })
  // return request.get('/users/current_user/').then(res => { return res.data })
  // return request.get<{a:string}>('/users/current_user/')
  // return request.get('/users/current_user/')
}
