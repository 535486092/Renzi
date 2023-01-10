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
