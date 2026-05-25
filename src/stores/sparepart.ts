import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { SparePart } from '@/types'
import { mockSparePartList } from '@/api/mock/sparepart'

export const useSparePartStore = defineStore('sparepart', () => {
  const sparePartList = ref<SparePart[]>([])
  const currentPart = ref<SparePart | null>(null)
  const loading = ref(false)
  const filters = ref({
    keyword: '',
    category: '' as string,
    status: '' as string
  })

  const categoryLabels: Record<string, { label: string; desc: string }> = {
    A: { label: 'A类', desc: '高价值、关键' },
    B: { label: 'B类', desc: '中等价值' },
    C: { label: 'C类', desc: '低值易耗' }
  }

  const statusLabels: Record<string, string> = {
    normal: '正常',
    low: '库存过低',
    overstock: '库存过高',
    stagnant: '呆滞库存',
    expiring: '临期'
  }

  const statusColors: Record<string, { bg: string; text: string }> = {
    normal: { bg: 'bg-green-100', text: 'text-green-800' },
    low: { bg: 'bg-red-100', text: 'text-red-800' },
    overstock: { bg: 'bg-orange-100', text: 'text-orange-800' },
    stagnant: { bg: 'bg-gray-100', text: 'text-gray-800' },
    expiring: { bg: 'bg-yellow-100', text: 'text-yellow-800' }
  }

  const filteredList = computed(() => {
    let result = sparePartList.value
    if (filters.value.keyword) {
      const keyword = filters.value.keyword.toLowerCase()
      result = result.filter(p =>
        p.name.toLowerCase().includes(keyword) ||
        p.code.toLowerCase().includes(keyword)
      )
    }
    if (filters.value.category) {
      result = result.filter(p => p.category === filters.value.category)
    }
    if (filters.value.status) {
      result = result.filter(p => p.status === filters.value.status)
    }
    return result
  })

  const alerts = computed(() => {
    return sparePartList.value.filter(p => p.status !== 'normal')
  })

  const overview = computed(() => ({
    total: sparePartList.value.length,
    totalValue: sparePartList.value.reduce((sum, p) => sum + p.stock * p.price, 0),
    categoryA: sparePartList.value.filter(p => p.category === 'A').length,
    categoryB: sparePartList.value.filter(p => p.category === 'B').length,
    categoryC: sparePartList.value.filter(p => p.category === 'C').length,
    alertCount: alerts.value.length
  }))

  async function fetchList() {
    loading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 300))
      sparePartList.value = mockSparePartList
    } finally {
      loading.value = false
    }
  }

  async function fetchById(id: string) {
    loading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 200))
      currentPart.value = mockSparePartList.find(p => p.id === id) || null
    } finally {
      loading.value = false
    }
  }

  function setFilters(newFilters: Partial<typeof filters.value>) {
    filters.value = { ...filters.value, ...newFilters }
  }

  return {
    sparePartList,
    currentPart,
    loading,
    filters,
    categoryLabels,
    statusLabels,
    statusColors,
    filteredList,
    alerts,
    overview,
    fetchList,
    fetchById,
    setFilters
  }
})
