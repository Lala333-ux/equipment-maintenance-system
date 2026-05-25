<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useKnowledgeStore } from '@/stores/knowledge'
import { mockKnowledgeList } from '@/api/mock/knowledge'
import type { Knowledge } from '@/types'

const route = useRoute()
const router = useRouter()
const knowledgeStore = useKnowledgeStore()

const knowledge = ref<Knowledge | null>(null)
const loading = ref(true)
const isLiked = ref(false)
const currentRating = ref(0)

onMounted(async () => {
  const id = route.params.id as string
  loading.value = true
  try {
    await knowledgeStore.fetchById(id)
    knowledge.value = knowledgeStore.currentKnowledge
    currentRating.value = knowledge.value?.rating || 0
  } finally {
    loading.value = false
  }
})

const relatedKnowledge = computed(() => {
  if (!knowledge.value) return []
  return mockKnowledgeList
    .filter(k => k.id !== knowledge.value!.id && k.type === knowledge.value!.type)
    .slice(0, 4)
})

const handleBack = () => {
  router.push('/knowledge')
}

const handleLike = () => {
  isLiked.value = !isLiked.value
  if (knowledge.value) {
    knowledge.value.likeCount += isLiked.value ? 1 : -1
  }
}

const handleRating = (rating: number) => {
  currentRating.value = rating
  if (knowledge.value) {
    const totalRating = knowledge.value.rating * knowledge.value.viewCount + rating
    knowledge.value.rating = Math.round((totalRating / (knowledge.value.viewCount + 1)) * 10) / 10
  }
}

const goToRelatedKnowledge = (relatedId: string) => {
  router.push(`/knowledge/${relatedId}`)
  window.location.reload()
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

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}
</script>

<template>
  <div class="max-w-5xl mx-auto">
    <!-- 加载状态 -->
    <div v-if="loading" class="flex items-center justify-center h-96">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p class="mt-3 text-gray-600">加载中...</p>
      </div>
    </div>

    <!-- 知识详情 -->
    <div v-else-if="knowledge" class="space-y-6">
      <!-- 返回按钮 -->
      <button
        @click="handleBack"
        class="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span>返回知识列表</span>
      </button>

      <!-- 主要内容卡片 -->
      <div class="bg-white rounded-lg shadow-sm p-8">
        <!-- 标题和类型 -->
        <div class="flex items-start justify-between mb-6">
          <div class="flex-1">
            <h1 class="text-2xl font-bold text-gray-800 mb-3">
              {{ knowledge.title }}
            </h1>
            <div class="flex items-center gap-4 text-sm text-gray-500">
              <span class="flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {{ knowledge.author.name }}
              </span>
              <span class="flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ formatDate(knowledge.updatedAt) }}
              </span>
              <span class="flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {{ knowledge.viewCount }} 次浏览
              </span>
            </div>
          </div>
          <span
            class="px-3 py-1.5 text-sm font-medium rounded-full"
            :class="getTypeColorClass(knowledge.type)"
          >
            {{ getTypeLabel(knowledge.type) }}
          </span>
        </div>

        <!-- 标签 -->
        <div class="flex flex-wrap gap-2 mb-6">
          <span
            v-for="tag in knowledge.tags"
            :key="tag"
            class="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full"
          >
            {{ tag }}
          </span>
        </div>

        <!-- 摘要 -->
        <div class="mb-6 p-4 bg-primary-50 rounded-lg border border-primary-100">
          <h3 class="font-semibold text-gray-800 mb-2">摘要</h3>
          <p class="text-gray-600">{{ knowledge.summary }}</p>
        </div>

        <!-- 正文内容 -->
        <div class="prose prose-lg max-w-none mb-8">
          <div v-html="knowledge.content"></div>
        </div>

        <!-- 附件 -->
        <div v-if="knowledge.attachments.length > 0" class="mb-8">
          <h3 class="font-semibold text-gray-800 mb-3">附件下载</h3>
          <div class="space-y-2">
            <div
              v-for="attachment in knowledge.attachments"
              :key="attachment.id"
              class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div class="flex items-center gap-3">
                <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <div>
                  <p class="font-medium text-gray-700">{{ attachment.name }}</p>
                  <p class="text-sm text-gray-500">{{ formatFileSize(attachment.size) }}</p>
                </div>
              </div>
              <button class="px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                下载
              </button>
            </div>
          </div>
        </div>

        <!-- 评分和点赞 -->
        <div class="flex items-center justify-between pt-6 border-t border-gray-200">
          <div>
            <h4 class="font-medium text-gray-700 mb-2">知识评分</h4>
            <div class="flex items-center gap-2">
              <button
                v-for="star in 5"
                :key="star"
                @click="handleRating(star)"
                class="transition-colors"
                :class="star <= currentRating ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'"
              >
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
              <span class="ml-2 text-sm text-gray-600">
                ({{ knowledge.rating.toFixed(1) }})
              </span>
            </div>
          </div>

          <button
            @click="handleLike"
            class="flex items-center gap-2 px-6 py-3 rounded-lg transition-colors"
            :class="isLiked ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600'"
          >
            <svg class="w-6 h-6" :fill="isLiked ? 'currentColor' : 'none'" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span class="font-medium">{{ knowledge.likeCount }}</span>
          </button>
        </div>
      </div>

      <!-- 相关知识 -->
      <div v-if="relatedKnowledge.length > 0" class="bg-white rounded-lg shadow-sm p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">相关知识</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            v-for="related in relatedKnowledge"
            :key="related.id"
            @click="goToRelatedKnowledge(related.id)"
            class="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all cursor-pointer"
          >
            <h4 class="font-medium text-gray-800 mb-2 line-clamp-2">
              {{ related.title }}
            </h4>
            <p class="text-sm text-gray-600 line-clamp-2 mb-2">
              {{ related.summary }}
            </p>
            <div class="flex items-center justify-between text-xs text-gray-500">
              <span
                class="px-2 py-0.5 rounded-full"
                :class="getTypeColorClass(related.type)"
              >
                {{ getTypeLabel(related.type) }}
              </span>
              <span class="flex items-center gap-1">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {{ related.rating }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 未找到 -->
    <div v-else class="flex flex-col items-center justify-center h-96 text-gray-500">
      <svg class="w-20 h-20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p class="text-xl">未找到该知识</p>
      <button
        @click="handleBack"
        class="mt-4 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
      >
        返回列表
      </button>
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

.prose :deep(h2) {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}

.prose :deep(h3) {
  font-size: 1.125rem;
  font-weight: 600;
  color: #374151;
  margin-top: 1.25rem;
  margin-bottom: 0.5rem;
}

.prose :deep(p) {
  margin-bottom: 1rem;
  line-height: 1.75;
  color: #4b5563;
}

.prose :deep(ul),
.prose :deep(ol) {
  margin-left: 1.5rem;
  margin-bottom: 1rem;
}

.prose :deep(li) {
  margin-bottom: 0.5rem;
  line-height: 1.75;
  color: #4b5563;
}

.prose :deep(ul li) {
  list-style-type: disc;
}

.prose :deep(ol li) {
  list-style-type: decimal;
}

.prose :deep(strong) {
  font-weight: 600;
  color: #1f2937;
}
</style>
