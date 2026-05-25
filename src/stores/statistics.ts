import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { DashboardStats } from '@/types'

export const useStatisticsStore = defineStore('statistics', () => {
  const loading = ref(false)
  const dashboardStats = ref<DashboardStats>({
    equipmentOverview: {
      total: 156,
      normal: 128,
      warning: 12,
      fault: 6,
      maintenance: 10
    },
    workOrderOverview: {
      total: 89,
      pending: 15,
      processing: 23,
      completed: 51
    },
    knowledgeOverview: {
      total: 1245,
      published: 1089,
      thisMonth: 56
    },
    sparePartAlerts: 8
  })

  const equipmentTrend = ref([
    { month: '1月', normal: 120, fault: 5 },
    { month: '2月', normal: 122, fault: 4 },
    { month: '3月', normal: 118, fault: 7 },
    { month: '4月', normal: 125, fault: 3 },
    { month: '5月', normal: 128, fault: 6 },
    { month: '6月', normal: 130, fault: 4 }
  ])

  const workOrderTrend = ref([
    { month: '1月', created: 45, completed: 42 },
    { month: '2月', created: 38, completed: 40 },
    { month: '3月', created: 52, completed: 48 },
    { month: '4月', created: 48, completed: 50 },
    { month: '5月', created: 55, completed: 52 },
    { month: '6月', created: 50, completed: 48 }
  ])

  const faultDistribution = ref([
    { type: '机械故障', count: 45, percentage: 35 },
    { type: '电气故障', count: 32, percentage: 25 },
    { type: '液压故障', count: 26, percentage: 20 },
    { type: '控制故障', count: 18, percentage: 14 },
    { type: '其他', count: 7, percentage: 6 }
  ])

  const departmentWorkload = ref([
    { department: '生产车间A', orders: 28, completed: 25 },
    { department: '生产车间B', orders: 22, completed: 20 },
    { department: '生产车间C', orders: 18, completed: 16 },
    { department: '动力车间', orders: 12, completed: 11 },
    { department: '装配车间', orders: 9, completed: 8 }
  ])

  const topFaultEquipment = ref([
    { name: 'CNC加工中心 #03', count: 8, mtbf: 45 },
    { name: '数控车床 #12', count: 6, mtbf: 52 },
    { name: '注塑机 #05', count: 5, mtbf: 68 },
    { name: '焊接机器人 #02', count: 4, mtbf: 75 },
    { name: '激光切割机 #01', count: 3, mtbf: 82 }
  ])

  const repairEfficiency = ref({
    avgResponseTime: 25,
    avgRepairTime: 145,
    avgDowntime: 180,
    firstTimeFix: 78
  })

  const kpiMetrics = ref({
    oee: 87.5,
    mtbf: 720,
    mttr: 3.2,
    availability: 95.8
  })

  async function fetchDashboard() {
    loading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 300))
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    dashboardStats,
    equipmentTrend,
    workOrderTrend,
    faultDistribution,
    departmentWorkload,
    topFaultEquipment,
    repairEfficiency,
    kpiMetrics,
    fetchDashboard
  }
})
