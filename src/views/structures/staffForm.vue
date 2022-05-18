<template>
  <AppDialofForm
  :title="props.staffId? '编辑员工' : '新增员工'"
  @open="handleDialogOpen"
  @closed="handleDialogClosed"
  :confirm="handleSubmit"
  >
    <el-form
    :model="formData"
    ref="form"
    label-width="100px"
    :rules="formRules"
    v-loading="formLoading">
    <template>
      <department-Form
        v-model="departmentformVisible"
        @success = "handleFormSuccess"
        append-to-body
      />
    </template>
      <el-form-item label="员工名字" prop="name">
        <el-input placeholder="请输入员工名字" v-model= "formData.name"></el-input>
      </el-form-item>
      <el-form-item label="员工电话" prop="phone">
        <el-input placeholder="请输入员工电话" v-model= "formData.phone"></el-input>
      </el-form-item>
      <el-form-item label="部门" prop="department">
          <el-select v-model="formData.department" placeholder="选择部门">
              <el-option v-for="item in Departmentlist" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
          <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
          <el-button type="primary" @click="departmentformVisible = true">新建部门</el-button >
      </el-form-item>
    </el-form>
  </AppDialofForm>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type { PropType } from 'vue'
import { ElMessage } from 'element-plus'
import type { IElForm, IFormRule } from '@/types/element-plus'
import { getDepartmentData, getStaff, getStaffData, updateStaff, createStaff } from '@/api/organizational_structure'
import departmentForm from './departmentForm.vue'

const form = ref<IElForm | null>(null)
const formLoading = ref(false)
const Departmentlist = ref([])
const departmentformVisible = ref(false)

const props = defineProps({
  staffId: {
    type: String as PropType<string | null>,
    default: null
  }
})

const formData = ref({
  name: '',
  phone: '',
  department: ''
})

interface EmetsType {
    (e: 'success'):void
}
const emit = defineEmits<EmetsType>()

const formRules: IFormRule = {
  name: [
    { required: true, message: '请输入员工姓名', trigger: 'blur' },
    { min: 2, max: 5, message: '姓名只能在2~5个汉字', trigger: 'blur' },
    { pattern: /^[\u4E00-\u9FA5]+$/, message: '请输入正确的汉字', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入员工电话', trigger: 'blur' },
    { pattern: /^1(3\d|4[5-9]|5[0-35-9]|6[567]|7[0-8]|8\d|9[0-35-9])\d{8}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  department: [
    { required: true, message: '请选择部门', trigger: 'blur' }
  ]
}

const loadStaff = async () => {
  if (!props.staffId) {
    return
  }
  const data = await getStaff(props.staffId)
  formData.value = {
    name: data.name,
    phone: data.phone,
    department: data.department.id
  }
}

const handleDialogOpen = () => {
  formLoading.value = true
  // 打开才开始读api
  Promise.all([loadStaff(), loadDepartmentlist()]).finally(() => {
    formLoading.value = false
    // console.log(formData.value.department)
  })
}

const handleDialogClosed = () => {
  form.value?.clearValidate() // 清除验证结果
  form.value?.resetFields() // 清除表单数据
}

const loadDepartmentlist = async () => {
  const data = await getDepartmentData()
  Departmentlist.value = data.results
}

const handleSubmit = async () => {
  const valid = await form.value?.validate().catch(err => {
    // console.log(err)
    for (const key in err) {
      setTimeout(() => {
        ElMessage.error(err[key][0].message)
      }, 10)
    }
  })
  if (!valid) {
    return null
  }
  if (props.staffId) { // 有id，更新
    // console.log(props.staffId)
    const data = await updateStaff(props.staffId, formData.value)
    if (data.status_code === 200) {
      ElMessage.success('修改成功')
      emit('success')
    }
  } else { // 新建
    // console.log('新建')
    if (await isdupulicated()) {
      return null
    }
    const data = await createStaff(formData.value)
    // console.log(data)
    if (data.status_code === 201) {
      ElMessage.success('新建成功')
      emit('success')
    } else {
      // console.log(data)
      for (const key in data) {
        setTimeout(() => {
          ElMessage.error(data[key][0])
        }, 10)
      }
    }
  }
}

const handleFormSuccess = () => {
  departmentformVisible.value = false
  loadDepartmentlist()
}

const isdupulicated = async () => {
  const tempNameDepartment = {
    name__icontains: formData.value.name,
    department: formData.value.department,
    is_delete: null
  }
  const Namedata = await getStaffData(tempNameDepartment)
  //   console.log(Namedata)
  if (Namedata.status_code !== 200) {
    return true
  }
  for (let i = 0; i < Namedata.results.length; i++) {
    if (formData.value.name === Namedata.results[i].name && formData.value.department === Namedata.results[i].department.id && Namedata.results[i].is_delete === false) {
      setTimeout(() => {
        ElMessage.error('部门有重复的员工')
      }, 10)
      return true
    } else if (formData.value.name === Namedata.results[i].name && formData.value.department === Namedata.results[i].department.id && Namedata.results[i].is_delete === true) { // 回收
      const newData = {
        name: formData.value.name,
        phone: formData.value.phone,
        department: formData.value.department,
        is_delete: false
      }
      const res = await updateStaff(Namedata.results[i].id, newData)
      if (res.status_code === 200) {
        setTimeout(() => {
          ElMessage.success('新建成功')
        }, 10)
        emit('success')
        return true
      }
    } else {
      return false
    }
  }
  return false
}

</script>
