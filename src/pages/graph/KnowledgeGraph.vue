<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick, onBeforeUnmount } from 'vue'
import { useGraphStore } from '@/stores/graph'
import type { GraphEdge } from '@/types'

const graphStore = useGraphStore()

const canvasRef = ref<HTMLDivElement>()
const svgRef = ref<SVGSVGElement>()

const zoom = ref(1)
const panX = ref(0)
const panY = ref(0)

const selectedNodeId = ref<string | null>(null)
const draggedNode = ref<string | null>(null)
const dragOffset = ref({ x: 0, y: 0 })

const searchQuery = ref('')
const showFilters = ref(true)
const showDetail = ref(false)

const nodeTypeList = [
  { key: 'equipment', label: '设备' },
  { key: 'component', label: '部件' },
  { key: 'fault', label: '故障' },
  { key: 'cause', label: '原因' },
  { key: 'solution', label: '解决方案' },
  { key: 'sparepart', label: '备件' },
  { key: 'tool', label: '工具' },
  { key: 'sop', label: 'SOP' }
]

const activeFilters = ref<Set<string>>(new Set(nodeTypeList.map(t => t.key)))

const nodePositions = ref<Map<string, { x: number; y: number; vx: number; vy: number }>>(new Map())

const filteredNodes = computed(() => {
  let nodes = graphStore.nodes.filter(n => activeFilters.value.has(n.type))
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    nodes = nodes.filter(n => n.label.toLowerCase().includes(query))
  }
  
  return nodes
})

const filteredEdges = computed(() => {
  const nodeIds = new Set(filteredNodes.value.map(n => n.id))
  return graphStore.edges.filter(e => nodeIds.has(e.source) && nodeIds.has(e.target))
})

const selectedNode = computed(() => {
  if (!selectedNodeId.value) return null
  return graphStore.getNodeById(selectedNodeId.value)
})

const nodeConnectionCounts = computed(() => {
  const counts = new Map<string, number>()
  graphStore.edges.forEach(edge => {
    counts.set(edge.source, (counts.get(edge.source) || 0) + 1)
    counts.set(edge.target, (counts.get(edge.target) || 0) + 1)
  })
  return counts
})

const getNodeSize = (nodeId: string) => {
  const count = nodeConnectionCounts.value.get(nodeId) || 0
  return Math.min(Math.max(30 + count * 5, 30), 60)
}

const getNodeColor = (type: string) => {
  const colors: Record<string, { bg: string; border: string }> = {
    equipment: { bg: '#DBEAFE', border: '#3B82F6' },
    component: { bg: '#CFFAFE', border: '#06B6D4' },
    fault: { bg: '#FEE2E2', border: '#EF4444' },
    cause: { bg: '#FFEDD5', border: '#F97316' },
    solution: { bg: '#DCFCE7', border: '#22C55E' },
    sparepart: { bg: '#F3E8FF', border: '#A855F7' },
    tool: { bg: '#F3F4F6', border: '#6B7280' },
    sop: { bg: '#CCFBF1', border: '#14B8A6' }
  }
  return colors[type] || { bg: '#F3F4F6', border: '#9CA3AF' }
}

const getEdgeColor = (type: string) => {
  const colors: Record<string, string> = {
    contains: '#3B82F6',
    occurs: '#EF4444',
    causes: '#F97316',
    solves: '#22C55E',
    needs_sparepart: '#A855F7',
    uses_tool: '#6B7280',
    follows: '#14B8A6',
    references: '#8B5CF6',
    precedes: '#EC4899',
    similar: '#06B6D4'
  }
  return colors[type] || '#9CA3AF'
}

const getNodePosition = (nodeId: string) => {
  if (!nodePositions.value.has(nodeId)) {
    const canvas = canvasRef.value
    const width = canvas?.clientWidth || 800
    const height = canvas?.clientHeight || 600
    nodePositions.value.set(nodeId, {
      x: Math.random() * (width - 200) + 100,
      y: Math.random() * (height - 200) + 100,
      vx: 0,
      vy: 0
    })
  }
  return nodePositions.value.get(nodeId)!
}

