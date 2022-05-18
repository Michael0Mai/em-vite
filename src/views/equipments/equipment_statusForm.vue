<template>
  <AppDialofForm
  :title="props.statusId? '编辑状态' : '新增状态'"
  @open="handleDialogOpen"
  @closed="handleDialogClosed"
  :confirm="handleSubmit"
  >
    <el-form :model="formData"
    :rules="formRules"
    ref="form"
    label-width="100px"
    v-loading="formLoading">
      <el-form-item label="状态" prop="status">
        <el-input placeholder="请输入设备状态" v-model= "formData.status"></el-input>
      </el-form-item>
    </el-form>
  </AppDialofForm>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type { PropType } from 'vue'
import { ElMessage } from 'element-plus'
import type { IElForm, IFormRule } from '@/types/element-plus'
import { getStatus, updateStatus, searchStatusNames, createStatus } from '@/api/equipment_status'

const form = ref<IElForm | null>(null)
const formLoading = ref(false)
const formData = ref({
  status: ''
})

interface EmetsType {
    // (e: 'update:departmentId', value:string|null):void
    (e: 'success'):void
}

const emit = defineEmits<EmetsType>()

const formRules: IFormRule = {
  status: [
    { required: true, message: '请输入状态', trigger: 'blur' }
  ]
}

const props = defineProps({
  statusId: {
    type: String as PropType<string | null>,
    default: null
  }
})

const loadstatus = async () => {
  if (!props.statusId) {
    return
  }
  const data = await getStatus(props.statusId)
  // console.log(data)
  formData.value = {
    ...data
  }
}

const handleDialogOpen = () => {
  formLoading.value = true
  // 打开才开始读api
  loadstatus().finally(() => {
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
  if (props.statusId) { // 有id，更新
    const data = await updateStatus(props.statusId, formData.value)
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
    const data = await createStatus(formData.value)
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
    status: formData.value.status,
    is_delete: null
  }
  const Namedata = await searchStatusNames(tempName)
  // console.log(Namedata)
  if (Namedata.status_code !== 200) {
    return true
  }
  if (Namedata.results.length === 0) {
    return false
  }
  if (formData.value.status === Namedata.results[0].status && Namedata.results[0].is_delete === false) {
    setTimeout(() => {
      ElMessage.error('状态名称有重复')
    }, 10)
    return true
  }
  if (formData.value.status === Namedata.results[0].status && Namedata.results[0].is_delete === true) { // 回收
    const newData = {
      status: formData.value.status,
      is_delete: false
    }
    const res = await updateStatus(Namedata.results[0].id, newData)
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
