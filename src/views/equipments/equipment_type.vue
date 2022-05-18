<template>
<div class="page-container">
  <el-card class="box-card select-box">
    <template #header>
        数据筛选
    </template>
    <el-form class="filter" :inline="true" :model='typeParams' :disabled="listLoading">
        <el-form-item label="类型">
            <el-input v-model="typeParams.name__icontains" clearable placeholder="输入类型以搜索" @change="handleQuery">
                <template #prefix>
                    <el-icon class="el-input__icon"><search /></el-icon>
                </template>
            </el-input>
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
        <el-button type="primary" @click="formVisible = true" :disabled="!ismanager">添加类型</el-button>
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
      <el-table-column prop="name" label="类型" min-width="180"/>
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
  v-model:page = "typeParams.page"
  :total = "counts"
  :loadlist="loadlist"
  :disabled="listLoading"
  />
  </el-card>
  <equipmentType-Form
  v-model="formVisible"
  :typeId = "typeId"
  @closed = "typeId=null"
  @success = "handleFormSuccess"
  />
</div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getTypeData, deletType } from '@/api/equipment_type'
import { isAdmin } from '@/utils/isAdmin'
import equipmentTypeForm from './equipment_typeForm.vue'

const list = ref([])
const ismanager = ref(false)
const counts = ref()
const listLoading = ref(true)
const formVisible = ref(false)
const typeId = ref<string | null>(null)

const typeParams = reactive({ // 搜索用
  is_delete: false,
  name__icontains: '',
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
  const data = await getTypeData(typeParams).finally(() => { listLoading.value = false })
  list.value = data.results
  counts.value = data.count
}

const handleQuery = async (page:number) => {
  typeParams.page = 1
  loadlist()
}

const handleupdate = (id:string) => {
  typeId.value = id
  formVisible.value = true
}

const handleDelete = async (id:string) => {
  const data = await deletType(id)
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
