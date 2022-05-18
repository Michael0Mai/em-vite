<template>
<AppDialofForm
  :title="props.equipmentId? '编辑设备' : '新增设备'"
  @open="handleDialogOpen"
  @closed="handleDialogClosed"
  :confirm="handleSubmit"
  >
    <el-form :model="formData"
        :rules="formRules"
        ref="form"
        label-width="100px"
        v-loading="formLoading">
        <el-form-item label="编号" prop="serial_number">
            <el-input placeholder="请输入设备编号" v-model.number= "formData.serial_number" clearable></el-input>
        </el-form-item>
        <el-form-item label="别名" prop="cname">
            <el-input placeholder="请输入设备别名" v-model= "formData.cname" clearable></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="price">
            <el-input placeholder="请输入设备价格" v-model= "formData.price" clearable></el-input>
        </el-form-item>
        <el-form-item label="日期" prop="purchase_date">
            <el-date-picker
            v-model= "formData.purchase_date"
            type="date"
            placeholder="请选择购买时间"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD" 
            :disabled-date="disabledDate"/>
        </el-form-item>
        <el-form-item label="型号" prop="model">
          <el-select v-model= "formData.model" placeholder="选择设备型号">
              <el-option v-for="item in ModelNames" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
          <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
          <el-button type="primary" @click="modelformVisible = true">&nbsp;新建型号&nbsp;</el-button >
      </el-form-item>
      <el-form-item label="状态" prop="status">
          <el-select v-model= "formData.status" placeholder="选择设备状态">
              <el-option v-for="item in StatusNames" :key="item.id" :label="item.status" :value="item.id" />
          </el-select>
          <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
          <el-button type="primary" @click="statusformVisible = true">&nbsp;新建状态&nbsp;</el-button >
      </el-form-item>
      <el-form-item label="性能" prop="performance">
          <el-select v-model= "formData.performance" placeholder="选择设备性能">
              <el-option v-for="item in PerformanceNames" :key="item.id" :label="item.performance" :value="item.id" />
          </el-select>
          <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
          <el-button type="primary" @click="performanceformVisible = true">&nbsp;新建性能&nbsp;</el-button >
      </el-form-item>
      <el-form-item label="负责人" prop="charger">
          <el-select v-model= "formData.charger" placeholder="选择负责人">
              <el-option v-for="item in StaffNames" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
          <span>&nbsp;&nbsp;&nbsp;&nbsp;</span>
          <el-button type="primary" @click="chargerformVisible = true">新建负责人</el-button >
      </el-form-item>
      <el-form-item label="备注" prop="remark">
          <el-input placeholder="请输入备注" v-model= "formData.remark" clearable autosize type="textarea"></el-input>
      </el-form-item>
        <div class="otherForms">
        <equipmentModel-Form
            v-model="modelformVisible"
            :modelId = null
            @success = "handleModelFormSuccess"
            append-to-body
            />
        <equipmentStatus-Form
            v-model="statusformVisible"
            :statusId = null
            @success = "statushandleFormSuccess"
            append-to-body
            />
        <equipmentPerformance-Form
            v-model="performanceformVisible"
            :performanceId = null
            @success = "handlePerformanceFormSuccess"
            append-to-body
            />
        <staff-Form
            v-model="chargerformVisible"
            :staffId = null
            @success = "handleChargerFormSuccess"
            append-to-body
            />
    </div>
    </el-form>
</AppDialofForm>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type { PropType } from 'vue'
import { ElMessage } from 'element-plus'
import type { IElForm, IFormRule } from '@/types/element-plus'
import { createEquipment, updateEquipment, getEquipment, getEquipmentData } from '@/api/equipment'
import { getModelNames } from '@/api/equipment_model'
import { getStatusData } from '@/api/equipment_status'
import { getPerformanceData } from '@/api/equipment_performance'
import { getStaffNames } from '@/api/organizational_structure'
import equipmentModelForm from './equipment_modelForm.vue'
import equipmentStatusForm from './equipment_statusForm.vue'
import equipmentPerformanceForm from './equipment_performanceForm.vue'
import staffForm from '../structures/staffForm.vue'

