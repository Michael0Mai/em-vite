<template>
<div class="page-container">
    <el-card class="box-card select-box">
        <template #header> 数据筛选 </template>
            <el-form class="filter" :inline="true" :model='equipmentParams' :disabled="listLoading">
                <el-form-item label="编号">
                    <el-input v-model="equipmentParams.serial_number" clearable placeholder="输入编号以搜索" @clear="handleQuery" @change="handleQuery">
                        <template #prefix>
                            <el-icon class="el-input__icon"><search /></el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item label="别名">
                    <el-input v-model="equipmentParams.cname__icontains" clearable placeholder="输入别名以搜索" @clear="handleQuery" @change="handleQuery">
                        <template #prefix>
                            <el-icon class="el-input__icon"><search /></el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item label="型号">
                    <el-select v-model="equipmentParams.model" clearable filterable placeholder="请选择型号" @change="handleQuery" @focus="loadModelNames">
                        <el-option v-for="item in ModelNames" :key="item.id" :value="item.id" :label="item.name" />
                    </el-select>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select v-model="equipmentParams.status" clearable filterable placeholder="请选择状态" @change="handleQuery" @focus="loadStatusNames">
                        <el-option v-for="item in StatusNames" :key="item.id" :value="item.id" :label="item.status" />
                    </el-select>
                </el-form-item>
            </el-form>
    </el-card>
    <el-card class="box-card">
        <template #header>
            <div class="card-header">
                <el-button color="#626aef" @click="loadlist" :disabled="listLoading">刷新数据</el-button>
                <el-button type="primary" @click="formVisible = true" :disabled="!ismanager">添加设备</el-button>
            </div>
        </template>
        <el-table
        v-loading="listLoading"
        :data="list"
        height-max="900"
        style="width: 100%"
        stripe
        highlight-current-row
        table-layout="fixed"
        >
            <el-table-column type="expand">
                <template #default="scope">
                    <div class="equement-expand">
                        <div class="expand-column">
                            <p class="expand-column-item">型号: {{ scope.row.model.name }} - ({{scope.row.model.cname}})</p>
                            <p class="expand-column-item">供应商: {{ scope.row.model.manufacturer.name }}</p>
                            <p class="expand-column-item">售后: {{ scope.row.model.manufacturer.after_sales_charger }}</p>
                            <p class="expand-column-item">售后电话: {{ scope.row.model.manufacturer.after_sales_phone }}</p>
                            <p class="expand-column-item">技术支持: {{ scope.row.model.manufacturer.technical_support_charger }}</p>
                            <p class="expand-column-item">技术支持电话: {{ scope.row.model.manufacturer.technical_support_phone }}</p>
                            <p class="expand-column-item">网址: {{ scope.row.model.manufacturer.web }}</p>
                        </div>
                        <div class="box-card expand-column">
                            <p class="expand-column-item">状态: {{ scope.row.status.status }}</p>
                            <p class="expand-column-item">性能: {{ scope.row.performance.performance }}</p>
                            <p class="expand-column-item">价格: {{ scope.row.price }}</p>
                            <p class="expand-column-item">购买日期: {{ scope.row.purchase_date }}</p>
                        </div>
                        <div class="box-card expand-column">
                            <p class="expand-column-item">负责人: {{ scope.row.charger.name }} - ({{scope.row.charger.phone}})</p>
                            <p class="expand-column-item">部门: {{ scope.row.charger.department.name }}</p>
                            <div class="qrcode" :id="scope.row.id">
                                <qrcode-vue :value="'http://' + ipAddr + '/#/equipment_detail/' + scope.row.id" :size="150" level="H" />
                            </div>
                        </div>
                        <div class="box-card expand-column remark" >
                            <p style="text-align:center; font-size:18px;">备注</p>
                            <p class="expand-column-item">{{ scope.row.remark }}</p>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="serial_number" label="编号" min-width="100">
                <template #default="scope">
                   ABC{{scope.row.serial_number}}-{{scope.row.purchase_date.slice(0,4)}}-{{scope.row.charger.department.abbreviation}}
                </template>
            </el-table-column>
            <el-table-column prop="cname" label="别名" min-width="80" />
            <el-table-column prop="model.name" label="型号" min-width="80" />
            <el-table-column prop="performance.performance" label="性能" min-width="40" />
            <el-table-column prop="status.status" label="状态" min-width="70" />
            <el-table-column prop="charger.name" label="负责人" min-width="60" />
            <!-- <el-table-column prop="price" label="价格" min-width="60" /> -->
            <!-- <el-table-column prop="purchase_date" label="购买日期" min-width="70" /> -->
            <el-table-column label="操作" align="center" min-width="100" fixed="right">
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
            v-model:page = "equipmentParams.page"
            :total = "counts"
            :loadlist="loadlist"
            :disabled="listLoading"
        />
    </el-card>
    <equipment-Form
        v-model="formVisible"
        :equipmentId = "equipmentId"
        @closed = "equipmentId=null"
        @success = "handleFormSuccess"
    />
</div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import QrcodeVue from 'qrcode.vue'
import { getEquipmentData, deletEquipment } from '@/api/equipment'
import { getModelNames } from '@/api/equipment_model'
import { getStatusData } from '@/api/equipment_status'
import { isAdmin } from '@/utils/isAdmin'
import equipmentForm from './equipmentForm.vue'


const list = ref([])
const ismanager = ref(false)
const listLoading = ref(true)
const counts = ref()
const formVisible = ref(false)
const ModelNames = ref([])
const StatusNames = ref([])
const ipAddr = location.host
const equipmentId = ref<string | null>(null)

const equipmentParams = reactive({ // 搜索用
  is_delete: false,
  serial_number: null,
  cname__icontains: '',
  model: '',
  status: '',
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
  const data = await getEquipmentData(equipmentParams).finally(() => { listLoading.value = false })
  list.value = data.results
  counts.value = data.count
}

const handleQuery = async (page:number) => {
  equipmentParams.page = 1
  loadlist()
}

const handleupdate = (id:string) => {
  equipmentId.value = id
  formVisible.value = true
}

const handleDelete = async (id:string) => {
  const data = await deletEquipment(id)
  if (data.status_code === 200) {
    ElMessage.success('删除成功')
    loadlist()
  }
}

const loadModelNames = async () => {
  const data = await getModelNames()
  ModelNames.value = data.results
}

const loadStatusNames = async () => {
  const data = await getStatusData()
  StatusNames.value = data.results
}

const handleFormSuccess = () => {
  formVisible.value = false
  loadlist()
}

</script>

<style lang="scss" scoped>
.equement-expand{
    display: grid;
    grid-template-columns: 40% 30% 30%;
    // grid-template-rows: 50% 50%;
    grid-row-gap: 5px;
    grid-column-gap: 5px;
    .remark{
        grid-column: 1 / 4;
    }
}

// .equement-expand {
//     display: flex;
//     flex-wrap: wrap;
//     .expand-column {
//          width: 33.3%;
//     }
// }
</style>
