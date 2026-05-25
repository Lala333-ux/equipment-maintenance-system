import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { SOP } from '@/types'
import { useUserStore } from './user'

export const useSOPStore = defineStore('sop', () => {
  const list = ref<SOP[]>([])
  const currentSOP = ref<SOP | null>(null)
  const loading = ref(false)
  
  const selectedJobType = ref('')
  const searchKeyword = ref('')

  const filteredList = computed(() => {
    let result = list.value

    if (searchKeyword.value) {
      const keyword = searchKeyword.value.toLowerCase()
      result = result.filter(
        sop =>
          sop.name.toLowerCase().includes(keyword) ||
          sop.code.toLowerCase().includes(keyword)
      )
    }

    if (selectedJobType.value) {
      result = result.filter(sop => sop.jobType === selectedJobType.value)
    }

    return result
  })

  const jobTypeLabels: Record<string, string> = {
    daily_maintenance: '日常保养',
    periodic_maintenance: '定期保养',
    fault_repair: '故障维修',
    safety_check: '安全检查',
    calibration: '精度校准'
  }

  const jobTypeColors: Record<string, { bg: string; text: string; dot: string }> = {
    daily_maintenance: { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500' },
    periodic_maintenance: { bg: 'bg-blue-100', text: 'text-blue-800', dot: 'bg-blue-500' },
    fault_repair: { bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-500' },
    safety_check: { bg: 'bg-yellow-100', text: 'text-yellow-800', dot: 'bg-yellow-500' },
    calibration: { bg: 'bg-purple-100', text: 'text-purple-800', dot: 'bg-purple-500' }
  }

  const jobTypes = [
    { value: 'daily_maintenance', label: '日常保养' },
    { value: 'periodic_maintenance', label: '定期保养' },
    { value: 'fault_repair', label: '故障维修' },
    { value: 'safety_check', label: '安全检查' },
    { value: 'calibration', label: '精度校准' }
  ]

  const fetchList = async () => {
    loading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const userStore = useUserStore()
      
      list.value = [
        {
          id: 'SOP001',
          code: 'SOP-MA-001',
          name: '数控车床日常保养规程',
          equipmentScope: ['数控车床', 'CNC-001', 'CNC-002'],
          jobType: 'daily_maintenance',
          version: 'V2.1',
          effectiveDate: '2024-01-01',
          author: userStore.currentUser!,
          approver: userStore.currentUser!,
          totalEstimatedTime: 60,
          steps: [
            {
              order: 1,
              title: '清洁设备表面',
              description: '使用干净抹布清洁数控车床外表面积累的切屑、冷却液残渍和油污',
              keyPoints: ['重点清洁操作面板', '清洁导轨防护罩外表面'],
              estimatedTime: 10
            },
            {
              order: 2,
              title: '润滑系统检查',
              description: '检查润滑泵油位是否在刻度范围内，确认润滑管路无泄漏',
              keyPoints: ['油位不低于最低刻度', '管路连接紧固'],
              estimatedTime: 10
            },
            {
              order: 3,
              title: '冷却系统检查',
              description: '检查冷却液液位，清理冷却泵滤网，确认喷嘴无堵塞',
              keyPoints: ['冷却液液位正常', '滤网清洁无堵塞'],
              estimatedTime: 15
            },
            {
              order: 4,
              title: '空运行测试',
              description: '启动设备空运行5分钟，观察主轴运转是否平稳，有无异常声响',
              keyPoints: ['检查主轴运转', '确认无异响'],
              safetyNotes: '保持安全距离',
              estimatedTime: 10
            },
            {
              order: 5,
              title: '记录与归档',
              description: '填写日常保养记录表，签字确认',
              estimatedTime: 5
            }
          ],
          checklist: [
            {
              id: 'CL001',
              item: '设备外观清洁',
              method: '目视检查',
              standard: '表面无明显灰尘、切屑、油污'
            },
            {
              id: 'CL002',
              item: '润滑系统油位',
              method: '液位计目视',
              standard: '油位在MIN-MAX刻度之间'
            },
            {
              id: 'CL003',
              item: '冷却液液位',
              method: '液位计目视',
              standard: '液位在容器2/3以上'
            },
            {
              id: 'CL004',
              item: '滤网清洁度',
              method: '目视检查',
              standard: '无堵塞、切屑堆积'
            },
            {
              id: 'CL005',
              item: '设备运行状态',
              method: '空运行观察',
              standard: '无异常声响、振动'
            }
          ],
          resources: {
            tools: [
              { id: 'T001', name: '清洁布', specification: '无纤维脱落' },
              { id: 'T002', name: '润滑油', specification: 'ISO VG 68' },
              { id: 'T003', name: '冷却液', specification: '乳化型' }
            ],
            spareParts: ['冷却液', '润滑油'],
            personnel: [
              { role: '维修工程师', count: 1, skills: ['设备操作', '维护保养'] }
            ],
            ppe: ['防护手套', '工作服', '安全鞋']
          }
        },
        {
          id: 'SOP002',
          code: 'SOP-MA-002',
          name: '数控车床定期精度校准规程',
          equipmentScope: ['数控车床', 'CNC-001', 'CNC-002', 'CNC-003'],
          jobType: 'calibration',
          version: 'V1.5',
          effectiveDate: '2024-03-15',
          author: userStore.currentUser!,
          approver: userStore.currentUser!,
          totalEstimatedTime: 180,
          steps: [
            {
              order: 1,
              title: '准备工作',
              description: '设备停机冷却至室温，准备校准工具和量具',
              estimatedTime: 15
            },
            {
              order: 2,
              title: '几何精度检测',
              description: '使用千分表和标准块检测主轴径向跳动、轴向窜动',
              keyPoints: ['主轴跳动检测', '丝杠螺距误差检测'],
              estimatedTime: 45
            },
            {
              order: 3,
              title: '定位精度检测',
              description: '使用激光干涉仪检测各轴定位精度和重复定位精度',
              keyPoints: ['X轴定位精度', 'Z轴定位精度'],
              estimatedTime: 60
            },
            {
              order: 4,
              title: '数据记录与分析',
              description: '记录检测数据，与标准值对比分析',
              estimatedTime: 30
            },
            {
              order: 5,
              title: '调整与补偿',
              description: '根据检测结果进行必要的调整和参数补偿',
              safetyNotes: '调整参数需授权',
              estimatedTime: 20
            },
            {
              order: 6,
              title: '复检与验证',
              description: '重新检测确认调整效果',
              estimatedTime: 15
            }
          ],
          checklist: [
            {
              id: 'CL006',
              item: '主轴径向跳动',
              method: '千分表检测',
              standard: '≤0.01mm'
            },
            {
              id: 'CL007',
              item: '主轴轴向窜动',
              method: '千分表检测',
              standard: '≤0.008mm'
            },
            {
              id: 'CL008',
              item: 'X轴定位精度',
              method: '激光干涉仪',
              standard: '≤0.015mm'
            },
            {
              id: 'CL009',
              item: 'Z轴定位精度',
              method: '激光干涉仪',
              standard: '≤0.02mm'
            }
          ],
          resources: {
            tools: [
              { id: 'T004', name: '千分表', specification: '0.001mm分辨率' },
              { id: 'T005', name: '标准块', specification: '等级0' },
              { id: 'T006', name: '激光干涉仪', specification: '雷尼绍ML10' }
            ],
            spareParts: [],
            personnel: [
              { role: '计量工程师', count: 1, skills: ['精度校准', '量具使用'] },
              { role: '设备技术员', count: 1, skills: ['设备调整'] }
            ],
            ppe: ['防护手套', '工作服', '安全鞋']
          }
        },
        {
          id: 'SOP003',
          code: 'SOP-MA-003',
          name: '设备安全检查规程',
          equipmentScope: ['所有生产设备'],
          jobType: 'safety_check',
          version: 'V3.0',
          effectiveDate: '2023-12-01',
          author: userStore.currentUser!,
          approver: userStore.currentUser!,
          totalEstimatedTime: 40,
          steps: [
            {
              order: 1,
              title: '安全装置检查',
              description: '检查急停按钮、防护罩、安全联锁装置是否完好有效',
              keyPoints: ['急停按钮功能', '防护罩完整性'],
              safetyNotes: '确认设备处于停机状态',
              estimatedTime: 15
            },
            {
              order: 2,
              title: '电气系统检查',
              description: '检查接地保护、绝缘性能、控制线路',
              keyPoints: ['接地电阻', '绝缘电阻'],
              safetyNotes: '需专业电工操作',
              estimatedTime: 15
            },
            {
              order: 3,
              title: '环境安全检查',
              description: '检查设备周围安全通道、消防设施',
              estimatedTime: 10
            }
          ],
          checklist: [
            {
              id: 'CL010',
              item: '急停按钮功能',
              method: '手动测试',
              standard: '按下后设备立即停止'
            },
            {
              id: 'CL011',
              item: '防护罩完整性',
              method: '目视检查',
              standard: '无变形、破损、松动'
            },
            {
              id: 'CL012',
              item: '接地电阻',
              method: '接地电阻测试仪',
              standard: '≤4Ω'
            },
            {
              id: 'CL013',
              item: '安全通道畅通',
              method: '目视检查',
              standard: '通道宽度≥1.2m，无杂物'
            }
          ],
          resources: {
            tools: [
              { id: 'T007', name: '接地电阻测试仪', specification: '0-20Ω' },
              { id: 'T008', name: '兆欧表', specification: '500V' }
            ],
            spareParts: [],
            personnel: [
              { role: '安全员', count: 1, skills: ['安全检查'] },
              { role: '维修工程师', count: 1, skills: ['设备检查'] }
            ],
            ppe: ['安全帽', '绝缘手套', '安全鞋', '工作服']
          }
        },
        {
          id: 'SOP004',
          code: 'SOP-MA-004',
          name: '故障维修标准流程',
          equipmentScope: ['所有生产设备'],
          jobType: 'fault_repair',
          version: 'V2.0',
          effectiveDate: '2024-02-01',
          author: userStore.currentUser!,
          approver: userStore.currentUser!,
          totalEstimatedTime: 120,
          steps: [
            {
              order: 1,
              title: '故障确认',
              description: '了解故障现象，确认故障设备，检查设备状态',
              keyPoints: ['故障现象记录', '设备状态确认'],
              estimatedTime: 15
            },
            {
              order: 2,
              title: '故障分析',
              description: '查阅设备资料，分析可能原因',
              keyPoints: ['查阅维修手册', '分析故障原因'],
              estimatedTime: 20
            },
            {
              order: 3,
              title: '维修准备',
              description: '准备工具、备件，确认维修人员',
              estimatedTime: 10
            },
            {
              order: 4,
              title: '故障排除',
              description: '按照维修步骤进行故障排除',
              keyPoints: ['严格执行操作规程', '注意安全防护'],
              safetyNotes: '维修前断电挂牌',
              estimatedTime: 60
            },
            {
              order: 5,
              title: '功能测试',
              description: '维修完成后进行功能测试',
              estimatedTime: 10
            },
            {
              order: 6,
              title: '验收交付',
              description: '通知使用部门验收，填写维修记录',
              estimatedTime: 5
            }
          ],
          checklist: [
            {
              id: 'CL014',
              item: '故障现象记录',
              method: '询问+观察',
              standard: '详细记录故障现象'
            },
            {
              id: 'CL015',
              item: '维修前断电',
              method: '目视确认',
              standard: '设备断电，悬挂警示牌'
            },
            {
              id: 'CL016',
              item: '功能测试',
              method: '运行测试',
              standard: '设备正常运行，无异常'
            }
          ],
          resources: {
            tools: [
              { id: 'T009', name: '万用表', specification: '数字式' },
              { id: 'T010', name: '扳手套装', specification: '公制' },
              { id: 'T011', name: '螺丝刀套装', specification: '十字/一字' }
            ],
            spareParts: [],
            personnel: [
              { role: '维修工程师', count: 1, skills: ['故障诊断', '设备维修'] }
            ],
            ppe: ['防护手套', '安全鞋', '工作服']
          }
        },
        {
          id: 'SOP005',
          code: 'SOP-MA-005',
          name: 'CNC加工中心定期保养规程',
          equipmentScope: ['CNC加工中心', 'MC-001', 'MC-002'],
          jobType: 'periodic_maintenance',
          version: 'V1.8',
          effectiveDate: '2024-01-15',
          author: userStore.currentUser!,
          approver: userStore.currentUser!,
          totalEstimatedTime: 120,
          steps: [
            {
              order: 1,
              title: '清洁与检查',
              description: '清洁设备内外，检查各部位清洁状态',
              estimatedTime: 20
            },
            {
              order: 2,
              title: '润滑系统维护',
              description: '更换润滑油，清洗润滑泵和管路',
              keyPoints: ['使用规定牌号润滑油', '排空旧油后加入新油'],
              estimatedTime: 30
            },
            {
              order: 3,
              title: '冷却系统维护',
              description: '更换冷却液，清理冷却系统',
              keyPoints: ['按比例配置冷却液', '清理水槽和滤网'],
              estimatedTime: 30
            },
            {
              order: 4,
              title: '机械部件检查',
              description: '检查导轨、丝杠、主轴状态',
              keyPoints: ['导轨无磨损', '丝杠无松动'],
              estimatedTime: 20
            },
            {
              order: 5,
              title: '电气系统检查',
              description: '检查电气元件、接线、接地',
              estimatedTime: 15
            },
            {
              order: 6,
              title: '记录归档',
              description: '填写保养记录，签字确认',
              estimatedTime: 5
            }
          ],
          checklist: [
            {
              id: 'CL017',
              item: '润滑油更换',
              method: '排油+加油',
              standard: '油色清亮，无杂质'
            },
            {
              id: 'CL018',
              item: '冷却液更换',
              method: '配置+更换',
              standard: '浓度8-12%，无异味'
            },
            {
              id: 'CL019',
              item: '导轨间隙',
              method: '塞尺检测',
              standard: '间隙≤0.03mm'
            },
            {
              id: 'CL020',
              item: '主轴温度',
              method: '红外测温',
              standard: '温升≤20℃'
            }
          ],
          resources: {
            tools: [
              { id: 'T012', name: '油桶', specification: '20L' },
              { id: 'T013', name: '抽油泵', specification: '电动' },
              { id: 'T014', name: '冷却液', specification: 'FALKEN CCF-20' }
            ],
            spareParts: ['润滑油', '冷却液', '滤网'],
            personnel: [
              { role: '维修工程师', count: 2, skills: ['设备保养', '机械维修'] }
            ],
            ppe: ['防护手套', '耐油手套', '安全鞋', '工作服']
          }
        }
      ]
    } catch (error) {
      console.error('获取SOP列表失败:', error)
    } finally {
      loading.value = false
    }
  }

  const fetchById = async (id: string) => {
    loading.value = true
    try {
      await new Promise(resolve => setTimeout(resolve, 300))
      currentSOP.value = list.value.find(sop => sop.id === id) || null
    } catch (error) {
      console.error('获取SOP详情失败:', error)
    } finally {
      loading.value = false
    }
  }

  const setFilters = (filters: { jobType?: string; keyword?: string }) => {
    if (filters.jobType !== undefined) {
      selectedJobType.value = filters.jobType
    }
    if (filters.keyword !== undefined) {
      searchKeyword.value = filters.keyword
    }
  }

  const resetFilters = () => {
    selectedJobType.value = ''
    searchKeyword.value = ''
  }

  return {
    list,
    currentSOP,
    loading,
    filteredList,
    selectedJobType,
    searchKeyword,
    jobTypeLabels,
    jobTypeColors,
    jobTypes,
    fetchList,
    fetchById,
    setFilters,
    resetFilters
  }
})
