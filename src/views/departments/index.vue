<template>
  <div class="departments-container">
    <div class="app-container">
      <el-card v-loading="loading" class="tree-card">
        <!-- 用了一个行列布局 -->
        <treeToolsVue
          :node-data="company"
          :is-root="true"
          @openDialog="openDialog"
        />
        <el-tree :data="departs" :props="defaultProps">
          <!-- 解构 -->
          <template #default="{ data }">
            <!-- node是el-tree偏低层一点节点信息 -->
            <!-- data是el-tree 数据层面的信息 -->
            <treeToolsVue
              :node-data="data"
              @delDeptsFn="getDepartmentsList()"
              @openDialog="openDialog"
              @editDepts="editDepts"
            />
          </template>
        </el-tree>
      </el-card>
      <addDeptVue
        ref="addDept"
        :dialog-visible.sync="dialogVisible"
        :original-departs="originalDeparts"
        :node-data="nodeData"
        @addDept="getDepartmentsList()"
      />
      <!-- @closeDialog="dialogVisible = false" -->
    </div>
  </div>
</template>

<script>
import treeToolsVue from './components/tree-tools.vue'
import { getDepartmentsApi } from '@/api/departments'
import addDeptVue from './components/add-dept.vue'
import { recursionDepartsFn } from '@/utils'
export default {
  components: {
    treeToolsVue,
    addDeptVue
  },
  data() {
    return {
      dialogVisible: false,
      departs: [],
      originalDeparts: [], // 后台返回的原始数据
      defaultProps: {
        label: 'name',
        children: 'children'
      },
      company: { name: '江苏传智播客教育科技股份有限公司', manager: '负责人' },
      nodeData: {} // 点击添加子拿到当前的部门
    }
  },
  created() {
    this.getDepartmentsList()
  },

  methods: {
    // handleClose(done) {
    //   this.$confirm('确认关闭？')
    //     .then(_ => {
    //       done()
    //     })
    //     .catch(_ => {})
    // },
    async getDepartmentsList() {
      // 加载数据之前，要让loading转起来
      this.loading = true
      // 请求接口拿到组织架构数据
      const {
        data: { depts, companyName, companyManager }
      } = await getDepartmentsApi()
      this.company.name = companyName
      this.company.manager = companyManager
      this.company.id = ''
      // 原始数据也存一份
      this.originalDeparts = depts
      const departs = recursionDepartsFn(depts, '')
      // 接口返回的数据，都是同级的
      // 使用：递归
      // pid：-1：代表顶级组织架构
      // pid：空字符串：代表一级组织架构
      // pid：不为空：代表父级组织架构的id
      this.departs = departs
      // 请求完数据，loading关闭
      this.loading = false
    },

    // 点击新增部门出发的方法
    openDialog(data) {
      // 目标：打开弹窗再进行接口请求
      this.dialogVisible = true
      this.nodeData = data
      // 父组件调用子组件方法，需要先在子组件标签上定义ref
      this.$refs.addDept.getSimpleList()
      this.$refs.addDept.showTitle = '新增部门'
    },
    // 点击编辑打开弹窗
    editDepts(nodeData) {
      this.dialogVisible = true
      this.$refs.addDept.showTitle = '编辑部门'
      this.nodeData = nodeData
      this.$refs.addDept.getDepartmentsDetails(this.nodeData.id)
    }
  }
}
</script>

<style lang="scss" scoped>
.tree-card {
  padding: 30px 30px;
  font-size: 14px;
}
.el-tree {
  ::v-deep {
    // 小三角的样式, 去掉默认的小三角的旋转效果
    .el-tree-node__expand-icon.expanded {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    // 有子节点 且未展开 +
    .el-icon-caret-right:before {
      background: url('~@/assets/common/add-circle.png') no-repeat 0 0;
      content: '';
      display: block;
      width: 16px;
      height: 16px;
      font-size: 16px;
      background-size: 16px;
    }
    // 有子节点 且已展开 -
    .el-tree-node__expand-icon.expanded.el-icon-caret-right:before {
      background: url('~@/assets/common/minus-circle.png') no-repeat 0 0;
      content: '';
      display: block;
      width: 16px;
      height: 16px;
      font-size: 16px;
      background-size: 16px;
    }
    // 没有子节点
    .el-tree-node__expand-icon.is-leaf::before {
      background: url('~@/assets/common/user-filling.png') no-repeat 0 0;
      content: '';
      display: block;
      width: 16px;
      height: 16px;
      font-size: 16px;
      background-size: 16px;
    }
  }
}
</style>
