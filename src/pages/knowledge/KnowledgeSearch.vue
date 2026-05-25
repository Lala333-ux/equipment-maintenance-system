<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useKnowledgeStore } from '@/stores/knowledge'
import { mockCategoryTree } from '@/api/mock/knowledge'
import type { Knowledge } from '@/types'

const router = useRouter()
const knowledgeStore = useKnowledgeStore()

const searchKeyword = ref('')
const selectedCategory = ref('')
const expandedCategories = ref<string[]>(['fault', 'maintenance', 'safety'])

onMounted(() => {
  knowledgeStore.fetchList()
})

const handleSearch = () => {
  knowledgeStore.setFilters({ keyword: searchKeyword.value })
}

const handleCategorySelect = (categoryId: string) => {
  selectedCategory.value = categoryId
  knowledgeStore.setFilters({ type: categoryId })
}

const handleCardClick = (knowledge: Knowledge) => {
  router.push(`/knowledge/${knowledge.id}`)
}

const getTypeLabel = (type: string) => {
  const typeMap: Record<string, string> = {
    fault_solution: '故障解决方案',
    maintenance_guide: '维护保养指南',
    safety_procedure: '安全操作规程',
    manual: '操作手册',
    standard: '技术标准',
    training: '培训资料'
  }
  return typeMap[type] || type
}

const getTypeColorClass = (type: string) => {
  return knowledgeStore.typeColors[type] || 'bg-gray-100 text-gray-800'
}

const paginatedKnowledge = computed(() => {
  const start = (knowledgeStore.pagination.page - 1) * knowledgeStore.pagination.pageSize
  const end = start + knowledgeStore.pagination.pageSize
  return knowledgeStore.filteredList.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(knowledgeStore.filteredList.length / knowledgeStore.pagination.pageSize)
})

const handlePageChange = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    knowledgeStore.fetchList({ page })
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN')
}

const toggleCategory = (categoryId: string) => {
  const index = expandedCategories.value.indexOf(categoryId)
  if (index > -1) {
    expandedCategories.value.splice(index, 1)
  } else {
    expandedCategories.value.push(categoryId)
  }
}
</script>

