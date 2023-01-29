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

/**
 * 删除员工
 * @param {string} id 员工id
 * @returns promise对象
 */
export function delUserItemApi(id) {
  return request({
    url: `/sys/user/${id}`,
    method: 'DELETE'
  })
}

/**
 * 新增员工
 * @param {string} username 员工名字
 * @param {string} mobile 员工手机号
 * @param {string} formOfEmployment 员工聘用形式 1正式, 2非正式
 * @param {string} workNumber 员工工号
 * @param {string} departmentName 员工部门名字
 * @param {string} timeOfEntry 员工入职日期 格式: 2020-01-01
 * @param {string} correctionTime 员工转正日期 格式: 2020-01-01
 * @returns promise对象
 */
export function addUserItemApi(data) {
  return request({
    url: '/sys/user',
    method: 'post',
    data
  })
}

/**
 * 批量新增员工
 * @param {string} username 员工名字
 * @param {string} mobile 员工手机号
 * @param {string} timeOfEntry 员工入职日期 格式: 2020-01-01
 * @param {string} correctionTime 员工转正日期 格式: 2020-01-01
 * @param {string} workNumber 员工工号
 * @returns promise对象
 */
export function batchUserListApi(data) {
  return request({
    url: '/sys/user/batch',
    method: 'post',
    data
  })
}