const initializePositions = () => {
  const canvas = canvasRef.value
  if (!canvas) return
  
  const centerX = canvas.clientWidth / 2 || 400
  const centerY = canvas.clientHeight / 2 || 300
  const radius = Math.min(canvas.clientWidth, canvas.clientHeight) / 3 || 200
  
  filteredNodes.value.forEach((node, index) => {
    if (!nodePositions.value.has(node.id)) {
      const angle = (2 * Math.PI * index) / Math.max(filteredNodes.value.length, 1)
      nodePositions.value.set(node.id, {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
        vx: 0,
        vy: 0
      })
    }
  })
}

let animationFrame: number | null = null

const simulateForces = () => {
  const nodes = filteredNodes.value
  const edges = filteredEdges.value
  const positions = nodePositions.value
  
  if (nodes.length === 0 || !canvasRef.value) return
  
  const canvas = canvasRef.value
  const width = canvas.clientWidth
  const height = canvas.clientHeight
  const centerX = width / 2
  const centerY = height / 2
  
  const repulsionStrength = 5000
  const attractionStrength = 0.01
  const centeringStrength = 0.01
  const damping = 0.9
  
  nodes.forEach(node1 => {
    const pos1 = positions.get(node1.id)!
    let fx = 0, fy = 0
    
    nodes.forEach(node2 => {
      if (node1.id === node2.id) return
      const pos2 = positions.get(node2.id)!
      const dx = pos1.x - pos2.x
      const dy = pos1.y - pos2.y
      const dist = Math.sqrt(dx * dx + dy * dy) || 1
      const force = repulsionStrength / (dist * dist)
      fx += (dx / dist) * force
      fy += (dy / dist) * force
    })
    
    edges.forEach(edge => {
      if (edge.source === node1.id || edge.target === node1.id) {
        const otherId = edge.source === node1.id ? edge.target : edge.source
        const otherNode = positions.get(otherId)
        if (otherNode) {
          const dx = otherNode.x - pos1.x
          const dy = otherNode.y - pos1.y
          fx += dx * attractionStrength
          fy += dy * attractionStrength
        }
      }
    })
    
    fx += (centerX - pos1.x) * centeringStrength
    fy += (centerY - pos1.y) * centeringStrength
    
    pos1.vx = (pos1.vx + fx) * damping
    pos1.vy = (pos1.vy + fy) * damping
    pos1.x += pos1.vx
    pos1.y += pos1.vy
    
    pos1.x = Math.max(50, Math.min(width - 50, pos1.x))
    pos1.y = Math.max(50, Math.min(height - 50, pos1.y))
  })
}

const runSimulation = () => {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
  }
  
  let iterations = 0
  const maxIterations = 200
  
  const step = () => {
    simulateForces()
    iterations++
    
    if (iterations < maxIterations) {
      animationFrame = requestAnimationFrame(step)
    }
  }
  
  step()
}

const toggleFilter = (type: string) => {
  if (activeFilters.value.has(type)) {
    activeFilters.value.delete(type)
  } else {
    activeFilters.value.add(type)
  }
  activeFilters.value = new Set(activeFilters.value)
}

const zoomIn = () => {
  zoom.value = Math.min(zoom.value + 0.2, 3)
}

const zoomOut = () => {
  zoom.value = Math.max(zoom.value - 0.2, 0.3)
}

const fitView = () => {
  zoom.value = 1
  panX.value = 0
  panY.value = 0
}

const handleWheel = (e: WheelEvent) => {
  e.preventDefault()
  const delta = e.deltaY > 0 ? -0.1 : 0.1
  zoom.value = Math.max(0.3, Math.min(3, zoom.value + delta))
}

const handleMouseDown = (e: MouseEvent, nodeId: string) => {
  if (e.button !== 0) return
  e.stopPropagation()
  draggedNode.value = nodeId
  const pos = getNodePosition(nodeId)
  dragOffset.value = {
    x: e.offsetX - pos.x,
    y: e.offsetY - pos.y
  }
  selectedNodeId.value = nodeId
  showDetail.value = true
}

const isPanning = ref(false)
const panStart = ref({ x: 0, y: 0 })

