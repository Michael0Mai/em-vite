import { App } from '@vue/runtime-dom'
import PaginationComponent from './Pagination.vue'
import DialofFormComponent from './DialofForm.vue'

export default {
  install (app: App) {
    app.component('AppPagination', PaginationComponent)
    app.component('AppDialofForm', DialofFormComponent)
  }
}
