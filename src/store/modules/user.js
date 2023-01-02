import { login } from '@/api/user'
import { getToken, setToken } from '@/utils/auth'
const state = {
  token: getToken() || ''
}
const mutations = {
  setToken(state, newToken) {
    state.token = newToken
    setToken(newToken)
  }
}
const actions = {
  getToken(context, data) {
    return new Promise((resolve, reject) => {
      login(data)
        .then(res => {
          resolve()
          context.commit('setToken', res.data)
        })
        .catch(err => {
          reject()
          console.log(err)
        })
    })
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
