import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { GraphNode, GraphEdge } from '@/types'
import { mockGraphData } from '@/api/mock/graph'

export const useGraphStore = defineStore('graph', () => {
  const nodes = ref<GraphNode[]>([])
  const edges = ref<GraphEdge[]>([])
  const selectedNode = ref<GraphNode | null>(null)
  const loading = ref(false)
  const filters = ref({
    nodeTypes: [] as string[],
    keyword: ''
  })

  const nodeTypeColors: Record<string, { bg: string; border: string; icon: string }> = {
    equipment: { bg: 'bg-blue-100', border: 'border-blue-500', icon: '🔧' },
    component: { bg: 'bg-cyan-100', border: 'border-cyan-500', icon: '⚙️' },
    fault: { bg: 'bg-red-100', border: 'border-red-500', icon: '⚠️' },
    cause: { bg: 'bg-orange-100', border: 'border-orange-500', icon: '❓' },
    solution: { bg: 'bg-green-100', border: 'border-green-500', icon: '💡' },
    sparepart: { bg: 'bg-purple-100', border: 'border-purple-500', icon: '📦' },
    tool: { bg: 'bg-gray-100', border: 'border-gray-500', icon: '🔧' },
    sop: { bg: 'bg-teal-100', border: 'border-teal-500', icon: '📋' }
  }

  const nodeTypeLabels: Record<string, string> = {
    equipment: '设备',
    component: '部件',
    fault: '故障',
    cause: '原因',
    solution: '解决方案',
    sparepart: '备件',
    tool: '工具',
    sop: 'SOP'
  }

  const edgeTypeLabels: Record<string, string> = {
    contains: '包含',
    occurs: '发生',
    causes: '导致',
    solves: '解决',
    needs_sparepart: '需要备件',
    uses_tool: '使用工具',
    follows: '遵循',
    references: '参考',
    precedes: '前序',
    similar: '相似'
  }

  async function fetchGraph() {
    loading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      const data = mockGraphData
      nodes.value = data.nodes
      edges.value = data.edges
    } finally {
      loading.value = false
    }
  }

  function selectNode(node: GraphNode | null) {
    selectedNode.value = node
  }

  function getNodeById(id: string): GraphNode | undefined {
    return nodes.value.find(n => n.id === id)
  }

  function getNeighbors(nodeId: string, depth: number = 1): GraphNode[] {
    const neighborIds = new Set<string>()
    const findNeighbors = (id: string, currentDepth: number) => {
      if (currentDepth > depth) return
      edges.value.forEach(edge => {
        if (edge.source === id && !neighborIds.has(edge.target)) {
          neighborIds.add(edge.target)
          findNeighbors(edge.target, currentDepth + 1)
        }
        if (edge.target === id && !neighborIds.has(edge.source)) {
          neighborIds.add(edge.source)
          findNeighbors(edge.source, currentDepth + 1)
        }
      })
    }
    findNeighbors(nodeId, 1)
    return nodes.value.filter(n => neighborIds.has(n.id))
  }

  function getEdgesForNode(nodeId: string): GraphEdge[] {
    return edges.value.filter(e => e.source === nodeId || e.target === nodeId)
  }

  return {
    nodes,
    edges,
    selectedNode,
    loading,
    filters,
    nodeTypeColors,
    nodeTypeLabels,
    edgeTypeLabels,
    fetchGraph,
    selectNode,
    getNodeById,
    getNeighbors,
    getEdgesForNode
  }
})
