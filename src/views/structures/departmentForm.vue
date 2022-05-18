<template>
  <AppDialofForm
  :title="props.departmentId? '编辑部门' : '新增部门'"
  @open="handleDialogOpen"
  @closed="handleDialogClosed"
  :confirm="handleSubmit"
  >
    <el-form :model="formData"
    :rules="formRules"
    ref="form"
    label-width="100px"
    v-loading="formLoading">
      <el-form-item label="部门名字" prop="name">
        <el-input placeholder="请输入部门名字" v-model= "formData.name"></el-input>
      </el-form-item>
      <el-form-item label="部门代号" prop="abbreviation">
        <el-input placeholder="请输入部门代号" v-model= "formData.abbreviation"></el-input>
      </el-form-item>
    </el-form>
  </AppDialofForm>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type { PropType } from 'vue'
import { ElMessage } from 'element-plus'
import type { IElForm, IFormRule } from '@/types/element-plus'
import { getDepartment, createDepartment, updateDepartment, getDepartmentData } from '@/api/organizational_structure'

const form = ref<IElForm | null>(null)
const formLoading = ref(false)
const formData = ref({
  name: '',
  abbreviation: ''
})

interface EmetsType {
    // (e: 'update:departmentId', value:string|null):void
    (e: 'success'):void
}

const emit = defineEmits<EmetsType>()

const formRules: IFormRule = {
  name: [
    { required: true, message: '请输入部门名字', trigger: 'blur' }
  ],
  abbreviation: [
    { required: true, message: '请输入部门代号', trigger: 'blur' },
    { min: 1, max: 2, message: '代号位数只能在1~2之间', trigger: 'blur' },
    { pattern: /^[A-Z]{2}/, message: '代号只能是大写字母', trigger: 'blur' }
  ]
}

const props = defineProps({
  departmentId: {
    type: String as PropType<string | null>,
    default: null
  }
})

const loadDepartment = async () => {
  if (!props.departmentId) {
    return
  }
  const data = await getDepartment(props.departmentId)
  // console.log(data)
  formData.value = {
    ...data
  }
}

const handleDialogOpen = () => {
  formLoading.value = true
  // 打开才开始读api
  loadDepartment().finally(() => {
    formLoading.value = false
  })
}

const handleDialogClosed = () => {
  // emit('update:departmentId', null)
  form.value?.clearValidate() // 清除验证结果
  form.value?.resetFields() // 清除表单数据
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
  } else {
    if (await checkAbbreviation(formData.value.abbreviation)) {
      setTimeout(() => {
        ElMessage.error('代号有重复')
      }, 10)
      return null
    }
    if (props.departmentId) { // 有id，更新
      const data = await updateDepartment(props.departmentId, formData.value)
      if (data.status_code === 200) {
        ElMessage.success('修改成功')
        emit('success')
      } else {
      // console.log(data)
        if (data.abbreviation) {
          setTimeout(() => {
            ElMessage.error('代号：' + data.abbreviation[0])
          }, 10)
        }
        if (data.name) {
          setTimeout(() => {
            ElMessage.error('名称：' + data.name[0])
          }, 10)
        }
      }
    } else { // 新建
      if (await isdupulicated()) {
        return null
      }
      const data = await createDepartment(formData.value)
      // console.log(data)
      if (data.status_code === 201) {
        ElMessage.success('新建成功')
        emit('success')
      } else {
        // console.log(data)
        if (data.abbreviation) {
          setTimeout(() => {
            ElMessage.error('代号：' + data.abbreviation[0])
          }, 10)
        }
        if (data.name) {
          setTimeout(() => {
            ElMessage.error('名称：' + data.name[0])
          }, 10)
        }
      }
    }
  }
}

const isdupulicated = async () => {
  const tempName = {
    name__icontains: formData.value.name,
    // abbreviation: formData.value.abbreviation
    is_delete: null
  }
  const Namedata = await getDepartmentData(tempName)
  // console.log(Namedata)
  if (Namedata.status_code !== 200) {
    return true
  }
  for (let i = 0; i < Namedata.results.length; i++) {
    if (formData.value.name === Namedata.results[i].name && Namedata.results[i].is_delete === false) {
      setTimeout(() => {
        ElMessage.error('部门名称有重复')
      }, 10)
      return true
    }
    if (formData.value.name === Namedata.results[i].name && Namedata.results[i].is_delete === true) { // 回收
      const newData = {
        name: formData.value.name,
        abbreviation: formData.value.abbreviation,
        is_delete: false
      }
      const res = await updateDepartment(Namedata.results[i].id, newData)
      console.log(Namedata.results[i].id)
      if (res.status_code === 200) {
        setTimeout(() => {
          ElMessage.success('新建成功')
        }, 10)
        emit('success')
        return true
      }
    }
  }
  return false
}

const checkAbbreviation = async (abbreviation:string) => {
  const tempAbbreviation = {
    // name__icontains: formData.value.name
    abbreviation: formData.value.abbreviation,
    is_delete: null
  }
  const abbreviationData = await getDepartmentData(tempAbbreviation)
  // console.log(abbreviationData)
  if (abbreviationData.status_code !== 200) {
    console.log('网络')
    return true
  }
  for (let i = 0; i < abbreviationData.results.length; i++) {
    if (abbreviationData.results[0] === abbreviation) {
      console.log('重复')
      return true
    }
  }
  return false
}
</script>
