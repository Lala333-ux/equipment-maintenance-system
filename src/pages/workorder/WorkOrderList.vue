<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useWorkOrderStore } from '@/stores/workorder'


const router = useRouter()
const workOrderStore = useWorkOrderStore()

const searchKeyword = ref('')
const selectedStatus = ref('')
const selectedType = ref('')
const selectedPriority = ref('')

onMounted(async () => {
  await workOrderStore.fetchList()
})

const handleSearch = () => {
  workOrderStore.setFilters({
    keyword: searchKeyword.value,
    status: selectedStatus.value,
    type: selectedType.value,
    priority: selectedPriority.value
  })
}

const handleReset = () => {
  searchKeyword.value = ''
  selectedStatus.value = ''
  selectedType.value = ''
  selectedPriority.value = ''
  workOrderStore.setFilters({
    keyword: '',
    status: '',
    type: '',
    priority: ''
  })
}

const goToDetail = (id: string) => {
  router.push(`/workorder/${id}`)
}

const handleReportFault = () => {
  router.push('/workorder/report/new')
}

const kanbanColumns = computed(() => {
  const filtered = workOrderStore.filteredList
  return {
    pending: {
      label: '待派发',
      items: filtered.filter(w => w.status === 'pending_dispatch'),
      color: 'bg-purple-500'
    },
    processing: {
      label: '处理中',
      items: filtered.filter(w => ['dispatched', 'accepted', 'processing'].includes(w.status)),
      color: 'bg-orange-500'
    },
    pendingAccept: {
      label: '待验收',
      items: filtered.filter(w => w.status === 'pending_acceptance'),
      color: 'bg-yellow-500'
    },
    completed: {
      label: '已完成',
      items: filtered.filter(w => w.status === 'completed'),
      color: 'bg-green-500'
    }
  }
})

const getPriorityIcon = (priority: string) => {
  const icons: Record<string, string> = {
    P1: '🔴',
    P2: '🟠',
    P3: '🔵',
    P4: '⚪'
  }
  return icons[priority] || '⚪'
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">工单管理</h2>
        <p class="mt-1 text-sm text-gray-600">管理设备维修工单全生命周期</p>
      </div>
      <button
        @click="handleReportFault"
        class="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        故障登记
      </button>
    </div>

    <div class="bg-white rounded-lg shadow-sm p-4">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">搜索工单</label>
          <div class="relative">
            <input
              v-model="searchKeyword"
              type="text"
              placeholder="输入工单编号或设备名称"
              class="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              @input="handleSearch"
            />
            <svg class="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">工单状态</label>
          <select
            v-model="selectedStatus"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            @change="handleSearch"
          >
            <option value="">全部状态</option>
            <option v-for="(label, key) in workOrderStore.statusLabels" :key="key" :value="key">
              {{ label }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">工单类型</label>
          <select
            v-model="selectedType"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            @change="handleSearch"
          >
            <option value="">全部类型</option>
            <option v-for="(label, key) in workOrderStore.typeLabels" :key="key" :value="key">
              {{ label }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">优先级</label>
          <select
            v-model="selectedPriority"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            @change="handleSearch"
          >
            <option value="">全部优先级</option>
            <option v-for="(label, key) in workOrderStore.priorityLabels" :key="key" :value="key">
              {{ getPriorityIcon(key) }} {{ label }}
            </option>
          </select>
        </div>
      </div>

      <div class="mt-4 flex items-center justify-between">
        <div class="text-sm text-gray-600">
          共 <span class="font-semibold text-gray-900">{{ workOrderStore.filteredList.length }}</span> 个工单
        </div>
        <button
          @click="handleReset"
          class="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          重置筛选
        </button>
      </div>
    </div>

    <div v-if="workOrderStore.loading" class="flex items-center justify-center py-12">
      <svg class="animate-spin h-8 w-8 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span class="ml-3 text-gray-600">加载中...</span>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div
        v-for="(column, columnKey) in kanbanColumns"
        :key="columnKey"
        class="bg-gray-50 rounded-lg p-4 min-h-[600px]"
      >
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-full" :class="column.color"></div>
            <h3 class="font-semibold text-gray-900">{{ column.label }}</h3>
          </div>
          <span class="bg-white px-2.5 py-1 rounded-full text-xs font-medium text-gray-700 shadow-sm">
            {{ column.items.length }}
          </span>
        </div>

        <div class="space-y-3">
          <div
            v-for="order in column.items"
            :key="order.id"
            @click="goToDetail(order.id)"
            class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer p-4 border border-gray-200"
          >
            <div class="flex items-start justify-between mb-2">
              <span class="text-xs font-mono text-gray-500">{{ order.code }}</span>
              <span
                class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                :class="[workOrderStore.priorityColors[order.priority].bg, workOrderStore.priorityColors[order.priority].text]"
              >
                {{ getPriorityIcon(order.priority) }} {{ workOrderStore.priorityLabels[order.priority] }}
              </span>
            </div>

            <h4 class="text-sm font-medium text-gray-900 mb-2 line-clamp-2">
              {{ order.fault.phenomenon }}
            </h4>

            <div class="flex items-center gap-2 text-xs text-gray-600 mb-3">
              <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span class="truncate">{{ order.equipment.name }}</span>
            </div>

            <div class="flex items-center justify-between pt-3 border-t border-gray-100">
              <div class="flex items-center gap-2">
                <div v-if="order.assignee" class="flex items-center gap-1.5">
                  <div class="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center">
                    <span class="text-xs font-medium text-primary-700">{{ order.assignee.name.charAt(0) }}</span>
                  </div>
                  <span class="text-xs text-gray-600">{{ order.assignee.name }}</span>
                </div>
                <span v-else class="text-xs text-gray-400 italic">待派发</span>
              </div>
              <span class="text-xs text-gray-500">
                {{ workOrderStore.typeLabels[order.type] }}
              </span>
            </div>

            <div v-if="order.steps && order.steps.length > 0" class="mt-3">
              <div class="flex items-center gap-2 text-xs text-gray-500">
                <span>进度</span>
                <div class="flex-1 bg-gray-200 rounded-full h-1.5">
                  <div
                    class="bg-primary-600 h-1.5 rounded-full transition-all"
                    :style="{ width: `${(order.steps.filter(s => s.status === 'completed').length / order.steps.length) * 100}%` }"
                  ></div>
                </div>
                <span>{{ order.steps.filter(s => s.status === 'completed').length }}/{{ order.steps.length }}</span>
              </div>
            </div>
          </div>

          <div v-if="column.items.length === 0" class="text-center py-8 text-gray-400 text-sm">
            暂无工单
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
