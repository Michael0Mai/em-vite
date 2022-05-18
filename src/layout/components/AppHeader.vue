<template>
<div class="appheader">
  <el-space size="large">
    <ToggleSidebar />
    <Breadcrumb />
  </el-space>
  <el-space class="right-edge"   size="large">
    <!-- <MenuSearch /> -->
    <FullScreen />
    <!-- <Notification /> -->
    <UserInfo />
  </el-space>
</div>
</template>

<script lang="ts" setup>
import ToggleSidebar from './ToggleSidebar.vue'
import Breadcrumb from './Breadcrumb.vue'
// import MenuSearch from './MenuSearch.vue'
import FullScreen from './FullScreen.vue'
// import Notification from './Notification.vue'
import UserInfo from './UserInfo.vue'

</script>

<style lang="scss" scoped>
i {
  font-size: 19px;
  cursor: pointer;
}

.el-space {
    background-color: #faebd7;
    border-right: none;
}

.right-edge {
  position: absolute;
  right: 0px;
}
</style>
