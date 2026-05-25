<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSOPStore } from '@/stores/sop'


const route = useRoute()
const router = useRouter()
const sopStore = useSOPStore()

const currentStepIndex = ref(0)
const completedSteps = ref<Set<number>>(new Set())
const stepTimers = ref<{ [key: number]: number }>({})
const stepStartTime = ref<number>(Date.now())
const activeTimers = ref<{ [key: number]: number }>({})
const completedChecklist = ref<{ [key: string]: 'pass' | 'fail' | 'na' }>({})
const stepNotes = ref<{ [key: number]: string }>({})

const activeTimerInterval = ref<number | null>(null)

onMounted(async () => {
  const id = route.params.id as string
  await sopStore.fetchById(id)
  startTimer()
})

onUnmounted(() => {
  if (activeTimerInterval.value) {
    clearInterval(activeTimerInterval.value)
  }
})

const sop = computed(() => sopStore.currentSOP)
const totalSteps = computed(() => sop.value?.steps.length || 0)

const currentStep = computed(() => {
  if (sop.value) {
    return sop.value.steps[currentStepIndex.value]
  }
  return null
})

const progress = computed(() => {
  if (totalSteps.value === 0) return 0
  return Math.round((completedSteps.value.size / totalSteps.value) * 100)
})

const formatElapsedTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  
  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const currentElapsed = computed(() => {
  const elapsed = Math.floor((Date.now() - stepStartTime.value) / 1000)
  return formatElapsedTime(elapsed)
})

const startTimer = () => {
  if (activeTimerInterval.value) {
    clearInterval(activeTimerInterval.value)
  }
  
  stepStartTime.value = Date.now()
  activeTimers.value[currentStepIndex.value] = 0
  
  activeTimerInterval.value = window.setInterval(() => {
    activeTimers.value[currentStepIndex.value] = Math.floor((Date.now() - stepStartTime.value) / 1000)
  }, 1000)
}

const goToDetail = () => {
  if (sop.value) {
    router.push(`/sop/${sop.value.id}`)
  }
}

const completeCurrentStep = () => {
  if (currentStepIndex.value < totalSteps.value - 1) {
    completedSteps.value.add(currentStepIndex.value)
    stepTimers.value[currentStepIndex.value] = activeTimers.value[currentStepIndex.value] || 0
    
    if (activeTimerInterval.value) {
      clearInterval(activeTimerInterval.value)
    }
    
    currentStepIndex.value++
    startTimer()
  } else {
    completedSteps.value.add(currentStepIndex.value)
    stepTimers.value[currentStepIndex.value] = activeTimers.value[currentStepIndex.value] || 0
    
    if (activeTimerInterval.value) {
      clearInterval(activeTimerInterval.value)
    }
    
    alert('所有步骤已完成！')
  }
}

const goToPreviousStep = () => {
  if (currentStepIndex.value > 0) {
    if (activeTimerInterval.value) {
      clearInterval(activeTimerInterval.value)
    }
    
    currentStepIndex.value--
    startTimer()
  }
}

const handleChecklistChange = (itemId: string, result: 'pass' | 'fail' | 'na') => {
  completedChecklist.value[itemId] = result
}

const handleNoteChange = (note: string) => {
  stepNotes.value[currentStepIndex.value] = note
}

const isAllChecklistCompleted = computed(() => {
  if (!sop.value) return false
  
  const currentChecklist = sop.value.checklist
  if (currentChecklist.length === 0) return true
  
  return currentChecklist.every(item => completedChecklist.value[item.id])
})

const canComplete = computed(() => {
  return isAllChecklistCompleted.value
})