<template>
  <div class="flex gap-6 h-full">
    <!-- 左侧边栏：分类过滤 -->
    <aside class="w-64 flex-shrink-0">
      <div class="bg-white rounded-lg shadow-sm p-4">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">知识分类</h3>
        
        <!-- 搜索框 -->
        <div class="mb-4">
          <div class="relative">
            <input
              v-model="searchKeyword"
              @keyup.enter="handleSearch"
              type="text"
              placeholder="搜索关键词..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
            />
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <button
            @click="handleSearch"
            class="w-full mt-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            搜索
          </button>
        </div>

        <!-- 分类树 -->
        <div class="space-y-2">
          <div v-for="category in mockCategoryTree" :key="category.id" class="border border-gray-200 rounded-lg">
            <button
              @click="toggleCategory(category.id)"
              class="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-gray-50 transition-colors"
            >
              <span class="font-medium text-gray-700">{{ category.label }}</span>
              <svg
                class="w-5 h-5 text-gray-500 transition-transform duration-200"
                :class="{ 'rotate-90': expandedCategories.includes(category.id) }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
            
            <div v-if="expandedCategories.includes(category.id)" class="px-3 pb-2">
              <div
                v-for="child in category.children"
                :key="child.id"
                @click="handleCategorySelect(child.id)"
                class="pl-4 py-1.5 text-sm cursor-pointer rounded hover:bg-primary-50 hover:text-primary-700 transition-colors"
                :class="selectedCategory === child.id ? 'bg-primary-50 text-primary-700 font-medium' : 'text-gray-600'"
              >
                {{ child.label }}
              </div>
            </div>
          </div>
        </div>

        <!-- 知识类型快速筛选 -->
        <div class="mt-6">
          <h4 class="text-sm font-medium text-gray-700 mb-3">快速筛选</h4>
          <div class="space-y-2">
            <button
              v-for="type in knowledgeStore.knowledgeTypes"
              :key="type.value"
              @click="handleCategorySelect(type.value)"
              class="w-full text-left px-3 py-2 text-sm rounded-lg transition-colors"
              :class="selectedCategory === type.value ? 'bg-primary-50 text-primary-700 font-medium' : 'text-gray-600 hover:bg-gray-50'"
            >
              {{ type.label }}
            </button>
          </div>
        </div>
      </div>
    </aside>

    <!-- 右侧内容：知识卡片网格 -->
    <div class="flex-1 overflow-auto">
      <!-- 加载状态 -->
      <div v-if="knowledgeStore.loading" class="flex items-center justify-center h-64">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p class="mt-3 text-gray-600">加载中...</p>
        </div>
      </div>

      <!-- 知识列表 -->
      <div v-else>
        <!-- 结果统计 -->
        <div class="mb-4 flex items-center justify-between">
          <p class="text-gray-600">
            共找到 <span class="font-semibold text-primary-600">{{ knowledgeStore.filteredList.length }}</span> 条知识
          </p>
        </div>

        <!-- 卡片网格 -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div
            v-for="knowledge in paginatedKnowledge"
            :key="knowledge.id"
            @click="handleCardClick(knowledge)"
            class="bg-white rounded-lg shadow-sm p-5 hover:shadow-md transition-shadow cursor-pointer border border-gray-200"
          >
            <!-- 标题和类型标签 -->
            <div class="flex items-start justify-between mb-3">
              <h3 class="text-lg font-semibold text-gray-800 flex-1 pr-3 line-clamp-2">
                {{ knowledge.title }}
              </h3>
              <span
                class="px-2.5 py-1 text-xs font-medium rounded-full whitespace-nowrap"
                :class="getTypeColorClass(knowledge.type)"
              >
                {{ getTypeLabel(knowledge.type) }}
              </span>
            </div>

            <!-- 摘要 -->
            <p class="text-gray-600 text-sm mb-4 line-clamp-3">
              {{ knowledge.summary }}
            </p>

            <!-- 标签 -->
            <div class="flex flex-wrap gap-2 mb-3">
              <span
                v-for="tag in knowledge.tags.slice(0, 3)"
                :key="tag"
                class="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded"
              >
                {{ tag }}
              </span>
            </div>

            <!-- 元信息 -->
            <div class="flex items-center justify-between text-sm text-gray-500 pt-3 border-t border-gray-100">
              <div class="flex items-center gap-4">
                <!-- 评分 -->
                <div class="flex items-center gap-1">
                  <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span class="font-medium text-gray-700">{{ knowledge.rating }}</span>
                </div>

                <!-- 浏览量 -->
                <div class="flex items-center gap-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>{{ knowledge.viewCount }}</span>
                </div>

                <!-- 点赞数 -->
                <div class="flex items-center gap-1">
                  <svg class="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" />
                  </svg>
                  <span>{{ knowledge.likeCount }}</span>
                </div>
              </div>

              <!-- 更新时间 -->
              <span>{{ formatDate(knowledge.updatedAt) }}</span>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-if="paginatedKnowledge.length === 0" class="flex flex-col items-center justify-center h-64 text-gray-500">
          <svg class="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-lg">未找到匹配的知识</p>
          <p class="text-sm mt-1">请尝试调整搜索条件</p>
        </div>

        <!-- 分页 -->
        <div v-if="totalPages > 1" class="mt-6 flex justify-center">
          <div class="flex items-center gap-2">
            <button
              @click="handlePageChange(knowledgeStore.pagination.page - 1)"
              :disabled="knowledgeStore.pagination.page <= 1"
              class="px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              上一页
            </button>
            
            <template v-for="page in totalPages" :key="page">
              <button
                v-if="page === 1 || page === totalPages || (page >= knowledgeStore.pagination.page - 1 && page <= knowledgeStore.pagination.page + 1)"
                @click="handlePageChange(page)"
                class="px-3 py-2 rounded-lg border transition-colors"
                :class="page === knowledgeStore.pagination.page ? 'bg-primary-600 text-white border-primary-600' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'"
              >
                {{ page }}
              </button>
              <span
                v-else-if="page === knowledgeStore.pagination.page - 2 || page === knowledgeStore.pagination.page + 2"
                class="px-2 text-gray-500"
              >
                ...
              </span>
            </template>

            <button
              @click="handlePageChange(knowledgeStore.pagination.page + 1)"
              :disabled="knowledgeStore.pagination.page >= totalPages"
              class="px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              下一页
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
