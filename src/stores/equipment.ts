import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Equipment, PaginationParams } from '@/types'
import { mockEquipmentList } from '@/api/mock/equipment'

export const useEquipmentStore = defineStore('equipment', () => {
  const equipmentList = ref<Equipment[]>([])
  const currentEquipment = ref<Equipment | null>(null)
  const pagination = ref<PaginationParams>({
    page: 1,
    pageSize: 12,
    total: 0,
    totalPages: 0
  })
  const loading = ref(false)
  const filters = ref({
    keyword: '',
    status: '' as string,
    type: '',
    department: ''
  })

  const statusColors: Record<string, { bg: string; text: string; dot: string }> = {
    normal: { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500' },
    warning: { bg: 'bg-yellow-100', text: 'text-yellow-800', dot: 'bg-yellow-500' },
    fault: { bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-500' },
    maintenance: { bg: 'bg-blue-100', text: 'text-blue-800', dot: 'bg-blue-500' },
    stopped: { bg: 'bg-gray-100', text: 'text-gray-800', dot: 'bg-gray-500' }
  }

  const statusLabels: Record<string, string> = {
    normal: '正常运行',
    warning: '预警',
    fault: '故障',
    maintenance: '维修中',
    stopped: '停机'
  }

  const criticalityLabels: Record<string, string> = {
    A: '关键设备',
    B: '重要设备',
    C: '一般设备',
    D: '辅助设备'
  }

  const overview = computed(() => {
    const list = equipmentList.value
    return {
      total: list.length,
      normal: list.filter(e => e.status === 'normal').length,
      warning: list.filter(e => e.status === 'warning').length,
      fault: list.filter(e => e.status === 'fault').length,
      maintenance: list.filter(e => e.status === 'maintenance').length,
      stopped: list.filter(e => e.status === 'stopped').length
    }
  })

  const filteredList = computed(() => {
    let result = equipmentList.value
    if (filters.value.keyword) {
      const keyword = filters.value.keyword.toLowerCase()
      result = result.filter(e =>
        e.name.toLowerCase().includes(keyword) ||
        e.code.toLowerCase().includes(keyword)
      )
    }
    if (filters.value.status) {
      result = result.filter(e => e.status === filters.value.status)
    }
    if (filters.value.type) {
      result = result.filter(e => e.type === filters.value.type)
    }
    if (filters.value.department) {
      result = result.filter(e => e.department === filters.value.department)
    }
    return result
  })

  const departments = computed(() => {
    const depts = new Set(equipmentList.value.map(e => e.department))
    return Array.from(depts).sort()
  })

  const equipmentTypes = computed(() => {
    const types = new Set(equipmentList.value.map(e => e.type))
    return Array.from(types).sort()
  })

  async function fetchList(params?: { page?: number; pageSize?: number }) {
    loading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 300))
      const page = params?.page || pagination.value.page
      const pageSize = params?.pageSize || pagination.value.pageSize
      
      equipmentList.value = mockEquipmentList
      pagination.value = {
        page,
        pageSize,
        total: mockEquipmentList.length,
        totalPages: Math.ceil(mockEquipmentList.length / pageSize)
      }
    } finally {
      loading.value = false
    }
  }

  async function fetchById(id: string) {
    loading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 200))
      currentEquipment.value = mockEquipmentList.find(e => e.id === id) || null
    } finally {
      loading.value = false
    }
  }

  function setFilters(newFilters: Partial<typeof filters.value>) {
    filters.value = { ...filters.value, ...newFilters }
  }

  function resetFilters() {
    filters.value = {
      keyword: '',
      status: '',
      type: '',
      department: ''
    }
  }

  return {
    equipmentList,
    currentEquipment,
    pagination,
    loading,
    filters,
    statusColors,
    statusLabels,
    criticalityLabels,
    overview,
    filteredList,
    departments,
    equipmentTypes,
    fetchList,
    fetchById,
    setFilters,
    resetFilters
  }
})
