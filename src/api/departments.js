import request from '@/utils/request'
// 获取-部门列表
export function getDepartmentsApi() {
  return request({
    url: '/company/department'
  })
}

// 根据id删除部门
export function delDepartmentsApi(id) {
  return request({
    url: `/company/department/${id}`,
    method: 'delete'
  })
}

// 新增部门

export function addDepartmentsApi(data) {
  return request({
    url: '/company/department',
    method: 'post',
    data
  })
}

// 获取部门详情

export function getDepartmentsDetailsApi(id) {
  return request({
    url: `/company/department/${id}`,
    method: 'get'
  })
}

// 修改部门详情
export function editDepartmentsDetailsApi(form) {
  return request({
    url: `/company/department/${form.id}`,
    method: 'put',
    data: form
  })
}
