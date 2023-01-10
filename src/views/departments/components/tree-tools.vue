<template>
  <el-row
    type="flex"
    justify="space-between"
    align="middle"
    style="height: 40px; width: 100%"
  >
    <el-col :span="20">
      <span>{{ nodeData.name }}</span>
    </el-col>
    <el-col :span="4">
      <el-row type="flex" justify="end">
        <!-- 两个内容 -->
        <el-col>{{ nodeData.manager }}</el-col>
        <el-col>
          <!-- 下拉菜单 element -->
          <el-dropdown @command="handleCommand">
            <span> 操作<i class="el-icon-arrow-down"></i> </span>
            <!-- 下拉菜单 -->
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="add">添加子部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="edit">
                编辑部门
              </el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="del">
                删除部门
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { delDepartmentsApi } from '@/api/departments'
export default {
  props: {
    // 定义传入的属性
    nodeData: {
      type: Object,
      required: true
    },
    isRoot: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    async handleCommand(command) {
      if (command === 'add') {
        // 这里是点击了添加
        this.$emit('openDialog', this.nodeData)
      }
      if (command === 'edit') {
        this.$emit('editDepts', this.nodeData)
      }
      if (command === 'del') {
        this.$confirm('此次操作将永久删除该部门，是否继续？', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(async () => {
            await delDepartmentsApi(this.nodeData.id)
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.$emit('delDeptsFn')
          })
          .catch(() => {})
      }
    }
  }
}
</script>
<style lang="scss" scoped></style>
