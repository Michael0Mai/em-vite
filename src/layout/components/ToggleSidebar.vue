<template>
<div class="collapse-container">
   <!-- <i
    :class="collapseIcon"
    @click="handleCollapse"
  /> -->
  <!-- <el-icon><expand /></el-icon>-->
  <i class="el-icon" @click="handleCollapse"><paperclip /></i>
  <!-- <i class="!$store.state.isCollapse ? el-icon-s-fold : 'el-icon-s-expand'"
  @click="$store.commit('setIsCollapse', !store.state.isCollapse)"
  />-->
</div>
</template>

<script lang="ts" setup>
import { useStore } from '@/store'
import { computed } from 'vue'

const store = useStore()

const collapseIcon = computed(() => {
  return !store.state.isCollapse ? 'el-icon-s-fold' : 'el-icon-s-expand'
})

const handleCollapse = () => {
  store.commit('setIsCollapse', !store.state.isCollapse)
}
</script>

<style lang="scss" scoped>

</style>
