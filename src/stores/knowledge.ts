import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Knowledge, PaginationParams } from '@/types'
import { mockKnowledgeList } from '@/api/mock/knowledge'

export const useKnowledgeStore = defineStore('knowledge', () => {
  const knowledgeList = ref<Knowledge[]>([])
  const currentKnowledge = ref<Knowledge | null>(null)
  const pagination = ref<PaginationParams>({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0
  })
  const loading = ref(false)
  const filters = ref({
    keyword: '',
    type: '' as string,
    equipmentType: '',
    status: ''
  })

  const knowledgeTypes = [
    { value: 'fault_solution', label: '故障解决方案' },
    { value: 'maintenance_guide', label: '维护保养指南' },
    { value: 'safety_procedure', label: '安全操作规程' },
    { value: 'manual', label: '操作手册' },
    { value: 'standard', label: '技术标准' },
    { value: 'training', label: '培训资料' }
  ]

  const typeColors: Record<string, string> = {
    fault_solution: 'bg-red-100 text-red-800',
    maintenance_guide: 'bg-blue-100 text-blue-800',
    safety_procedure: 'bg-orange-100 text-orange-800',
    manual: 'bg-purple-100 text-purple-800',
    standard: 'bg-green-100 text-green-800',
    training: 'bg-indigo-100 text-indigo-800'
  }

  const filteredList = computed(() => {
    let result = knowledgeList.value
    if (filters.value.keyword) {
      const keyword = filters.value.keyword.toLowerCase()
      result = result.filter(k =>
        k.title.toLowerCase().includes(keyword) ||
        k.summary.toLowerCase().includes(keyword)
      )
    }
    if (filters.value.type) {
      result = result.filter(k => k.type === filters.value.type)
    }
    return result
  })

  async function fetchList(params?: { page?: number; pageSize?: number }) {
    loading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 300))
      const page = params?.page || pagination.value.page
      const pageSize = params?.pageSize || pagination.value.pageSize
      
      
      knowledgeList.value = mockKnowledgeList
      pagination.value = {
        page,
        pageSize,
        total: mockKnowledgeList.length,
        totalPages: Math.ceil(mockKnowledgeList.length / pageSize)
      }
    } finally {
      loading.value = false
    }
  }

  async function fetchById(id: string) {
    loading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 200))
      currentKnowledge.value = mockKnowledgeList.find(k => k.id === id) || null
      if (currentKnowledge.value) {
        currentKnowledge.value.viewCount++
      }
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
      type: '',
      equipmentType: '',
      status: ''
    }
  }

  return {
    knowledgeList,
    currentKnowledge,
    pagination,
    loading,
    filters,
    knowledgeTypes,
    typeColors,
    filteredList,
    fetchList,
    fetchById,
    setFilters,
    resetFilters
  }
})
