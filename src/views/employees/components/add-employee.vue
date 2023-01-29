<template>
  <el-dialog
    title="新增员工"
    :visible="showDialog"
    @close="closeDialog()"
    @click.native="DialogClick()"
  >
    <!-- 表单 -->
    <el-form ref="addForm" :model="formData" :rules="rules" label-width="120px">
      <el-form-item label="姓名" prop="username">
        <el-input
          v-model="formData.username"
          style="width: 50%"
          placeholder="请输入姓名"
        />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input
          v-model="formData.mobile"
          style="width: 50%"
          placeholder="请输入手机号"
        />
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker
          v-model="formData.timeOfEntry"
          style="width: 50%"
          placeholder="请选择入职时间"
        />
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select
          v-model="formData.formOfEmployment"
          style="width: 50%"
          placeholder="请选择"
        >
          <el-option
            v-for="item in hireType"
            :key="item.id"
            :label="item.value"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input
          v-model="formData.workNumber"
          style="width: 50%"
          placeholder="请输入工号"
        />
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <el-input
          :value="formData.departmentName"
          style="width: 50%"
          placeholder="请选择部门"
          @click.native.stop="isShowTreeFn()"
        />
        <div v-if="isShowTree" class="tree-box">
          <el-tree
            v-loading="isLoadingTree"
            :data="deptsList"
            :props="{ label: 'name' }"
            @node-click="nodeClick"
          />
        </div>
      </el-form-item>
      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker
          v-model="formData.correctionTime"
          style="width: 50%"
          placeholder="请选择转正时间"
        />
      </el-form-item>
    </el-form>
    <!-- footer插槽 -->
    <template v-slot:footer>
      <el-button @click="closeDialog()">取消</el-button>
      <el-button type="primary" @click="submitUserItem()">确定</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { getDepartmentsApi } from '@/api/departments'
import { addUserItemApi } from '@/api/employees'
import { recursionDepartsFn } from '@/utils'
import obj from '@/constant/employees'
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      deptsList: [], // 处理完成后的树形数据
      isShowTree: false,
      isLoadingTree: false,
      hireType: obj.hireType,
      formData: {
        username: '', // 用户名
        mobile: '', // 手机号
        formOfEmployment: '', // 聘用形式
        workNumber: '', // 工号
        departmentName: '', // 部门
        timeOfEntry: '', // 入职时间
        correctionTime: '' // 转正时间
      },
      rules: {
        username: [
          {
            required: true,
            message: '用户姓名不能为空',
            trigger: ['blur', 'change']
          },
          {
            min: 1,
            max: 4,
            message: '用户姓名为1-4位',
            trigger: ['blur', 'change']
          }
        ],
        mobile: [
          {
            required: true,
            message: '手机号不能为空',
            trigger: ['blur', 'change']
          },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: '手机号格式不正确',
            trigger: ['blur', 'change']
          }
        ],
        formOfEmployment: [
          {
            required: true,
            message: '聘用形式不能为空',
            trigger: ['blur', 'change']
          }
        ],
        workNumber: [
          {
            required: true,
            message: '工号不能为空',
            trigger: ['blur', 'change']
          }
        ],
        departmentName: [
          {
            required: true,
            message: '部门不能为空',
            trigger: ['blur', 'change']
          }
        ],
        timeOfEntry: [
          {
            required: true,
            message: '请选择入职时间',
            trigger: ['blur', 'change']
          }
        ],
        correctionTime: [
          {
            required: true,
            message: '请选择转正时间',
            trigger: ['blur', 'change']
          }
        ]
      }
    }
  },
  created() {
    // this.getDepartments()
  },
  methods: {
    // 获取部门列表
    async getDepartments() {
      this.isLoadingTree = true
      const {
        data: { depts }
      } = await getDepartmentsApi()
      const deptsList = recursionDepartsFn(depts, '')
      this.deptsList = deptsList
      this.isLoadingTree = false
    },
    // 关闭弹层
    closeDialog() {
      this.$emit('update:showDialog', false)
      this.formData = {
        username: '', // 用户名
        mobile: '', // 手机号
        formOfEmployment: '', // 聘用形式
        workNumber: '', // 工号
        departmentName: '', // 部门
        timeOfEntry: '', // 入职时间
        correctionTime: '' // 转正时间
      }
      // 清空校验
      this.$refs.addForm.resetFields()
    },
    isShowTreeFn() {
      this.isShowTree = !this.isShowTree
      if (!this.isShowTree) return
      this.getDepartments()
    },
    // 给整个dialog添加点击事件
    // 利用事件冒泡处理
    DialogClick() {
      this.isShowTree = false
    },
    // el-tree节点被点击时的回调
    nodeClick(data) {
      if (data.children && data.children.length > 0) {
        return
      }
      this.formData.departmentName = data.name
      this.isShowTree = false
    },
    submitUserItem() {
      this.$refs.addForm.validate(async flag => {
        if (!flag) return

        await addUserItemApi(this.formData)
        this.$message.success('新增员工成功')
        this.closeDialog()
        // 重新渲染表格数据
        // 找到父组件，调用父组件的方法
        // this.$parent 找到父组件 如果遇到插槽的场景，会被插槽所影响
        this.$parent.getUserList()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.tree-box {
  height: 150px;
  position: absolute;
  width: 50%;
  min-height: 50px;
  left: 0;
  top: 45px;
  z-index: 100;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding-right: 5px;
  overflow-y: auto;
  background-color: #fff;
}
</style>
