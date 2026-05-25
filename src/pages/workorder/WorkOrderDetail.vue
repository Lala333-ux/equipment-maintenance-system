<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useWorkOrderStore } from '@/stores/workorder'

const route = useRoute()
const router = useRouter()
const workOrderStore = useWorkOrderStore()

const orderId = computed(() => route.params.id as string)

onMounted(async () => {
  await workOrderStore.fetchById(orderId.value)
})

const currentOrder = computed(() => workOrderStore.currentOrder)

const getPriorityIcon = (priority: string) => {
  const icons: Record<string, string> = {
    P1: '🔴',
    P2: '🟠',
    P3: '🔵',
    P4: '⚪'
  }
  return icons[priority] || '⚪'
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatDuration = (minutes: number) => {
  if (minutes < 60) {
    return `${minutes}分钟`
  }
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hours}小时${mins}分钟` : `${hours}小时`
}

const getStepStatusIcon = (status: string) => {
  const icons: Record<string, string> = {
    pending: '○',
    in_progress: '◐',
    completed: '●',
    skipped: '⊘'
  }
  return icons[status] || '○'
}



const handleBack = () => {
  router.push('/workorder')
}

const handleStatusChange = (newStatus: string) => {
  if (currentOrder.value) {
    workOrderStore.updateStatus(
      currentOrder.value.id,
      newStatus as any
    )
  }
}

const getAvailableActions = computed(() => {
  if (!currentOrder.value) return []
  
  const status = currentOrder.value.status
  const actions: Array<{ label: string; action: string; variant: string }> = []
  
  switch (status) {
    case 'pending_dispatch':
      actions.push({ label: '派发工单', action: 'dispatch', variant: 'primary' })
      break
    case 'dispatched':
      actions.push({ label: '接单', action: 'accept', variant: 'primary' })
      break
    case 'accepted':
      actions.push({ label: '开始处理', action: 'start', variant: 'primary' })
      break
    case 'processing':
      actions.push({ label: '完成处理', action: 'complete', variant: 'success' })
      break
    case 'pending_acceptance':
      actions.push({ label: '验收通过', action: 'accept', variant: 'success' })
      actions.push({ label: '退回修改', action: 'return', variant: 'warning' })
      break
  }
  
  return actions
})

const executeAction = (action: string) => {
  const actionMap: Record<string, string> = {
    dispatch: 'dispatched',
    accept: 'accepted',
    start: 'processing',
    complete: 'pending_acceptance',
    return: 'processing'
  }
  
  if (actionMap[action]) {
    handleStatusChange(actionMap[action])
  }
}
</script>

<template>
  <div v-if="currentOrder" class="space-y-6">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <button
          @click="handleBack"
          class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <div class="flex items-center gap-3">
            <h2 class="text-2xl font-bold text-gray-900">{{ currentOrder.code }}</h2>
            <span
              class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
              :class="[workOrderStore.statusColors[currentOrder.status].bg, workOrderStore.statusColors[currentOrder.status].text]"
            >
              {{ workOrderStore.statusLabels[currentOrder.status] }}
            </span>
          </div>
          <p class="mt-1 text-sm text-gray-600">
            {{ workOrderStore.typeLabels[currentOrder.type] }} · 
            创建时间：{{ formatDate(currentOrder.createdAt) }}
          </p>
        </div>
      </div>
      
      <div class="flex items-center gap-2">
        <button
          v-for="action in getAvailableActions"
          :key="action.action"
          @click="executeAction(action.action)"
          class="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
          :class="{
            'bg-primary-600 text-white hover:bg-primary-700': action.variant === 'primary',
            'bg-green-600 text-white hover:bg-green-700': action.variant === 'success',
            'bg-yellow-600 text-white hover:bg-yellow-700': action.variant === 'warning'
          }"
        >
          {{ action.label }}
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 space-y-6">
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            故障信息
          </h3>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-2">故障现象</label>
              <p class="text-gray-900">{{ currentOrder.fault.phenomenon }}</p>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-2">严重程度</label>
                <span
                  class="inline-flex items-center px-3 py-1 rounded text-sm font-medium"
                  :class="[workOrderStore.priorityColors[currentOrder.fault.severity].bg, workOrderStore.priorityColors[currentOrder.fault.severity].text]"
                >
                  {{ getPriorityIcon(currentOrder.fault.severity) }}
                  {{ workOrderStore.priorityLabels[currentOrder.fault.severity] }}
                </span>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-500 mb-2">故障类别</label>
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="(cat, idx) in currentOrder.fault.phenomenonCategory"
                    :key="idx"
                    class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                  >
                    {{ cat }}
                  </span>
                </div>
              </div>
            </div>
            
            <div class="pt-4 border-t border-gray-200">
              <label class="block text-sm font-medium text-gray-500 mb-2">关联设备</label>
              <div class="bg-gray-50 rounded-lg p-4">
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <h4 class="text-base font-medium text-gray-900">{{ currentOrder.equipment.name }}</h4>
                    <div class="mt-2 grid grid-cols-2 gap-2 text-sm text-gray-600">
                      <div>设备编号：{{ currentOrder.equipment.code }}</div>
                      <div>设备类型：{{ currentOrder.equipment.type }}</div>
                      <div>所属部门：{{ currentOrder.equipment.department }}</div>
                      <div>安装位置：{{ currentOrder.equipment.location }}</div>
                    </div>
                  </div>
                  <span
                    class="px-2 py-1 rounded text-xs font-medium"
                    :class="{
                      'bg-red-100 text-red-800': currentOrder.equipment.criticality === 'A',
                      'bg-yellow-100 text-yellow-800': currentOrder.equipment.criticality === 'B',
                      'bg-blue-100 text-blue-800': currentOrder.equipment.criticality === 'C',
                      'bg-gray-100 text-gray-800': currentOrder.equipment.criticality === 'D'
                    }"
                  >
                    重要度{{ currentOrder.equipment.criticality }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            处理进度
          </h3>
          
          <div v-if="currentOrder.steps && currentOrder.steps.length > 0" class="space-y-4">
            <div
              v-for="(step, index) in currentOrder.steps"
              :key="step.id"
              class="flex gap-4"
            >
              <div class="flex flex-col items-center">
                <div
                  class="w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold"
                  :class="{
                    'bg-green-100 text-green-600': step.status === 'completed',
                    'bg-blue-100 text-blue-600': step.status === 'in_progress',
                    'bg-gray-100 text-gray-400': step.status === 'pending',
                    'bg-gray-100 text-gray-400 line-through': step.status === 'skipped'
                  }"
                >
                  {{ getStepStatusIcon(step.status) }}
                </div>
                <div v-if="index < currentOrder.steps.length - 1" class="w-0.5 h-12 bg-gray-200 my-1"></div>
              </div>
              
              <div class="flex-1 pb-6">
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <h4 class="text-base font-medium text-gray-900">{{ step.title }}</h4>
                    <p class="mt-1 text-sm text-gray-600">{{ step.description }}</p>
                    <p v-if="step.notes" class="mt-2 text-sm text-blue-600 bg-blue-50 px-3 py-2 rounded">
                      {{ step.notes }}
                    </p>
                  </div>
                  <span
                    class="text-xs px-2 py-1 rounded"
                    :class="{
                      'bg-green-100 text-green-700': step.status === 'completed',
                      'bg-blue-100 text-blue-700': step.status === 'in_progress',
                      'bg-gray-100 text-gray-600': step.status === 'pending',
                      'bg-gray-100 text-gray-500': step.status === 'skipped'
                    }"
                  >
                    {{ step.status === 'completed' ? '已完成' : step.status === 'in_progress' ? '进行中' : step.status === 'skipped' ? '已跳过' : '待处理' }}
                  </span>
                </div>
                <p v-if="step.completedAt" class="mt-2 text-xs text-gray-500">
                  完成时间：{{ formatDate(step.completedAt) }}
                </p>
              </div>
            </div>
          </div>
          
          <div v-else class="text-center py-8 text-gray-400">
            暂无处理步骤
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <svg class="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
            备件消耗
          </h3>
          
          <div v-if="currentOrder.spareParts && currentOrder.spareParts.length > 0">
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">备件名称</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">计划数量</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">实际数量</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="part in currentOrder.spareParts" :key="part.sparePartId">
                    <td class="px-4 py-3 text-sm text-gray-900">{{ part.name }}</td>
                    <td class="px-4 py-3 text-sm text-gray-600">{{ part.quantity }}</td>
                    <td class="px-4 py-3 text-sm text-gray-600">
                      {{ part.actualQuantity || '-' }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div v-else class="text-center py-8 text-gray-400">
            暂无备件消耗记录
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">工单信息</h3>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-1">优先级</label>
              <span
                class="inline-flex items-center px-3 py-1 rounded text-sm font-medium"
                :class="[workOrderStore.priorityColors[currentOrder.priority].bg, workOrderStore.priorityColors[currentOrder.priority].text]"
              >
                {{ getPriorityIcon(currentOrder.priority) }}
                {{ workOrderStore.priorityLabels[currentOrder.priority] }}
              </span>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-1">预计工时</label>
              <p class="text-gray-900">{{ formatDuration(currentOrder.estimatedDuration) }}</p>
            </div>
            
            <div v-if="currentOrder.actualDuration">
              <label class="block text-sm font-medium text-gray-500 mb-1">实际工时</label>
              <p class="text-gray-900">{{ formatDuration(currentOrder.actualDuration) }}</p>
            </div>
            
            <div class="pt-4 border-t border-gray-200">
              <label class="block text-sm font-medium text-gray-500 mb-1">派单人</label>
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                  <span class="text-sm font-medium text-primary-700">{{ currentOrder.reporter.name.charAt(0) }}</span>
                </div>
                <span class="text-gray-900">{{ currentOrder.reporter.name }}</span>
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-1">维修人员</label>
              <div v-if="currentOrder.assignee" class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                  <span class="text-sm font-medium text-primary-700">{{ currentOrder.assignee.name.charAt(0) }}</span>
                </div>
                <div>
                  <p class="text-gray-900">{{ currentOrder.assignee.name }}</p>
                  <p class="text-xs text-gray-500">{{ currentOrder.assignee.department }}</p>
                </div>
              </div>
              <p v-else class="text-gray-400 italic">待派发</p>
            </div>
          </div>
        </div>

        <div v-if="currentOrder.discussion && currentOrder.discussion.length > 0" class="bg-white rounded-lg shadow-sm p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">工单讨论</h3>
          
          <div class="space-y-4">
            <div
              v-for="msg in currentOrder.discussion"
              :key="msg.id"
              class="flex gap-3"
            >
              <div class="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                <span class="text-sm font-medium text-primary-700">{{ msg.user.name.charAt(0) }}</span>
              </div>
              <div class="flex-1">
                <div class="flex items-center gap-2">
                  <span class="text-sm font-medium text-gray-900">{{ msg.user.name }}</span>
                  <span class="text-xs text-gray-500">{{ formatDate(msg.createdAt) }}</span>
                </div>
                <p class="mt-1 text-sm text-gray-600">{{ msg.content }}</p>
              </div>
            </div>
          </div>
        </div>

        <div v-if="currentOrder.completedAt" class="bg-green-50 rounded-lg shadow-sm p-6">
          <div class="flex items-center gap-2 text-green-800">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="font-medium">工单已完成</span>
          </div>
          <p class="mt-2 text-sm text-green-700">
            完成时间：{{ formatDate(currentOrder.completedAt) }}
          </p>
          
          <div v-if="currentOrder.rating" class="mt-4 pt-4 border-t border-green-200">
            <label class="block text-sm font-medium text-green-800 mb-2">服务评价</label>
            <div class="grid grid-cols-3 gap-2 text-sm">
              <div class="text-center">
                <div class="text-yellow-500">★</div>
                <div class="text-gray-600">质量</div>
                <div class="font-medium text-gray-900">{{ currentOrder.rating.quality }}</div>
              </div>
              <div class="text-center">
                <div class="text-yellow-500">★</div>
                <div class="text-gray-600">速度</div>
                <div class="font-medium text-gray-900">{{ currentOrder.rating.speed }}</div>
              </div>
              <div class="text-center">
                <div class="text-yellow-500">★</div>
                <div class="text-gray-600">态度</div>
                <div class="font-medium text-gray-900">{{ currentOrder.rating.attitude }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else-if="workOrderStore.loading" class="flex items-center justify-center py-20">
    <svg class="animate-spin h-8 w-8 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <span class="ml-3 text-gray-600">加载中...</span>
  </div>

  <div v-else class="text-center py-20">
    <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <h3 class="mt-4 text-lg font-medium text-gray-900">工单不存在</h3>
    <p class="mt-2 text-sm text-gray-500">无法找到该工单信息</p>
    <button
      @click="handleBack"
      class="mt-4 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
    >
      返回工单列表
    </button>
  </div>
</template>
