<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSparePartStore } from '@/stores/sparepart'

const router = useRouter()
const sparePartStore = useSparePartStore()

const searchKeyword = ref('')
const selectedCategory = ref('')
const selectedStatus = ref('')

onMounted(async () => {
  await sparePartStore.fetchList()
})

const handleSearch = () => {
  sparePartStore.setFilters({
    keyword: searchKeyword.value,
    category: selectedCategory.value,
    status: selectedStatus.value
  })
}

const handleReset = () => {
  searchKeyword.value = ''
  selectedCategory.value = ''
  selectedStatus.value = ''
  sparePartStore.setFilters({
    keyword: '',
    category: '',
    status: ''
  })
}

const goToDetail = (id: string) => {
  router.push(`/sparepart/${id}`)
}

const getStockPercentage = (stock: number, _safeStock: number, maxStock: number) => {
  if (maxStock === 0) return 0
  return Math.min((stock / maxStock) * 100, 100)
}

const getStockLevelColor = (stock: number, safeStock: number) => {
  if (stock < safeStock) return 'bg-red-500'
  if (stock > safeStock * 1.5) return 'bg-orange-500'
  return 'bg-green-500'
}

const getStockLevelTextColor = (stock: number, safeStock: number) => {
  if (stock < safeStock) return 'text-red-600'
  return 'text-gray-900'
}

const isLowStock = (stock: number, safeStock: number) => {
  return stock < safeStock
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-start justify-between">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">备件库存</h2>
        <p class="mt-1 text-sm text-gray-600">管理备件库存与预警</p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">备件总数</p>
            <p class="mt-2 text-3xl font-bold text-gray-900">{{ sparePartStore.overview.total }}</p>
          </div>
          <div class="p-3 bg-blue-100 rounded-lg">
            <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">库存预警</p>
            <p class="mt-2 text-3xl font-bold text-red-600">{{ sparePartStore.overview.alertCount }}</p>
          </div>
          <div class="p-3 bg-red-100 rounded-lg">
            <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">A类备件</p>
            <p class="mt-2 text-3xl font-bold text-purple-600">{{ sparePartStore.overview.categoryA }}</p>
          </div>
          <div class="p-3 bg-purple-100 rounded-lg">
            <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow-sm p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600">库存总值</p>
            <p class="mt-2 text-3xl font-bold text-green-600">¥{{ sparePartStore.overview.totalValue.toLocaleString() }}</p>
          </div>
          <div class="p-3 bg-green-100 rounded-lg">
            <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-sm p-4">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-1">搜索备件</label>
          <div class="relative">
            <input
              v-model="searchKeyword"
              type="text"
              placeholder="输入备件名称或编号"
              class="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              @input="handleSearch"
            />
            <svg class="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">备件分类</label>
          <select
            v-model="selectedCategory"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            @change="handleSearch"
          >
            <option value="">全部分类</option>
            <option value="A">A类 - 高价值关键件</option>
            <option value="B">B类 - 中等价值件</option>
            <option value="C">C类 - 低值易耗件</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">库存状态</label>
          <select
            v-model="selectedStatus"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            @change="handleSearch"
          >
            <option value="">全部状态</option>
            <option value="normal">正常</option>
            <option value="low">库存过低</option>
            <option value="overstock">库存过高</option>
            <option value="stagnant">呆滞库存</option>
            <option value="expiring">临期</option>
          </select>
        </div>
      </div>

      <div class="mt-4 flex items-center justify-between">
        <div class="text-sm text-gray-600">
          共 <span class="font-semibold text-gray-900">{{ sparePartStore.filteredList.length }}</span> 个备件
        </div>
        <button
          @click="handleReset"
          class="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          重置筛选
        </button>
      </div>
    </div>

    <div v-if="sparePartStore.loading" class="flex items-center justify-center py-12">
      <svg class="animate-spin h-8 w-8 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span class="ml-3 text-gray-600">加载中...</span>
    </div>

    <div v-else-if="sparePartStore.filteredList.length === 0" class="bg-white rounded-lg shadow-sm p-12 text-center">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 class="mt-4 text-lg font-medium text-gray-900">暂无备件</h3>
      <p class="mt-2 text-sm text-gray-500">没有找到符合条件的备件，请调整筛选条件</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="part in sparePartStore.filteredList"
        :key="part.id"
        @click="goToDetail(part.id)"
        class="bg-white rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden border-2"
        :class="isLowStock(part.stock, part.safeStock) ? 'border-red-300' : 'border-gray-200'"
      >
        <div class="p-6">
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-gray-900 mb-1">{{ part.name }}</h3>
              <div class="flex items-center text-sm text-gray-600 mb-2">
                <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                </svg>
                {{ part.code }}
              </div>
            </div>
            <span
              class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ml-2"
              :class="sparePartStore.statusColors[part.status].bg + ' ' + sparePartStore.statusColors[part.status].text"
            >
              {{ sparePartStore.statusLabels[part.status] }}
            </span>
          </div>

          <div class="flex items-center justify-between mb-3">
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
            <span class="text-sm font-medium text-gray-900">
              ¥{{ part.price.toLocaleString() }}/{{ part.unit }}
            </span>
          </div>

          <div class="space-y-2">
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-600">当前库存</span>
              <span
                class="font-semibold"
                :class="getStockLevelTextColor(part.stock, part.safeStock)"
              >
                {{ part.stock }} {{ part.unit }}
              </span>
            </div>

            <div class="relative">
              <div class="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span>安全库存: {{ part.safeStock }}</span>
                <span>最大库存: {{ part.maxStock }}</span>
              </div>
              <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  class="h-full transition-all duration-300 rounded-full"
                  :class="getStockLevelColor(part.stock, part.safeStock)"
                  :style="{ width: getStockPercentage(part.stock, part.safeStock, part.maxStock) + '%' }"
                ></div>
              </div>
            </div>

            <div v-if="isLowStock(part.stock, part.safeStock)" class="flex items-center text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              库存低于安全线，请及时补充
            </div>
          </div>

          <div class="mt-4 pt-4 border-t border-gray-100">
            <div class="flex items-center text-sm text-gray-600">
              <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span class="truncate">{{ part.location }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
