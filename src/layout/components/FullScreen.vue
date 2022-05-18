<template>
   <i class="el-icon" @click="toggleFullScreen">
     <full-screen />
   </i>
   <!-- <span>全屏</span> -->
</template>

<script lang="ts" setup>
const toggleFullScreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen()
    }
  }
}
</script>

<style lang="scss" scoped></style>
