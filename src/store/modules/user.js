import { login, getUserInfoApi, getStaffInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
const state = {
  token: getToken() || '',
  userInfo: {}
}
const mutations = {
  // 设置token
  setToken(state, newToken) {
    state.token = newToken
    setToken(newToken)
  },
  // 设置用户信息
  setUserInfo(state, newUserInfo) {
    state.userInfo = newUserInfo
  },
  // 清除token
  removeTokenMut(state) {
    state.token = ''
    removeToken()
  },
  // 清除用户信息
  removeUserInfo(state) {
    state.userInfo = {}
  }
}
const actions = {
  // 通过接口获取token
  async getToken(context, data) {
    const res = await login(data)
    context.commit('setToken', res.data)
    return res.data
  },

  // getToken(context, data) {
  //   return new Promise((resolve, reject) => {
  //     login(data)
  //       .then(res => {
  //         resolve()
  //         context.commit('setToken', res.data)
  //       })
  //       .catch(err => {
  //         reject()
  //         console.log(err)
  //       })
  //   })
  // },
  // 获取用户身份信息
  // asyns函数执行的结果，默认是一个promise对象
  async getUserInfo(context) {
    const { data: data1 } = await getUserInfoApi()
    const { data: data2 } = await getStaffInfo(data1.userId)
    // console.log(data2)
    const obj = {
      ...data1,
      ...data2
    }
    context.commit('setUserInfo', obj)
    return obj
  },

  // getUserInfo(context) {
  //   return new Promise((resolve, reject) => {
  //     getUserInfoApi()
  //       .then(res => {
  //         const { data } = res
  //         context.commit('setUserInfo', data)
  //         resolve(res)
  //       })
  //       .catch(err => {
  //         console.log(err)
  //         reject(err)
  //       })
  //   })
  //   // console.log(res)
  // }
  logout(context) {
    context.commit('removeTokenMut')
    context.commit('removeUserInfo')
  }
}
const getters = {}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
