import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
// create an axios instance
const request = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})
// 添加请求拦截器
request.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    if (store.gettets.token) {
      config.header.Authorization = `Bearer ${store.gettets.token}`
    }
    return config
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 添加响应拦截器
request.interceptors.response.use(
  function (response) {
    // 对响应数据做点什么
    // 希望对所有的相应sucess为false的情况，统一抛出错误，为以后的catch弹出错误
    const { message, success } = response.data
    if (!success) {
      Message.error(response.data.message)
      return Promise.reject(new Error(message))
    }
    return response.data
  },
  function (error) {
    // 对响应错误做点什么
    Message.error('请求出错')
    return Promise.reject(error)
  }
)

export default request
