import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('@/pages/Dashboard.vue'),
    meta: { title: '首页仪表盘' }
  },
  {
    path: '/knowledge',
    name: 'KnowledgeSearch',
    component: () => import('@/pages/knowledge/KnowledgeSearch.vue'),
    meta: { title: '知识检索' }
  },
  {
    path: '/knowledge/:id',
    name: 'KnowledgeDetail',
    component: () => import('@/pages/knowledge/KnowledgeDetail.vue'),
    meta: { title: '知识详情' }
  },
  {
    path: '/equipment',
    name: 'EquipmentList',
    component: () => import('@/pages/equipment/EquipmentList.vue'),
    meta: { title: '设备台账' }
  },
  {
    path: '/equipment/:id',
    name: 'EquipmentDetail',
    component: () => import('@/pages/equipment/EquipmentDetail.vue'),
    meta: { title: '设备详情' }
  },
  {
    path: '/workorder',
    name: 'WorkOrderList',
    component: () => import('@/pages/workorder/WorkOrderList.vue'),
    meta: { title: '工单管理' }
  },
  {
    path: '/workorder/:id',
    name: 'WorkOrderDetail',
    component: () => import('@/pages/workorder/WorkOrderDetail.vue'),
    meta: { title: '工单详情' }
  },
  {
    path: '/workorder/report/new',
    name: 'FaultReport',
    component: () => import('@/pages/workorder/FaultReport.vue'),
    meta: { title: '故障登记' }
  },
  {
    path: '/sop',
    name: 'SOPList',
    component: () => import('@/pages/sop/SOPList.vue'),
    meta: { title: 'SOP管理' }
  },
  {
    path: '/sop/:id',
    name: 'SOPDetail',
    component: () => import('@/pages/sop/SOPDetail.vue'),
    meta: { title: 'SOP详情' }
  },
  {
    path: '/sop/execute/:id',
    name: 'SOPExecution',
    component: () => import('@/pages/sop/SOPExecution.vue'),
    meta: { title: 'SOP执行' }
  },
  {
    path: '/graph',
    name: 'KnowledgeGraph',
    component: () => import('@/pages/graph/KnowledgeGraph.vue'),
    meta: { title: '知识图谱' }
  },
  {
    path: '/sparepart',
    name: 'SparePartList',
    component: () => import('@/pages/sparepart/SparePartList.vue'),
    meta: { title: '备件管理' }
  },
  {
    path: '/sparepart/:id',
    name: 'InventoryDetail',
    component: () => import('@/pages/sparepart/InventoryDetail.vue'),
    meta: { title: '库存详情' }
  },
  {
    path: '/statistics',
    name: 'StatisticsBoard',
    component: () => import('@/pages/statistics/StatisticsBoard.vue'),
    meta: { title: '统计分析' }
  }
]

const router = createRouter({
  history: createWebHistory('/equipment-maintenance-system/'),
  routes
})

router.beforeEach((to, _from, next) => {
  document.title = `${to.meta.title || '设备检修知识系统'} - 设备检修知识系统 (2026版)`
  next()
})

export default router