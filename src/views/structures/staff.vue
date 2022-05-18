<template>
<div class="page-container">
  <el-card class="box-card select-box">
    <template #header>
      数据筛选
    </template>
    <el-form class="filter" :inline="true" :model='staffParams' :disabled="listLoading">
      <el-form-item label="姓名">
        <el-input v-model="staffParams.name__icontains" clearable filterable placeholder="请输入姓名" @change="handleQuery">
          <template #prefix>
            <el-icon class="el-input__icon"><search /></el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="部门">
        <el-select v-model="staffParams.department" clearable filterable placeholder="请选择部门" @change="handleQuery"  @focus="loadDepartmentlist">
        <el-option v-for="item in Departmentlist" :key="item.id" :value="item.id" :label="item.name" />
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>

  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <el-button color="#626aef" @click="loadlist" :disabled="listLoading">刷新数据</el-button>
        <el-button type="primary" @click="formVisible = true" :disabled="!ismanager">添加员工</el-button>
      </div>
    </template>
    <el-table v-loading="listLoading" :data="list" height-max="800" style="width: 100%" stripe highlight-current-row>
      <el-table-column prop="name" label="姓名" width="80"/>
      <el-table-column prop="department.name" label="部门" width="80" />
      <el-table-column prop="phone" label="电话" width="180"/>
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
  <!-- <el-pagination  background layout="total, prev, pager, next, jumper"
      v-model:current-page = "staffParams.page"
      :total = "counts"
      @current-change="handlecurrentpage"
    /> -->
  <AppPagination
  v-model:page = "staffParams.page"
  :total = "counts"
  :loadlist="loadlist"
  :disabled="listLoading"
  />
  </el-card>
  <staff-Form
  v-model="formVisible"
  :staffId = "staffId"
  @closed = "staffId=null"
  @success = "handleFormSuccess"
  />
</div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getStaffData, getDepartmentData, getStaffNames, deletStaff } from '@/api/organizational_structure'
import { isAdmin } from '@/utils/isAdmin'
import staffForm from './staffForm.vue'

const list = ref([])
const staffNames = ref([])
const Departmentlist = ref([])
const counts = ref()
const ismanager = ref(false)
const formVisible = ref(false)
const listLoading = ref(true)
const staffId = ref<string | null>(null)
const staffParams = reactive({
  name__icontains: '',
  department: '',
  page: 1,
  is_delete: false
})

onMounted(() => {
  loadlist()
  showEdit()
  // loadDepartmentlist()
  // loadStaffNames()
})

const showEdit = () => {
  ismanager.value = isAdmin()
}

const loadDepartmentlist = async () => {
  const data = await getDepartmentData()
  Departmentlist.value = data.results
}

const loadStaffNames = async () => {
  const data = await getStaffNames()
  staffNames.value = data.results
}

const loadlist = async () => {
  listLoading.value = true
  const data = await getStaffData(staffParams).finally(() => { listLoading.value = false })
  list.value = data.results
  counts.value = data.count
}

const handleQuery = async (page:number) => {
  staffParams.page = 1
  loadlist()
}

const handleDelete = async (id: string) => {
  const data = await deletStaff(id)
  if (data.status_code === 200) {
    ElMessage.success('删除成功')
    loadlist()
  }
}

// const handlecurrentpage = (page:number) => {
//   staffParams.page = page
//   loadlist()
// }

const handleupdate = (id:string) => {
  staffId.value = id
  formVisible.value = true
}

const handleFormSuccess = () => {
  formVisible.value = false
  loadlist()
}

</script>

<style lang="scss" scoped>

</style>
