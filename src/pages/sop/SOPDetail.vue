<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSOPStore } from '@/stores/sop'

const route = useRoute()
const router = useRouter()
const sopStore = useSOPStore()

const activeTab = ref('steps')

const tabs = [
  { key: 'steps', label: '操作步骤' },
  { key: 'checklist', label: '检查清单' },
  { key: 'resources', label: '资源清单' }
]

onMounted(async () => {
  const id = route.params.id as string
  await sopStore.fetchById(id)
})

const sop = computed(() => sopStore.currentSOP)

const goBack = () => {
  router.push('/sop')
}

const startExecution = () => {
  if (sop.value) {
    router.push(`/sop/execute/${sop.value.id}`)
  }
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
  <div v-if="sopStore.loading" class="flex items-center justify-center py-20">
    <svg class="animate-spin h-8 w-8 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <span class="ml-3 text-gray-600">加载中...</span>
  </div>

  <div v-else-if="!sop" class="bg-white rounded-lg shadow-sm p-12 text-center">
    <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
    <h3 class="mt-4 text-lg font-medium text-gray-900">SOP不存在</h3>
    <p class="mt-2 text-sm text-gray-500">未找到对应的SOP信息</p>
    <button
      @click="goBack"
      class="mt-6 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
    >
      返回SOP列表
    </button>
  </div>

  <div v-else class="space-y-6">
    <div class="bg-white rounded-lg shadow-sm p-6">
      <div class="flex items-start justify-between">
        <div class="flex items-start gap-4">
          <button
            @click="goBack"
            class="mt-1 p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div>
            <div class="flex items-center gap-3 mb-2">
              <h1 class="text-2xl font-bold text-gray-900">{{ sop.name }}</h1>
              <span
                class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium"
                :class="[sopStore.jobTypeColors[sop.jobType].bg, sopStore.jobTypeColors[sop.jobType].text]"
              >
                <span
                  class="w-2 h-2 rounded-full"
                  :class="sopStore.jobTypeColors[sop.jobType].dot"
                ></span>
                {{ sopStore.jobTypeLabels[sop.jobType] }}
              </span>
            </div>

            <div class="flex items-center gap-6 text-sm text-gray-600 mb-4">
              <span class="flex items-center gap-1.5">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                </svg>
                {{ sop.code }}
              </span>
              <span class="flex items-center gap-1.5">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                {{ sop.version }}
              </span>
              <span class="flex items-center gap-1.5">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                生效日期: {{ formatDate(sop.effectiveDate) }}
              </span>
            </div>

            <div class="bg-gray-50 rounded-lg p-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-500 mb-1">适用设备</label>
                  <p class="text-sm text-gray-900">{{ sop.equipmentScope.join('、') }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-500 mb-1">作业类型</label>
                  <p class="text-sm text-gray-900">{{ sopStore.jobTypeLabels[sop.jobType] }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-500 mb-1">编制人员</label>
                  <p class="text-sm text-gray-900">{{ sop.author.name }} - {{ sop.author.role }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-500 mb-1">预计时长</label>
                  <p class="text-sm text-gray-900">{{ formatTime(sop.totalEstimatedTime) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex gap-2">
          <button class="px-4 py-2 text-sm font-medium text-primary-700 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors">
            编辑SOP
          </button>
          <button
            @click="startExecution"
            class="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors flex items-center"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            开始执行
          </button>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-sm">
      <div class="border-b border-gray-200">
        <nav class="flex gap-8 px-6">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            @click="activeTab = tab.key"
            class="py-4 text-sm font-medium border-b-2 transition-colors"
            :class="activeTab === tab.key
              ? 'text-primary-600 border-primary-600'
              : 'text-gray-500 border-transparent hover:text-gray-700'"
          >
            {{ tab.label }}
          </button>
        </nav>
      </div>

      <div class="p-6">
        <div v-show="activeTab === 'steps'" class="space-y-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-gray-900">操作步骤</h3>
            <span class="text-sm text-gray-600">
              共 {{ sop.steps.length }} 个步骤，预计 {{ formatTime(sop.totalEstimatedTime) }}
            </span>
          </div>

          <div class="relative">
            <div class="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>

            <div class="space-y-6">
              <div
                v-for="step in sop.steps"
                :key="step.order"
                class="relative"
              >
                <div class="absolute left-6 w-4 h-4 rounded-full border-2 border-white ring-2 bg-primary-500 ring-primary-200"></div>

                <div class="ml-16 bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                  <div class="flex items-start justify-between mb-3">
                    <div class="flex-1">
                      <div class="flex items-center gap-3 mb-2">
                        <span class="w-8 h-8 rounded-full bg-primary-100 text-primary-700 font-semibold text-sm flex items-center justify-center">
                          {{ step.order }}
                        </span>
                        <h4 class="text-base font-semibold text-gray-900">{{ step.title }}</h4>
                      </div>
                      <p class="text-sm text-gray-600 mb-3">{{ step.description }}</p>

                      <div v-if="step.keyPoints && step.keyPoints.length > 0" class="mb-3">
                        <div class="flex items-center gap-2 mb-2">
                          <svg class="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                          </svg>
                          <span class="text-xs font-medium text-gray-700">关键点</span>
                        </div>
                        <ul class="space-y-1">
                          <li v-for="(point, index) in step.keyPoints" :key="index" class="flex items-start text-sm text-gray-600">
                            <span class="mr-2">•</span>
                            <span>{{ point }}</span>
                          </li>
                        </ul>
                      </div>

                      <div v-if="step.safetyNotes" class="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div class="flex items-start gap-2">
                          <svg class="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                          </svg>
                          <div>
                            <span class="text-xs font-medium text-red-800">安全提示</span>
                            <p class="text-sm text-red-700 mt-1">{{ step.safetyNotes }}</p>
                          </div>
                        </div>
                      </div>

                      <div class="flex items-center gap-4 text-sm text-gray-500">
                        <span class="flex items-center gap-1.5">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          预计 {{ formatTime(step.estimatedTime) }}
                        </span>
                        <span v-if="step.checkStandard" class="flex items-center gap-1.5">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {{ step.checkStandard }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-show="activeTab === 'checklist'" class="space-y-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-gray-900">检查清单</h3>
            <span class="text-sm text-gray-600">
              共 {{ sop.checklist.length }} 个检查项
            </span>
          </div>

          <div class="border border-gray-200 rounded-lg overflow-hidden">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                    序号
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    检查项目
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    检查方法
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    验收标准
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="(item, index) in sop.checklist" :key="item.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{ index + 1 }}
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-900">
                    {{ item.item }}
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-600">
                    {{ item.method }}
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-600">
                    {{ item.standard }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div v-show="activeTab === 'resources'" class="space-y-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-6">资源清单</h3>

          <div class="space-y-6">
            <div class="bg-white border border-gray-200 rounded-lg p-5">
              <div class="flex items-center gap-2 mb-4">
                <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <h4 class="text-base font-semibold text-gray-900">工具清单</h4>
                <span class="text-sm text-gray-500 ml-2">({{ sop.resources.tools.length }}项)</span>
              </div>
              <div v-if="sop.resources.tools.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div v-for="tool in sop.resources.tools" :key="tool.id" class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <div class="flex-1">
                    <p class="text-sm font-medium text-gray-900">{{ tool.name }}</p>
                    <p class="text-xs text-gray-500">{{ tool.specification }}</p>
                  </div>
                </div>
              </div>
              <p v-else class="text-sm text-gray-500">无需特殊工具</p>
            </div>

            <div class="bg-white border border-gray-200 rounded-lg p-5">
              <div class="flex items-center gap-2 mb-4">
                <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
                <h4 class="text-base font-semibold text-gray-900">备件清单</h4>
                <span class="text-sm text-gray-500 ml-2">({{ sop.resources.spareParts.length }}项)</span>
              </div>
              <div v-if="sop.resources.spareParts.length > 0" class="flex flex-wrap gap-2">
                <span v-for="part in sop.resources.spareParts" :key="part" class="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                  {{ part }}
                </span>
              </div>
              <p v-else class="text-sm text-gray-500">无需备件</p>
            </div>

            <div class="bg-white border border-gray-200 rounded-lg p-5">
              <div class="flex items-center gap-2 mb-4">
                <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <h4 class="text-base font-semibold text-gray-900">人员要求</h4>
                <span class="text-sm text-gray-500 ml-2">({{ sop.resources.personnel.length }}项)</span>
              </div>
              <div class="space-y-3">
                <div v-for="person in sop.resources.personnel" :key="person.role" class="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <div class="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                    <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div class="flex-1">
                    <p class="text-sm font-medium text-gray-900">{{ person.role }} × {{ person.count }}人</p>
                    <div class="flex flex-wrap gap-1 mt-1">
                      <span v-for="skill in person.skills" :key="skill" class="px-2 py-0.5 bg-gray-200 text-gray-700 text-xs rounded">
                        {{ skill }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-white border border-gray-200 rounded-lg p-5">
              <div class="flex items-center gap-2 mb-4">
                <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <h4 class="text-base font-semibold text-gray-900">个人防护装备</h4>
                <span class="text-sm text-gray-500 ml-2">({{ sop.resources.ppe.length }}项)</span>
              </div>
              <div class="flex flex-wrap gap-2">
                <span v-for="ppe in sop.resources.ppe" :key="ppe" class="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                  {{ ppe }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
