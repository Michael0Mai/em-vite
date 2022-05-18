<template>
<div>
    <!-- <img alt="Vue logo" src="@/assets/logo.png" /> -->
    <HelloWorld msg="Hello Vue 3 + TypeScript + Vite" />
    <!-- <p>{{ $store.state.count }}</p>
    <p>{{ store.state.count }}</p> -->
</div>

</template>

<script lang = 'ts' setup>
import HelloWorld from '@/components/HelloWorld.vue'
// import { useStore } from 'vuex'
import { useStore } from '@/store'

const store = useStore()

</script>

<style lang="scss" scoped></style>
