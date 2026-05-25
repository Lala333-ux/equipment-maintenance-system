import type { SparePart } from '@/types'

export const mockSparePartList: SparePart[] = [
  {
    id: 'SP001',
    code: 'BRG-7220AC',
    name: '主轴轴承 7220AC',
    category: 'A',
    unit: '套',
    stock: 4,
    safeStock: 2,
    maxStock: 10,
    price: 2800,
    location: 'A区-01-03',
    applicableEquipment: ['CNC加工中心 #01', 'CNC加工中心 #02'],
    batches: [
      { id: 'B001', batchNumber: 'BT20240315', quantity: 4, inDate: '2024-03-15' }
    ],
    lastInDate: '2024-03-15',
    lastOutDate: '2024-04-20',
    status: 'normal'
  },
  {
    id: 'SP002',
    code: 'BRG-7210AC',
    name: '主轴轴承 7210AC',
    category: 'A',
    unit: '套',
    stock: 8,
    safeStock: 4,
    maxStock: 15,
    price: 680,
    location: 'A区-01-04',
    applicableEquipment: ['CNC数控车床 #03', 'CNC数控铣床 #02'],
    batches: [
      { id: 'B002', batchNumber: 'BT20240210', quantity: 8, inDate: '2024-02-10' }
    ],
    lastInDate: '2024-02-10',
    lastOutDate: '2024-05-08',
    status: 'normal'
  },
  {
    id: 'SP003',
    code: 'V-BELT-C5',
    name: 'V带 C型',
    category: 'C',
    unit: '根',
    stock: 25,
    safeStock: 10,
    maxStock: 50,
    price: 85,
    location: 'B区-02-01',
    applicableEquipment: ['注塑机 #01', '液压机 #01'],
    batches: [
      { id: 'B003', batchNumber: 'BT20240120', quantity: 30, inDate: '2024-01-20' }
    ],
    lastInDate: '2024-01-20',
    lastOutDate: '2024-05-15',
    status: 'normal'
  },
  {
    id: 'SP004',
    code: 'OIL-HYD-46',
    name: '液压油 L-HM 46#',
    category: 'B',
    unit: '桶',
    stock: 5,
    safeStock: 8,
    maxStock: 20,
    price: 380,
    location: '油库-01',
    applicableEquipment: ['液压设备', '注塑机 #01', '液压机 #01'],
    batches: [
      { id: 'B004', batchNumber: 'BT20240301', quantity: 10, inDate: '2024-03-01', expireDate: '2026-03-01' }
    ],
    lastInDate: '2024-03-01',
    lastOutDate: '2024-04-28',
    status: 'low'
  },
  {
    id: 'SP005',
    code: 'BRUSH-AB360',
    name: '碳刷 AB360',
    category: 'B',
    unit: '个',
    stock: 20,
    safeStock: 10,
    maxStock: 40,
    price: 128,
    location: 'C区-01-05',
    applicableEquipment: ['焊接机器人 #01', '装配机器人'],
    batches: [
      { id: 'B005', batchNumber: 'BT20240228', quantity: 20, inDate: '2024-02-28' }
    ],
    lastInDate: '2024-02-28',
    lastOutDate: '2024-05-10',
    status: 'normal'
  },
  {
    id: 'SP006',
    code: 'SERVO-MOTOR',
    name: '伺服电机 βiS 20/3000',
    category: 'A',
    unit: '台',
    stock: 1,
    safeStock: 1,
    maxStock: 3,
    price: 15800,
    location: 'A区-01-01',
    applicableEquipment: ['CNC加工中心 #01', 'CNC加工中心 #02', '五轴加工中心'],
    batches: [
      { id: 'B006', batchNumber: 'BT20231015', quantity: 2, inDate: '2023-10-15' }
    ],
    lastInDate: '2023-10-15',
    lastOutDate: '2024-03-20',
    status: 'normal'
  },
  {
    id: 'SP007',
    code: 'ENCODER-ABS',
    name: '绝对值编码器',
    category: 'A',
    unit: '个',
    stock: 3,
    safeStock: 2,
    maxStock: 5,
    price: 8500,
    location: 'A区-01-02',
    applicableEquipment: ['CNC数控车床 #03', 'CNC数控铣床 #02'],
    batches: [
      { id: 'B007', batchNumber: 'BT20231101', quantity: 3, inDate: '2023-11-01' }
    ],
    lastInDate: '2023-11-01',
    status: 'normal'
  },
  {
    id: 'SP008',
    code: 'FILTER-OIL',
    name: '油过滤器',
    category: 'C',
    unit: '个',
    stock: 45,
    safeStock: 20,
    maxStock: 80,
    price: 65,
    location: 'B区-02-02',
    applicableEquipment: ['注塑机 #01', '液压机 #01'],
    batches: [
      { id: 'B008', batchNumber: 'BT20240115', quantity: 50, inDate: '2024-01-15' }
    ],
    lastInDate: '2024-01-15',
    lastOutDate: '2024-05-18',
    status: 'normal'
  },
  {
    id: 'SP009',
    code: 'LASER-LENS',
    name: '激光切割聚焦镜',
    category: 'A',
    unit: '个',
    stock: 6,
    safeStock: 4,
    maxStock: 12,
    price: 2200,
    location: 'D区-01-01',
    applicableEquipment: ['激光切割机 #01'],
    batches: [
      { id: 'B009', batchNumber: 'BT20240220', quantity: 6, inDate: '2024-02-20' }
    ],
    lastInDate: '2024-02-20',
    lastOutDate: '2024-05-12',
    status: 'normal'
  },
  {
    id: 'SP010',
    code: 'WELD-NOZZLE',
    name: '焊枪喷嘴',
    category: 'C',
    unit: '个',
    stock: 8,
    safeStock: 15,
    maxStock: 50,
    price: 45,
    location: 'E区-01-01',
    applicableEquipment: ['焊接机器人 #01'],
    batches: [
      { id: 'B010', batchNumber: 'BT20231201', quantity: 30, inDate: '2023-12-01' }
    ],
    lastInDate: '2023-12-01',
    lastOutDate: '2024-05-20',
    status: 'low'
  },
  {
    id: 'SP011',
    code: 'WIRE-FEEDER',
    name: '送丝轮',
    category: 'C',
    unit: '个',
    stock: 12,
    safeStock: 8,
    maxStock: 30,
    price: 98,
    location: 'E区-01-02',
    applicableEquipment: ['焊接机器人 #01'],
    batches: [
      { id: 'B011', batchNumber: 'BT20231215', quantity: 20, inDate: '2023-12-15' }
    ],
    lastInDate: '2023-12-15',
    lastOutDate: '2024-05-15',
    status: 'normal'
  },
  {
    id: 'SP012',
    code: 'OIL-SEAL-50',
    name: '骨架油封 50×72×12',
    category: 'C',
    unit: '个',
    stock: 60,
    safeStock: 30,
    maxStock: 100,
    price: 28,
    location: 'B区-02-03',
    applicableEquipment: ['CNC数控车床 #03', 'CNC加工中心 #01'],
    batches: [
      { id: 'B012', batchNumber: 'BT20240105', quantity: 80, inDate: '2024-01-05' }
    ],
    lastInDate: '2024-01-05',
    lastOutDate: '2024-05-08',
    status: 'normal'
  },
  {
    id: 'SP013',
    code: 'BALL-SCREW',
    name: '滚珠丝杠 φ40×1500',
    category: 'A',
    unit: '根',
    stock: 2,
    safeStock: 1,
    maxStock: 4,
    price: 12000,
    location: 'A区-02-01',
    applicableEquipment: ['CNC加工中心 #02', '五轴加工中心'],
    batches: [
      { id: 'B013', batchNumber: 'BT20230901', quantity: 3, inDate: '2023-09-01' }
    ],
    lastInDate: '2023-09-01',
    lastOutDate: '2024-02-15',
    status: 'normal'
  },
  {
    id: 'SP014',
    code: 'LUBRICANT-GREASE',
    name: '润滑脂 02#',
    category: 'C',
    unit: 'kg',
    stock: 15,
    safeStock: 20,
    maxStock: 50,
    price: 45,
    location: '油库-02',
    applicableEquipment: ['CNC加工中心', 'CNC数控车床', 'CNC数控铣床'],
    batches: [
      { id: 'B014', batchNumber: 'BT20240201', quantity: 30, inDate: '2024-02-01', expireDate: '2025-02-01' }
    ],
    lastInDate: '2024-02-01',
    lastOutDate: '2024-04-30',
    status: 'low'
  },
  {
    id: 'SP015',
    code: 'CNC-CUTTER',
    name: '硬质合金立铣刀 φ10',
    category: 'B',
    unit: '支',
    stock: 35,
    safeStock: 20,
    maxStock: 60,
    price: 168,
    location: '刀具库-01',
    applicableEquipment: ['CNC加工中心', 'CNC数控铣床'],
    batches: [
      { id: 'B015', batchNumber: 'BT20240310', quantity: 40, inDate: '2024-03-10' }
    ],
    lastInDate: '2024-03-10',
    lastOutDate: '2024-05-20',
    status: 'normal'
  }
]
