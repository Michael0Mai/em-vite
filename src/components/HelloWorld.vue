<script setup lang="ts">
import { ref } from 'vue'
defineProps<{ msg: string }>()

const value = ref(new Date())

// const count = ref(0)
</script>

<template>
  <div class=container>
    <!-- <h1>{{ msg }}</h1> -->
      <!-- <el-button>中文</el-button> -->
      <el-calendar v-model="value" />
  </div>
</template>

<style lang="scss" scoped>
// @import '@/styles/variables.scss';

h1 {
  color: $injectedColor;
}

a {
  color: #42b983;
}

label {
  margin: 0 0.5em;
  font-weight: bold;
}

code {
  background-color: #eee;
  padding: 2px 4px;
  border-radius: 4px;
  color: #304455;
}

div {
  margin:0 auto;
}
</style>
