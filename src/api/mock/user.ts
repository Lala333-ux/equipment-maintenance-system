import type { User } from '@/types'

export const mockUsers: User[] = [
  {
    id: 'U001',
    name: '张维修',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhang',
    role: '维修工程师',
    department: '生产车间A',
    skills: ['CNC维修', '电气维修', '液压系统'],
    phone: '13800138001',
    email: 'zhang@example.com'
  },
  {
    id: 'U002',
    name: '李技术',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=li',
    role: '技术专家',
    department: '技术部',
    skills: ['设备诊断', 'PLC编程', '变频器维修'],
    phone: '13800138002',
    email: 'li@example.com'
  },
  {
    id: 'U003',
    name: '王管理',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wang',
    role: '主管',
    department: '设备部',
    skills: ['设备管理', '团队管理', '数据分析'],
    phone: '13800138003',
    email: 'wang@example.com'
  }
]
