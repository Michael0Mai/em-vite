<template>
<el-descriptions class="detail-containor" title="设备详情" direction="horizontal" :column="1" border>
    <el-descriptions-item width="5px" label-align="right" label="返回">
      <el-button type="primary" @click="gotoRoot">返回总表</el-button>
    </el-descriptions-item>
    <el-descriptions-item width="5px" label-align="right" label="名称">{{tabelData.cname }}</el-descriptions-item>
    <el-descriptions-item label-align="right" label="编号">{{tabelData.serial_number }} - {{tabelData.purchase_date_cut}} - {{tabelData.chargerDepartmentAbbreviation}}</el-descriptions-item>
    <el-descriptions-item label-align="right" label="型号">{{tabelData.modelName }} - ({{tabelData.modelCname}}</el-descriptions-item>
    <el-descriptions-item label-align="right" label="供应商">{{ tabelData.manufacturerName }}</el-descriptions-item>
    <el-descriptions-item label-align="right" label="售后">{{ tabelData.manufacturerAfter_sales_charger }}</el-descriptions-item>
    <el-descriptions-item label-align="right" label="售后电话">{{ tabelData.manufacturerAfter_sales_phone }}</el-descriptions-item>
    <el-descriptions-item label-align="right" label="技术支持">{{ tabelData.manufacturerTechnical_support_charger }}</el-descriptions-item>
    <el-descriptions-item label-align="right" label="技术电话">{{ tabelData.manufacturerTechnical_support_phone }}</el-descriptions-item>
    <el-descriptions-item label-align="right" label="网址">{{ tabelData.manufacturerWeb }}</el-descriptions-item>
    <el-descriptions-item label-align="right" label="状态">{{ tabelData.status }}</el-descriptions-item>
    <el-descriptions-item label-align="right" label="性能"> {{ tabelData.performance }}</el-descriptions-item>
    <el-descriptions-item label-align="right" label="价格">{{ tabelData.price }}</el-descriptions-item>
    <el-descriptions-item label-align="right" label="购买日期">{{ tabelData.purchase_date }}</el-descriptions-item>
    <el-descriptions-item label-align="right" label="负责人">{{ tabelData.chargerName }} - ({{tabelData.chargerPhone}})</el-descriptions-item>
    <el-descriptions-item label-align="right" label="部门">{{ tabelData.chargerDepartment }}</el-descriptions-item>
    <el-descriptions-item label-align="right" label="备注">{{ tabelData.remark }}</el-descriptions-item>
</el-descriptions>
</template>

<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import { getEquipment } from '@/api/equipment'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const id = route.params.id
const tabelData = ref({})

onMounted(() => {
  loadEquipment()
})

const loadEquipment = async () => {
  const data = await getEquipment(id)
  if (data.status_code === 200) {
    tabelData.value = {
      cname: data.cname,
      serial_number: data.serial_number,
      modelName: data.model.name,
      modelCname: data.model.cname,
      manufacturerName: data.model.manufacturer.name,
      manufacturerAfter_sales_charger: data.model.manufacturer.after_sales_charger,
      manufacturerAfter_sales_phone: data.model.manufacturer.after_sales_phone,
      manufacturerTechnical_support_charger: data.model.manufacturer.technical_support_charger,
      manufacturerTechnical_support_phone: data.model.manufacturer.technical_support_phone,
      manufacturerWeb: data.model.manufacturer.web,
      status: data.status.status,
      performance: data.performance.performance,
      chargerName: data.charger.name,
      chargerPhone: data.charger.phone,
      chargerDepartment: data.charger.department.name,
      chargerDepartmentAbbreviation: data.charger.department.abbreviation,
      remark: data.remark,
      price: data.price,
      purchase_date: data.purchase_date,
      purchase_date_cut: data.purchase_date.slice(0, 4)
    }
    console.log(tabelData.value)
  } else {
    setTimeout(() => {
      ElMessage.error('设备不存在')
    }, 10)
  }
}

const gotoRoot = () => {
  router.replace('/equipment_manage/equipment/')
}
</script>

<style lang="scss" scoped>
.detail-containor{
  width: 400px;
}
</style>
