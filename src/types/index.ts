export interface User {
  id: string
  name: string
  avatar?: string
  role: '维修工程师' | '设备管理员' | '技术专家' | '主管' | '管理员'
  department: string
  skills: string[]
  phone?: string
  email?: string
}

export interface Equipment {
  id: string
  code: string
  name: string
  type: string
  typePath: string[]
  status: 'normal' | 'warning' | 'fault' | 'maintenance' | 'stopped'
  department: string
  location: string
  criticality: 'A' | 'B' | 'C' | 'D'
  manufacturer: string
  model: string
  serialNumber: string
  installDate: string
  parameters: Record<string, any>
  imageUrl?: string
}

export interface Knowledge {
  id: string
  title: string
  summary: string
  content: string
  type: 'fault_solution' | 'maintenance_guide' | 'safety_procedure' | 'manual' | 'standard' | 'training'
  status: 'draft' | 'pending' | 'published' | 'archived'
  author: User
  tags: string[]
  equipmentTypes: string[]
  faultTypes: string[]
  rating: number
  viewCount: number
  likeCount: number
  createdAt: string
  updatedAt: string
  attachments: Attachment[]
}

export interface Attachment {
  id: string
  name: string
  type: string
  url: string
  size: number
}

export interface WorkOrder {
  id: string
  code: string
  type: 'fault_repair' | 'planned_maintenance' | 'inspection' | 'emergency' | 'modification'
  status: 'created' | 'pending_dispatch' | 'dispatched' | 'accepted' | 'processing' | 'pending_acceptance' | 'completed' | 'cancelled'
  priority: 'P1' | 'P2' | 'P3' | 'P4'
  equipment: Equipment
  fault: Fault
  assignee?: User
  reporter: User
  estimatedDuration: number
  actualDuration?: number
  steps: WorkOrderStep[]
  spareParts: SparePartUsage[]
  discussion?: Discussion[]
  rating?: { quality: number; speed: number; attitude: number }
  createdAt: string
  completedAt?: string
}

export interface WorkOrderStep {
  id: string
  title: string
  description: string
  status: 'pending' | 'in_progress' | 'completed' | 'skipped'
  completedAt?: string
  notes?: string
}

export interface SparePartUsage {
  sparePartId: string
  name: string
  quantity: number
  actualQuantity?: number
}

export interface Discussion {
  id: string
  user: User
  content: string
  images?: string[]
  createdAt: string
  mentions?: string[]
}

export interface Fault {
  id: string
  phenomenon: string
  phenomenonCategory: string[]
  severity: 'P1' | 'P2' | 'P3' | 'P4'
  mediaFiles: MediaFile[]
  locationMark?: { x: number; y: number }
  diagnosis?: FaultDiagnosis
  rootCause?: string
  relatedKnowledge?: Knowledge[]
  createdAt: string
}

export interface MediaFile {
  id: string
  type: 'image' | 'video' | 'audio'
  url: string
  thumbnail?: string
}

export interface FaultDiagnosis {
  process: DiagnosisStep[]
  fiveWhy?: string[]
  finalCause?: string
  causeCategory?: string
}

export interface DiagnosisStep {
  id: string
  checkItem: string
  result: 'normal' | 'abnormal' | 'pending'
  finding?: string
}

export interface SparePart {
  id: string
  code: string
  name: string
  category: 'A' | 'B' | 'C'
  unit: string
  stock: number
  safeStock: number
  maxStock: number
  price: number
  location: string
  applicableEquipment: string[]
  batches: StockBatch[]
  lastInDate?: string
  lastOutDate?: string
  status: 'normal' | 'low' | 'overstock' | 'stagnant' | 'expiring'
}

export interface StockBatch {
  id: string
  batchNumber: string
  quantity: number
  inDate: string
  expireDate?: string
}

export interface SOP {
  id: string
  code: string
  name: string
  equipmentScope: string[]
  jobType: 'daily_maintenance' | 'periodic_maintenance' | 'fault_repair' | 'safety_check' | 'calibration'
  version: string
  effectiveDate: string
  author: User
  approver?: User
  steps: SOPStep[]
  checklist: ChecklistItem[]
  resources: {
    tools: Tool[]
    spareParts: string[]
    personnel: { role: string; count: number; skills: string[] }[]
    ppe: string[]
  }
  totalEstimatedTime: number
}

export interface SOPStep {
  order: number
  title: string
  description: string
  keyPoints?: string[]
  safetyNotes?: string
  media?: MediaFile[]
  checkStandard?: string
  tools?: string[]
  estimatedTime: number
}

export interface ChecklistItem {
  id: string
  item: string
  method: string
  standard: string
  result?: 'pass' | 'fail' | 'na'
  notes?: string
}

export interface Tool {
  id: string
  name: string
  specification: string
  imageUrl?: string
}

export interface GraphNode {
  id: string
  type: 'equipment' | 'component' | 'fault' | 'cause' | 'solution' | 'sparepart' | 'tool' | 'sop'
  label: string
  properties: Record<string, any>
  x?: number
  y?: number
}

export interface GraphEdge {
  id: string
  source: string
  target: string
  type: 'contains' | 'occurs' | 'causes' | 'solves' | 'needs_sparepart' | 'uses_tool' | 'follows' | 'references' | 'precedes' | 'similar'
  weight?: number
}

export interface KnowledgeGraph {
  nodes: GraphNode[]
  edges: GraphEdge[]
}

export interface DashboardStats {
  equipmentOverview: {
    total: number
    normal: number
    warning: number
    fault: number
    maintenance: number
  }
  workOrderOverview: {
    total: number
    pending: number
    processing: number
    completed: number
  }
  knowledgeOverview: {
    total: number
    published: number
    thisMonth: number
  }
  sparePartAlerts: number
}

export interface PaginationParams {
  page: number
  pageSize: number
  total?: number
  totalPages?: number
}

export interface ApiResponse<T> {
  code: number
  message: string
  data: T
  pagination?: PaginationParams
}
