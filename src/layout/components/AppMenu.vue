<template>
<div class = menucontainer>
  <!-- <el-radio-group v-model="isCollapse" style="margin-bottom: 20px">
    <el-radio-button :label="false">展开</el-radio-button>
    <el-radio-button :label="true">折叠</el-radio-button>
  </el-radio-group> -->
  <el-menu
    default-active="/equipments"
    class="el-menu-vertical-demo"
    :collapse="$store.state.isCollapse"
    @open="handleOpen"
    @close="handleClose"
    router
  >
    <el-menu-item index="/">
        <el-icon><house /></el-icon>
        <span>首页</span>
    </el-menu-item>

    <el-sub-menu index="/equipments">
      <template #title>
        <el-icon><operation /></el-icon>
        <span>设备管理</span>
      </template>
        <el-menu-item index="/equipment_manage/equipment/">设备</el-menu-item>
        <el-menu-item index="/equipment_manage/equipment_model/">型号</el-menu-item>
        <el-menu-item index="/equipment_manage/equipment_type/">类型</el-menu-item>
        <el-menu-item index="/equipment_manage/equipment_status/">状态</el-menu-item>
        <el-menu-item index="/equipment_manage/equipment_performance/">性能</el-menu-item>
        <el-menu-item index="/equipment_manage/manufacturer/">供应商</el-menu-item>
    </el-sub-menu>

    <el-sub-menu index="/organizational_structure">
      <template #title>
        <el-icon><user-filled /></el-icon>
        <span>组织架构</span>
      </template>
        <el-menu-item index="/organizational_structure/staff">员工</el-menu-item>
        <el-menu-item index="/organizational_structure/department">部门</el-menu-item>
    </el-sub-menu>

  </el-menu>
</div>
</template>

<script lang="ts" setup>
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting
} from '@element-plus/icons-vue'

const handleOpen = (key: string, keyPath: string[]) => {
  // console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  // console.log(key, keyPath)
}
</script>

<style lang=scss scoped>
.el-radio-group {
    margin-top: 30px;
}

.el-menu {
    background-color: #faebd7;
    border-right: none;
}

.el-menu-item{
    background-color: #faebd7;
    border-right: none;
}

.el-menu:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
</style>
