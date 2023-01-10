<template>
  <el-dialog
    :title="showTitle"
    :visible="dialogVisible"
    width="30%"
    @close="handleClose()"
  >
    <!-- 表单组件  el-form   label-width设置label的宽度   -->
    <!-- 匿名插槽 -->
    <el-form ref="deptForm" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="部门名称" prop="name">
        <el-input
          v-model="form.name"
          style="width: 80%"
          placeholder="1-50个字符"
        />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input
          v-model="form.code"
          style="width: 80%"
          placeholder="1-50个字符"
        />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select
          v-model="form.manager"
          style="width: 80%"
          placeholder="请选择"
        >
          <el-option
            v-for="item in userList"
            :key="item.id"
            :label="item.username"
            :value="item.username"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input
          v-model="form.introduce"
          style="width: 80%"
          placeholder="1-300个字符"
          type="textarea"
          :rows="3"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose()">取 消</el-button>
        <el-button type="primary" @click="addDepartments()"> 确 定 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { getSimpleListApi } from '@/api/user'
import {
  addDepartmentsApi,
  getDepartmentsDetailsApi,
  editDepartmentsDetailsApi
} from '@/api/departments'
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    originalDeparts: {
      type: Array,
      required: true
    },
    nodeData: {
      type: Object,
      required: true
    }
  },
  data() {
    // 自定义校验规则
    // 同级中禁止出现重复部门
    const checkNameRepeat = (rule, value, callback) => {
      let arr = []
      if (this.form.id) {
        // bug:编辑完成后出现了重名的部门名称
        // 同级的兄弟中不能出现重名
        if (this.originalDeparts.name === value) {
          // 编辑时候，name是可以和原来的name相等的，如果相等了，则直接通过校验 return
          callback()
          return
        }
        arr = this.originalDeparts.filter(
          // 编辑的时候。nodeData是当前编辑的部门
          // 当前编辑的部门不能有重名的兄弟
          // 兄弟有一个共同的特点：有一个共同的爹
          // arr过滤同级的兄弟
          item => item.pid === this.nodeData.pid
        )
      } else {
        // 1.根据爹的id作为pid，找到所有的兄弟
        arr = this.originalDeparts.filter(item => {
          return item.pid === this.nodeData.id
        })
      }
      // 2.只要value和arr中任意一个部门的name相等，那就不通过校验
      const isRepeast = arr.some(item => item.name === value)
      // 3.判断是否有重复部门
      isRepeast ? callback(new Error('出现了重名的部门')) : callback()
    }
    // 禁止出现重复的部门编码
    const checkCodeRepeat = (rule, value, callback) => {
      if (this.form.id && value === this.nodeData.code) {
        // 编辑状态下，code可以和原来一样
        callback()
        return
      }
      const isRepeast = this.originalDeparts.some(item => item.code === value)
      isRepeast ? callback(new Error('部门编码已存在')) : callback()
    }
    return {
      form: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },
      // 定义校验规则
      rules: {
        name: [
          {
            required: true,
            message: '部门名称不能为空',
            trigger: ['blur', 'change']
          },
          {
            min: 1,
            max: 50,
            message: '部门名称要求1-50个字符',
            trigger: ['blur', 'change']
          },
          { validator: checkNameRepeat, trigger: 'blur' }
        ],
        code: [
          {
            required: true,
            message: '部门编码不能为空',
            trigger: ['blur', 'change']
          },
          {
            min: 1,
            max: 50,
            message: '部门编码要求1-50个字符',
            trigger: ['blur', 'change']
          },
          { validator: checkCodeRepeat, trigger: 'blur' }
        ],
        manager: [
          {
            required: true,
            message: '部门负责人不能为空',
            trigger: ['blur', 'change']
          }
        ],
        introduce: [
          {
            required: true,
            message: '部门介绍不能为空',
            trigger: ['blur', 'change']
          },
          {
            min: 1,
            max: 300,
            message: '部门介绍要求1-300个字符',
            trigger: ['blur', 'change']
          }
        ]
      },
      userList: [],
      // 弹层标题
      showTitle: ''
    }
  },
  created() {},
  methods: {
    async getSimpleList() {
      const { data } = await getSimpleListApi()
      this.userList = data
    },
    // 关闭弹层
    handleClose() {
      // this.$emit('closeDialog')
      // 关闭弹层的时候清空数据，调用的是form表单的内部reserFields方法
      this.$refs.deptForm.resetFields()
      this.form = {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      }
      // 一个Vue应用中有一个父组件包含了一个子组件，子组件接收了父组件传入的一个外部变量（props），子组件通过$emit让父组件监听到子组件的一个事件，该事件修改了外部变量props，然后将修改后的结果同步给父组件中被.sync修饰的属性。
      this.$emit('update:dialogVisible', false)
    },
    // 新增部门
    addDepartments() {
      // 提交ajax之前，表单校验通过在提交
      this.$refs.deptForm.validate(async valid => {
        if (!valid) return
        if (this.form.id) {
          await editDepartmentsDetailsApi(this.form)
          this.$message.success('编辑部门成功')
        } else {
          // 添加子部门
          const data = {
            ...this.form,
            pid: this.nodeData.id
          }
          await addDepartmentsApi(data)
          this.$message.success('新增部门成功')
        }
        // 1.关闭弹层
        this.handleClose()
        // 2.重新渲染组织架构数据
        this.$emit('addDept')
      })
    },
    // 获取部门详情
    async getDepartmentsDetails(id) {
      const { data } = await getDepartmentsDetailsApi(id)
      this.form = data
    }
  }
}
</script>

<style></style>
