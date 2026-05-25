import type { KnowledgeGraph } from '@/types'

export const mockGraphData: KnowledgeGraph = {
  nodes: [
    { id: 'E001', type: 'equipment', label: 'CNC加工中心 #01', properties: { status: 'normal', department: '生产车间A' } },
    { id: 'E002', type: 'equipment', label: 'CNC数控车床 #03', properties: { status: 'warning', department: '生产车间A' } },
    { id: 'E003', type: 'equipment', label: '注塑机 #01', properties: { status: 'normal', department: '注塑车间' } },
    { id: 'C001', type: 'component', label: '主轴组件', properties: {} },
    { id: 'C002', type: 'component', label: '液压系统', properties: {} },
    { id: 'C003', type: 'component', label: '数控系统', properties: {} },
    { id: 'F001', type: 'fault', label: '主轴振动异常', properties: { severity: 'P1' } },
    { id: 'F002', type: 'fault', label: '轴报警无法复位', properties: { severity: 'P2' } },
    { id: 'F003', type: 'fault', label: '液压压力不稳', properties: { severity: 'P2' } },
    { id: 'F004', type: 'fault', label: '加工精度超差', properties: { severity: 'P2' } },
    { id: 'CA001', type: 'cause', label: '轴承磨损', properties: {} },
    { id: 'CA002', type: 'cause', label: '润滑不足', properties: {} },
    { id: 'CA003', type: 'cause', label: '参数设置错误', properties: {} },
    { id: 'CA004', type: 'cause', label: '反向间隙过大', properties: {} },
    { id: 'S001', type: 'solution', label: '更换主轴轴承', properties: {} },
    { id: 'S002', type: 'solution', label: '调整润滑系统', properties: {} },
    { id: 'S003', type: 'solution', label: '重设轴参数', properties: {} },
    { id: 'S004', type: 'solution', label: '进行螺距补偿', properties: {} },
    { id: 'SP001', type: 'sparepart', label: '主轴轴承 7220AC', properties: { stock: 4 } },
    { id: 'SP002', type: 'sparepart', label: '液压油 L-HM 46#', properties: { stock: 5 } },
    { id: 'T001', type: 'tool', label: '轴承拉马', properties: {} },
    { id: 'T002', type: 'tool', label: '激光干涉仪', properties: {} },
    { id: 'T003', type: 'tool', label: '振动分析仪', properties: {} },
    { id: 'SOP001', type: 'sop', label: '主轴轴承更换SOP', properties: {} },
    { id: 'SOP002', type: 'sop', label: '精度校准SOP', properties: {} }
  ],
  edges: [
    { id: 'R001', source: 'E001', target: 'C001', type: 'contains', weight: 1 },
    { id: 'R002', source: 'E002', target: 'C003', type: 'contains', weight: 1 },
    { id: 'R003', source: 'C001', target: 'F001', type: 'occurs', weight: 0.8 },
    { id: 'R004', source: 'C003', target: 'F002', type: 'occurs', weight: 0.6 },
    { id: 'R005', source: 'C002', target: 'F003', type: 'occurs', weight: 0.7 },
    { id: 'R006', source: 'E001', target: 'F004', type: 'occurs', weight: 0.5 },
    { id: 'R007', source: 'CA001', target: 'F001', type: 'causes', weight: 0.9 },
    { id: 'R008', source: 'CA002', target: 'F001', type: 'causes', weight: 0.7 },
    { id: 'R009', source: 'CA003', target: 'F002', type: 'causes', weight: 0.8 },
    { id: 'R010', source: 'CA004', target: 'F004', type: 'causes', weight: 0.85 },
    { id: 'R011', source: 'S001', target: 'F001', type: 'solves', weight: 0.95 },
    { id: 'R012', source: 'S002', target: 'F001', type: 'solves', weight: 0.7 },
    { id: 'R013', source: 'S003', target: 'F002', type: 'solves', weight: 0.85 },
    { id: 'R014', source: 'S004', target: 'F004', type: 'solves', weight: 0.9 },
    { id: 'R015', source: 'S001', target: 'SP001', type: 'needs_sparepart', weight: 1 },
    { id: 'R016', source: 'S002', target: 'SP002', type: 'needs_sparepart', weight: 1 },
    { id: 'R017', source: 'S001', target: 'T001', type: 'uses_tool', weight: 1 },
    { id: 'R018', source: 'S004', target: 'T002', type: 'uses_tool', weight: 1 },
    { id: 'R019', source: 'S001', target: 'SOP001', type: 'follows', weight: 1 },
    { id: 'R020', source: 'S004', target: 'SOP002', type: 'follows', weight: 1 },
    { id: 'R021', source: 'CA001', target: 'CA002', type: 'precedes', weight: 0.8 },
    { id: 'R022', source: 'F001', target: 'F004', type: 'similar', weight: 0.6 }
  ]
}

