<template>
  <div>
    <UploadExcel :on-success="handleSuccess" :before-upload="beforeUpload" />
  </div>
</template>
<script>
import UploadExcel from '@/components/UploadExcel'
import { batchUserListApi } from '@/api/employees'
export default {
  components: {
    UploadExcel
  },
  data() {
    return {}
  },
  methods: {
    // 区分当前的excel上传，是上传怎样的excel数据
    handleSuccess({ results, header }) {
      // 判断当前上传的excel是不是员工的批量导入
      if (this.$route.query.type === 'user') {
        // 进行员工信息批量导入
        this.BatchEmployees(results, header)
      }

      // if(this.$route.query.type === 'money'){
      //   this.BatchMoney(results, header)
      // }
    },
    // 当input 的type=file
    // 这个方法是做验证的，验证文件大小是否符合要求
    beforeUpload(file) {
      // 当前文件是否小于1M
      // 员工导入模版9013字节
      const isLt1M = file.size / 1024 / 1024 < 1
      console.log(isLt1M)

      if (isLt1M) {
        return true
      }

      this.$message({
        message: '请不要上传大于1M的文件。',
        type: 'warning'
      })
      return false
    },
    // 返回了excel里面的数据，表头
    // 员工批量导入
    async BatchEmployees(results, header) {
      const userRelation = {
        入职日期: 'timeOfEntry',
        手机号: 'mobile',
        姓名: 'username',
        转正日期: 'correctionTime',
        工号: 'workNumber'
      }
      // 我们需要对results进行数据处理，因为返回的数据键名不符合接口传参的要求

      const arr = []
      results.forEach(item => {
        // 新建一个对象，换掉键，保留值
        const obj = {}
        for (const key in item) {
          // 拿到中文对应的英文键名 key
          const englishKey = userRelation[key]
          if (['timeOfEntry', 'correctionTime'].includes(englishKey)) {
            obj[englishKey] = this.formatExcelDate(item[key], '-')
          } else {
            obj[englishKey] = item[key]
          }
        }
        arr.push(obj)
      })
      await batchUserListApi(arr)
      this.$message.success('恭喜，批量导入成功！')
      this.$router.push('/employees')
    },

    // 处理excel的时间格式化方法
    formatExcelDate(numb, format = '') {
      const time = new Date(numb * 24 * 3600000 + 1) // 毫秒
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() - 1 + ''
      if (format && format.length === 1) {
        return (
          year +
          format +
          (month < 10 ? '0' + month : month) +
          format +
          (date < 10 ? '0' + date : date)
        )
      }
      // return (
      //   year +
      //   (month < 10 ? '0' + month : month) +
      //   (date < 10 ? '0' + date : date)
      // )
    }
  }
}
</script>
<style scoped></style>
