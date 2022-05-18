<template>
  <AppDialofForm
  :title="props.modelId? '编辑型号' : '新增型号'"
  @open="handleDialogOpen"
  @closed="handleDialogClosed"
  :confirm="handleSubmit"
  >
    <el-form :model="formData"
    :rules="formRules"
    ref="form"
    label-width="100px"
    v-loading="formLoading">
        <el-form-item label="型号" prop="name">
            <el-input placeholder="请输入设备型号" v-model= "formData.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="别名" prop="cname">
            <el-input v-model= "formData.cname" clearable placeholder="输入类型以别名" ></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="equipment_type">
          <el-select v-model= "formData.equipment_type" placeholder="选择设备类型">
              <el-option v-for="item in typelNames" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
          <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
          <el-button type="primary" @click="typeformVisible = true">&nbsp;新建&nbsp;类型&nbsp;</el-button >
      </el-form-item>
      <equipmentType-Form
        v-model="typeformVisible"
        :typeId = null
        @success = "handleTypeFormSuccess"
        append-to-body
        />
            <el-form-item label="供应商" prop="manufacturer">
          <el-select v-model= "formData.manufacturer" placeholder="选择设备供应商">
              <el-option v-for="item in manufacturerNames" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
          <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
          <el-button type="primary" @click="manufacturerformVisible = true">新建供应商</el-button >
      </el-form-item>
      <manufacturer-Form
          v-model="manufacturerformVisible"
          :manufacturerId = null
          @closed = "manufacturerId=null"
          @success = "handleManufacturerFormSuccess"
          append-to-body
          />
    </el-form>
  </AppDialofForm>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type { PropType } from 'vue'
import { ElMessage } from 'element-plus'
import type { IElForm, IFormRule } from '@/types/element-plus'
import { createModel, updateModel, getModel, searchModelName } from '@/api/equipment_model'
import { getTypeNames } from '@/api/equipment_type'
import { getManufacturerNames } from '@/api/manufacturer'
import manufacturerForm from './manufacturerForm.vue'
import equipmentTypeForm from './equipment_typeForm.vue'

const form = ref<IElForm | null>(null)
const formLoading = ref(false)
const typelNames = ref([])
const manufacturerNames = ref([])
const typeformVisible = ref(false)
const manufacturerformVisible = ref(false)
const formData = ref({
  name: '',
  cname: '',
  equipment_type: '',
  manufacturer: ''
})

interface EmetsType {
    (e: 'success'):void
}

const emit = defineEmits<EmetsType>()

const formRules: IFormRule = {
  name: [
    { required: true, message: '请输入型号', trigger: 'blur' }
  ],
  equipment_type: [
    { required: true, message: '请选择类型', trigger: 'blur' }
  ],
  manufacturer: [
    { required: true, message: '请选择供应商', trigger: 'blur' }
  ]
}

const props = defineProps({
  modelId: {
    type: String as PropType<string | null>,
    default: null
  }
})

const loadmodel = async () => {
  if (!props.modelId) {
    return
  }
  const data = await getModel(props.modelId)
  // console.log(data)
  formData.value = {
    name: data.name,
    cname: data.cname,
    equipment_type: data.equipment_type.id,
    manufacturer: data.manufacturer.id
  }
}

const loadTypeNames = async () => {
  const data = await getTypeNames()
  typelNames.value = data.results
}

const loadManufacturerNames = async () => {
  const data = await getManufacturerNames()
  manufacturerNames.value = data.results
}

const handleDialogOpen = () => {
  formLoading.value = true
  // 打开才开始读api
  Promise.all([loadmodel(), loadTypeNames(), loadManufacturerNames()]).finally(() => {
    formLoading.value = false
  })
}

const handleDialogClosed = () => {
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
  if (props.modelId) { // 有id，更新
    const data = await updateModel(props.modelId, formData.value)
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
    const data = await createModel(formData.value)
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
  const Namedata = await searchModelName(tempName)
  if (Namedata.status_code !== 200) {
    return true
  }
  if (Namedata.results.length === 0) {
    return false
  }
  if (formData.value.name === Namedata.results[0].name && Namedata.results[0].is_delete === false) {
    setTimeout(() => {
      ElMessage.error('型号名称有重复')
    }, 10)
    return true
  }
  if (formData.value.name === Namedata.results[0].name && Namedata.results[0].is_delete === true) { // 回收
    const newData = {
      name: formData.value.name,
      cname: formData.value.cname,
      equipment_type: formData.value.equipment_type,
      manufacturer: formData.value.manufacturer,
      is_delete: false
    }
    const res = await updateModel(Namedata.results[0].id, newData)
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

const handleManufacturerFormSuccess = async () => {
  manufacturerformVisible.value = false
  await loadManufacturerNames()
}

const handleTypeFormSuccess = async () => {
  typeformVisible.value = false
  await loadTypeNames()
}

</script>
