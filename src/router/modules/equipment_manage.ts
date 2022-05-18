import { RouteRecordRaw, RouterView } from 'vue-router'

const routes: RouteRecordRaw = {
  path: '/equipment_manage',
  name: 'equipment_manage',
  component: RouterView,
  meta: {
    title: '设备管理'
  },
  children: [
    {
      path: 'equipment',
      name: 'equipment',
      component: () => import('@/views/equipments/equipment.vue'),
      meta: {
        title: '设备'
      }
    },
    {
      path: 'equipment_model',
      name: 'equipment_model',
      component: () => import('@/views/equipments/equipment_model.vue'),
      meta: {
        title: '型号'
      }
    },
    {
      path: 'equipment_type',
      name: 'equipment_type',
      component: () => import('@/views/equipments/equipment_type.vue'),
      meta: {
        title: '类型'
      }
    },
    {
      path: 'manufacturer',
      name: 'manufacturer',
      component: () => import('@/views/equipments/manufacturer.vue'),
      meta: {
        title: '生产商'
      }
    },
    {
      path: 'equipment_status',
      name: 'equipment_status',
      component: () => import('@/views/equipments/equipment_status.vue'),
      meta: {
        title: '状态'
      }
    },
    {
      path: 'equipment_performance',
      name: 'equipment_performance',
      component: () => import('@/views/equipments/equipment_performance.vue'),
      meta: {
        title: '性能'
      }
    }
  ]
}

export default routes