const form = ref<IElForm | null>(null)
const formLoading = ref(false)
const ModelNames = ref([])
const StatusNames = ref([])
const PerformanceNames = ref([])
const StaffNames = ref([])
const modelformVisible = ref(false)
const statusformVisible = ref(false)
const performanceformVisible = ref(false)
const chargerformVisible = ref(false)

const formData = ref({
  serial_number: null,
  cname: '',
  model: '',
  status: '',
  performance: '',
  charger: '',
  price: null,
  purchase_date: '',
  remark: ''
})

interface EmetsType {
    (e: 'success'):void
}

const emit = defineEmits<EmetsType>()

const formRules: IFormRule = {
  serial_number: [
    { required: true, message: '请输入编号', trigger: 'blur' },
    { type: 'number', message: '请输入数字', trigger: 'blur' },
    { pattern: /^\d{1,4}$/, message: '编号为1~9999之间的数字', trigger: 'blur' }
  ],
  model: [
    { required: true, message: '请选择型号', trigger: 'blur' }
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'blur' }
  ],
  performance: [
    { required: true, message: '请选择型号', trigger: 'blur' }
  ],
  charger: [
    { required: true, message: '请选择型号', trigger: 'blur' }
  ],
  price: [
    { required: true, message: '请输入价格', trigger: 'blur' },
    { pattern: /^-?\d{1,9}(?:\.\d{1,2})?$/, message: '编号为1~999999999之间的数字, 小数点右边最多2位', trigger: 'blur' }
  ],
  purchase_date: [
    { required: true, message: '请选择日期', trigger: 'blur' }
  ]
}

const props = defineProps({
  equipmentId: {
    type: String as PropType<string | null>,
    default: null
  }
})

const loadEquipment = async () => {
  if (!props.equipmentId) {
    return
  }
  const data = await getEquipment(props.equipmentId)
  // console.log(data)
  formData.value = {
    serial_number: data.serial_number,
    cname: data.cname,
    price: data.price,
    purchase_date: data.purchase_date,
    remark: data.remark,
    model: data.model.id,
    status: data.status.id,
    performance: data.performance.id,
    charger: data.charger.id
  }
}

const disabledDate = (time: Date) => {
  return time.getTime() > Date.now()
}

const loadModelNames = async () => {
  const data = await getModelNames()
  ModelNames.value = data.results
}

const loadStatusNames = async () => {
  const data = await getStatusData()
  StatusNames.value = data.results
}

const loadPerformanceNames = async () => {
  const data = await getPerformanceData()
  PerformanceNames.value = data.results
}

const loadStaffNames = async () => {
  const data = await getStaffNames()
  StaffNames.value = data.results
}

const handleDialogOpen = () => {
  formLoading.value = true
  // 打开才开始读api
  Promise.all([loadEquipment(), loadModelNames(), loadStatusNames(), loadPerformanceNames(), loadStaffNames()]).finally(() => {
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
  if (props.equipmentId) { // 有id，更新
    const data = await updateEquipment(props.equipmentId, formData.value)
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
    const data = await createEquipment(formData.value)
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
  const tempNumber = {
    serial_number: formData.value.serial_number,
    is_delete: null
  }
  const serialNumberdata = await getEquipmentData(tempNumber)
  if (serialNumberdata.status_code !== 200) {
    return true
  }
  if (serialNumberdata.results.length === 0) {
    return false
  }
  if (formData.value.serial_number === serialNumberdata.results[0].serial_numbe) {
    setTimeout(() => {
      ElMessage.error('编号有重复')
    }, 10)
    return true
  }
}

const handleModelFormSuccess = () => {
  modelformVisible.value = false
  loadModelNames()
}

const statushandleFormSuccess = () => {
  statusformVisible.value = false
  loadStatusNames()
}

const handlePerformanceFormSuccess = () => {
  performanceformVisible.value = false
  loadPerformanceNames()
}

const handleChargerFormSuccess = () => {
  chargerformVisible.value = false
  loadStaffNames()
}

</script>
