<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useEquipmentStore } from '@/stores/equipment'

const route = useRoute()
const router = useRouter()
const equipmentStore = useEquipmentStore()

const activeTab = ref('basic')

const tabs = [
  { key: 'basic', label: '基本信息' },
  { key: 'parameters', label: '技术参数' },
  { key: 'maintenance', label: '维修履历' },
  { key: 'documents', label: '关联文档' }
]

onMounted(async () => {
  const id = route.params.id as string
  await equipmentStore.fetchById(id)
})

const equipment = computed(() => equipmentStore.currentEquipment)

const goBack = () => {
  router.push('/equipment')
}

const maintenanceRecords = computed(() => {
  return [
    {
      id: 'MR001',
      type: '故障维修',
      title: '主轴异响维修',
      description: '更换主轴轴承，调整间隙',
      startTime: '2024-05-10T09:00:00Z',
      endTime: '2024-05-10T15:30:00Z',
      duration: 390,
      technician: '张维修',
      result: 'success',
      cost: 15000
    },
    {
      id: 'MR002',
      type: '计划保养',
      title: '季度保养',
      description: '润滑系统检查，精度校准',
      startTime: '2024-04-15T08:00:00Z',
      endTime: '2024-04-15T12:00:00Z',
      duration: 240,
      technician: '李技术',
      result: 'success',
      cost: 2000
    },
    {
      id: 'MR003',
      type: '故障维修',
      title: '控制系统升级',
      description: '更新数控系统软件，优化加工参数',
      startTime: '2024-03-20T13:00:00Z',
      endTime: '2024-03-20T18:00:00Z',
      duration: 300,
      technician: '王工程师',
      result: 'success',
      cost: 8000
    },
    {
      id: 'MR004',
      type: '计划保养',
      title: '年度大修',
      description: '全面检查，更换磨损部件',
      startTime: '2024-01-10T08:00:00Z',
      endTime: '2024-01-12T17:00:00Z',
      duration: 1800,
      technician: '张维修',
      result: 'success',
      cost: 25000
    }
  ]
})

const formatDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours}小时${mins}分钟`
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<template>
  <div v-if="equipmentStore.loading" class="flex items-center justify-center py-20">
    <svg class="animate-spin h-8 w-8 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <span class="ml-3 text-gray-600">加载中...</span>
  </div>

  <div v-else-if="!equipment" class="bg-white rounded-lg shadow-sm p-12 text-center">
    <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <h3 class="mt-4 text-lg font-medium text-gray-900">设备不存在</h3>
    <p class="mt-2 text-sm text-gray-500">未找到对应的设备信息</p>
    <button
      @click="goBack"
      class="mt-6 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
    >
      返回设备列表
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
              <h1 class="text-2xl font-bold text-gray-900">{{ equipment.name }}</h1>
              <span
                class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium"
                :class="[equipmentStore.statusColors[equipment.status].bg, equipmentStore.statusColors[equipment.status].text]"
              >
                <span
                  class="w-2 h-2 rounded-full"
                  :class="equipmentStore.statusColors[equipment.status].dot"
                ></span>
                {{ equipmentStore.statusLabels[equipment.status] }}
              </span>
            </div>

            <div class="flex items-center gap-6 text-sm text-gray-600">
              <span class="flex items-center gap-1.5">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                </svg>
                设备编号: {{ equipment.code }}
              </span>
              <span class="flex items-center gap-1.5">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                {{ equipment.department }}
              </span>
              <span class="flex items-center gap-1.5">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {{ equipment.location }}
              </span>
            </div>
          </div>
        </div>

        <div class="flex gap-2">
          <button class="px-4 py-2 text-sm font-medium text-primary-700 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors">
            编辑信息
          </button>
          <button class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors">
            导出档案
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
        <div v-show="activeTab === 'basic'" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">基本信息</h3>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-500 mb-1">设备类型</label>
                  <p class="text-sm text-gray-900">{{ equipment.type }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-500 mb-1">设备编号</label>
                  <p class="text-sm text-gray-900">{{ equipment.code }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-500 mb-1">所属部门</label>
                  <p class="text-sm text-gray-900">{{ equipment.department }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-500 mb-1">安装位置</label>
                  <p class="text-sm text-gray-900">{{ equipment.location }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-500 mb-1">重要程度</label>
                  <p class="text-sm text-gray-900">{{ equipmentStore.criticalityLabels[equipment.criticality] }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-500 mb-1">当前状态</label>
                  <p class="text-sm text-gray-900">{{ equipmentStore.statusLabels[equipment.status] }}</p>
                </div>
              </div>
            </div>

            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">制造商信息</h3>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-500 mb-1">制造商</label>
                  <p class="text-sm text-gray-900">{{ equipment.manufacturer }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-500 mb-1">型号</label>
                  <p class="text-sm text-gray-900">{{ equipment.model }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-500 mb-1">序列号</label>
                  <p class="text-sm text-gray-900">{{ equipment.serialNumber }}</p>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-500 mb-1">安装日期</label>
                  <p class="text-sm text-gray-900">{{ equipment.installDate }}</p>
                </div>
              </div>
            </div>
          </div>

          <div v-if="equipment.imageUrl" class="mt-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">设备图片</h3>
            <img
              :src="equipment.imageUrl"
              :alt="equipment.name"
              class="max-w-2xl h-auto rounded-lg shadow-sm"
            />
          </div>
        </div>

        <div v-show="activeTab === 'parameters'" class="space-y-6">
          <h3 class="text-lg font-semibold text-gray-900">技术参数</h3>
          <div class="border border-gray-200 rounded-lg overflow-hidden">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    参数名称
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    参数值
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="(value, key) in equipment.parameters" :key="key">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{ key }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {{ value }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div v-show="activeTab === 'maintenance'" class="space-y-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-gray-900">维修履历</h3>
            <button class="px-4 py-2 text-sm font-medium text-primary-700 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors">
              新增维修记录
            </button>
          </div>

          <div class="relative">
            <div class="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>

            <div class="space-y-6">
              <div
                v-for="record in maintenanceRecords"
                :key="record.id"
                class="relative pl-16"
              >
                <div class="absolute left-6 w-4 h-4 rounded-full border-2 border-white ring-2"
                  :class="record.result === 'success' ? 'bg-green-500 ring-green-200' : 'bg-red-500 ring-red-200'"
                ></div>

                <div class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div class="flex items-start justify-between mb-3">
                    <div>
                      <div class="flex items-center gap-2 mb-1">
                        <span
                          class="px-2 py-0.5 text-xs font-medium rounded"
                          :class="record.type === '故障维修' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'"
                        >
                          {{ record.type }}
                        </span>
                        <h4 class="text-base font-semibold text-gray-900">{{ record.title }}</h4>
                      </div>
                      <p class="text-sm text-gray-600">{{ record.description }}</p>
                    </div>
                    <span
                      class="px-2 py-1 text-xs font-medium rounded"
                      :class="record.result === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                    >
                      {{ record.result === 'success' ? '已完成' : '未完成' }}
                    </span>
                  </div>

                  <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span class="text-gray-500">维修人员:</span>
                      <span class="ml-1 text-gray-900 font-medium">{{ record.technician }}</span>
                    </div>
                    <div>
                      <span class="text-gray-500">维修时长:</span>
                      <span class="ml-1 text-gray-900 font-medium">{{ formatDuration(record.duration) }}</span>
                    </div>
                    <div>
                      <span class="text-gray-500">维修费用:</span>
                      <span class="ml-1 text-gray-900 font-medium">¥{{ record.cost.toLocaleString() }}</span>
                    </div>
                    <div>
                      <span class="text-gray-500">完成时间:</span>
                      <span class="ml-1 text-gray-900 font-medium">{{ formatDate(record.endTime) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-show="activeTab === 'documents'" class="space-y-6">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-gray-900">关联文档</h3>
            <button class="px-4 py-2 text-sm font-medium text-primary-700 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors">
              上传文档
            </button>
          </div>

          <div class="bg-white border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-primary-400 transition-colors cursor-pointer">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <h3 class="mt-4 text-lg font-medium text-gray-900">暂无关联文档</h3>
            <p class="mt-2 text-sm text-gray-500">点击或拖拽文件到此处上传</p>
            <p class="mt-1 text-xs text-gray-400">支持 PDF, Word, Excel, 图片等格式</p>
          </div>

          <div class="mt-6 text-center">
            <p class="text-sm text-gray-500">常见关联文档包括：</p>
            <ul class="mt-2 text-sm text-gray-600 space-y-1">
              <li>• 设备操作手册</li>
              <li>• 维修保养记录表</li>
              <li>• 设备验收报告</li>
              <li>• 安全检验证书</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
