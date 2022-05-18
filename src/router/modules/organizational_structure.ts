import { RouteRecordRaw, RouterView } from 'vue-router'

const routes: RouteRecordRaw = {
  path: '/organizational_structure',
  name: 'organizational_structure',
  component: RouterView,
  meta: {
    title: '组织架构'
  },
  children: [
    {
      path: 'department',
      name: 'department',
      component: () => import('@/views/structures/department.vue'),
      meta: {
        title: '部门'
      }
    },
    {
      path: 'staff',
      name: 'staff',
      component: () => import('@/views/structures/staff.vue'),
      meta: {
        title: '员工'
      }
    }
  ]
}

export default routes
