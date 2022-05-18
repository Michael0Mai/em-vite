<template>
  <el-dialog
  width="50%"
  ref = "dialog"
  :close-on-click-modal = "false"
  :close-on-press-escape= "false"
  >
    <slot />
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handlecanel">取 消</el-button>
        <el-button type="primary"  @click="handleConfirm" :loading="confirmLoading">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import type { PropType } from 'vue'
import { IElDialog } from '@/types/element-plus'

const confirmLoading = ref(false)
const props = defineProps({
  confirm: {
    type: Function as PropType<() => Promise<void>>,
    default: () => Promise.resolve()
  }
})

const dialog = ref<IElDialog | null>(null)

// interface EmetsType {
//   (e:'confirm'): void
// }

// const emit = defineEmits<EmetsType>()

const handlecanel = () => {
//   console.log(dialog.value)
  if (dialog.value) {
    dialog.value.visible = false
  }
}

const handleConfirm = async () => {
  confirmLoading.value = true
  // emit('confirm')
  await props.confirm().finally(() => {
    confirmLoading.value = false
  })
}

</script>
