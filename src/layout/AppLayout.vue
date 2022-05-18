<template>
  <div class="common-layout">
    <meta name="referrer" content="no-referrer" />
    <el-container>
      <el-aside >
        <AppMenu />
        </el-aside>
      <el-container>
        <el-header>
          <AppHeader />
        </el-header>
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts" setup>

import AppMenu from './components/AppMenu.vue'
import AppHeader from './components/AppHeader.vue'

</script>

<style lang="scss" scoped>

.el-container {
    height: 100vh;
};

.el-aside {
    background-color: antiquewhite;
    width: auto;
}

.el-main {
    background-color: antiquewhite;
}

.el-header {
  background-color: #faebd7;
  color: #333;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
