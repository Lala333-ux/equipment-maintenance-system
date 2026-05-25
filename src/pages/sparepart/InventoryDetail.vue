<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSparePartStore } from '@/stores/sparepart'

const route = useRoute()
const router = useRouter()
const sparePartStore = useSparePartStore()

const activeTab = ref('overview')

const tabs = [
  { key: 'overview', label: '库存概览' },
  { key: 'batches', label: '批次明细' },
  { key: 'equipment', label: '适用设备' },
  { key: 'history', label: '出入库记录' }
]

onMounted(async () => {
  const id = route.params.id as string
  await sparePartStore.fetchById(id)
})

const part = computed(() => sparePartStore.currentPart)

const goBack = () => {
  router.push('/sparepart')
}

const getStockPercentage = (stock: number, maxStock: number) => {
  if (maxStock === 0) return 0
  return Math.min((stock / maxStock) * 100, 100)
}

const getSafeStockPercentage = (safeStock: number, maxStock: number) => {
  if (maxStock === 0) return 0
  return (safeStock / maxStock) * 100
}

const getStockStatusColor = (stock: number, safeStock: number, maxStock: number) => {
  if (stock < safeStock) return {
    bg: 'bg-red-500',
    text: 'bg-red-100 text-red-800',
    label: '库存不足'
  }
  if (stock > maxStock) {
    return {
      bg: 'bg-orange-500',
      text: 'bg-orange-100 text-orange-800',
      label: '库存过高'
    }
  }
  return {
    bg: 'bg-green-500',
    text: 'bg-green-100 text-green-800',
    label: '库存正常'
  }
}

const movementHistory = computed(() => {
  return [
    {
      id: 'MH001',
      type: '出库',
      quantity: -5,
      date: '2024-05-20T14:30:00Z',
      operator: '张维修',
      workOrder: 'WO2024052001',
      remark: '故障维修使用'
    },
    {
      id: 'MH002',
      type: '入库',
      quantity: 50,
      date: '2024-05-15T09:00:00Z',
      operator: '李仓管',
      workOrder: '',
      remark: '批量采购入库'
    },
    {
      id: 'MH003',
      type: '出库',
      quantity: -3,
      date: '2024-05-10T16:45:00Z',
      operator: '王技术',
      workOrder: 'WO2024051003',
      remark: '计划保养使用'
    },
    {
      id: 'MH004',
      type: '入库',
      quantity: 100,
      date: '2024-04-28T10:20:00Z',
      operator: '李仓管',
      workOrder: '',
      remark: '供应商补货'
    },
    {
      id: 'MH005',
      type: '出库',
      quantity: -10,
      date: '2024-04-20T11:00:00Z',
      operator: '张维修',
      workOrder: 'WO2024042005',
      remark: '紧急维修'
    }
  ]
})

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

const formatSimpleDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}
</script>