const handleMouseDownOnCanvas = (e: MouseEvent) => {
  if (e.button !== 0) return
  const target = e.target as HTMLElement
  if (target.tagName === 'svg' || target.tagName === 'g') {
    isPanning.value = true
    panStart.value = { x: e.clientX - panX.value, y: e.clientY - panY.value }
  }
}

const handleMouseMove = (e: MouseEvent) => {
  if (draggedNode.value) {
    const rect = canvasRef.value?.getBoundingClientRect()
    if (!rect) return
    const pos = nodePositions.value.get(draggedNode.value)
    if (pos) {
      pos.x = (e.clientX - rect.left) / zoom.value - panX.value / zoom.value
      pos.y = (e.clientY - rect.top) / zoom.value - panY.value / zoom.value
      pos.vx = 0
      pos.vy = 0
    }
  } else if (isPanning.value) {
    panX.value = e.clientX - panStart.value.x
    panY.value = e.clientY - panStart.value.y
  }
}

const handleMouseUp = () => {
  draggedNode.value = null
  isPanning.value = false
}

const handleCanvasClick = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  if (target.tagName === 'svg' || target.tagName === 'g') {
    selectedNodeId.value = null
    showDetail.value = false
  }
}

const exportGraph = () => {
  const svg = svgRef.value
  if (!svg) return
  
  const svgData = new XMLSerializer().serializeToString(svg)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const img = new Image()
  
  canvas.width = canvasRef.value?.clientWidth || 800
  canvas.height = canvasRef.value?.clientHeight || 600
  
  img.onload = () => {
    ctx?.drawImage(img, 0, 0)
    const link = document.createElement('a')
    link.download = '知识图谱.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }
  
  img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
}

const getNodeEdges = (nodeId: string) => {
  return graphStore.getEdgesForNode(nodeId)
}

const getConnectedNode = (edge: GraphEdge, nodeId: string) => {
  const otherId = edge.source === nodeId ? edge.target : edge.source
  return graphStore.getNodeById(otherId)
}

onMounted(async () => {
  await graphStore.fetchGraph()
  await nextTick()
  initializePositions()
  runSimulation()
})

watch([activeFilters], () => {
  initializePositions()
  runSimulation()
}, { deep: true })

watch(() => graphStore.nodes, () => {
  initializePositions()
  runSimulation()
}, { deep: true })

onBeforeUnmount(() => {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
  }
})
</script>

