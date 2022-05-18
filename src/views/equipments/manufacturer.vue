<template>
<div class="page-container">
  <el-card class="box-card select-box">
    <template #header>
      数据筛选
    </template>
    <el-form class="filter" :inline="true" :model='ManufacturerNames' :disabled="listLoading">
      <el-form-item label="供应商">
        <el-input v-model="ManufacturerParams.name__icontains" clearable filterable placeholder="请选择生产商" @change="handleQuery" >
          <template #prefix>
            <el-icon class="el-input__icon"><search /></el-icon>
          </template>
        </el-input>
      </el-form-item>
    </el-form>
  </el-card>

  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <el-button color="#626aef" @click="loadlist" :disabled="listLoading">刷新数据</el-button>
        <el-button type="primary" @click="formVisible = true" :disabled="!ismanager">添加供应商</el-button>
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
                    <p class="expand-column-item">售后: {{ scope.row.after_sales_charger }}</p>
                    <p class="expand-column-item">售后电话: {{ scope.row.after_sales_phone }}</p>
                    <p class="expand-column-item">技术支持: {{ scope.row.technical_support_charger }}</p>
                    <p class="expand-column-item">技术支持电话: {{ scope.row.technical_support_phone }}</p>
                    <p class="expand-column-item">网址: {{ scope.row.web }}</p>
              </div>
          </template>
      </el-table-column>
      <el-table-column prop="name" label="生产商" min-width="80"/>
      <el-table-column prop="after_sales_charger" label="售后" min-width="80" />
      <el-table-column prop="after_sales_phone" label="售后电话" min-width="120"/>
      <el-table-column prop="technical_support_charger" label="技术支持" min-width="80" />
      <el-table-column prop="technical_support_phone" label="技术支持电话" min-width="120"/>
      <el-table-column prop="web" label="网址" min-width="200" />
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
  v-model:page = "ManufacturerParams.page"
  :total = "counts"
  :loadlist="loadlist"
  :disabled="listLoading"
  />
  </el-card>
  <manufacturer-Form
  v-model="formVisible"
  :manufacturerId = "manufacturerId"
  @closed = "manufacturerId=null"
  @success = "handleFormSuccess"
  />
</div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getManufacturerData, getManufacturerNames, deleteManufacturer } from '@/api/manufacturer'
// import type { ManufacturerParams } from '@/api/Manufacturer'
import { isAdmin } from '@/utils/isAdmin'
import manufacturerForm from './manufacturerForm.vue'

const list = ref([])
const ManufacturerNames = ref([])
const ismanager = ref(false)
const listLoading = ref(true)
const counts = ref()
const formVisible = ref(false)
const manufacturerId = ref<string | null>(null)

const ManufacturerParams = reactive({ // 搜索用
  is_delete: false,
  name__icontains: '',
  after_sales_charger__icontains: '',
  technical_support_charger__icontains: '',
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
  const data = await getManufacturerData(ManufacturerParams).finally(() => { listLoading.value = false })
  list.value = data.results
  counts.value = data.count
}

const loadManufacturerNames = async () => {
  const data = await getManufacturerNames()
  ManufacturerNames.value = data.results
}

const handleQuery = async (page:number) => {
  ManufacturerParams.page = 1
  loadlist()
}

const handleupdate = (id:string) => {
  manufacturerId.value = id
  formVisible.value = true
}

const handleDelete = async (id:string) => {
  const data = await deleteManufacturer(id)
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
