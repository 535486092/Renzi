<template>
  <div class="setting-container">
    <div class="app-container">
      <el-card v-loading="loading" class="treex-card">
        <el-tabs v-model="activeName">
          <el-tab-pane label="角色管理" name="role">
            <el-button
              type="primary"
              size="medium"
              @click="dialogVisible = true"
            >
              新增角色
            </el-button>
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
                <template #default="{ row }">
                  <el-button size="medium" type="success">分配权限</el-button>
                  <el-button
                    size="medium"
                    type="primary"
                    @click="editRoleDetails(row.id)"
                  >
                    编辑
                  </el-button>
                  <el-button size="medium" type="danger" @click="del(row.id)">
                    删除
                  </el-button>
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

          <el-tab-pane label="公司信息" name="company">
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              show-icon
              :closable="false"
            />
            <!-- 表单 -->
            <el-form label-width="120px" style="margin-top: 50px">
              <el-form-item label="公司名称">
                <el-input
                  v-model="companyForm.name"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input
                  v-model="companyForm.companyAddress"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input
                  v-model="companyForm.mailbox"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
              <el-form-item label="备注">
                <el-input
                  v-model="companyForm.remarks"
                  type="textarea"
                  :rows="3"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
      <el-dialog
        :title="showTitle"
        :visible="dialogVisible"
        @close="closeDialog()"
      >
        <el-form ref="roleForm" :model="form" :rules="rules" label-width="80px">
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="form.name" placeholder="1-50个字符" />
          </el-form-item>
          <el-form-item label="角色描述" prop="description">
            <el-input v-model="form.description" placeholder="1-50个字符" />
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button size="medium" @click="closeDialog()">取消</el-button>
          <el-button size="medium" type="primary" @click="submitRole()">
            确定
          </el-button>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  getRoleListApi,
  delRoleApi,
  addRoleApi,
  modifyRoleApi
} from '@/api/setting'
import { reqGetCompanyById } from '@/api/company'
import { mapState } from 'vuex'
export default {
  data() {
    return {
      activeName: 'role',
      tableData: [],
      total: 0, // 数据总数 指的在后台数据库里一共有多少条数据匹配
      page: 1, // 当前页数
      pageSize: 2, // 每页显示的数据条数
      loading: false,
      showTitle: '新增角色',
      dialogVisible: false,
      form: {
        name: '',
        description: ''
      },
      companyForm: {
        name: '',
        companyAddress: '',
        mailbox: '',
        remarks: ''
      },
      rules: {
        name: [
          {
            required: true,
            message: '角色名称不能为空',
            trigger: ['blur', 'change']
          }
        ],
        description: [
          {
            required: true,
            message: '角色描述不能为空',
            trigger: ['blur', 'change']
          }
        ]
      }
    }
  },
  computed: {
    ...mapState('user', ['userInfo'])
  },
  created() {
    this.getRoleList() // 获取角色列表
    this.getCompanyInfo() // 获取公司信息
  },
  methods: {
    // 获取公司信息
    async getCompanyInfo() {
      const { data } = await reqGetCompanyById(this.userInfo.companyId)
      this.companyForm = data
    },
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
    },
    // 点击删除触发的方法
    del(id) {
      this.$confirm('此次操作将永久删除该部门，是否继续？', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await delRoleApi(id)
          this.$message.message('删除成功')
          // 如果仅剩最后一条数据了，还删除成功了，这个时候应当页面减一
          if (this.tableData.length === 1 && this.page > 1) {
            this.page--
          }
          // 删除成功，从新走一遍接口，渲染数据
          this.getRoleList()
        })
        .catch(() => {})
    },
    // 关闭弹层
    closeDialog() {
      this.dialogVisible = false
      this.form = {
        name: '',
        description: ''
      }
      // 重置表单方法
      // 重置表单状态（红色校验）
      this.$refs.roleForm.resetFields()
    },
    // 发起请求添加角色
    submitRole() {
      this.$refs.roleForm.validate(async flag => {
        if (!flag) return
        if (this.form.id) {
          // 有id说明是编辑，走编辑窗口
          await modifyRoleApi(this.form)
          this.$message.success('编辑角色成功')
        } else {
          await addRoleApi(this.form)
          this.$message.success('添加角色成功')
        }
        // 调用关闭弹层方法
        this.closeDialog()
        // 甭管是新增还是修改，完事都是重新渲染最新的数据
        this.getRoleList()
      })
    },
    // 点击编辑触发的事件
    async editRoleDetails(id) {
      this.showTitle = '编辑角色'
      this.dialogVisible = true
      const { data } = await modifyRoleApi(id)
      this.form = data
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
