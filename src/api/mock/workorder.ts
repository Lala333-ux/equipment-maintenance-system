import type { WorkOrder, Fault } from '@/types'
import { mockUsers } from './user'
import { mockEquipmentList } from './equipment'

const createFault = (
  id: string,
  phenomenon: string,
  category: string[],
  severity: 'P1' | 'P2' | 'P3' | 'P4'
): Fault => ({
  id,
  phenomenon,
  phenomenonCategory: category,
  severity,
  mediaFiles: [],
  diagnosis: undefined,
  createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
})

export const mockWorkOrderList: WorkOrder[] = [
  {
    id: 'WO001',
    code: 'WO-2024-0501',
    type: 'fault_repair',
    status: 'processing',
    priority: 'P1',
    equipment: mockEquipmentList[0],
    fault: createFault('F001', '主轴运行时振动明显，伴有异常噪音', ['异响', '机械异响', '主轴异响'], 'P1'),
    assignee: mockUsers[0],
    reporter: mockUsers[0],
    estimatedDuration: 180,
    actualDuration: undefined,
    steps: [
      { id: 'S001', title: '初步检查', description: '检查主轴振动情况', status: 'completed', completedAt: new Date().toISOString() },
      { id: 'S002', title: '拆卸主轴', description: '小心拆卸主轴组件', status: 'in_progress', notes: '正在拆卸' },
      { id: 'S003', title: '检查轴承', description: '检查轴承磨损情况', status: 'pending' },
      { id: 'S004', title: '更换轴承', description: '更换损坏的轴承', status: 'pending' },
      { id: 'S005', title: '装配调试', description: '重新装配并调试', status: 'pending' },
      { id: 'S006', title: '运行测试', description: '空载和负载测试', status: 'pending' }
    ],
    spareParts: [
      { sparePartId: 'SP001', name: '主轴轴承 7220AC', quantity: 2 }
    ],
    discussion: [
      {
        id: 'D001',
        user: mockUsers[0],
        content: '主轴振动值超标，需要停机检查',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'D002',
        user: mockUsers[1],
        content: '先检查轴承，可能需要更换',
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
      }
    ],
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'WO002',
    code: 'WO-2024-0502',
    type: 'fault_repair',
    status: 'pending_dispatch',
    priority: 'P2',
    equipment: mockEquipmentList[1],
    fault: createFault('F002', '数控系统启动后显示轴报警，无法复位', ['报警', '系统报警', '轴报警'], 'P2'),
    assignee: undefined,
    reporter: mockUsers[0],
    estimatedDuration: 120,
    steps: [],
    spareParts: [],
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'WO003',
    code: 'WO-2024-0428',
    type: 'planned_maintenance',
    status: 'completed',
    priority: 'P3',
    equipment: mockEquipmentList[2],
    fault: createFault('F003', '定期保养-季度保养', ['保养', '定期保养'], 'P3'),
    assignee: mockUsers[1],
    reporter: mockUsers[2],
    estimatedDuration: 240,
    actualDuration: 220,
    steps: [
      { id: 'S001', title: '润滑系统检查', description: '检查各轴润滑情况', status: 'completed', completedAt: new Date().toISOString() },
      { id: 'S002', title: '精度校准', description: '使用激光干涉仪校准', status: 'completed', completedAt: new Date().toISOString() },
      { id: 'S003', title: '电气检查', description: '检查各接线端子', status: 'completed', completedAt: new Date().toISOString() }
    ],
    spareParts: [],
    rating: { quality: 5, speed: 4, attitude: 5 },
    completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'WO004',
    code: 'WO-2024-0503',
    type: 'fault_repair',
    status: 'pending_acceptance',
    priority: 'P1',
    equipment: mockEquipmentList[4],
    fault: createFault('F004', '加工精度超差，工件尺寸不稳定', ['精度', '尺寸超差'], 'P2'),
    assignee: mockUsers[0],
    reporter: mockUsers[0],
    estimatedDuration: 150,
    actualDuration: 180,
    steps: [
      { id: 'S001', title: '精度检测', description: '使用三坐标测量', status: 'completed', completedAt: new Date().toISOString() },
      { id: 'S002', title: '反向间隙测量', description: '测量各轴反向间隙', status: 'completed', completedAt: new Date().toISOString() },
      { id: 'S003', title: '参数调整', description: '输入补偿值', status: 'completed', completedAt: new Date().toISOString() }
    ],
    spareParts: [],
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'WO005',
    code: 'WO-2024-0504',
    type: 'emergency',
    status: 'dispatched',
    priority: 'P1',
    equipment: mockEquipmentList[3],
    fault: createFault('F005', '注塑机突然停机，显示屏黑屏', ['停机', '显示屏黑屏'], 'P1'),
    assignee: mockUsers[1],
    reporter: mockUsers[0],
    estimatedDuration: 60,
    steps: [
      { id: 'S001', title: '故障诊断', description: '检查电源和控制系统', status: 'in_progress' }
    ],
    spareParts: [],
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
  },
  {
    id: 'WO006',
    code: 'WO-2024-0425',
    type: 'inspection',
    status: 'completed',
    priority: 'P4',
    equipment: mockEquipmentList[6],
    fault: createFault('F006', '激光切割机日常巡检', ['巡检', '日常巡检'], 'P4'),
    assignee: mockUsers[0],
    reporter: mockUsers[2],
    estimatedDuration: 30,
    actualDuration: 25,
    steps: [
      { id: 'S001', title: '光学系统检查', description: '检查镜片状态', status: 'completed', completedAt: new Date().toISOString() },
      { id: 'S002', title: '气体系统检查', description: '检查辅助气体', status: 'completed', completedAt: new Date().toISOString() }
    ],
    spareParts: [],
    rating: { quality: 5, speed: 5, attitude: 5 },
    completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'WO007',
    code: 'WO-2024-0505',
    type: 'planned_maintenance',
    status: 'accepted',
    priority: 'P3',
    equipment: mockEquipmentList[5],
    fault: createFault('F007', '焊接机器人预防性保养', ['保养', '预防性保养'], 'P3'),
    assignee: mockUsers[1],
    reporter: mockUsers[2],
    estimatedDuration: 180,
    steps: [
      { id: 'S001', title: '机械检查', description: '检查各关节状态', status: 'pending' },
      { id: 'S002', title: '示教器校准', description: '校准坐标系', status: 'pending' }
    ],
    spareParts: [
      { sparePartId: 'SP010', name: '焊枪喷嘴', quantity: 5 },
      { sparePartId: 'SP011', name: '送丝轮', quantity: 2 }
    ],
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'WO008',
    code: 'WO-2024-0506',
    type: 'fault_repair',
    status: 'processing',
    priority: 'P2',
    equipment: mockEquipmentList[7],
    fault: createFault('F008', '液压系统压力不稳定，动作迟缓', ['液压', '压力异常'], 'P2'),
    assignee: mockUsers[0],
    reporter: mockUsers[0],
    estimatedDuration: 200,
    steps: [
      { id: 'S001', title: '液压系统检查', description: '检查泵和阀门', status: 'in_progress', notes: '发现溢流阀有问题' }
    ],
    spareParts: [
      { sparePartId: 'SP020', name: '溢流阀', quantity: 1 }
    ],
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
  }
]