const formatTime = (minutes: number) => {
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}小时${mins}分钟` : `${hours}小时`
  }
  return `${minutes}分钟`
}

const getStepStatus = (index: number) => {
  if (completedSteps.value.has(index)) {
    return 'completed'
  } else if (index === currentStepIndex.value) {
    return 'current'
  } else {
    return 'pending'
  }
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
      @click="goToDetail"
      class="mt-6 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
    >
      返回SOP列表
    </button>
  </div>

  <div v-else class="space-y-6">
    <div class="bg-white rounded-lg shadow-sm p-6">
      <div class="flex items-start justify-between mb-4">
        <div class="flex items-center gap-3">
          <button
            @click="goToDetail"
            class="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 class="text-2xl font-bold text-gray-900">{{ sop.name }}</h1>
            <div class="flex items-center gap-4 mt-1 text-sm text-gray-600">
              <span>{{ sop.code }}</span>
              <span>{{ sop.version }}</span>
              <span
                class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium"
                :class="[sopStore.jobTypeColors[sop.jobType].bg, sopStore.jobTypeColors[sop.jobType].text]"
              >
                {{ sopStore.jobTypeLabels[sop.jobType] }}
              </span>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <div class="text-right">
            <p class="text-sm text-gray-500">当前用时</p>
            <p class="text-2xl font-bold text-primary-600 font-mono">{{ currentElapsed }}</p>
          </div>
        </div>
      </div>

      <div class="relative">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-gray-700">执行进度</span>
          <span class="text-sm font-medium text-gray-700">{{ progress }}%</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            class="bg-primary-600 h-full transition-all duration-300 ease-in-out flex items-center justify-center"
            :style="{ width: `${progress}%` }"
          >
            <span v-if="progress > 20" class="text-xs text-white font-medium">{{ completedSteps.size }}/{{ totalSteps }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-1">
        <div class="bg-white rounded-lg shadow-sm p-4">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">步骤列表</h3>
          
          <div class="space-y-2">
            <div
              v-for="(step, index) in sop.steps"
              :key="step.order"
              @click="currentStepIndex = index"
              class="p-3 rounded-lg cursor-pointer transition-all border-2"
              :class="{
                'border-primary-500 bg-primary-50': getStepStatus(index) === 'current',
                'border-green-500 bg-green-50': getStepStatus(index) === 'completed',
                'border-gray-200 hover:border-gray-300': getStepStatus(index) === 'pending'
              }"
            >
              <div class="flex items-center justify-between mb-1">
                <div class="flex items-center gap-2">
                  <span
                    class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                    :class="{
                      'bg-primary-600 text-white': getStepStatus(index) === 'current',
                      'bg-green-600 text-white': getStepStatus(index) === 'completed',
                      'bg-gray-300 text-gray-600': getStepStatus(index) === 'pending'
                    }"
                  >
                    <svg v-if="getStepStatus(index) === 'completed'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span v-else>{{ step.order }}</span>
                  </span>
                  <span class="text-sm font-medium text-gray-900">{{ step.title }}</span>
                </div>
              </div>
              
              <div class="flex items-center justify-between text-xs text-gray-500 ml-8">
                <span>预计 {{ formatTime(step.estimatedTime) }}</span>
                <span v-if="activeTimers[index] !== undefined && getStepStatus(index) !== 'completed'" class="font-mono">
                  {{ formatElapsedTime(activeTimers[index]) }}
                </span>
                <span v-else-if="getStepStatus(index) === 'completed' && stepTimers[index]" class="font-mono text-green-600">
                  {{ formatElapsedTime(stepTimers[index]) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="lg:col-span-2">
        <div v-if="currentStep" class="bg-white rounded-lg shadow-sm p-6">
          <div class="mb-6">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-3">
                <span class="w-10 h-10 rounded-full bg-primary-600 text-white font-bold text-lg flex items-center justify-center">
                  {{ currentStep.order }}
                </span>
                <div>
                  <h2 class="text-xl font-bold text-gray-900">{{ currentStep.title }}</h2>
                  <p class="text-sm text-gray-500">
                    步骤 {{ currentStepIndex + 1 }} / {{ totalSteps }}
                  </p>
                </div>
              </div>
              
              <div class="text-right">
                <p class="text-sm text-gray-500">当前步骤用时</p>
                <p class="text-lg font-bold text-primary-600 font-mono">
                  {{ formatElapsedTime(activeTimers[currentStepIndex] || 0) }}
                </p>
              </div>
            </div>

            <p class="text-gray-700 mb-4">{{ currentStep.description }}</p>

            <div v-if="currentStep.keyPoints && currentStep.keyPoints.length > 0" class="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div class="flex items-center gap-2 mb-2">
                <svg class="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
                <span class="text-sm font-semibold text-yellow-800">关键点</span>
              </div>
              <ul class="space-y-1">
                <li v-for="(point, index) in currentStep.keyPoints" :key="index" class="flex items-start text-sm text-yellow-900">
                  <span class="mr-2">•</span>
                  <span>{{ point }}</span>
                </li>
              </ul>
            </div>

            <div v-if="currentStep.safetyNotes" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div class="flex items-start gap-2">
                <svg class="w-5 h-5 text-red-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
                <div>
                  <span class="text-sm font-semibold text-red-800">安全提示</span>
                  <p class="text-sm text-red-700 mt-1">{{ currentStep.safetyNotes }}</p>
                </div>
              </div>
            </div>

            <div v-if="currentStep.checkStandard" class="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div class="flex items-start gap-2">
                <svg class="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                <div>
                  <span class="text-sm font-semibold text-blue-800">检查标准</span>
                  <p class="text-sm text-blue-700 mt-1">{{ currentStep.checkStandard }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="border-t border-gray-200 pt-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">检查清单</h3>
            
            <div v-if="sop.checklist.length > 0" class="space-y-3 mb-6">
              <div
                v-for="item in sop.checklist"
                :key="item.id"
                class="p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div class="flex items-start justify-between mb-3">
                  <div class="flex-1">
                    <h4 class="text-sm font-semibold text-gray-900 mb-1">{{ item.item }}</h4>
                    <p class="text-xs text-gray-600 mb-1">方法: {{ item.method }}</p>
                    <p class="text-xs text-gray-600">标准: {{ item.standard }}</p>
                  </div>
                </div>

                <div class="flex items-center gap-2">
                  <button
                    @click="handleChecklistChange(item.id, 'pass')"
                    class="flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-all border-2"
                    :class="completedChecklist[item.id] === 'pass'
                      ? 'bg-green-100 border-green-500 text-green-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-green-50'"
                  >
                    ✓ 合格
                  </button>
                  <button
                    @click="handleChecklistChange(item.id, 'fail')"
                    class="flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-all border-2"
                    :class="completedChecklist[item.id] === 'fail'
                      ? 'bg-red-100 border-red-500 text-red-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-red-50'"
                  >
                    ✗ 不合格
                  </button>
                  <button
                    @click="handleChecklistChange(item.id, 'na')"
                    class="flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-all border-2"
                    :class="completedChecklist[item.id] === 'na'
                      ? 'bg-gray-200 border-gray-400 text-gray-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100'"
                  >
                    N/A 不适用
                  </button>
                </div>
              </div>
            </div>

            <div v-else class="text-center py-8 text-gray-500 mb-6">
              <p>当前步骤无检查清单</p>
            </div>

            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-2">步骤备注</label>
              <textarea
                :value="stepNotes[currentStepIndex] || ''"
                @input="handleNoteChange(($event.target as HTMLTextAreaElement).value)"
                rows="3"
                placeholder="可在此处记录执行过程中的特殊情况..."
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              ></textarea>
            </div>

            <div class="flex items-center justify-between pt-4 border-t border-gray-200">
              <button
                @click="goToPreviousStep"
                :disabled="currentStepIndex === 0"
                class="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                上一步
              </button>

              <button
                @click="completeCurrentStep"
                :disabled="!canComplete"
                class="px-8 py-2 text-sm font-medium text-white rounded-lg transition-all shadow-sm flex items-center gap-2"
                :class="canComplete
                  ? 'bg-primary-600 hover:bg-primary-700'
                  : 'bg-gray-400 cursor-not-allowed'"
              >
                {{ currentStepIndex === totalSteps - 1 ? '完成所有步骤' : '完成当前步骤' }}
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <div v-if="!canComplete && sop.checklist.length > 0" class="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p class="text-sm text-amber-800">
                ⚠️ 请完成所有检查清单项目后再继续
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
