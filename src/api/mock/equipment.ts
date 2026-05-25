import type { Equipment } from '@/types'

export const mockEquipmentList: Equipment[] = [
  {
    id: 'E001',
    code: 'CNC-001',
    name: 'CNC加工中心 #01',
    type: 'CNC加工中心',
    typePath: ['数控机床', '加工中心', 'CNC加工中心'],
    status: 'normal',
    department: '生产车间A',
    location: 'A区-01工位',
    criticality: 'A',
    manufacturer: 'DMG MORI',
    model: 'NMV 1500 DCG',
    serialNumber: 'DMG-2021-0150',
    installDate: '2021-06-15',
    parameters: {
      '工作行程': '1500×800×800mm',
      '主轴转速': '20-10000rpm',
      '刀库容量': '40把',
      '定位精度': '0.008mm',
      '重复定位精度': '0.004mm'
    },
    imageUrl: 'https://images.unsplash.com/photo-1565514020179-026b92b84bb6?w=400'
  },
  {
    id: 'E002',
    code: 'CNC-002',
    name: 'CNC数控车床 #03',
    type: '数控车床',
    typePath: ['数控机床', '车床', '数控车床'],
    status: 'warning',
    department: '生产车间A',
    location: 'A区-05工位',
    criticality: 'A',
    manufacturer: '沈阳机床',
    model: 'CAK6180',
    serialNumber: 'SY-2020-0088',
    installDate: '2020-03-20',
    parameters: {
      '最大车削直径': '400mm',
      '最大车削长度': '800mm',
      '主轴转速': '50-3000rpm',
      '定位精度': '0.015mm'
    },
    imageUrl: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=400'
  },
  {
    id: 'E003',
    code: 'CNC-003',
    name: '五轴加工中心',
    type: '五轴加工中心',
    typePath: ['数控机床', '加工中心', '五轴加工中心'],
    status: 'normal',
    department: '生产车间B',
    location: 'B区-01工位',
    criticality: 'A',
    manufacturer: '海天精工',
    model: 'GMB2560WR',
    serialNumber: 'HT-2022-0035',
    installDate: '2022-09-10',
    parameters: {
      '工作行程': '2500×1200×800mm',
      '主轴转速': '18-8000rpm',
      '刀库容量': '60把',
      '定位精度': '0.010mm'
    },
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400'
  },
  {
    id: 'E004',
    code: 'INJ-001',
    name: '注塑机 #01',
    type: '注塑机',
    typePath: ['塑料机械', '注塑机'],
    status: 'normal',
    department: '注塑车间',
    location: '注塑区-01',
    criticality: 'B',
    manufacturer: '海天塑机',
    model: 'MA1200',
    serialNumber: 'HT-2021-INJ001',
    installDate: '2021-08-05',
    parameters: {
      '锁模力': '1200t',
      '注射量': '2800g',
      '螺杆直径': '90mm'
    },
    imageUrl: 'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=400'
  },
  {
    id: 'E005',
    code: 'CNC-004',
    name: 'CNC数控铣床 #02',
    type: '数控铣床',
    typePath: ['数控机床', '铣床', '数控铣床'],
    status: 'fault',
    department: '生产车间C',
    location: 'C区-03工位',
    criticality: 'B',
    manufacturer: '北京精雕',
    model: 'JDLVG-400',
    serialNumber: 'JD-2020-0402',
    installDate: '2020-11-15',
    parameters: {
      '工作行程': '400×300×150mm',
      '主轴转速': '0-24000rpm',
      '定位精度': '0.005mm'
    },
    imageUrl: 'https://images.unsplash.com/photo-1622675363311-3e1904dc1885?w=400'
  },
  {
    id: 'E006',
    code: 'WELD-001',
    name: '焊接机器人 #01',
    type: '焊接机器人',
    typePath: ['焊接设备', '机器人焊接'],
    status: 'maintenance',
    department: '焊接车间',
    location: '焊装线-01',
    criticality: 'B',
    manufacturer: 'ABB',
    model: 'IRB 2600',
    serialNumber: 'ABB-2019-2601',
    installDate: '2019-05-20',
    parameters: {
      '最大负载': '12kg',
      '工作半径': '1850mm',
      '重复定位精度': '0.05mm'
    },
    imageUrl: 'https://images.unsplash.com/photo-1565514020179-026b92b84bb6?w=400'
  },
  {
    id: 'E007',
    code: 'LASER-001',
    name: '激光切割机 #01',
    type: '激光切割机',
    typePath: ['切割设备', '激光切割'],
    status: 'normal',
    department: '下料车间',
    location: '激光区-01',
    criticality: 'A',
    manufacturer: '大族激光',
    model: 'G3015F',
    serialNumber: 'HZ-2022-L001',
    installDate: '2022-03-25',
    parameters: {
      '切割范围': '3000×1500mm',
      '激光功率': '3000W',
      '切割厚度': '0.5-25mm'
    },
    imageUrl: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400'
  },
  {
    id: 'E008',
    code: 'HYD-001',
    name: '液压机 #01',
    type: '液压机',
    typePath: ['压力设备', '液压机'],
    status: 'normal',
    department: '锻造车间',
    location: '液压区-01',
    criticality: 'B',
    manufacturer: '合肥锻压',
    model: 'YH-500',
    serialNumber: 'HF-2021-HYD001',
    installDate: '2021-04-10',
    parameters: {
      '公称力': '5000kN',
      '滑块行程': '800mm',
      '工作台尺寸': '1600×1400mm'
    },
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400'
  },
  {
    id: 'E009',
    code: 'CMM-001',
    name: '三坐标测量仪',
    type: '测量设备',
    typePath: ['检测设备', '三坐标'],
    status: 'normal',
    department: '质检部',
    location: '测量室-01',
    criticality: 'A',
    manufacturer: '蔡司',
    model: 'CONTURA',
    serialNumber: 'ZEISS-2020-C001',
    installDate: '2020-07-15',
    parameters: {
      '测量范围': '900×1200×700mm',
      '精度': '0.002mm',
      '探测系统': '接触式'
    },
    imageUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400'
  },
  {
    id: 'E010',
    code: 'PRESS-001',
    name: '冲压机 #01',
    type: '冲压机',
    typePath: ['压力设备', '冲压机'],
    status: 'stopped',
    department: '冲压车间',
    location: '冲压线-01',
    criticality: 'B',
    manufacturer: '舒勒',
    model: 'S2-630',
    serialNumber: 'SL-2018-0630',
    installDate: '2018-12-01',
    parameters: {
      '公称力': '6300kN',
      '行程数': '35spm',
      '工作台尺寸': '2500×1600mm'
    },
    imageUrl: 'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=400'
  },
  {
    id: 'E011',
    code: 'CNC-005',
    name: 'CNC加工中心 #02',
    type: 'CNC加工中心',
    typePath: ['数控机床', '加工中心', 'CNC加工中心'],
    status: 'normal',
    department: '生产车间A',
    location: 'A区-02工位',
    criticality: 'A',
    manufacturer: '德玛吉',
    model: 'DMU 80 monoBLOCK',
    serialNumber: 'DMG-2021-0080',
    installDate: '2021-10-20',
    parameters: {
      '工作行程': '800×700×550mm',
      '主轴转速': '20-12000rpm',
      '刀库容量': '30把'
    },
    imageUrl: 'https://images.unsplash.com/photo-1622675363311-3e1904dc1885?w=400'
  },
  {
    id: 'E012',
    code: 'ROBOT-001',
    name: '装配机器人',
    type: '装配机器人',
    typePath: ['机器人', '装配机器人'],
    status: 'normal',
    department: '装配车间',
    location: '装配线-02',
    criticality: 'B',
    manufacturer: 'FANUC',
    model: 'M-20iA',
    serialNumber: 'FANUC-2020-20IA01',
    installDate: '2020-06-30',
    parameters: {
      '最大负载': '20kg',
      '工作半径': '1811mm',
      '重复精度': '0.02mm'
    },
    imageUrl: 'https://images.unsplash.com/photo-1565514020179-026b92b84bb6?w=400'
  }
]

export const mockMaintenanceRecords = [
  {
    id: 'MR001',
    equipmentId: 'E001',
    type: 'fault_repair',
    title: '主轴异响维修',
    description: '更换主轴轴承，调整间隙',
    startTime: '2024-05-10T09:00:00Z',
    endTime: '2024-05-10T15:30:00Z',
    duration: 390,
    technician: '张维修',
    result: 'success'
  },
  {
    id: 'MR002',
    equipmentId: 'E001',
    type: 'planned_maintenance',
    title: '季度保养',
    description: '润滑系统检查，精度校准',
    startTime: '2024-04-15T08:00:00Z',
    endTime: '2024-04-15T12:00:00Z',
    duration: 240,
    technician: '李技术',
    result: 'success'
  }
]
