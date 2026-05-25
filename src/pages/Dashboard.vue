<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useStatisticsStore } from '@/stores/statistics'
import { useWorkOrderStore } from '@/stores/workorder'
import { useKnowledgeStore } from '@/stores/knowledge'
import type { WorkOrder, Knowledge } from '@/types'
import { useRouter } from 'vue-router'

const router = useRouter()
const statisticsStore = useStatisticsStore()
const workOrderStore = useWorkOrderStore()
const knowledgeStore = useKnowledgeStore()

const pendingWorkOrders = ref<WorkOrder[]>([])
const recentKnowledge = ref<Knowledge[]>([])

const quickAccessItems = [
  { label: '故障登记', path: '/workorder/report/new', icon: 'alert' },
  { label: '知识检索', path: '/knowledge', icon: 'book' },
  { label: '设备台账', path: '/equipment', icon: 'cog' },
  { label: 'SOP管理', path: '/sop', icon: 'document' },
  { label: '知识图谱', path: '/graph', icon: 'chart' },
  { label: '统计分析', path: '/statistics', icon: 'chart-bar' }
]

const statCards = [
  { label: '设备总数', value: 156, unit: '台', color: 'green', icon: 'cog' },
  { label: '今日工单', value: 8, unit: '单', color: 'blue', icon: 'clipboard' },
  { label: '知识总数', value: 1245, unit: '篇', color: 'purple', icon: 'book' },
  { label: '备件预警', value: 5, unit: '项', color: 'red', icon: 'alert' }
]

onMounted(async () => {
  await Promise.all([
    statisticsStore.fetchDashboard(),
    workOrderStore.fetchList(),
    knowledgeStore.fetchList()
  ])

  pendingWorkOrders.value = workOrderStore.workOrderList
    .filter(w => w.status !== 'completed' && w.status !== 'cancelled')
    .slice(0, 5)

  recentKnowledge.value = knowledgeStore.knowledgeList
    .filter(k => k.status === 'published')
    .slice(0, 5)
})

const navigateTo = (path: string) => {
  router.push(path)
}

const formatTime = (timeString: string) => {
  const date = new Date(timeString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days}天前`
  if (hours > 0) return `${hours}小时前`
  return '刚刚'
}
</script>

<template>
  <div class="space-y-6">
    <!-- 统计卡片区域 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div
        v-for="stat in statCards"
        :key="stat.label"
        class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
      >
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 mb-1">{{ stat.label }}</p>
            <div class="flex items-baseline gap-2">
              <span class="text-3xl font-bold" :class="`text-${stat.color}-600`">
                {{ stat.value }}
              </span>
              <span class="text-sm text-gray-500">{{ stat.unit }}</span>
            </div>
          </div>
          <div :class="`w-12 h-12 rounded-lg bg-${stat.color}-100 flex items-center justify-center`">
            <svg v-if="stat.icon === 'cog'" class="w-6 h-6" :class="`text-${stat.color}-600`" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <svg v-else-if="stat.icon === 'clipboard'" class="w-6 h-6" :class="`text-${stat.color}-600`" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            <svg v-else-if="stat.icon === 'book'" class="w-6 h-6" :class="`text-${stat.color}-600`" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <svg v-else-if="stat.icon === 'alert'" class="w-6 h-6" :class="`text-${stat.color}-600`" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- 快速访问按钮 -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 class="text-lg font-semibold text-gray-800 mb-4">快速访问</h2>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <button
          v-for="item in quickAccessItems"
          :key="item.label"
          @click="navigateTo(item.path)"
          class="flex flex-col items-center justify-center p-4 rounded-lg border-2 border-gray-100 hover:border-primary-500 hover:bg-primary-50 transition-all duration-200 group"
        >
          <div class="w-10 h-10 rounded-lg bg-gray-100 group-hover:bg-primary-100 flex items-center justify-center mb-2 transition-colors">
            <svg v-if="item.icon === 'alert'" class="w-5 h-5 text-gray-600 group-hover:text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <svg v-else-if="item.icon === 'book'" class="w-5 h-5 text-gray-600 group-hover:text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <svg v-else-if="item.icon === 'cog'" class="w-5 h-5 text-gray-600 group-hover:text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <svg v-else-if="item.icon === 'document'" class="w-5 h-5 text-gray-600 group-hover:text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <svg v-else-if="item.icon === 'chart'" class="w-5 h-5 text-gray-600 group-hover:text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <svg v-else-if="item.icon === 'chart-bar'" class="w-5 h-5 text-gray-600 group-hover:text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <span class="text-sm font-medium text-gray-700 group-hover:text-primary-700">{{ item.label }}</span>
        </button>
      </div>
    </div>

    <!-- 待处理工单和最新知识动态 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 待处理工单 -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-800">待处理工单</h2>
          <button 
            @click="navigateTo('/workorder')"
            class="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            查看全部
          </button>
        </div>
        <div class="space-y-3">
          <div
            v-for="order in pendingWorkOrders"
            :key="order.id"
            class="p-4 rounded-lg border border-gray-100 hover:border-primary-200 hover:bg-primary-50 transition-all cursor-pointer"
            @click="navigateTo(`/workorder/${order.id}`)"
          >
            <div class="flex items-start justify-between mb-2">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <span class="px-2 py-0.5 text-xs font-medium rounded" :class="workOrderStore.priorityColors[order.priority]">
                    {{ workOrderStore.priorityLabels[order.priority] }}
                  </span>
                  <span class="text-sm font-medium text-gray-800">{{ order.code }}</span>
                </div>
                <p class="text-sm text-gray-600 mb-1">{{ order.equipment.name }}</p>
                <p class="text-xs text-gray-500">{{ order.fault.phenomenon }}</p>
              </div>
              <span class="px-2 py-1 text-xs font-medium rounded" :class="workOrderStore.statusColors[order.status]">
                {{ workOrderStore.statusLabels[order.status] }}
              </span>
            </div>
          </div>
          <div v-if="pendingWorkOrders.length === 0" class="text-center py-8 text-gray-500">
            暂无待处理工单
          </div>
        </div>
      </div>

      <!-- 最新知识动态 -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-800">最新知识动态</h2>
          <button 
            @click="navigateTo('/knowledge')"
            class="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            查看全部
          </button>
        </div>
        <div class="space-y-3">
          <div
            v-for="knowledge in recentKnowledge"
            :key="knowledge.id"
            class="p-4 rounded-lg border border-gray-100 hover:border-primary-200 hover:bg-primary-50 transition-all cursor-pointer"
            @click="navigateTo(`/knowledge/${knowledge.id}`)"
          >
            <div class="flex items-start justify-between mb-2">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <span class="px-2 py-0.5 text-xs font-medium rounded" :class="knowledgeStore.typeColors[knowledge.type]">
                    {{ knowledgeStore.knowledgeTypes.find(t => t.value === knowledge.type)?.label || knowledge.type }}
                  </span>
                  <span class="text-xs text-gray-400">{{ formatTime(knowledge.updatedAt) }}</span>
                </div>
                <p class="text-sm font-medium text-gray-800 mb-1 line-clamp-2">{{ knowledge.title }}</p>
                <p class="text-xs text-gray-500">
                  {{ knowledge.author.name }}
                </p>
              </div>
            </div>
          </div>
          <div v-if="recentKnowledge.length === 0" class="text-center py-8 text-gray-500">
            暂无知识动态
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
</style>
