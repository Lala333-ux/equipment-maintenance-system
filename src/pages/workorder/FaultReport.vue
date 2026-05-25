<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useEquipmentStore } from '@/stores/equipment'

const router = useRouter()
const equipmentStore = useEquipmentStore()

const formData = ref({
  equipmentId: '',
  phenomenon: '',
  phenomenonCategory: [] as string[],
  severity: '' as string,
  mediaFiles: [] as File[]
})

const isSubmitting = ref(false)
const showSuccess = ref(false)

const categoryOptions = [
  '机械故障',
  '电气故障',
  '液压故障',
  '气动故障',
  '控制系统故障',
  '传感器故障',
  '通信故障',
  '精度问题',
  '异常噪音',
  '异常振动',
  '温度异常',
  '泄漏问题',
  '其他'
]

const severityOptions = [
  { value: 'P1', label: '紧急 - 设备停机，影响生产', color: 'bg-red-100 text-red-800' },
  { value: 'P2', label: '严重 - 设备性能严重下降', color: 'bg-orange-100 text-orange-800' },
  { value: 'P3', label: '一般 - 设备可继续运行，需安排维修', color: 'bg-blue-100 text-blue-800' },
  { value: 'P4', label: '轻微 - 不影响运行，可延后处理', color: 'bg-gray-100 text-gray-800' }
]

onMounted(async () => {
  await equipmentStore.fetchList()
})

const handleBack = () => {
  router.push('/workorder')
}

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files) {
    const newFiles = Array.from(input.files)
    formData.value.mediaFiles = [...formData.value.mediaFiles, ...newFiles]
  }
}

const removeFile = (index: number) => {
  formData.value.mediaFiles.splice(index, 1)
}

const getObjectURL = (file: File) => {
  return globalThis.URL.createObjectURL(file)
}

const toggleCategory = (category: string) => {
  const index = formData.value.phenomenonCategory.indexOf(category)
  if (index > -1) {
    formData.value.phenomenonCategory.splice(index, 1)
  } else {
    formData.value.phenomenonCategory.push(category)
  }
}

const validateForm = (): boolean => {
  if (!formData.value.equipmentId) {
    alert('请选择故障设备')
    return false
  }
  if (!formData.value.phenomenon.trim()) {
    alert('请填写故障现象描述')
    return false
  }
  if (formData.value.phenomenonCategory.length === 0) {
    alert('请至少选择一个故障类别')
    return false
  }
  if (!formData.value.severity) {
    alert('请选择故障严重程度')
    return false
  }
  return true
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  isSubmitting.value = true
  
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    console.log('提交故障登记:', {
      equipmentId: formData.value.equipmentId,
      phenomenon: formData.value.phenomenon,
      categories: formData.value.phenomenonCategory,
      severity: formData.value.severity,
      fileCount: formData.value.mediaFiles.length
    })
    
    showSuccess.value = true
    
    setTimeout(() => {
      router.push('/workorder')
    }, 1500)
  } catch (error) {
    console.error('提交失败:', error)
    alert('提交失败，请重试')
  } finally {
    isSubmitting.value = false
  }
}

