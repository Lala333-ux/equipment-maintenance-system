<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useStatisticsStore } from '@/stores/statistics'

const statisticsStore = useStatisticsStore()

const statusDistribution = computed(() => {
  const { normal, warning, fault, maintenance } = statisticsStore.dashboardStats.equipmentOverview
  const total = normal + warning + fault + maintenance
  return [
    { name: '正常运行', value: normal, percentage: Math.round((normal / total) * 100), color: 'bg-green-500' },
    { name: '预警', value: warning, percentage: Math.round((warning / total) * 100), color: 'bg-yellow-500' },
    { name: '故障', value: fault, percentage: Math.round((fault / total) * 100), color: 'bg-red-500' },
    { name: '维修中', value: maintenance, percentage: Math.round((maintenance / total) * 100), color: 'bg-blue-500' }
  ]
})

const availabilityTrend = computed(() => {
  const trend = [91.2, 92.5, 90.8, 94.1, 93.6, 95.8]
  return statisticsStore.equipmentTrend.map((item, index) => ({
    month: item.month,
    value: trend[index]
  }))
})

const maxAvailability = computed(() => Math.max(...availabilityTrend.value.map(d => d.value)))
const minAvailability = computed(() => Math.min(...availabilityTrend.value.map(d => d.value)))

const maxWorkOrders = computed(() => Math.max(...statisticsStore.workOrderTrend.map(d => d.completed)))
const maxFaultCount = computed(() => Math.max(...statisticsStore.faultDistribution.map(d => d.count)))
const maxDepartmentOrders = computed(() => Math.max(...statisticsStore.departmentWorkload.map(d => d.orders)))

onMounted(async () => {
  await statisticsStore.fetchDashboard()
})

const kpiCards = computed(() => [
  {
    title: '设备OEE',
    value: statisticsStore.kpiMetrics.oee,
    unit: '%',
    icon: 'efficiency',
    trend: '+2.3%',
    trendUp: true
  },
  {
    title: 'MTBF',
    value: statisticsStore.kpiMetrics.mtbf,
    unit: '小时',
    icon: 'time',
    trend: '+5.2%',
    trendUp: true
  },
  {
    title: 'MTTR',
    value: statisticsStore.kpiMetrics.mttr,
    unit: '小时',
    icon: 'repair',
    trend: '-8.1%',
    trendUp: true
  },
  {
    title: '设备可用率',
    value: statisticsStore.kpiMetrics.availability,
    unit: '%',
    icon: 'availability',
    trend: '+1.5%',
    trendUp: true
  }
])

const faultTypeColors = [
  'bg-blue-500',
  'bg-green-500',
  'bg-yellow-500',
  'bg-purple-500',
  'bg-gray-500'
]
</script>

