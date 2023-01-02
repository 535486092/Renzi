import Cookies from 'js-cookie'

const TokenKey = 'hrsaas_22_usertoken_nb'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
