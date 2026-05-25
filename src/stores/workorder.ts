import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { WorkOrder } from '@/types'
import { mockWorkOrderList } from '@/api/mock/workorder'

export const useWorkOrderStore = defineStore('workorder', () => {
  const workOrderList = ref<WorkOrder[]>([])
  const currentOrder = ref<WorkOrder | null>(null)
  const loading = ref(false)
  const filters = ref({
    keyword: '',
    status: '' as string,
    type: '' as string,
    priority: '' as string
  })

  const statusFlow = [
    'created',
    'pending_dispatch',
    'dispatched',
    'accepted',
    'processing',
    'pending_acceptance',
    'completed'
  ]

  const statusLabels: Record<string, string> = {
    created: '已创建',
    pending_dispatch: '待派发',
    dispatched: '已派发',
    accepted: '已接单',
    processing: '处理中',
    pending_acceptance: '待验收',
    completed: '已完成',
    cancelled: '已取消'
  }

  const statusColors: Record<string, { bg: string; text: string }> = {
    created: { bg: 'bg-gray-100', text: 'text-gray-800' },
    pending_dispatch: { bg: 'bg-purple-100', text: 'text-purple-800' },
    dispatched: { bg: 'bg-blue-100', text: 'text-blue-800' },
    accepted: { bg: 'bg-cyan-100', text: 'text-cyan-800' },
    processing: { bg: 'bg-orange-100', text: 'text-orange-800' },
    pending_acceptance: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
    completed: { bg: 'bg-green-100', text: 'text-green-800' },
    cancelled: { bg: 'bg-red-100', text: 'text-red-800' }
  }

  const priorityLabels: Record<string, string> = {
    P1: '紧急',
    P2: '严重',
    P3: '一般',
    P4: '轻微'
  }

  const priorityColors: Record<string, { bg: string; text: string }> = {
    P1: { bg: 'bg-red-100', text: 'text-red-800' },
    P2: { bg: 'bg-orange-100', text: 'text-orange-800' },
    P3: { bg: 'bg-blue-100', text: 'text-blue-800' },
    P4: { bg: 'bg-gray-100', text: 'text-gray-800' }
  }

  const typeLabels: Record<string, string> = {
    fault_repair: '故障维修',
    planned_maintenance: '计划保养',
    inspection: '巡检',
    emergency: '应急抢修',
    modification: '改造'
  }

  const kanbanData = computed(() => {
    return {
      pending: workOrderList.value.filter(w => w.status === 'pending_dispatch'),
      processing: workOrderList.value.filter(w => ['dispatched', 'accepted', 'processing'].includes(w.status)),
      pendingAccept: workOrderList.value.filter(w => w.status === 'pending_acceptance'),
      completed: workOrderList.value.filter(w => w.status === 'completed')
    }
  })

  const filteredList = computed(() => {
    let result = workOrderList.value
    if (filters.value.keyword) {
      const keyword = filters.value.keyword.toLowerCase()
      result = result.filter(w =>
        w.code.toLowerCase().includes(keyword) ||
        w.equipment.name.toLowerCase().includes(keyword) ||
        w.fault.phenomenon.toLowerCase().includes(keyword)
      )
    }
    if (filters.value.status) {
      result = result.filter(w => w.status === filters.value.status)
    }
    if (filters.value.type) {
      result = result.filter(w => w.type === filters.value.type)
    }
    if (filters.value.priority) {
      result = result.filter(w => w.priority === filters.value.priority)
    }
    return result
  })

  const overview = computed(() => ({
    total: workOrderList.value.length,
    pending: workOrderList.value.filter(w => w.status === 'pending_dispatch').length,
    processing: workOrderList.value.filter(w => ['dispatched', 'accepted', 'processing'].includes(w.status)).length,
    completed: workOrderList.value.filter(w => w.status === 'completed').length
  }))

  async function fetchList() {
    loading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 300))
      workOrderList.value = mockWorkOrderList
    } finally {
      loading.value = false
    }
  }

  async function fetchById(id: string) {
    loading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 200))
      currentOrder.value = mockWorkOrderList.find(w => w.id === id) || null
    } finally {
      loading.value = false
    }
  }

  function updateStatus(id: string, status: WorkOrder['status']) {
    const order = workOrderList.value.find(w => w.id === id)
    if (order) {
      order.status = status
      if (status === 'completed') {
        order.completedAt = new Date().toISOString()
      }
    }
  }

  function setFilters(newFilters: Partial<typeof filters.value>) {
    filters.value = { ...filters.value, ...newFilters }
  }

  return {
    workOrderList,
    currentOrder,
    loading,
    filters,
    statusFlow,
    statusLabels,
    statusColors,
    priorityLabels,
    priorityColors,
    typeLabels,
    kanbanData,
    filteredList,
    overview,
    fetchList,
    fetchById,
    updateStatus,
    setFilters
  }
})