<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-bold text-gray-900">统计分析</h2>
      <p class="mt-1 text-sm text-gray-600">设备运行与维修数据统计看板</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div
        v-for="kpi in kpiCards"
        :key="kpi.title"
        class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
      >
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-sm font-medium text-gray-600">{{ kpi.title }}</h3>
          <div
            class="w-10 h-10 rounded-lg flex items-center justify-center"
            :class="{
              'bg-blue-100': kpi.icon === 'efficiency',
              'bg-green-100': kpi.icon === 'time',
              'bg-yellow-100': kpi.icon === 'repair',
              'bg-purple-100': kpi.icon === 'availability'
            }"
          >
            <svg v-if="kpi.icon === 'efficiency'" class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <svg v-else-if="kpi.icon === 'time'" class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <svg v-else-if="kpi.icon === 'repair'" class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <svg v-else-if="kpi.icon === 'availability'" class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <div class="flex items-baseline gap-2 mb-2">
          <span class="text-3xl font-bold text-gray-900">{{ kpi.value }}</span>
          <span class="text-sm text-gray-500">{{ kpi.unit }}</span>
        </div>
        <div class="flex items-center text-sm">
          <span
            class="font-medium"
            :class="kpi.trendUp ? 'text-green-600' : 'text-red-600'"
          >
            {{ kpi.trend }}
          </span>
          <span class="text-gray-400 ml-2">较上月</span>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">设备状态分布</h3>
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <div class="space-y-3">
              <div v-for="status in statusDistribution" :key="status.name" class="flex items-center">
                <div :class="status.color" class="w-3 h-3 rounded-full mr-3"></div>
                <span class="text-sm text-gray-600 w-20">{{ status.name }}</span>
                <div class="flex-1 bg-gray-100 rounded-full h-2 mx-3 overflow-hidden">
                  <div
                    :class="status.color"
                    class="h-full rounded-full transition-all duration-500"
                    :style="{ width: status.percentage + '%' }"
                  ></div>
                </div>
                <span class="text-sm font-medium text-gray-900 w-12 text-right">{{ status.percentage }}%</span>
                <span class="text-xs text-gray-500 w-12 text-right ml-2">{{ status.value }}台</span>
              </div>
            </div>
          </div>
          <div class="relative w-40 h-40 ml-8">
            <svg viewBox="0 0 100 100" class="transform -rotate-90">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" stroke-width="12" />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#22c55e"
                stroke-width="12"
                :stroke-dasharray="`${statusDistribution[0].percentage * 2.51} 251`"
                stroke-linecap="round"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#eab308"
                stroke-width="12"
                :stroke-dasharray="`${statusDistribution[1].percentage * 2.51} 251`"
                :stroke-dashoffset="`-${statusDistribution[0].percentage * 2.51}`"
                stroke-linecap="round"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#ef4444"
                stroke-width="12"
                :stroke-dasharray="`${statusDistribution[2].percentage * 2.51} 251`"
                :stroke-dashoffset="`-${(statusDistribution[0].percentage + statusDistribution[1].percentage) * 2.51}`"
                stroke-linecap="round"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#3b82f6"
                stroke-width="12"
                :stroke-dasharray="`${statusDistribution[3].percentage * 2.51} 251`"
                :stroke-dashoffset="`-${(statusDistribution[0].percentage + statusDistribution[1].percentage + statusDistribution[2].percentage) * 2.51}`"
                stroke-linecap="round"
              />
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center">
              <span class="text-2xl font-bold text-gray-900">{{ statisticsStore.dashboardStats.equipmentOverview.total }}</span>
              <span class="text-xs text-gray-500">总设备数</span>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">可用性趋势</h3>
        <div class="h-48 flex items-end justify-between space-x-2">
          <div
            v-for="data in availabilityTrend"
            :key="data.month"
            class="flex-1 flex flex-col items-center"
          >
            <div class="w-full flex items-end justify-center flex-1">
              <div
                class="w-8 bg-gradient-to-t from-blue-500 to-blue-300 rounded-t transition-all duration-500 hover:from-blue-600 hover:to-blue-400"
                :style="{ height: ((data.value - 85) / 15) * 100 + '%' }"
              ></div>
            </div>
            <span class="text-xs text-gray-600 mt-2">{{ data.month }}</span>
            <span class="text-xs font-medium text-blue-600">{{ data.value }}%</span>
          </div>
        </div>
        <div class="flex items-center justify-between mt-4 text-xs text-gray-500">
          <span>最高: {{ maxAvailability }}%</span>
          <span>最低: {{ minAvailability }}%</span>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">工单完成趋势</h3>
        <div class="space-y-4">
          <div class="flex items-center space-x-4">
            <div class="flex items-center">
              <div class="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <span class="text-sm text-gray-600">完成数</span>
            </div>
            <div class="flex items-center">
              <div class="w-3 h-3 bg-gray-300 rounded-full mr-2"></div>
              <span class="text-sm text-gray-600">创建数</span>
            </div>
          </div>
          <div class="h-48 flex items-end justify-between space-x-4">
            <div
              v-for="data in statisticsStore.workOrderTrend"
              :key="data.month"
              class="flex-1 flex flex-col items-center"
            >
              <div class="w-full flex items-end justify-center flex-1 space-y-1">
                <div
                  class="w-6 bg-blue-500 rounded-t transition-all duration-300"
                  :style="{ height: (data.completed / maxWorkOrders) * 150 + 'px' }"
                ></div>
                <div
                  class="w-6 bg-gray-300 rounded-t transition-all duration-300 opacity-60"
                  :style="{ height: (data.created / maxWorkOrders) * 150 + 'px' }"
                ></div>
              </div>
              <span class="text-xs text-gray-600 mt-2">{{ data.month }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">故障类型分布</h3>
        <div class="space-y-3">
          <div v-for="(fault, index) in statisticsStore.faultDistribution" :key="fault.type" class="flex items-center">
            <span class="text-sm text-gray-600 w-24">{{ fault.type }}</span>
            <div class="flex-1 bg-gray-100 rounded-full h-6 mx-4 overflow-hidden">
              <div
                :class="faultTypeColors[index]"
                class="h-full rounded-full flex items-center justify-end pr-2 transition-all duration-500"
                :style="{ width: (fault.count / maxFaultCount) * 100 + '%' }"
              >
                <span class="text-xs font-medium text-white">{{ fault.count }}</span>
              </div>
            </div>
            <span class="text-sm font-medium text-gray-900 w-12 text-right">{{ fault.percentage }}%</span>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">故障设备Top5</h3>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-gray-200">
                <th class="text-left py-2 text-xs font-medium text-gray-600">设备名称</th>
                <th class="text-center py-2 text-xs font-medium text-gray-600">故障次数</th>
                <th class="text-right py-2 text-xs font-medium text-gray-600">MTBF(小时)</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(equipment, index) in statisticsStore.topFaultEquipment"
                :key="equipment.name"
                class="border-b border-gray-100 hover:bg-gray-50"
              >
                <td class="py-3">
                  <div class="flex items-center">
                    <span
                      class="w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium mr-2"
                      :class="{
                        'bg-red-100 text-red-600': index === 0,
                        'bg-orange-100 text-orange-600': index === 1,
                        'bg-yellow-100 text-yellow-600': index === 2,
                        'bg-gray-100 text-gray-600': index > 2
                      }"
                    >
                      {{ index + 1 }}
                    </span>
                    <span class="text-sm text-gray-900">{{ equipment.name }}</span>
                  </div>
                </td>
                <td class="py-3 text-center">
                  <span class="text-sm font-medium text-red-600">{{ equipment.count }}</span>
                </td>
                <td class="py-3 text-right">
                  <span class="text-sm text-gray-900">{{ equipment.mtbf }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">部门工作量对比</h3>
        <div class="space-y-4">
          <div v-for="dept in statisticsStore.departmentWorkload" :key="dept.department" class="space-y-2">
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-600">{{ dept.department }}</span>
              <span class="font-medium text-gray-900">{{ dept.completed }}/{{ dept.orders }}</span>
            </div>
            <div class="flex items-center space-x-2">
              <div class="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                <div
                  class="bg-blue-500 h-full rounded-full transition-all duration-500"
                  :style="{ width: (dept.orders / maxDepartmentOrders) * 100 + '%' }"
                ></div>
              </div>
              <span class="text-xs text-gray-500 w-12">
                {{ Math.round((dept.completed / dept.orders) * 100) }}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">维修效率指标</h3>
        <div class="space-y-4">
          <div class="p-4 bg-blue-50 rounded-lg">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-blue-900">平均响应时间</span>
              <span class="text-lg font-bold text-blue-600">{{ statisticsStore.repairEfficiency.avgResponseTime }}分钟</span>
            </div>
            <div class="text-xs text-blue-600">
              <span class="inline-block w-2 h-2 bg-blue-400 rounded-full mr-1"></span>
              目标: 30分钟以内
            </div>
          </div>

          <div class="p-4 bg-green-50 rounded-lg">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-green-900">平均维修时间</span>
              <span class="text-lg font-bold text-green-600">{{ statisticsStore.repairEfficiency.avgRepairTime }}分钟</span>
            </div>
            <div class="text-xs text-green-600">
              <span class="inline-block w-2 h-2 bg-green-400 rounded-full mr-1"></span>
              目标: 120分钟以内
            </div>
          </div>

          <div class="p-4 bg-purple-50 rounded-lg">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-purple-900">平均停机时间</span>
              <span class="text-lg font-bold text-purple-600">{{ statisticsStore.repairEfficiency.avgDowntime }}分钟</span>
            </div>
            <div class="text-xs text-purple-600">
              <span class="inline-block w-2 h-2 bg-purple-400 rounded-full mr-1"></span>
              目标: 200分钟以内
            </div>
          </div>

          <div class="p-4 bg-yellow-50 rounded-lg">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-yellow-900">一次修复率</span>
              <span class="text-lg font-bold text-yellow-600">{{ statisticsStore.repairEfficiency.firstTimeFix }}%</span>
            </div>
            <div class="w-full bg-yellow-200 rounded-full h-2 mt-2">
              <div
                class="bg-yellow-500 h-full rounded-full transition-all duration-500"
                :style="{ width: statisticsStore.repairEfficiency.firstTimeFix + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>