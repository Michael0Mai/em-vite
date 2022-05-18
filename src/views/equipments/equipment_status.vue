<template>
<div class="page-container">
  <el-card class="box-card select-box">
    <template #header>
        数据筛选
    </template>
    <el-form class="filter" :inline="true" :model='statusParams' :disabled="listLoading">
        <el-form-item label="状态">
            <el-input v-model="statusParams.status" clearable placeholder="输入类型以搜索" @change="handleQuery">
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
        <el-button type="primary" @click="formVisible = true" :disabled="!ismanager">添加状态</el-button>
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
      <el-table-column prop="status" label="状态" min-width="180"/>
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
  </el-card>
  <equipmentStatus-Form
  v-model="formVisible"
  :statusId = "statusId"
  @closed = "statusId=null"
  @success = "handleFormSuccess"
  />
</div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getStatusData, deletStatus } from '@/api/equipment_status'
import { isAdmin } from '@/utils/isAdmin'
import equipmentStatusForm from './equipment_statusForm.vue'

const list = ref([])
const ismanager = ref(false)
const listLoading = ref(true)
const formVisible = ref(false)
const statusId = ref<string | null>(null)

const statusParams = reactive({ // 搜索用
  is_delete: false,
  status: ''
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
  const data = await getStatusData(statusParams).finally(() => { listLoading.value = false })
  list.value = data.results
}

const handleQuery = async (page:number) => {
  loadlist()
}

const handleupdate = (id:string) => {
  statusId.value = id
  formVisible.value = true
}

const handleDelete = async (id:string) => {
  const data = await deletStatus(id)
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
