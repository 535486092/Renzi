import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import router from '@/router'
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
    if (store.getters.token) {
      config.headers.Authorization = `Bearer ${store.getters.token}`
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
    const res = response.data
    const { message, success } = res
    if (!success) {
      Message.error(response.data.message)
      return Promise.reject(new Error(message))
    }
    return res
  },
  function (error) {
    // 断网了 服务器宕机 请求超时
    // 状态码 400 404 404 500  502
    // 对响应错误做点什么
    if (error.response.status === 401 && error.response.data.code === 10002) {
      // token过期了，需要返回登录页，清除个人身份信息，清除token
      // 调用封装好的退出登录的actions
      // 小提示，登陆过期了
      Message.error('您的登陆已过期，请重新登录')
      store.dispatch('user/logout')
      router.push('/login')
    } else {
      Message.error(error)
    }
    return Promise.reject(error)
  }
)

export default request