export const mockSOPList = [
  {
    id: 'SOP001',
    code: 'SOP-MAINT-CNC-001',
    name: 'CNC加工中心日常保养标准作业',
    equipmentScope: ['CNC加工中心'],
    jobType: 'daily_maintenance',
    version: 'V2.1',
    effectiveDate: '2024-01-01',
    totalEstimatedTime: 30,
    steps: [
      { order: 1, title: '开机前检查', description: '检查液压油、切削液、气源', estimatedTime: 5 },
      { order: 2, title: '清理切屑', description: '清理工作台和导轨', estimatedTime: 10 },
      { order: 3, title: '润滑检查', description: '检查各轴润滑状态', estimatedTime: 5 },
      { order: 4, title: '日常点检', description: '记录设备状态', estimatedTime: 10 }
    ],
    checklist: [
      { id: 'C1', item: '液压油油位', method: '目视', standard: '在油位计1/2以上' },
      { id: 'C2', item: '切削液浓度', method: '测量', standard: '5%-8%' },
      { id: 'C3', item: '气源压力', method: '读数', standard: '0.5-0.7MPa' }
    ],
    resources: {
      tools: [],
      spareParts: [],
      personnel: [{ role: '维修工', count: 1, skills: ['设备操作'] }],
      ppe: ['工作服', '安全鞋']
    }
  },
  {
    id: 'SOP002',
    code: 'SOP-REPAIR-SPINDLE-001',
    name: '主轴轴承更换标准作业',
    equipmentScope: ['CNC加工中心', 'CNC数控车床'],
    jobType: 'fault_repair',
    version: 'V1.3',
    effectiveDate: '2023-10-15',
    totalEstimatedTime: 240,
    steps: [
      { order: 1, title: '准备工作', description: '停机断电，准备工具和备件', estimatedTime: 20, safetyNotes: '必须断电并挂警示牌' },
      { order: 2, title: '拆卸主轴', description: '按顺序拆卸主轴组件', estimatedTime: 60 },
      { order: 3, title: '清除旧轴承', description: '使用轴承拉马取出旧轴承', estimatedTime: 30, keyPoints: ['避免损伤轴颈'] },
      { order: 4, title: '安装新轴承', description: '加热后安装新轴承', estimatedTime: 40, keyPoints: ['轴承加热温度80-100℃'] },
      { order: 5, title: '装配调试', description: '重新装配并预紧', estimatedTime: 50 },
      { order: 6, title: '运行测试', description: '空载和负载测试', estimatedTime: 40 }
    ],
    checklist: [
      { id: 'C1', item: '轴承型号正确', method: '核对', standard: '与原规格一致' },
      { id: 'C2', item: '轴承间隙', method: '测量', standard: '符合技术要求' },
      { id: 'C3', item: '振动值', method: '测量', standard: '<2.8mm/s' }
    ],
    resources: {
      tools: [{ id: 'T001', name: '轴承拉马', specification: '大型' }, { id: 'T002', name: '轴承加热器', specification: 'BKG-200' }],
      spareParts: ['主轴轴承 7220AC'],
      personnel: [{ role: '维修技师', count: 2, skills: ['主轴维修'] }],
      ppe: ['工作服', '手套', '护目镜']
    }
  }
]
