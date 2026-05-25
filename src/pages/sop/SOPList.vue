<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSOPStore } from '@/stores/sop'

const router = useRouter()
const sopStore = useSOPStore()

const searchKeyword = ref('')
const selectedJobType = ref('')

onMounted(async () => {
  await sopStore.fetchList()
})

const handleSearch = () => {
  sopStore.setFilters({
    keyword: searchKeyword.value,
    jobType: selectedJobType.value
  })
}

const handleReset = () => {
  searchKeyword.value = ''
  selectedJobType.value = ''
  sopStore.resetFilters()
}

const goToDetail = (id: string) => {
  router.push(`/sop/${id}`)
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

const formatTime = (minutes: number) => {
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}小时${mins}分钟` : `${hours}小时`
  }
  return `${minutes}分钟`
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">SOP管理</h2>
        <p class="mt-1 text-sm text-gray-600">管理设备维修保养标准作业程序</p>
      </div>
      <button
        class="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        新增SOP
      </button>
    </div>

    <div class="bg-white rounded-lg shadow-sm p-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">搜索SOP</label>
          <div class="relative">
            <input
              v-model="searchKeyword"
              type="text"
              placeholder="输入SOP名称或编号"
              class="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              @input="handleSearch"
            />
            <svg class="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">作业类型</label>
          <select
            v-model="selectedJobType"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            @change="handleSearch"
          >
            <option value="">全部类型</option>
            <option v-for="type in sopStore.jobTypes" :key="type.value" :value="type.value">
              {{ type.label }}
            </option>
          </select>
        </div>

        <div class="flex items-end">
          <button
            @click="handleReset"
            class="w-full px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors border border-gray-300"
          >
            重置筛选
          </button>
        </div>
      </div>

      <div class="mt-4 flex items-center justify-between">
        <div class="text-sm text-gray-600">
          共 <span class="font-semibold text-gray-900">{{ sopStore.filteredList.length }}</span> 个SOP
        </div>
      </div>
    </div>

    <div v-if="sopStore.loading" class="flex items-center justify-center py-12">
      <svg class="animate-spin h-8 w-8 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span class="ml-3 text-gray-600">加载中...</span>
    </div>

    <div v-else-if="sopStore.filteredList.length === 0" class="bg-white rounded-lg shadow-sm p-12 text-center">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <h3 class="mt-4 text-lg font-medium text-gray-900">暂无SOP</h3>
      <p class="mt-2 text-sm text-gray-500">没有找到符合条件的SOP，请调整筛选条件</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="sop in sopStore.filteredList"
        :key="sop.id"
        @click="goToDetail(sop.id)"
        class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden border border-gray-200"
      >
        <div class="p-6">
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-xs font-mono text-gray-500">{{ sop.code }}</span>
                <span
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                  :class="[sopStore.jobTypeColors[sop.jobType].bg, sopStore.jobTypeColors[sop.jobType].text]"
                >
                  <span
                    class="w-1.5 h-1.5 rounded-full"
                    :class="sopStore.jobTypeColors[sop.jobType].dot"
                  ></span>
                  {{ sopStore.jobTypeLabels[sop.jobType] }}
                </span>
              </div>
              <h3 class="text-lg font-semibold text-gray-900 mb-3">{{ sop.name }}</h3>
            </div>
          </div>

          <div class="space-y-3 text-sm">
            <div class="flex items-start">
              <svg class="w-4 h-4 mr-2 mt-0.5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
              <div class="flex-1">
                <span class="text-gray-500">适用设备：</span>
                <span class="text-gray-700">{{ sop.equipmentScope.join('、') }}</span>
              </div>
            </div>

            <div class="flex items-center">
              <svg class="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <div class="flex-1">
                <span class="text-gray-500">版本：</span>
                <span class="text-gray-700 font-medium">{{ sop.version }}</span>
              </div>
            </div>

            <div class="flex items-center">
              <svg class="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div class="flex-1">
                <span class="text-gray-500">生效日期：</span>
                <span class="text-gray-700">{{ formatDate(sop.effectiveDate) }}</span>
              </div>
            </div>

            <div class="flex items-center">
              <svg class="w-4 h-4 mr-2 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div class="flex-1">
                <span class="text-gray-500">预计时长：</span>
                <span class="text-gray-700">{{ formatTime(sop.totalEstimatedTime) }}</span>
              </div>
            </div>
          </div>

          <div class="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
            <div class="flex items-center">
              <div class="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center mr-2">
                <svg class="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <span class="text-xs text-gray-600">{{ sop.author.name }}</span>
            </div>
            <span class="text-xs text-gray-500">
              {{ sop.steps.length }}个步骤
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
