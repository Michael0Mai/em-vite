<template>
<div class="page-container">
    <el-card class="box-card select-box">
    <template #header>
      数据筛选
    </template>
    <el-form class="filter" :inline="true" :model='modelParams' :disabled="listLoading">
        <el-form-item label="型号">
            <el-input v-model="modelParams.name__icontains" clearable placeholder="输入型号以搜索" @clear="handleQuery" @change="handleQuery">
                <template #prefix>
                    <el-icon class="el-input__icon"><search /></el-icon>
                </template>
            </el-input>
        </el-form-item>
        <el-form-item label="别名">
            <el-input v-model="modelParams.cname__icontains" clearable placeholder="输入类型以别名" @clear="handleQuery" @change="handleQuery">
                <template #prefix>
                    <el-icon class="el-input__icon"><search /></el-icon>
                </template>
            </el-input>
        </el-form-item>
        <el-form-item label="供应商">
            <el-select v-model="modelParams.manufacturer" clearable filterable placeholder="请选择生产商" @change="handleQuery" @focus="loadManufacturerNames">
                <el-option v-for="item in manufacturerNames" :key="item.id" :value="item.id" :label="item.name" />
            </el-select>
        </el-form-item>
        <el-form-item label="类型">
            <el-select v-model="modelParams.equipment_type" clearable filterable placeholder="请选择类型" @change="handleQuery" @focus="loadTypeNames">
                <el-option v-for="item in typelNames" :key="item.id" :value="item.id" :label="item.name" />
            </el-select>
        </el-form-item>
        <!-- <el-form-item>
            <el-button native-type="submit" @click="handleQuery">查询</el-button>
        </el-form-item> -->
    </el-form>
  </el-card>

  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <el-button color="#626aef" @click="loadlist" :disabled="listLoading">刷新数据</el-button>
        <el-button type="primary" @click="formVisible = true" :disabled="!ismanager">添加型号</el-button>
      </div>
    </template>
    <el-table
    v-loading="listLoading"
    :data="list"
    height-max="800"
    style="width: 100%"
    stripe
    highlight-current-row
    table-layout="fixed"
    >
      <el-table-column type="expand">
          <template #default="scope">
              <div class="expand-column">
                    <p class="expand-column-item">售后: {{ scope.row.manufacturer.after_sales_charger }}</p>
                    <p class="expand-column-item">售后电话: {{ scope.row.manufacturer.after_sales_phone }}</p>
                    <p class="expand-column-item">技术支持: {{ scope.row.manufacturer.technical_support_charger }}</p>
                    <p class="expand-column-item">技术支持电话: {{ scope.row.manufacturer.technical_support_phone }}</p>
                    <p class="expand-column-item">网址: {{ scope.row.manufacturer.web }}</p>
              </div>
          </template>
      </el-table-column>
      <el-table-column prop="name" label="型号" min-width="180"/>
      <el-table-column prop="cname" label="别名" min-width="80" />
      <el-table-column prop="equipment_type.name" label="类型" min-width="120"/>
      <el-table-column prop="manufacturer.name" label="供应商" min-width="180" />
      <el-table-column label="操作" align="center" min-width="200" fixed="right">
        <template #default="scope">
          <el-button size="small" @click = "handleupdate(scope.row.id)" :disabled="!ismanager"> 编辑 </el-button>
          <el-popconfirm title="确认删除吗？" @confirm = "handleDelete(scope.row.id)">
            <template #reference>
              <el-button size="small" type="danger" :disabled="!ismanager"> 删除 </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
  </el-table>
  <AppPagination
  v-model:page = "modelParams.page"
  :total = "counts"
  :loadlist="loadlist"
  :disabled="listLoading"
  />
  </el-card>
  <equipmentModel-Form
  v-model="formVisible"
  :modelId = "modelId"
  @closed = "modelId=null"
  @success = "handleFormSuccess"
  />
</div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getModelData, getModelNames, deletModel } from '@/api/equipment_model'
import { getTypeNames } from '@/api/equipment_type'
import { getManufacturerNames } from '@/api/manufacturer'
import { isAdmin } from '@/utils/isAdmin'
import equipmentModelForm from './equipment_modelForm.vue'

const list = ref([])
const typelNames = ref([])
const manufacturerNames = ref([])
const ismanager = ref(false)
const listLoading = ref(true)
const counts = ref()
const formVisible = ref(false)
const modelId = ref<string | null>(null)

const modelParams = reactive({ // 搜索用
  is_delete: false,
  name__icontains: '',
  cname__icontains: '',
  equipment_type: '',
  manufacturer: '',
  page: 1
})

onMounted(() => {
  loadlist()
  showEdit()
})

const showEdit = () => {
  ismanager.value = isAdmin()
}

const loadlist = async () => {
  listLoading.value = true
  const data = await getModelData(modelParams).finally(() => { listLoading.value = false })
  list.value = data.results
  counts.value = data.count
}

const loadTypeNames = async () => {
  const data = await getTypeNames()
  typelNames.value = data.results
}

const loadManufacturerNames = async () => {
  const data = await getManufacturerNames()
  manufacturerNames.value = data.results
}

const handleQuery = async (page:number) => {
  modelParams.page = 1
  loadlist()
}

const handleupdate = (id:string) => {
  modelId.value = id
  formVisible.value = true
}

const handleDelete = async (id:string) => {
  const data = await deletModel(id)
  if (data.status_code === 200) {
    ElMessage.success('删除成功')
    loadlist()
  }
}

const handleFormSuccess = () => {
  formVisible.value = false
  loadlist()
}

</script>

<style lang="scss" scoped>

</style>
