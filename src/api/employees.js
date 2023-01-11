// 处理员工模块API

import request from '@/utils/request'

/**
 * 获取-员工列表
 * @param {string} page 当前页码数
 * @param {string} size 当前页面需要的数据条数
 * @returns promise对象
 */
export function getUserListApi(page = 1, size = 5) {
  return request({
    url: '/sys/user',
    method: 'get',
    params: {
      page,
      size
    }
  })
}
