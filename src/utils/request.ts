import axios, { AxiosRequestConfig } from 'axios'
// import { config } from 'process'
import { ElMessage, ElMessageBox } from 'element-plus'
import { store } from '@/store'
import router from '@/router/' // @/router/ 后面加 “/” 说明是文件夹，不会和router.d.ts搞乱

const request = axios.create({
  // baseURL: 'http://127.0.0.1:8000/'
  baseURL: import.meta.env.VITE_API_BASEURL
})

request.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么, 可以设置token
  const token = store.state.token
  if (token && token.access) {
    config.headers.Authorization = `Bearer ${token.access}`
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

let isRefreshing = false
// 添加响应拦截器
request.interceptors.response.use(function (response) {
  // 2xx 范围内的状态码都会触发该函数。接口异常
  // 对响应数据做点什么
  // console.log(response)
  return response
}, function (error) {
  // 超出 2xx 范围的状态码都会触发该函数。
  // 对响应错误做点什么
  if (isRefreshing) return Promise.reject(error.response.data)
  isRefreshing = true
  ElMessage.error(error.response.data.detail || '请求失败，请稍后重试')
  // console.log('状态码：' + error.response.data.status_code)
  if (error.response.data.status_code === 401) {
    ElMessageBox.confirm('您的登录已过期，需要重新登录', '登录过期', {
      confirmButtonText: '确认',
      cancelButtonText: '取消'
    }).then(() => {
      store.commit('setToken', null) // 清楚token
      router.push({ // 转跳登录
        name: 'login',
        query: {
          redirect: router.currentRoute.value.fullPath
        }
      })
    })
  }
  isRefreshing = false
  // console.log(error.response.status)
  return Promise.reject(error.response.data)
})

export default request

// export default (config: AxiosRequestConfig) => {
//   return request(config).then(res => {
//     return res.data
//   })
// }