const selectedEquipment = () => {
  return equipmentStore.equipmentList.find(e => e.id === formData.value.equipmentId)
}
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-6">
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
        <h2 class="text-2xl font-bold text-gray-900">故障登记</h2>
        <p class="mt-1 text-sm text-gray-600">报告设备故障并创建维修工单</p>
      </div>
    </div>

    <div v-if="showSuccess" class="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
      <svg class="mx-auto h-12 w-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 class="mt-4 text-lg font-medium text-green-800">提交成功</h3>
      <p class="mt-2 text-sm text-green-700">故障工单已创建，正在跳转...</p>
    </div>

    <form v-else @submit.prevent="handleSubmit" class="space-y-6">
      <div class="bg-white rounded-lg shadow-sm p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <svg class="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          设备信息
        </h3>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            选择故障设备 <span class="text-red-500">*</span>
          </label>
          <select
            v-model="formData.equipmentId"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">请选择设备</option>
            <option
              v-for="equipment in equipmentStore.equipmentList"
              :key="equipment.id"
              :value="equipment.id"
            >
              {{ equipment.name }} ({{ equipment.code }}) - {{ equipment.department }}
            </option>
          </select>
          
          <div v-if="selectedEquipment()" class="mt-3 p-4 bg-gray-50 rounded-lg">
            <div class="grid grid-cols-2 gap-2 text-sm">
              <div class="text-gray-600">设备类型：<span class="text-gray-900">{{ selectedEquipment()!.type }}</span></div>
              <div class="text-gray-600">安装位置：<span class="text-gray-900">{{ selectedEquipment()!.location }}</span></div>
              <div class="text-gray-600">所属部门：<span class="text-gray-900">{{ selectedEquipment()!.department }}</span></div>
              <div class="text-gray-600">重要度等级：<span class="text-gray-900">{{ selectedEquipment()!.criticality }}</span></div>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          故障信息
        </h3>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              故障现象描述 <span class="text-red-500">*</span>
            </label>
            <textarea
              v-model="formData.phenomenon"
              rows="4"
              placeholder="请详细描述故障现象，包括异常表现、发生时间、频率等"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            ></textarea>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              故障类别 <span class="text-red-500">*</span>
            </label>
            <div class="grid grid-cols-3 gap-2">
              <button
                v-for="category in categoryOptions"
                :key="category"
                type="button"
                @click="toggleCategory(category)"
                class="px-3 py-2 text-sm rounded-lg border transition-colors text-left"
                :class="{
                  'bg-primary-50 border-primary-500 text-primary-700': formData.phenomenonCategory.includes(category),
                  'bg-white border-gray-300 text-gray-700 hover:bg-gray-50': !formData.phenomenonCategory.includes(category)
                }"
              >
                {{ category }}
              </button>
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              严重程度 <span class="text-red-500">*</span>
            </label>
            <div class="space-y-2">
              <label
                v-for="option in severityOptions"
                :key="option.value"
                class="flex items-center p-3 rounded-lg border cursor-pointer transition-colors"
                :class="{
                  'bg-primary-50 border-primary-500': formData.severity === option.value,
                  'bg-white border-gray-300 hover:bg-gray-50': formData.severity !== option.value
                }"
              >
                <input
                  type="radio"
                  v-model="formData.severity"
                  :value="option.value"
                  class="w-4 h-4 text-primary-600 focus:ring-primary-500"
                />
                <span class="ml-3 text-sm" :class="formData.severity === option.value ? 'text-primary-700 font-medium' : 'text-gray-700'">
                  {{ option.label }}
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          附件上传
        </h3>
        
        <div class="space-y-4">
          <div
            class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors"
            @dragover.prevent
            @drop.prevent
          >
            <input
              type="file"
              id="file-upload"
              multiple
              accept="image/*"
              @change="handleFileChange"
              class="hidden"
            />
            <label for="file-upload" class="cursor-pointer">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p class="mt-2 text-sm text-gray-600">
                <span class="text-primary-600 hover:text-primary-500 font-medium">点击上传</span>
                或拖拽文件到这里
              </p>
              <p class="mt-1 text-xs text-gray-500">支持 JPG、PNG 格式，建议图片大小不超过 5MB</p>
            </label>
          </div>
          
          <div v-if="formData.mediaFiles.length > 0" class="space-y-2">
            <div
              v-for="(file, index) in formData.mediaFiles"
              :key="index"
              class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-gray-200 rounded flex items-center justify-center overflow-hidden">
                  <img
                    v-if="file.type.startsWith('image/')"
                    :src="getObjectURL(file)"
                    :alt="file.name"
                    class="w-full h-full object-cover"
                  />
                  <svg v-else class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ file.name }}</p>
                  <p class="text-xs text-gray-500">{{ (file.size / 1024 / 1024).toFixed(2) }} MB</p>
                </div>
              </div>
              <button
                type="button"
                @click="removeFile(index)"
                class="p-1 hover:bg-gray-200 rounded transition-colors"
              >
                <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-end gap-3">
        <button
          type="button"
          @click="handleBack"
          class="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          取消
        </button>
        <button
          type="submit"
          :disabled="isSubmitting"
          class="px-6 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center"
        >
          <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ isSubmitting ? '提交中...' : '提交工单' }}
        </button>
      </div>
    </form>
  </div>
</template>
