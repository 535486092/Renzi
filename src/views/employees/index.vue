<template>
  <div class="employees-container">
    <div class="app-container">
      <!-- <h2>员工</h2> -->
      <PageTools>
        <template #left>
          <span>当前共有1780条记录</span>
        </template>
        <template #right>
          <el-button type="primary" size="small">普通excel导出</el-button>
          <el-button type="primary" size="small">负责excel导出</el-button>
          <el-button type="primary" size="small">excel导入</el-button>
          <el-button type="primary" size="small">新增员工</el-button>
        </template>
      </PageTools>
      <el-card style="margin-top: 10px">
        <el-table v-loading="loading" border :data="list">
          <el-table-column label="序号" type="index" sortable="" />
          <el-table-column label="姓名" prop="username" sortable="" />
          <el-table-column label="手机号" prop="mobile" sortable="" />
          <el-table-column label="工号" prop="workNumber" sortable="" />
          <el-table-column
            label="聘用形式"
            prop="formOfEmployment"
            sortable=""
          />
          <el-table-column label="部门" prop="departmentName" sortable="" />
          <el-table-column label="入职时间" prop="timeOfEntry" sortable="" />
          <el-table-column label="操作" sortable="" fixed="right" width="280">
            <template>
              <el-button type="text" size="small">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small">角色</el-button>
              <el-button type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :current-page="page"
          :page-sizes="[5, 10, 15, 20, 25]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="currentChange"
        />
      </el-card>
    </div>
  </div>
</template>

<script>
import { getUserListApi } from '@/api/employees'
export default {
  data() {
    return {
      list: [],
      total: 0,
      loading: false,
      page: 1, // 当前页数
      pageSize: 5 // 每页显示的数据条数
    }
  },
  created() {
    // 获取员工列表方法
    this.getUserList()
  },
  methods: {
    async getUserList() {
      const {
        data: { rows, total }
      } = await getUserListApi(this.page, this.pageSize)
      this.list = rows
      this.total = total
    },
    // currentPage 页码改变时会触发
    // 目标：页码切换渲染新一页的数据
    currentChange(val) {
      // 更新当前页
      this.page = val
      // 重新获取新的页码的数据
      this.getUserList()
    },
    // pageSize 改变时会触发
    handleSizeChange(val) {
      // 更新每页条数
      this.pageSize = val
      // 更新每页条数时，页码重置为第一页
      // 原因：每页条数的变化后，当前页已经不是之前的当前页了，需要重置
      this.page = 1
      // 根据新的页码以及最新的数据条数，请求最新的的数据
      this.getUserList()
    }
  }
}
</script>

<style></style>