<template>
  <div class="h-full flex flex-col bg-gray-50">
    <!-- 顶部工具栏 -->
    <div class="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <h1 class="text-xl font-bold text-gray-800">知识图谱</h1>
        <span class="text-sm text-gray-500">
          {{ filteredNodes.length }} 个节点，{{ filteredEdges.length }} 条关系
        </span>
      </div>
      
      <div class="flex items-center gap-3">
        <!-- 搜索框 -->
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索节点..."
            class="w-64 pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        <!-- 缩放控制 -->
        <div class="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          <button
            @click="zoomOut"
            class="p-2 hover:bg-white rounded transition-colors"
            title="缩小"
          >
            <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
            </svg>
          </button>
          <span class="px-2 text-sm text-gray-600 min-w-[50px] text-center">
            {{ Math.round(zoom * 100) }}%
          </span>
          <button
            @click="zoomIn"
            class="p-2 hover:bg-white rounded transition-colors"
            title="放大"
          >
            <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
          </button>
          <button
            @click="fitView"
            class="p-2 hover:bg-white rounded transition-colors"
            title="适应视图"
          >
            <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </button>
        </div>
        
        <!-- 导出 -->
        <button
          @click="exportGraph"
          class="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          导出
        </button>
        
        <!-- 筛选切换 -->
        <button
          @click="showFilters = !showFilters"
          class="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          :class="{ 'bg-primary-50 border-primary-200': showFilters }"
        >
          <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
        </button>
      </div>
    </div>
    
    <!-- 主内容区域 -->
    <div class="flex-1 flex overflow-hidden">
      <!-- 左侧筛选面板 -->
      <div
        v-if="showFilters"
        class="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto"
      >
        <h3 class="text-sm font-semibold text-gray-800 mb-3">节点类型筛选</h3>
        <div class="space-y-2">
          <label
            v-for="type in nodeTypeList"
            :key="type.key"
            class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <input
              type="checkbox"
              :checked="activeFilters.has(type.key)"
              @change="toggleFilter(type.key)"
              class="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span
              class="w-3 h-3 rounded-full"
              :style="{ backgroundColor: getNodeColor(type.key).border }"
            ></span>
            <span class="text-sm text-gray-700">{{ type.label }}</span>
            <span class="ml-auto text-xs text-gray-400">
              {{ filteredNodes.filter(n => n.type === type.key).length }}
            </span>
          </label>
        </div>
        
        <div class="mt-6 pt-4 border-t border-gray-200">
          <h3 class="text-sm font-semibold text-gray-800 mb-3">图例</h3>
          <div class="space-y-2 text-xs">
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <span class="text-gray-600">实线：直接关系</span>
            </div>
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" stroke-dasharray="4 2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <span class="text-gray-600">虚线：弱关系</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 画布区域 -->
      <div
        ref="canvasRef"
        class="flex-1 relative overflow-hidden bg-gray-100"
        @wheel="handleWheel"
        @mousedown="handleMouseDownOnCanvas"
        @mousemove="handleMouseMove"
        @mouseup="handleMouseUp"
        @mouseleave="handleMouseUp"
        @click="handleCanvasClick"
      >
        <!-- SVG 图谱 -->
        <svg
          ref="svgRef"
          class="w-full h-full"
          :style="{
            transform: `scale(${zoom}) translate(${panX / zoom}px, ${panY / zoom}px)`,
            transformOrigin: '0 0'
          }"
        >
          <defs>
            <marker
              v-for="(color, type) in {
                causes: getEdgeColor('causes'),
                solves: getEdgeColor('solves'),
                occurs: getEdgeColor('occurs')
              }"
              :key="type"
              :id="`arrow-${type}`"
              markerWidth="10"
              markerHeight="10"
              refX="9"
              refY="3"
              orient="auto"
              markerUnits="strokeWidth"
            >
              <path d="M0,0 L0,6 L9,3 z" :fill="color" />
            </marker>
          </defs>
          
          <!-- 边 -->
          <g class="edges">
            <g
              v-for="edge in filteredEdges"
              :key="edge.id"
            >
              <line
                :x1="getNodePosition(edge.source).x"
                :y1="getNodePosition(edge.source).y"
                :x2="getNodePosition(edge.target).x"
                :y2="getNodePosition(edge.target).y"
                :stroke="getEdgeColor(edge.type)"
                :stroke-width="edge.weight && edge.weight > 0.7 ? 2 : 1"
                :stroke-dasharray="edge.weight && edge.weight < 0.7 ? '4 2' : 'none'"
                :marker-end="['causes', 'solves', 'occurs'].includes(edge.type) ? `url(#arrow-${edge.type})` : ''"
                opacity="0.6"
              />
            </g>
          </g>
          
          <!-- 节点 -->
          <g class="nodes">
            <g
              v-for="node in filteredNodes"
              :key="node.id"
              class="cursor-pointer"
              :transform="`translate(${getNodePosition(node.id).x}, ${getNodePosition(node.id).y})`"
              @mousedown="(e) => handleMouseDown(e, node.id)"
            >
              <circle
                :r="getNodeSize(node.id) / 2"
                :fill="getNodeColor(node.type).bg"
                :stroke="getNodeColor(node.type).border"
                :stroke-width="selectedNodeId === node.id ? 3 : 2"
                class="transition-all duration-200"
                :class="{ 'drop-shadow-lg': selectedNodeId === node.id }"
              />
              <text
                :y="getNodeSize(node.id) / 2 + 16"
                text-anchor="middle"
                class="text-xs font-medium fill-gray-800 pointer-events-none select-none"
                style="user-select: none;"
              >
                {{ node.label.length > 12 ? node.label.substring(0, 12) + '...' : node.label }}
              </text>
            </g>
          </g>
        </svg>
        
        <!-- 小地图 -->
        <div class="absolute bottom-4 right-4 w-48 h-32 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          <div class="w-full h-full relative">
            <svg class="w-full h-full" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid meet">
              <rect
                v-for="node in filteredNodes"
                :key="node.id"
                :x="getNodePosition(node.id).x / 10"
                :y="getNodePosition(node.id).y / 10"
                :width="4"
                :height="4"
                :fill="getNodeColor(node.type).border"
                :rx="2"
              />
            </svg>
            <div
              class="absolute border-2 border-primary-500 bg-primary-50 bg-opacity-30 pointer-events-none"
              :style="{
                left: `${-panX / zoom / 10}px`,
                top: `${-panY / zoom / 10}px`,
                width: `${(canvasRef?.clientWidth || 800) / zoom / 10}px`,
                height: `${(canvasRef?.clientHeight || 600) / zoom / 10}px`
              }"
            ></div>
          </div>
        </div>
        
        <!-- 加载状态 -->
        <div
          v-if="graphStore.loading"
          class="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center"
        >
          <div class="flex flex-col items-center gap-3">
            <div class="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
            <span class="text-gray-600">加载图谱数据...</span>
          </div>
        </div>
      </div>
      
      <!-- 右侧详情面板 -->
      <div
        v-if="showDetail && selectedNode"
        class="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto"
      >
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-800">节点详情</h3>
          <button
            @click="showDetail = false"
            class="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="space-y-4">
          <!-- 节点信息 -->
          <div class="p-4 bg-gray-50 rounded-lg">
            <div class="flex items-center gap-3 mb-3">
              <span
                class="w-10 h-10 rounded-full flex items-center justify-center"
                :style="{ backgroundColor: getNodeColor(selectedNode.type).bg }"
              >
                <span
                  class="w-6 h-6 rounded-full"
                  :style="{ backgroundColor: getNodeColor(selectedNode.type).border }"
                ></span>
              </span>
              <div>
                <h4 class="font-semibold text-gray-800">{{ selectedNode.label }}</h4>
                <span class="text-xs text-gray-500">
                  {{ graphStore.nodeTypeLabels[selectedNode.type] || selectedNode.type }}
                </span>
              </div>
            </div>
            
            <div v-if="Object.keys(selectedNode.properties).length > 0" class="mt-3 pt-3 border-t border-gray-200">
              <div
                v-for="(value, key) in selectedNode.properties"
                :key="key"
                class="flex justify-between text-sm mb-1"
              >
                <span class="text-gray-500">{{ key }}</span>
                <span class="text-gray-800 font-medium">{{ value }}</span>
              </div>
            </div>
          </div>
          
          <!-- 关联边 -->
          <div>
            <h4 class="text-sm font-semibold text-gray-800 mb-2">关联关系</h4>
            <div class="space-y-2">
              <div
                v-for="edge in getNodeEdges(selectedNode.id)"
                :key="edge.id"
                class="p-3 bg-gray-50 rounded-lg border border-gray-100"
              >
                <div class="flex items-center gap-2 mb-1">
                  <span
                    class="px-2 py-0.5 text-xs rounded"
                    :style="{
                      backgroundColor: getEdgeColor(edge.type) + '20',
                      color: getEdgeColor(edge.type)
                    }"
                  >
                    {{ graphStore.edgeTypeLabels[edge.type] || edge.type }}
                  </span>
                </div>
                <div class="flex items-center gap-2">
                  <span v-if="edge.source === selectedNode.id" class="text-xs text-gray-500">→</span>
                  <span class="text-sm font-medium text-gray-800">
                    {{ getConnectedNode(edge, selectedNode.id)?.label }}
                  </span>
                </div>
                <div v-if="edge.weight" class="mt-1 text-xs text-gray-400">
                  权重: {{ (edge.weight * 100).toFixed(0) }}%
                </div>
              </div>
              
              <div v-if="getNodeEdges(selectedNode.id).length === 0" class="text-sm text-gray-400 text-center py-4">
                暂无关联关系
              </div>
            </div>
          </div>
          
          <!-- 操作按钮 -->
          <div class="pt-4 border-t border-gray-200">
            <button
              class="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              查看完整详情
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
circle {
  cursor: pointer;
  transition: all 0.2s;
}

circle:hover {
  filter: brightness(0.95);
}

.drop-shadow-lg {
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
}
</style>
