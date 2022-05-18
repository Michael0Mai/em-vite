<template>
<div class="page-container">
  <el-card class="box-card select-box">
    <template #header>
      数据筛选
    </template>
    <el-form class="filter" :inline="true" :model='departmentParams' :disabled="listLoading">
      <el-form-item label="部门">
        <el-input v-model="departmentParams.name__icontains" clearable  placeholder="请输入部门" @change="handleQuery" >
          <template #prefix>
            <el-icon class="el-input__icon"><search /></el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="代号">
        <el-select v-model="departmentParams.abbreviation" clearable filterable placeholder="请选择代号" @change="handleQuery" >
        <el-option v-for="item in list" :key="item.id" :value="item.abbreviation" />
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>

  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <el-button color="#626aef" @click="loadlist" :disabled="listLoading">刷新数据</el-button>
        <el-button type="primary" @click="formVisible = true" :disabled="!ismanager">添加部门</el-button>
      </div>
    </template>
    <el-table v-loading="listLoading" :data="list" height-max="800" style="width: 100%">
      <el-table-column prop="name" label="部门" width="180" />
      <el-table-column prop="abbreviation" label="代号" />
      <el-table-column label="操作" fixed="right" align="center">
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
  <department-Form
  v-model="formVisible"
  :departmentId = "departmentId"
  @closed = "departmentId=null"
  @success = "handleFormSuccess"
  />
</div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { getDepartmentData, deletDepartment } from '@/api/organizational_structure'
import { ElMessage } from 'element-plus'
// import type { departmentParams } from '@/api/types'
import { isAdmin } from '@/utils/isAdmin'
import departmentForm from './departmentForm.vue'


const ismanager = ref(false)
const listLoading = ref(true)
const list = ref([])
const formVisible = ref(false)
const departmentId = ref<string | null>(null)
const departmentParams = reactive({
  name__icontains: '',
  abbreviation: '',
  is_delete: false
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
  const data = await getDepartmentData(departmentParams).finally(() => {
    listLoading.value = false
  })
  list.value = data.results
}

const handleQuery = () => {
  loadlist()
}

const handleDelete = async (id: string) => {
  const data = await deletDepartment(id)
  if (data.status_code === 200) {
    ElMessage.success('删除成功')
    loadlist()
  }
}

const handleupdate = (id:string) => {
  departmentId.value = id
  formVisible.value = true
}

const handleFormSuccess = () => {
  formVisible.value = false
  loadlist()
}

</script>

<style lang="scss" scoped>

</style>
