<template>
  <!-- <img alt="Vue logo" src="./assets/logo.png" />
  <HelloWorld msg="Hello Vue 3 + TypeScript + Vite" /> -->
  <el-config-provider :locale="zhtw">
    <router-view />
  </el-config-provider>

</template>

<script lang='ts' setup>
import zhtw from 'element-plus/lib/locale/lang/zh-tw'
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0px;
  min-width: 1000px;
}
</style>
