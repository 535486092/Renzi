import request from '@/utils/request'

/**
 * 获取-角色列表
 * @param {string} page 当前页码数
 * @param {string} pagesize 当前页面需要的数据条数
 * @returns promise对象
 */
export function getRoleListApi(page, pagesize) {
  return request({
    url: '/sys/role',
    method: 'get',
    params: {
      page,
      pagesize
    }
  })
}

/**
 *
 * @param {string} id 角色id
 * @returns promise对象
 */
export function delRoleApi(id) {
  return request({
    url: `/sys/role/${id}`,
    method: 'DELETE'
  })
}

/**
 *
 * @returns
 */
export function addRoleApi(data) {
  return request({
    url: '/sys/role',
    method: 'POST',
    data
  })
}

/**
 *
 * @param {*} id
 * @returns
 */
export function modifyRoleApi(id) {
  return request({
    url: `/sys/role/${id}`,
    method: 'PUT'
  })
}