<template>
  <div v-if="sparePartStore.loading" class="flex items-center justify-center py-20">
    <svg class="animate-spin h-8 w-8 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <span class="ml-3 text-gray-600">加载中...</span>
  </div>

  <div v-else-if="!part" class="bg-white rounded-lg shadow-sm p-12 text-center">
    <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <h3 class="mt-4 text-lg font-medium text-gray-900">备件不存在</h3>
    <p class="mt-2 text-sm text-gray-500">未找到对应的备件信息</p>
    <button
      @click="goBack"
      class="mt-6 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
    >
      返回备件列表
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
              <h1 class="text-2xl font-bold text-gray-900">{{ part.name }}</h1>
              <span
                class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium"
                :class="[sparePartStore.statusColors[part.status].bg, sparePartStore.statusColors[part.status].text]"
              >
                {{ sparePartStore.statusLabels[part.status] }}
              </span>
            </div>

            <div class="flex items-center gap-6 text-sm text-gray-600">
              <span class="flex items-center gap-1.5">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                </svg>
                备件编号: {{ part.code }}
              </span>
              <span class="flex items-center gap-1.5">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {{ part.location }}
              </span>
              <span
                class="text-xs font-medium px-2 py-1 rounded"
                :class="{
                  'bg-red-100 text-red-800': part.category === 'A',
                  'bg-yellow-100 text-yellow-800': part.category === 'B',
                  'bg-blue-100 text-blue-800': part.category === 'C'
                }"
              >
                {{ sparePartStore.categoryLabels[part.category].label }}
              </span>
            </div>
          </div>
        </div>

        <div class="flex gap-2">
          <button class="px-4 py-2 text-sm font-medium text-primary-700 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors">
            编辑信息
          </button>
          <button class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors">
            出入库
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
        <div v-show="activeTab === 'overview'" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-medium text-blue-700">当前库存</span>
                <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <p class="text-3xl font-bold text-blue-900">{{ part.stock }}</p>
              <p class="text-sm text-blue-700 mt-1">{{ part.unit }}</p>
            </div>

            <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-medium text-green-700">安全库存</span>
                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <p class="text-3xl font-bold text-green-900">{{ part.safeStock }}</p>
              <p class="text-sm text-green-700 mt-1">{{ part.unit }}</p>
            </div>

            <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-medium text-purple-700">最大库存</span>
                <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <p class="text-3xl font-bold text-purple-900">{{ part.maxStock }}</p>
              <p class="text-sm text-purple-700 mt-1">{{ part.unit }}</p>
            </div>

            <div class="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-medium text-orange-700">单价</span>
                <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p class="text-3xl font-bold text-orange-900">¥{{ part.price }}</p>
              <p class="text-sm text-orange-700 mt-1">元/{{ part.unit }}</p>
            </div>

            <div class="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-6">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-medium text-indigo-700">库存总值</span>
                <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <p class="text-3xl font-bold text-indigo-900">¥{{ (part.stock * part.price).toLocaleString() }}</p>
              <p class="text-sm text-indigo-700 mt-1">元</p>
            </div>
          </div>

          <div class="bg-white border border-gray-200 rounded-lg p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-semibold text-gray-900">库存水位</h3>
              <span
                class="px-3 py-1 rounded-full text-sm font-medium"
                :class="getStockStatusColor(part.stock, part.safeStock, part.maxStock).text"
              >
                {{ getStockStatusColor(part.stock, part.safeStock, part.maxStock).label }}
              </span>
            </div>

            <div class="relative">
              <div class="flex items-end justify-between text-sm text-gray-600 mb-2">
                <span>0</span>
                <span>{{ part.maxStock }} {{ part.unit }}</span>
              </div>

              <div class="relative h-12 bg-gray-100 rounded-lg overflow-hidden">
                <div
                  class="absolute inset-y-0 left-0 transition-all duration-500 rounded-lg"
                  :class="getStockStatusColor(part.stock, part.safeStock, part.maxStock).bg"
                  :style="{ width: getStockPercentage(part.stock, part.maxStock) + '%' }"
                ></div>

                <div
                  class="absolute inset-y-0 w-0.5 bg-gray-600 opacity-50"
                  :style="{ left: getSafeStockPercentage(part.safeStock, part.maxStock) + '%' }"
                  title="安全库存线"
                ></div>
              </div>

              <div class="flex items-center gap-4 mt-4 text-sm">
                <div class="flex items-center">
                  <div class="w-4 h-4 bg-gray-400 rounded mr-2"></div>
                  <span class="text-gray-600">最大库存</span>
                </div>
                <div class="flex items-center">
                  <div class="w-4 h-4 border-l-2 border-gray-600 border-dashed mr-2"></div>
                  <span class="text-gray-600">安全库存线</span>
                </div>
                <div class="flex items-center">
                  <div
                    class="w-4 h-4 rounded mr-2"
                    :class="getStockStatusColor(part.stock, part.safeStock, part.maxStock).bg"
                  ></div>
                  <span class="text-gray-600">当前库存</span>
                </div>
              </div>
            </div>

            <div v-if="part.stock < part.safeStock" class="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div class="flex">
                <svg class="w-5 h-5 text-red-600 mr-3 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <h4 class="text-sm font-semibold text-red-900">库存预警</h4>
                  <p class="text-sm text-red-700 mt-1">
                    当前库存 {{ part.stock }} {{ part.unit }} 低于安全库存 {{ part.safeStock }} {{ part.unit }}，
                    建议立即补充库存。还需补充 {{ part.safeStock - part.stock }} {{ part.unit }}。
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="border border-gray-200 rounded-lg p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">存储信息</h3>
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600">存储位置</span>
                  <span class="text-sm font-medium text-gray-900">{{ part.location }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600">计量单位</span>
                  <span class="text-sm font-medium text-gray-900">{{ part.unit }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600">最近入库</span>
                  <span class="text-sm font-medium text-gray-900">{{ part.lastInDate || '暂无' }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-sm text-gray-600">最近出库</span>
                  <span class="text-sm font-medium text-gray-900">{{ part.lastOutDate || '暂无' }}</span>
                </div>
              </div>
            </div>

            <div class="border border-gray-200 rounded-lg p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">适用设备</h3>
              <div class="space-y-2">
                <div
                  v-for="equipment in part.applicableEquipment"
                  :key="equipment"
                  class="flex items-center p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <svg class="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span class="text-sm text-gray-900">{{ equipment }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-show="activeTab === 'batches'" class="space-y-6">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">批次明细</h3>
            <button class="px-4 py-2 text-sm font-medium text-primary-700 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors">
              新增批次
            </button>
          </div>

          <div class="border border-gray-200 rounded-lg overflow-hidden">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    批次号
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    数量
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    入库日期
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    有效期至
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    状态
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="batch in part.batches" :key="batch.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{ batch.batchNumber }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {{ batch.quantity }} {{ part.unit }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {{ formatSimpleDate(batch.inDate) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {{ batch.expireDate ? formatSimpleDate(batch.expireDate) : '-' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      v-if="batch.expireDate"
                      class="px-2 py-1 text-xs font-medium rounded"
                      :class="new Date(batch.expireDate) < new Date() ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'"
                    >
                      {{ new Date(batch.expireDate) < new Date() ? '已过期' : '有效' }}
                    </span>
                    <span v-else class="text-sm text-gray-400">-</span>
                  </td>
                </tr>
              </tbody>
            </table>

            <div v-if="part.batches.length === 0" class="text-center py-12">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <h3 class="mt-4 text-lg font-medium text-gray-900">暂无批次数据</h3>
              <p class="mt-2 text-sm text-gray-500">该备件暂无批次入库记录</p>
            </div>
          </div>
        </div>

        <div v-show="activeTab === 'equipment'" class="space-y-6">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">适用设备列表</h3>
            <span class="text-sm text-gray-600">共 {{ part.applicableEquipment.length }} 台设备</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              v-for="equipment in part.applicableEquipment"
              :key="equipment"
              class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div class="flex items-center gap-3">
                <div class="p-3 bg-blue-100 rounded-lg">
                  <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div class="flex-1">
                  <h4 class="text-base font-semibold text-gray-900">{{ equipment }}</h4>
                  <p class="text-sm text-gray-600 mt-1">使用此备件进行维修保养</p>
                </div>
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div v-show="activeTab === 'history'" class="space-y-6">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">出入库记录</h3>
            <div class="flex gap-2">
              <button class="px-4 py-2 text-sm font-medium text-primary-700 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors">
                导出记录
              </button>
            </div>
          </div>

          <div class="relative">
            <div class="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>

            <div class="space-y-6">
              <div
                v-for="record in movementHistory"
                :key="record.id"
                class="relative pl-16"
              >
                <div
                  class="absolute left-6 w-4 h-4 rounded-full border-2 border-white ring-2"
                  :class="record.type === '入库' ? 'bg-green-500 ring-green-200' : 'bg-red-500 ring-red-200'"
                ></div>

                <div class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div class="flex items-start justify-between mb-3">
                    <div class="flex items-center gap-3">
                      <span
                        class="px-2 py-1 text-xs font-medium rounded"
                        :class="record.type === '入库' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                      >
                        {{ record.type }}
                      </span>
                      <span class="text-base font-semibold text-gray-900">
                        {{ record.type === '入库' ? '+' : '' }}{{ record.quantity }} {{ part?.unit }}
                      </span>
                    </div>
                    <span class="text-sm text-gray-500">
                      {{ formatDate(record.date) }}
                    </span>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span class="text-gray-500">操作人:</span>
                      <span class="ml-1 text-gray-900 font-medium">{{ record.operator }}</span>
                    </div>
                    <div v-if="record.workOrder">
                      <span class="text-gray-500">工单:</span>
                      <span class="ml-1 text-primary-600 font-medium">{{ record.workOrder }}</span>
                    </div>
                    <div>
                      <span class="text-gray-500">备注:</span>
                      <span class="ml-1 text-gray-900">{{ record.remark }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
