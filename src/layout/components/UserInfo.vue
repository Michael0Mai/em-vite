<template>
  <el-dropdown>
    <span class="el-dropdown-link">
      {{ $store.state.user?.username }}
      <el-icon><arrow-down-bold /></el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <!-- <el-dropdown-item>个人中心</el-dropdown-item> -->
        <el-dropdown-item @click="handleLogou">
          退出登录
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
// import { useStore } from '@/store'
import { store } from '@/store'
const router = useRouter()
// const store = useStore()

const handleLogou = () => {
  ElMessageBox.confirm('确认退出吗？', '退出提示', { // 退出提示
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    store.commit('setUser', null) // 清除用户登录信息
    store.commit('setToken', null) // 清除用户登录信息
    ElMessage({
      type: 'success',
      message: '退出成功!'
    })
    router.push({ // 跳转到登录页
      name: 'login'
    })
  }).catch(() => {
    ElMessage({
      type: 'info',
      message: '已取消退出'
    })
  })
}
</script>

<style lang="scss" scoped></style>
