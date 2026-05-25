<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useEquipmentStore } from '@/stores/equipment'

const router = useRouter()
const equipmentStore = useEquipmentStore()

const searchKeyword = ref('')
const selectedStatus = ref('')
const selectedDepartment = ref('')

onMounted(async () => {
  await equipmentStore.fetchList()
})

const handleSearch = () => {
  equipmentStore.setFilters({
    keyword: searchKeyword.value,
    status: selectedStatus.value,
    department: selectedDepartment.value
  })
}

const handleReset = () => {
  searchKeyword.value = ''
  selectedStatus.value = ''
  selectedDepartment.value = ''
  equipmentStore.resetFilters()
}

const goToDetail = (id: string) => {
  router.push(`/equipment/${id}`)
}

const handleAddEquipment = () => {
  console.log('新增设备')
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">设备台账</h2>
        <p class="mt-1 text-sm text-gray-600">管理所有设备信息与运行状态</p>
      </div>
      <button
        @click="handleAddEquipment"
        class="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
      >
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        新增设备
      </button>
    </div>

    <div class="bg-white rounded-lg shadow-sm p-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">搜索设备</label>
          <div class="relative">
            <input
              v-model="searchKeyword"
              type="text"
              placeholder="输入设备名称或编号"
              class="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              @input="handleSearch"
            />
            <svg class="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">设备状态</label>
          <select
            v-model="selectedStatus"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            @change="handleSearch"
          >
            <option value="">全部状态</option>
            <option value="normal">正常运行</option>
            <option value="warning">预警</option>
            <option value="fault">故障</option>
            <option value="maintenance">维修中</option>
            <option value="stopped">停机</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">所属部门</label>
          <select
            v-model="selectedDepartment"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            @change="handleSearch"
          >
            <option value="">全部部门</option>
            <option v-for="dept in equipmentStore.departments" :key="dept" :value="dept">
              {{ dept }}
            </option>
          </select>
        </div>
      </div>

      <div class="mt-4 flex items-center justify-between">
        <div class="text-sm text-gray-600">
          共 <span class="font-semibold text-gray-900">{{ equipmentStore.filteredList.length }}</span> 台设备
        </div>
        <button
          @click="handleReset"
          class="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          重置筛选
        </button>
      </div>
    </div>

    <div v-if="equipmentStore.loading" class="flex items-center justify-center py-12">
      <svg class="animate-spin h-8 w-8 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span class="ml-3 text-gray-600">加载中...</span>
    </div>

    <div v-else-if="equipmentStore.filteredList.length === 0" class="bg-white rounded-lg shadow-sm p-12 text-center">
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 class="mt-4 text-lg font-medium text-gray-900">暂无设备</h3>
      <p class="mt-2 text-sm text-gray-500">没有找到符合条件的设备，请调整筛选条件</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="equipment in equipmentStore.filteredList"
        :key="equipment.id"
        @click="goToDetail(equipment.id)"
        class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden border border-gray-200"
      >
        <div v-if="equipment.imageUrl" class="h-48 overflow-hidden bg-gray-100">
          <img
            :src="equipment.imageUrl"
            :alt="equipment.name"
            class="w-full h-full object-cover"
          />
        </div>
        <div v-else class="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          <svg class="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>

        <div class="p-4">
          <div class="flex items-start justify-between mb-2">
            <h3 class="text-lg font-semibold text-gray-900 flex-1">{{ equipment.name }}</h3>
            <span
              class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ml-2"
              :class="[equipmentStore.statusColors[equipment.status].bg, equipmentStore.statusColors[equipment.status].text]"
            >
              <span
                class="w-1.5 h-1.5 rounded-full"
                :class="equipmentStore.statusColors[equipment.status].dot"
              ></span>
              {{ equipmentStore.statusLabels[equipment.status] }}
            </span>
          </div>

          <div class="space-y-2 text-sm">
            <div class="flex items-center text-gray-600">
              <svg class="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
              </svg>
              <span class="truncate">{{ equipment.code }}</span>
            </div>

            <div class="flex items-center text-gray-600">
              <svg class="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span class="truncate">{{ equipment.department }}</span>
            </div>

            <div class="flex items-center text-gray-600">
              <svg class="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span class="truncate">{{ equipment.location }}</span>
            </div>
          </div>

          <div class="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
            <span class="text-xs text-gray-500">{{ equipment.type }}</span>
            <span
              class="text-xs font-medium px-2 py-1 rounded"
              :class="{
                'bg-red-100 text-red-800': equipment.criticality === 'A',
                'bg-yellow-100 text-yellow-800': equipment.criticality === 'B',
                'bg-blue-100 text-blue-800': equipment.criticality === 'C',
                'bg-gray-100 text-gray-800': equipment.criticality === 'D'
              }"
            >
              {{ equipmentStore.criticalityLabels[equipment.criticality] }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
