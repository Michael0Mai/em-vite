<template>
  <AppDialofForm
  :title="props.manufacturerId? '编辑供应商' : '新增供应商'"
  @open="handleDialogOpen"
  @closed="handleDialogClosed"
  :confirm="handleSubmit"
  >
    <el-form :model="formData"
    :rules="formRules"
    ref="form"
    label-width="100px"
    v-loading="formLoading">
      <el-form-item label="供应商名字" prop="name">
        <el-input placeholder="请输入供应商名字" v-model= "formData.name"></el-input>
      </el-form-item>
      <el-form-item label="售后负责人" prop="after_sales_charger">
        <el-input placeholder="请输入售后负责人" v-model= "formData.after_sales_charger"></el-input>
      </el-form-item>
      <el-form-item label="售后电话" prop="after_sales_phone">
        <el-input placeholder="请输入售后电话" v-model= "formData.after_sales_phone"></el-input>
      </el-form-item>
      <el-form-item label="技术支持负责人" prop="technical_support_charger">
        <el-input placeholder="请输入技术支持负责人" v-model= "formData.technical_support_charger"></el-input>
      </el-form-item>
      <el-form-item label="技术支持电话" prop="technical_support_phone">
        <el-input placeholder="请输入技术支持电话" v-model= "formData.technical_support_phone"></el-input>
      </el-form-item>
      <el-form-item label="网址" prop="web">
        <el-input placeholder="请输入网址" v-model= "formData.web"></el-input>
      </el-form-item>
    </el-form>
  </AppDialofForm>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type { PropType } from 'vue'
import { ElMessage } from 'element-plus'
import type { IElForm, IFormRule } from '@/types/element-plus'
import { getManufacturer, updateManufacturer, createManufacturer, searchManufacturerName } from '@/api/manufacturer'

const form = ref<IElForm | null>(null)
const formLoading = ref(false)
const formData = ref({
  name: '',
  web: '',
  after_sales_charger: '',
  after_sales_phone: '',
  technical_support_charger: '',
  technical_support_phone: ''
})

interface EmetsType {
    // (e: 'update:departmentId', value:string|null):void
    (e: 'success'):void
}

const emit = defineEmits<EmetsType>()

const formRules: IFormRule = {
  name: [
    { required: true, message: '请输入供应商', trigger: 'blur' }
  ],
  web: [
    { required: false },
    { pattern: /^(?=^.{3,255}$)(http(s)?:\/\/)?(www\.)?[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+(:\d+)*(\/\w+\.\w+)*$/, message: '请输入正确的网址“ http://www.abc.com”', trigger: 'blur' }
  ]
}

const props = defineProps({
  manufacturerId: {
    type: String as PropType<string | null>,
    default: null
  }
})

const loadDepartment = async () => {
  if (!props.manufacturerId) {
    return
  }
  const data = await getManufacturer(props.manufacturerId)
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
  }
  if (props.manufacturerId) { // 有id，更新
    const data = await updateManufacturer(props.manufacturerId, formData.value)
    if (data.status_code === 200) {
      ElMessage.success('修改成功')
      emit('success')
    } else {
      // console.log(data)
      for (const key in data) {
        setTimeout(() => {
          ElMessage.error(data[key][0])
        }, 10)
      }
    }
  } else { // 新建
    if (await isdupulicated()) {
      return null
    }
    const data = await createManufacturer(formData.value)
    // console.log(data)
    if (data.status_code === 201) {
      ElMessage.success('新建成功')
      emit('success')
    } else {
    //   console.log(data)
      for (const key in data) {
        setTimeout(() => {
          ElMessage.error(data[key][0])
        }, 10)
      }
    }
  }
}

const isdupulicated = async () => {
  const tempName = {
    name: formData.value.name,
    is_delete: null
  }
  const Namedata = await searchManufacturerName(tempName)
  if (Namedata.status_code !== 200) {
    return true
  }
  if (Namedata.results.length === 0) {
    return false
  }
  if (formData.value.name === Namedata.results[0].name && Namedata.results[0].is_delete === false) {
    setTimeout(() => {
      ElMessage.error('供应商名称有重复')
    }, 10)
    return true
  }
  if (formData.value.name === Namedata.results[0].name && Namedata.results[0].is_delete === true) { // 回收
    const newData = {
      name: formData.value.name,
      web: formData.value.web,
      after_sales_charger: formData.value.after_sales_charger,
      after_sales_phone: formData.value.after_sales_phone,
      technical_support_charger: formData.value.technical_support_charger,
      technical_support_phone: formData.value.technical_support_phone,
      is_delete: false
    }
    const res = await updateManufacturer(Namedata.results[0].id, newData)
    // console.log(Namedata.results[i].id)
    if (res.status_code === 200) {
      setTimeout(() => {
        ElMessage.success('新建成功')
      }, 10)
      emit('success')
      return true
    }
  }
  return false
}

</script>
