<template>
  <div class="setting-container">
    <div class="app-container">
      <el-card v-loading="loading" class="treex-card">
        <el-tabs v-model="activeName">
          <el-tab-pane label="用户管理" name="role">
            <el-button type="primary" size="medium">新增角色</el-button>
            <el-table :data="tableData" style="width: 100%">
              <el-table-column
                label="序号"
                width="180"
                type="index"
                :index="indexFn"
              />
              <el-table-column prop="name" label="名称" width="180" />
              <el-table-column prop="description" label="描述" />
              <el-table-column label="操作">
                <template #default>
                  <el-button size="medium" type="success">分配权限</el-button>
                  <el-button size="medium" type="primary">编辑</el-button>
                  <el-button size="medium" type="danger">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              :current-page="page"
              :page-sizes="[1, 2, 3, 4, 5]"
              :page-size="pageSize"
              layout="total,sizes,prev,pager,next,jumper"
              :total="total"
              @size-change="handleSizeChange"
              @current-change="currentChange"
            />
          </el-tab-pane>

          <el-tab-pane label="配置管理" name="company">公司信息</el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getRoleListApi } from '@/api/setting'
export default {
  data() {
    return {
      activeName: 'role',
      tableData: [],
      total: 0, // 数据总数 指的在后台数据库里一共有多少条数据匹配
      page: 1, // 当前页数
      pageSize: 2, // 每页显示的数据条数
      loading: false
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    // 获取角色列表数据
    async getRoleList() {
      this.loading = true
      const {
        data: { rows, total }
      } = await getRoleListApi(this.page, this.pageSize)
      this.tableData = rows
      this.total = total
      this.loading = false
    },
    // currentChange页码改变时会触发
    currentChange(val) {
      // 更新当前页
      this.page = val
      // 重新获取新的u页码的数据
      this.getRoleList()
    },
    // pageSize改变是会触发
    handleSizeChange(val) {
      // 更新每页条数
      this.pageSize = val
      // 更新每条条数，页码重置为第一页
      this.page = 1
      // 重新获取新的额页码的数据，以及获取每页最新的数据条数
      this.getRoleList()
    },
    indexFn(index) {
      // 当前返回的序号，前面有多少条数据
      // 前面一共有多少条=前面的多少页*每页条数
      return index + 1 + (this.page - 1) * this.pageSize
    }
  }
}
</script>

<style lang="scss" scoped>
.treex-card {
  padding: 30px;
  font-size: 14px;
}
</style>
