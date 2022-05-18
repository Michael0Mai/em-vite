<template>
    <el-pagination background layout="total, prev, pager, next, jumper"
      :current-page = "props.page"
      :total = "counts"
      @current-change = "handlecurrentpage"
    />
</template>

<script lang='ts' setup>
const props = defineProps({ // 从父组件拿数据
  page: {
    type: Number,
    default: 1
  },
  counts: {
    type: Number,
    default: 0
  },
  loadlist: {
    type: Function,
    default: () => {}
  }
})
// const props = defineProps(['page', 'counts', 'loadlist']) // 简单没有类型的写法

// 分开写
// interface PropType { // 类型定义
//   page: number
//   counts: number
//   loadlist:() => void
// }

// // const props = defineProps<PropType>()
// const props = withDefaults(defineProps<PropType>(), { // 给出默认值
//   page: 1,
//   counts: 0,
//   loadlist: () => {}
// })

const emit = defineEmits(['update:page'])

const handlecurrentpage = (page:number) => {
  emit('update:page', page)
  props.loadlist()
}
</script>

<style lang="scss" scoped>
.el-pagination {
  margin-top: 15px;
  display: flex;
  justify-content: flex-end;
}
</style>
