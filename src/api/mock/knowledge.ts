import type { Knowledge } from '@/types'
import { mockUsers } from './user'

export const mockKnowledgeList: Knowledge[] = [
  {
    id: 'K001',
    title: 'FANUC数控系统主轴电机过热故障排查',
    summary: '详细介绍FANUC数控系统主轴电机出现过热故障时的排查步骤和处理方法，包括温度传感器检查、冷却系统验证等关键点。',
    content: `<h2>故障现象</h2>
<p>机床在加工过程中主轴突然停转，CRT显示"SPINDLE MOTOR OVERHEAT"报警。</p>

<h2>可能原因</h2>
<ul>
<li>主轴电机温度传感器故障</li>
<li>冷却风扇损坏或停止运转</li>
<li>电机负载过大，超出额定范围</li>
<li>环境温度过高</li>
<li>电机内部绕组短路</li>
</ul>

<h2>排查步骤</h2>
<ol>
<li>首先确认故障报警代码，查看PMC诊断画面</li>
<li>检查主轴电机温度传感器接线是否松动</li>
<li>使用红外测温仪测量电机外壳温度</li>
<li>检查冷却风扇是否正常运转，有无异物堵塞</li>
<li>检查切削参数是否合理，刀具是否磨损严重</li>
<li>测量电机三相电阻，确认绕组状态</li>
</ol>

<h2>处理方法</h2>
<p>根据排查结果进行相应处理：清洁或更换冷却风扇、调整切削参数、更换温度传感器或电机。</p>

<h2>预防措施</h2>
<ul>
<li>定期检查主轴电机温度</li>
<li>保持冷却系统清洁通畅</li>
<li>合理选择切削参数</li>
</ul>`,
    type: 'fault_solution',
    status: 'published',
    author: mockUsers[1],
    tags: ['FANUC', '主轴', '过热', '数控系统'],
    equipmentTypes: ['FANUC数控车床', 'FANUC加工中心'],
    faultTypes: ['主轴故障', '电机过热'],
    rating: 4.8,
    viewCount: 1256,
    likeCount: 89,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-03-20T14:25:00Z',
    attachments: [
      { id: 'A001', name: '温度传感器接线图.pdf', type: 'pdf', url: '#', size: 1024000 }
    ]
  },
  {
    id: 'K002',
    title: 'CNC加工中心日常保养标准作业指引',
    summary: 'CNC加工中心日常保养的标准流程，包括每日、每周、每月的保养项目和检查要点，确保设备稳定运行。',
    content: `<h2>适用范围</h2>
<p>适用于所有CNC加工中心的日常保养工作。</p>

<h2>每日保养项目</h2>
<ol>
<li>开机前检查液压油油位</li>
<li>检查切削液液位和浓度</li>
<li>清理工作台和导轨上的切屑</li>
<li>检查气源压力</li>
<li>确认急停按钮功能正常</li>
</ol>

<h2>每周保养项目</h2>
<ol>
<li>清理刀库和机械手</li>
<li>检查润滑系统油量</li>
<li>清洁数控系统显示屏</li>
<li>检查各轴参考点返回</li>
</ol>

<h2>每月保养项目</h2>
<ol>
<li>更换切削液</li>
<li>清洁液压油滤芯</li>
<li>检查各轴丝杠润滑状态</li>
<li>校准设备精度</li>
</ol>`,
    type: 'maintenance_guide',
    status: 'published',
    author: mockUsers[1],
    tags: ['CNC', '保养', '标准作业', '日常维护'],
    equipmentTypes: ['CNC加工中心', '数控铣床'],
    faultTypes: [],
    rating: 4.6,
    viewCount: 2341,
    likeCount: 156,
    createdAt: '2024-02-10T09:00:00Z',
    updatedAt: '2024-04-15T11:30:00Z',
    attachments: []
  },
  {
    id: 'K003',
    title: '数控机床安全操作规程',
    summary: '数控机床安全操作的基本规程，包括开机前检查、运行中监控、关机后处理等全流程安全注意事项。',
    content: `<h2>开机前检查</h2>
<ul>
<li>确认机床周围无障碍物</li>
<li>检查各轴是否在安全位置</li>
<li>确认急停按钮未被按下</li>
<li>检查润滑系统是否正常</li>
</ul>

<h2>运行中注意事项</h2>
<ul>
<li>禁止打开安全门</li>
<li>禁止触摸旋转部件</li>
<li>观察加工状态，发现异常立即停机</li>
<li>禁止离开操作岗位</li>
</ul>

<h2>关机后处理</h2>
<ul>
<li>执行机床停机程序</li>
<li>清理切屑和油污</li>
<li>填写设备运行记录</li>
<li>关闭电源和气源</li>
</ul>

<h2>紧急情况处理</h2>
<p>发生紧急情况时，立即按下急停按钮，并按照应急预案进行处理。</p>`,
    type: 'safety_procedure',
    status: 'published',
    author: mockUsers[2],
    tags: ['安全', '操作规程', '数控机床'],
    equipmentTypes: ['所有数控设备'],
    faultTypes: [],
    rating: 4.9,
    viewCount: 3567,
    likeCount: 234,
    createdAt: '2023-12-01T08:00:00Z',
    updatedAt: '2024-05-10T16:00:00Z',
    attachments: []
  },
  {
    id: 'K004',
    title: 'Siemens 840D系统PLC报警处理手册',
    summary: '详细介绍Siemens 840D数控系统常见PLC报警的原因分析和处理方法，帮助维修人员快速定位和解决问题。',
    content: `<h2>常见PLC报警</h2>

<h3>1. 14090报警 - 轴蠕动监控触发</h3>
<p><strong>原因：</strong>轴跟随误差超出允许范围</p>
<p><strong>处理：</strong>检查轴参数设置，排查机械卡阻</p>

<h3>2. 25040报警 - 主动轴停止</h3>
<p><strong>原因：</strong>主动轴停止但从动轴仍在运动</p>
<p><strong>处理：</strong>检查主从轴参数和耦合设置</p>

<h3>3. 300608报警 - 驱动器故障</h3>
<p><strong>原因：</strong>伺服驱动器检测到故障</p>
<p><strong>处理：</strong>查看驱动器诊断信息，检查电机和编码器</p>`,
    type: 'manual',
    status: 'published',
    author: mockUsers[1],
    tags: ['Siemens', '840D', 'PLC', '报警处理'],
    equipmentTypes: ['Siemens数控系统'],
    faultTypes: ['系统报警', 'PLC故障'],
    rating: 4.7,
    viewCount: 1890,
    likeCount: 123,
    createdAt: '2024-01-20T11:00:00Z',
    updatedAt: '2024-04-28T09:15:00Z',
    attachments: [
      { id: 'A002', name: '840D报警代码表.xlsx', type: 'xlsx', url: '#', size: 512000 }
    ]
  },
  {
    id: 'K005',
    title: '液压系统油温过高故障分析',
    summary: '液压系统运行过程中油温异常升高的原因分析及处理方法，包括冷却系统、液压泵、溢流阀等关键部件的检查。',
    content: `<h2>油温过高的危害</h2>
<ul>
<li>液压油氧化加速，性能下降</li>
<li>密封件老化失效</li>
<li>系统效率降低</li>
<li>可能造成设备热变形</li>
</ul>

<h2>主要原因</h2>

<h3>1. 冷却系统故障</h3>
<ul>
<li>冷却器堵塞或效率降低</li>
<li>冷却风扇电机故障</li>
<li>冷却水流量不足</li>
</ul>

<h3>2. 液压泵问题</h3>
<ul>
<li>泵内部磨损，容积效率下降</li>
<li>泵体发热传递到油箱</li>
</ul>

<h3>3. 系统压力过高</h3>
<ul>
<li>溢流阀调定压力过高</li>
<li>系统持续高压运行</li>
</ul>

<h2>处理步骤</h2>
<ol>
<li>检查液压油油位和质量</li>
<li>清理冷却器散热片</li>
<li>检查冷却风扇运转情况</li>
<li>测量系统工作压力</li>
<li>检查液压泵温度</li>
</ol>`,
    type: 'fault_solution',
    status: 'published',
    author: mockUsers[1],
    tags: ['液压', '油温', '冷却系统', '故障分析'],
    equipmentTypes: ['液压设备', '注塑机', '液压机'],
    faultTypes: ['液压故障', '温度异常'],
    rating: 4.5,
    viewCount: 987,
    likeCount: 67,
    createdAt: '2024-03-05T14:00:00Z',
    updatedAt: '2024-05-12T10:30:00Z',
    attachments: []
  },
  {
    id: 'K006',
    title: '伺服电机编码器零点丢失处理方法',
    summary: '伺服电机编码器零点丢失后的恢复方法，包括绝对值编码器和增量式编码器的不同处理流程。',
    content: `<h2>故障现象</h2>
<p>机床回零后原点位置偏移，或者原点返回报警。</p>

<h2>绝对值编码器处理</h2>
<ol>
<li>备份当前零点数据</li>
<li>重新加载编码器电池数据</li>
<li>执行原点复归操作</li>
<li>验证位置精度</li>
</ol>

<h2>增量式编码器处理</h2>
<ol>
<li>执行手动回零操作</li>
<li>调整参考点偏移参数</li>
<li>验证各轴位置</li>
<li>必要时重新设定机械原点</li>
</ol>`,
    type: 'fault_solution',
    status: 'published',
    author: mockUsers[0],
    tags: ['伺服电机', '编码器', '零点丢失', '原点复归'],
    equipmentTypes: ['伺服系统设备'],
    faultTypes: ['位置丢失', '原点偏移'],
    rating: 4.3,
    viewCount: 756,
    likeCount: 45,
    createdAt: '2024-04-10T16:30:00Z',
    updatedAt: '2024-05-18T08:45:00Z',
    attachments: []
  },
  {
    id: 'K007',
    title: '设备点检标准培训教材',
    summary: '设备点检的标准流程和注意事项，包括日常点检、定期点检的内容和要求，是维修人员培训的基础教材。',
    content: `<h2>点检的目的</h2>
<p>通过定期检查，及时发现设备异常，预防故障发生，确保设备稳定运行。</p>

<h2>点检的分类</h2>
<ul>
<li><strong>日常点检：</strong>每日一次，由操作人员执行</li>
<li><strong>定期点检：</strong>每周/每月，由维修人员执行</li>
<li><strong>专项点检：</strong>针对特定设备或系统</li>
</ul>

<h2>点检的基本方法</h2>
<ul>
<li>目视：检查外观、泄漏、异常等</li>
<li>耳听：听异响、振动</li>
<li>鼻嗅：闻异味、焦味</li>
<li>触摸：感受温度、振动</li>
<li>测量：使用仪器进行定量检测</li>
</ul>`,
    type: 'training',
    status: 'published',
    author: mockUsers[2],
    tags: ['点检', '培训', '设备管理'],
    equipmentTypes: ['所有设备'],
    faultTypes: [],
    rating: 4.6,
    viewCount: 2109,
    likeCount: 178,
    createdAt: '2024-01-05T09:30:00Z',
    updatedAt: '2024-04-20T14:00:00Z',
    attachments: []
  },
  {
    id: 'K008',
    title: '变频器常见故障代码及处理',
    summary: '汇总整理主流品牌变频器（西门子、ABB、三菱）的常见故障代码、原因分析和处理方法。',
    content: `<h2>西门子MM440变频器</h2>

<h3>F0001 - 过流</h3>
<ul>
<li>电机电缆短路</li>
<li>电机绕组短路</li>
<li>变频器功率单元故障</li>
</ul>

<h3>F0002 - 过压</h3>
<ul>
<li>电源电压过高</li>
<li>减速时间过短</li>
<li>制动电阻故障</li>
</ul>

<h3>F0003 - 欠压</h3>
<ul>
<li>电源电压过低</li>
<li>供电电源断相</li>
<li>直流回路电容老化</li>
</ul>

<h2>ABB ACS800变频器</h2>

<h3>OVERCURRENT - 过流</h3>
<p>检查电机和电缆，测量电机电阻</p>

<h3>DC OVERVOLT - 直流过压</h3>
<p>延长减速时间，增加制动电阻</p>`,
    type: 'standard',
    status: 'published',
    author: mockUsers[1],
    tags: ['变频器', '故障代码', '西门子', 'ABB'],
    equipmentTypes: ['变频器驱动设备'],
    faultTypes: ['变频器故障', '过流', '过压'],
    rating: 4.7,
    viewCount: 1567,
    likeCount: 112,
    createdAt: '2024-02-25T11:15:00Z',
    updatedAt: '2024-05-08T15:30:00Z',
    attachments: []
  },
  {
    id: 'K009',
    title: '气动系统维护保养指南',
    summary: '气动系统的日常维护和保养指南，包括空压机、干燥器、管路、阀岛等部件的检查和维护要点。',
    content: `<h2>空压机维护</h2>
<ul>
<li>每日排放冷凝水</li>
<li>每周检查油位</li>
<li>每月清洁空气滤芯</li>
<li>每半年更换润滑油</li>
</ul>

<h2>干燥器维护</h2>
<ul>
<li>定期检查排水器</li>
<li>检查再生温度</li>
<li>更换干燥剂（根据露点情况）</li>
</ul>

<h2>管路维护</h2>
<ul>
<li>检查泄漏情况</li>
<li>清理排水装置</li>
<li>检查固定管夹</li>
</ul>

<h2>阀岛维护</h2>
<ul>
<li>检查电磁阀动作</li>
<li>清理阀岛表面</li>
<li>检查接线端子</li>
</ul>`,
    type: 'maintenance_guide',
    status: 'published',
    author: mockUsers[0],
    tags: ['气动', '维护', '空压机', '干燥器'],
    equipmentTypes: ['气动设备'],
    faultTypes: ['气动系统故障'],
    rating: 4.4,
    viewCount: 892,
    likeCount: 56,
    createdAt: '2024-03-15T10:00:00Z',
    updatedAt: '2024-05-15T11:20:00Z',
    attachments: []
  },
  {
    id: 'K010',
    title: '设备精度检测与调整方法',
    summary: '介绍数控机床精度检测的标准方法和调整技巧，包括定位精度、反向间隙、螺距补偿等内容。',
    content: `<h2>精度检测项目</h2>

<h3>1. 定位精度检测</h3>
<p>使用激光干涉仪沿各轴测量，评估定位精度和重复定位精度。</p>

<h3>2. 反向间隙检测</h3>
<p>使用千分表在往返运动中测量，典型值为0.01-0.03mm。</p>

<h3>3. 垂直度检测</h3>
<p>使用方尺和千分表检测各轴之间的垂直度。</p>

<h2>精度调整方法</h2>

<h3>螺距补偿</h3>
<p>根据激光干涉仪测量结果，在数控系统中输入螺距补偿值。</p>

<h3>反向间隙补偿</h3>
<p>在参数中设置反向间隙补偿值，通常为实测值的50%-80%。</p>

<h3>丝杠预拉调整</h3>
<p>通过调整丝杠预拉伸量来补偿热变形。</p>`,
    type: 'standard',
    status: 'published',
    author: mockUsers[1],
    tags: ['精度检测', '激光干涉仪', '螺距补偿', '反向间隙'],
    equipmentTypes: ['数控机床'],
    faultTypes: ['精度下降'],
    rating: 4.8,
    viewCount: 1123,
    likeCount: 89,
    createdAt: '2024-04-01T08:30:00Z',
    updatedAt: '2024-05-20T09:00:00Z',
    attachments: []
  },
  {
    id: 'K011',
    title: '机床刀库换刀故障排除手册',
    summary: '详细分析刀库常见故障（掉刀、卡刀、位置错误）的原因和解决方案，包括机械结构和电气控制两部分。',
    content: `<h2>常见故障类型</h2>

<h3>1. 卡刀故障</h3>
<ul>
<li><strong>原因：</strong>刀套变形、机械手臂位置偏差、刀具超重</li>
<li><strong>处理：</strong>检查刀套、调整手臂位置、确认刀具重量</li>
</ul>

<h3>2. 掉刀故障</h3>
<ul>
<li><strong>原因：</strong>刀爪磨损、弹簧力不足、吹气压力不够</li>
<li><strong>处理：</strong>更换刀爪、调整弹簧、检查气压</li>
</ul>

<h3>3. 位置错误</h3>
<ul>
<li><strong>原因：</strong>编码器故障、原点丢失、参数错误</li>
<li><strong>处理：</strong>重新回原点、检查参数、更换编码器</li>
</ul>

<h2>检查要点</h2>
<ol>
<li>检查刀库旋转是否平稳</li>
<li>确认机械手抓刀力度</li>
<li>验证刀具夹紧信号</li>
<li>测试各位置传感器</li>
</ol>`,
    type: 'fault_solution',
    status: 'published',
    author: mockUsers[1],
    tags: ['刀库', '换刀', '卡刀', '机械手'],
    equipmentTypes: ['CNC加工中心', '数控车床'],
    faultTypes: ['换刀故障', '刀库问题'],
    rating: 4.9,
    viewCount: 2156,
    likeCount: 167,
    createdAt: '2024-03-02T10:30:00Z',
    updatedAt: '2024-05-22T14:15:00Z',
    attachments: []
  },
  {
    id: 'K012',
    title: '滚珠丝杠副维护与更换指南',
    summary: '滚珠丝杠副的日常维护方法、磨损判断标准及更换后的调整技巧，是提高机床精度保持性的重要参考。',
    content: `<h2>日常维护</h2>
<ul>
<li>保持润滑系统正常工作</li>
<li>防止切屑和冷却液进入丝杠副</li>
<li>定期检查丝杠副密封件</li>
<li>避免过载和冲击</li>
</ul>

<h2>磨损判断</h2>
<ul>
<li>反向间隙增大超过0.05mm</li>
<li>运动时有异常噪音</li>
<li>定位精度下降</li>
<li>滚珠有脱落或损坏</li>
</ul>

<h2>更换调整</h2>
<ol>
<li>拆卸前记录原安装位置</li>
<li>清洁安装基面和丝杠副</li>
<li>安装时控制预紧力</li>
<li>调整后检测反向间隙</li>
<li>进行定位精度检测</li>
</ol>`,
    type: 'maintenance_guide',
    status: 'published',
    author: mockUsers[0],
    tags: ['滚珠丝杠', '维护', '更换', '精度'],
    equipmentTypes: ['数控机床', 'CNC加工中心'],
    faultTypes: ['丝杠故障', '精度下降'],
    rating: 4.7,
    viewCount: 1345,
    likeCount: 98,
    createdAt: '2024-02-18T14:45:00Z',
    updatedAt: '2024-05-23T09:30:00Z',
    attachments: []
  },
  {
    id: 'K013',
    title: 'Mitsubishi M70系统操作手册',
    summary: 'Mitsubishi M70数控系统的详细操作指南，包括程序编辑、参数设置、手动操作、自动运行等完整功能说明。',
    content: `<h2>系统启动</h2>
<ol>
<li>接通主电源</li>
<li>启动数控系统</li>
<li>执行机床回零</li>
<li>确认各轴位置</li>
</ol>

<h2>程序编辑</h2>
<ul>
<li>新建程序：PROG → 编辑模式</li>
<li>输入程序号和内容</li>
<li>使用INSERT/DELETE键编辑</li>
<li>保存程序到内存或CF卡</li>
</ul>

<h2>参数设置</h2>
<ul>
<li>按PARAM键进入参数界面</li>
<li>输入参数号查找</li>
<li>修改参数值后写入</li>
<li>部分参数需重启生效</li>
</ul>

<h2>报警处理</h2>
<p>发生报警时按HELP键查看报警信息和处理建议。</p>`,
    type: 'manual',
    status: 'published',
    author: mockUsers[2],
    tags: ['Mitsubishi', 'M70', '操作手册', '数控系统'],
    equipmentTypes: ['Mitsubishi数控系统'],
    faultTypes: [],
    rating: 4.6,
    viewCount: 1876,
    likeCount: 134,
    createdAt: '2024-01-25T08:30:00Z',
    updatedAt: '2024-05-21T16:00:00Z',
    attachments: [
      { id: 'A003', name: 'M70快捷键说明.pdf', type: 'pdf', url: '#', size: 768000 }
    ]
  },
  {
    id: 'K014',
    title: '电气柜维护与检查标准',
    summary: '工业设备电气柜的定期检查项目和维护标准，包括防尘、防潮、接线检查、温度控制等关键内容。',
    content: `<h2>日常检查</h2>
<ul>
<li>检查柜内温度（正常30-40℃）</li>
<li>确认冷却风扇运行</li>
<li>检查柜门密封</li>
<li>观察有无异常气味</li>
</ul>

<h2>定期维护</h2>
<h3>每月</h3>
<ul>
<li>清洁柜内灰尘</li>
<li>检查接线端子紧固</li>
<li>检查空气过滤器</li>
</ul>

<h3>每季度</h3>
<ul>
<li>检查电源电压</li>
<li>测试绝缘电阻</li>
<li>检查接地连接</li>
</ul>

<h3>每年</h3>
<ul>
<li>全面检查所有元器件</li>
<li>更换老化部件</li>
<li>检测冷却系统</li>
</ul>`,
    type: 'maintenance_guide',
    status: 'published',
    author: mockUsers[0],
    tags: ['电气柜', '维护', '检查标准', '电气安全'],
    equipmentTypes: ['所有电气设备'],
    faultTypes: ['电气故障'],
    rating: 4.5,
    viewCount: 1023,
    likeCount: 76,
    createdAt: '2024-03-20T11:00:00Z',
    updatedAt: '2024-05-24T10:30:00Z',
    attachments: []
  },
  {
    id: 'K015',
    title: '主轴轴承更换与预紧调整',
    summary: '主轴轴承的更换步骤和预紧力调整方法，包括安装前检查、安装过程控制及精度验证。',
    content: `<h2>更换前准备</h2>
<ul>
<li>准备专用工具和备件</li>
<li>清洁工作区域</li>
<li>记录原始安装数据</li>
<li>准备润滑脂</li>
</ul>

<h2>拆卸步骤</h2>
<ol>
<li>切断电源和气源</li>
<li>拆卸主轴防护罩</li>
<li>松开主轴锁紧螺母</li>
<li>小心取出主轴和轴承</li>
<li>清洁轴承座和主轴</li>
</ol>

<h2>安装步骤</h2>
<ol>
<li>检查新轴承外观和型号</li>
<li>加热轴承（温度不超过120℃）</li>
<li>快速安装到主轴上</li>
<li>施加正确的预紧力</li>
<li>锁紧螺母并固定</li>
</ol>

<h2>预紧调整</h2>
<p>根据轴承型号使用扭矩扳手或测量温升确定预紧力。</p>`,
    type: 'fault_solution',
    status: 'published',
    author: mockUsers[1],
    tags: ['主轴', '轴承', '更换', '预紧力'],
    equipmentTypes: ['CNC加工中心', '数控车床', '磨床'],
    faultTypes: ['主轴故障', '轴承损坏'],
    rating: 4.8,
    viewCount: 1567,
    likeCount: 123,
    createdAt: '2024-04-15T14:20:00Z',
    updatedAt: '2024-05-25T08:45:00Z',
    attachments: []
  },
  {
    id: 'K016',
    title: '工业机器人保养与预防性维护',
    summary: '工业机器人（ABB、KUKA、FANUC）的定期保养项目和预防性维护计划，延长机器人使用寿命。',
    content: `<h2>日常检查</h2>
<ul>
<li>检查各轴运动是否顺畅</li>
<li>观察有无异常噪音</li>
<li>检查示教器功能</li>
<li>确认安全系统正常</li>
</ul>

<h2>每周保养</h2>
<ul>
<li>清洁机器人表面</li>
<li>检查电缆和气管</li>
<li>测试急停按钮</li>
<li>备份程序数据</li>
</ul>

<h2>每月保养</h2>
<ul>
<li>检查各轴润滑</li>
<li>检查平衡气缸压力</li>
<li>检查零点位置</li>
<li>清洁控制柜过滤器</li>
</ul>

<h2>年度保养</h2>
<ul>
<li>更换电池</li>
<li>全面检查减速机</li>
<li>校准机器人精度</li>
<li>更换润滑油</li>
</ul>`,
    type: 'maintenance_guide',
    status: 'published',
    author: mockUsers[2],
    tags: ['工业机器人', '保养', '预防性维护', 'ABB', 'KUKA'],
    equipmentTypes: ['工业机器人'],
    faultTypes: [],
    rating: 4.7,
    viewCount: 1432,
    likeCount: 109,
    createdAt: '2024-02-28T09:15:00Z',
    updatedAt: '2024-05-26T11:00:00Z',
    attachments: []
  },
  {
    id: 'K017',
    title: '数控系统电池更换指南',
    summary: '主流数控系统（FANUC、Siemens、Mitsubishi）的电池更换步骤和注意事项，防止数据丢失。',
    content: `<h2>更换时机</h2>
<ul>
<li>系统提示电池报警</li>
<li>定期更换（建议1年一次）</li>
<li>长时间停机前</li>
</ul>

<h2>FANUC系统</h2>
<ol>
<li>保持系统通电状态</li>
<li>打开电池仓盖</li>
<li>注意正负极方向</li>
<li>快速更换（30分钟内完成）</li>
<li>确认电池电压正常</li>
</ol>

<h2>Siemens系统</h2>
<ol>
<li>进入维护菜单</li>
<li>备份系统数据</li>
<li>更换电池模块</li>
<li>验证数据完整性</li>
</ol>

<h2>注意事项</h2>
<ul>
<li>必须使用原厂电池</li>
<li>不可使用充电电池</li>
<li>更换前备份重要数据</li>
</ul>`,
    type: 'fault_solution',
    status: 'published',
    author: mockUsers[0],
    tags: ['电池', '更换', '数据备份', 'FANUC', 'Siemens'],
    equipmentTypes: ['所有数控设备'],
    faultTypes: ['电池故障', '数据丢失'],
    rating: 4.6,
    viewCount: 2109,
    likeCount: 156,
    createdAt: '2024-01-30T10:45:00Z',
    updatedAt: '2024-05-27T09:30:00Z',
    attachments: []
  },
  {
    id: 'K018',
    title: '切削液管理与维护标准',
    summary: '切削液的选型、配制、日常管理和定期检测标准，延长刀具寿命，保证加工质量。',
    content: `<h2>切削液类型</h2>
<ul>
<li><strong>乳化液：</strong>适用于通用加工</li>
<li><strong>半合成液：</strong>适用于高速加工</li>
<li><strong>全合成液：</strong>适用于精密加工</li>
<li><strong>纯油：</strong>适用于重负荷加工</li>
</ul>

<h2>日常管理</h2>
<ul>
<li>每日检查液位</li>
<li>每周检测浓度</li>
<li>定期测量pH值（8.5-9.5）</li>
<li>检查有无异味和变质</li>
</ul>

<h2>定期检测</h2>
<ul>
<li>防锈性能测试</li>
<li>微生物检测</li>
<li>杂质含量检查</li>
</ul>

<h2>更换周期</h2>
<p>根据加工负荷和使用情况，建议3-6个月更换一次。</p>`,
    type: 'standard',
    status: 'published',
    author: mockUsers[1],
    tags: ['切削液', '管理', '浓度', '防锈'],
    equipmentTypes: ['CNC加工中心', '数控车床', '磨床'],
    faultTypes: [],
    rating: 4.4,
    viewCount: 987,
    likeCount: 67,
    createdAt: '2024-03-10T15:00:00Z',
    updatedAt: '2024-05-28T14:15:00Z',
    attachments: []
  },
  {
    id: 'K019',
    title: '设备维修安全作业规范',
    summary: '设备维修过程中的安全作业规范，包括锁定/挂牌（LOTO）、高空作业、电气安全等关键安全要求。',
    content: `<h2>基本安全原则</h2>
<ul>
<li>先断电后作业</li>
<li>执行锁定/挂牌程序</li>
<li>佩戴必要的防护用品</li>
<li>两人以上配合作业</li>
</ul>

<h2>锁定/挂牌（LOTO）</h2>
<ol>
<li>识别所有能源来源</li>
<li>关闭设备电源</li>
<li>上锁并挂牌</li>
<li>确认断电状态</li>
<li>作业完成后解锁</li>
</ol>

<h2>电气作业安全</h2>
<ul>
<li>使用绝缘工具</li>
<li>检测电压确认断电</li>
<li>保持作业区域干燥</li>
<li>设置警示标识</li>
</ul>

<h2>应急处理</h2>
<p>发生事故时立即停止作业，报告上级，必要时启动急救程序。</p>`,
    type: 'safety_procedure',
    status: 'published',
    author: mockUsers[2],
    tags: ['安全', '维修', 'LOTO', '电气安全'],
    equipmentTypes: ['所有设备'],
    faultTypes: [],
    rating: 4.9,
    viewCount: 3245,
    likeCount: 245,
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-05-29T10:00:00Z',
    attachments: []
  },
  {
    id: 'K020',
    title: '5S现场管理与设备维护',
    summary: '将5S管理理念应用于设备维护，通过整理、整顿、清扫、清洁、素养提高设备管理水平。',
    content: `<h2>5S与设备维护</h2>

<h3>整理（SEIRI）</h3>
<ul>
<li>区分必要和不必要物品</li>
<li>移除设备周围杂物</li>
<li>清理闲置工具和备件</li>
</ul>

<h3>整顿（SEITON）</h3>
<ul>
<li>工具定点放置</li>
<li>备件分类存放</li>
<li>标识清晰明确</li>
</ul>

<h3>清扫（SEISO）</h3>
<ul>
<li>建立清扫责任区</li>
<li>每日清扫设备</li>
<li>及时发现泄漏和异常</li>
</ul>

<h3>清洁（SEIKETSU）</h3>
<ul>
<li>保持设备外观整洁</li>
<li>定期清洁电气柜</li>
<li>维持良好工作环境</li>
</ul>

<h3>素养（SHITSUKE）</h3>
<ul>
<li>遵守操作规程</li>
<li>执行维护计划</li>
<li>持续改进</li>
</ul>`,
    type: 'training',
    status: 'published',
    author: mockUsers[2],
    tags: ['5S', '现场管理', '设备管理', '素养'],
    equipmentTypes: ['所有设备'],
    faultTypes: [],
    rating: 4.5,
    viewCount: 1678,
    likeCount: 123,
    createdAt: '2024-02-05T13:30:00Z',
    updatedAt: '2024-05-30T09:45:00Z',
    attachments: []
  },
  {
    id: 'K021',
    title: 'FANUC伺服驱动器维修案例集',
    summary: '收集整理FANUC伺服驱动器（αi、βi系列）典型维修案例，帮助维修人员快速定位和解决问题。',
    content: `<h2>案例1：433报警 - 软断线报警</h2>
<p><strong>现象：</strong>电机能转动但显示433报警</p>
<p><strong>原因：</strong>编码器反馈线接触不良</p>
<p><strong>处理：</strong>检查反馈线接头，必要时更换</p>

<h2>案例2：414报警 - 数字伺服报警</h2>
<p><strong>现象：</strong>系统显示414报警，电机无法运动</p>
<p><strong>原因：</strong>伺服驱动器硬件故障</p>
<p><strong>处理：</strong>更换驱动器或维修功率模块</p>

<h2>案例3：300报警 - 返回参考点失败</h2>
<p><strong>现象：</strong>回零过程中报警</p>
<p><strong>原因：</strong>减速开关或挡块问题</p>
<p><strong>处理：</strong>检查开关和挡块位置</p>

<h2>案例4：过流报警</h2>
<p><strong>现象：</strong>驱动器显示过流</p>
<p><strong>原因：</strong>电机电缆短路或电机故障</p>
<p><strong>处理：</strong>检查电机和电缆绝缘</p>`,
    type: 'fault_solution',
    status: 'published',
    author: mockUsers[1],
    tags: ['FANUC', '伺服驱动器', '案例', '报警'],
    equipmentTypes: ['FANUC数控系统'],
    faultTypes: ['伺服故障', '驱动器故障'],
    rating: 4.9,
    viewCount: 2567,
    likeCount: 189,
    createdAt: '2024-04-05T11:30:00Z',
    updatedAt: '2024-05-31T14:00:00Z',
    attachments: [
      { id: 'A004', name: 'FANUC报警代码汇总.pdf', type: 'pdf', url: '#', size: 1536000 }
    ]
  },
  {
    id: 'K022',
    title: '激光切割机日常维护要点',
    summary: '光纤激光切割机的日常维护要点，包括光路清洁、喷嘴更换、辅助气体检查等关键项目。',
    content: `<h2>每日检查</h2>
<ul>
<li>检查激光头保护镜片</li>
<li>清洁喷嘴和切割头</li>
<li>检查辅助气体压力</li>
<li>确认冷却水温度</li>
</ul>

<h2>每周维护</h2>
<ul>
<li>清洁聚焦镜片</li>
<li>检查光路准直</li>
<li>清理排渣系统</li>
<li>检查导轨润滑</li>
</ul>

<h2>每月维护</h2>
<ul>
<li>全面清洁光路系统</li>
<li>检查激光功率</li>
<li>更换过滤器</li>
<li>检查电缆连接</li>
</ul>

<h2>注意事项</h2>
<p>清洁镜片时必须使用专用工具和清洁剂，避免污染镜片。</p>`,
    type: 'maintenance_guide',
    status: 'published',
    author: mockUsers[0],
    tags: ['激光切割', '维护', '镜片', '光路'],
    equipmentTypes: ['激光切割机'],
    faultTypes: [],
    rating: 4.6,
    viewCount: 1234,
    likeCount: 89,
    createdAt: '2024-03-25T16:00:00Z',
    updatedAt: '2024-06-01T10:30:00Z',
    attachments: []
  },
  {
    id: 'K023',
    title: '设备故障诊断与分析方法',
    summary: '系统介绍设备故障诊断的基本方法，包括故障树分析、5Why分析法、FMEA失效模式分析等工具。',
    content: `<h2>故障诊断流程</h2>
<ol>
<li>记录故障现象</li>
<li>收集相关信息</li>
<li>分析可能原因</li>
<li>逐一排查验证</li>
<li>确定根本原因</li>
<li>制定解决方案</li>
</ol>

<h2>常用分析方法</h2>

<h3>5Why分析法</h3>
<p>连续问5个为什么，直至找到根本原因。</p>

<h3>故障树分析（FTA）</h3>
<p>从顶事件开始，逐层分析可能的原因，建立故障树。</p>

<h3>FMEA分析</h3>
<p>分析可能的失效模式、影响和严重度，提前预防。</p>

<h2>诊断工具</h2>
<ul>
<li>振动分析仪</li>
<li>红外测温仪</li>
<li>油液分析仪</li>
<li>超声波检测仪</li>
</ul>`,
    type: 'training',
    status: 'published',
    author: mockUsers[2],
    tags: ['故障诊断', '分析方法', '5Why', 'FTA'],
    equipmentTypes: ['所有设备'],
    faultTypes: [],
    rating: 4.7,
    viewCount: 1890,
    likeCount: 145,
    createdAt: '2024-04-20T09:00:00Z',
    updatedAt: '2024-06-02T15:00:00Z',
    attachments: []
  },
  {
    id: 'K024',
    title: '直线导轨安装与维护指南',
    summary: '直线导轨的安装步骤、精度调整方法及日常维护要点，确保导轨长期稳定运行。',
    content: `<h2>安装准备</h2>
<ul>
<li>清洁安装基面</li>
<li>检查导轨和滑块</li>
<li>准备安装工具</li>
<li>确认型号规格</li>
</ul>

<h2>安装步骤</h2>
<ol>
<li>固定基准导轨</li>
<li>轻轻拧紧固定螺丝</li>
<li>使用千分表找正</li>
<li>对角均匀拧紧</li>
<li>安装从动导轨</li>
<li>安装滑块和工作台</li>
</ol>

<h2>精度调整</h2>
<ul>
<li>调整导轨平行度</li>
<li>检查直线度</li>
<li>确认滑动顺畅</li>
<li>调整预紧力</li>
</ul>

<h2>日常维护</h2>
<ul>
<li>定期润滑</li>
<li>防止灰尘和切屑</li>
<li>检查密封件</li>
<li>监测运行声音</li>
</ul>`,
    type: 'maintenance_guide',
    status: 'published',
    author: mockUsers[0],
    tags: ['直线导轨', '安装', '维护', '精度'],
    equipmentTypes: ['数控机床', 'CNC加工中心'],
    faultTypes: ['导轨故障'],
    rating: 4.5,
    viewCount: 1109,
    likeCount: 78,
    createdAt: '2024-03-30T10:45:00Z',
    updatedAt: '2024-06-03T09:15:00Z',
    attachments: []
  },
  {
    id: 'K025',
    title: '数控机床电气原理图识图方法',
    summary: '数控机床电气原理图的识图方法和技巧，包括PLC梯形图、继电器电路图、伺服驱动接线图等。',
    content: `<h2>图纸类型</h2>
<ul>
<li><strong>电气原理图：</strong>表示电路逻辑关系</li>
<li><strong>接线图：</strong>表示实际接线关系</li>
<li><strong>PLC梯形图：</strong>表示程序逻辑</li>
<li><strong>IO分配图：</strong>表示输入输出信号</li>
</ul>

<h2>识图要点</h2>
<ul>
<li>先看电源部分</li>
<li>再看控制回路</li>
<li>分析信号流向</li>
<li>结合设备功能理解</li>
</ul>

<h2>常见符号</h2>
<ul>
<li>KM：接触器</li>
<li>KA：继电器</li>
<li>SQ：行程开关</li>
<li>SB：按钮</li>
<li>FR：热继电器</li>
</ul>

<h2>故障排查</h2>
<p>根据图纸逐点测量电压，确认信号状态，快速定位故障。</p>`,
    type: 'training',
    status: 'published',
    author: mockUsers[1],
    tags: ['电气原理图', '识图', 'PLC', '电气维修'],
    equipmentTypes: ['所有电气设备'],
    faultTypes: [],
    rating: 4.6,
    viewCount: 1756,
    likeCount: 134,
    createdAt: '2024-02-12T14:30:00Z',
    updatedAt: '2024-06-04T11:30:00Z',
    attachments: [
      { id: 'A005', name: '电气符号标准手册.pdf', type: 'pdf', url: '#', size: 2048000 }
    ]
  },
  {
    id: 'K026',
    title: '注塑机常见故障及处理方法',
    summary: '注塑机常见故障（不锁模、射不出、温度异常）的原因分析和处理方法，提高维修效率。',
    content: `<h2>机械系统故障</h2>

<h3>不锁模</h3>
<ul>
<li>检查安全门信号</li>
<li>检查液压压力</li>
<li>检查锁模机构</li>
</ul>

<h3>不开模</h3>
<ul>
<li>检查开模压力</li>
<li>检查机械结构</li>
<li>检查顶针位置</li>
</ul>

<h2>液压系统故障</h2>

<h3>压力不足</h3>
<ul>
<li>检查油泵</li>
<li>检查溢流阀</li>
<li>检查泄漏点</li>
</ul>

<h2>温度控制系统故障</h2>

<h3>温度异常</h3>
<ul>
<li>检查加热圈</li>
<li>检查热电偶</li>
<li>检查温控模块</li>
</ul>`,
    type: 'fault_solution',
    status: 'published',
    author: mockUsers[0],
    tags: ['注塑机', '故障处理', '液压', '温度控制'],
    equipmentTypes: ['注塑机'],
    faultTypes: ['注塑机故障'],
    rating: 4.4,
    viewCount: 876,
    likeCount: 56,
    createdAt: '2024-04-25T12:00:00Z',
    updatedAt: '2024-06-05T08:45:00Z',
    attachments: []
  },
  {
    id: 'K027',
    title: 'FANUC 0i-MF系统操作指南',
    summary: 'FANUC 0i-MF系统详细操作指南，包括界面介绍、程序编辑、MDI操作、自动运行等核心功能。',
    content: `<h2>系统启动与停止</h2>
<ol>
<li>启动：先开机床侧门，再开系统电源</li>
<li>等待系统引导完成，进入MAIN界面</li>
<li>执行机床回参考点操作</li>
<li>停止：先执行M30程序结束，再关闭系统电源</li>
</ol>

<h2>程序编辑</h2>
<ul>
<li>EDIT模式：新建、编辑、删除程序</li>
<li>使用PROG键打开程序列表</li>
<li>支持G代码和宏程序编辑</li>
<li>程序命名规则：O+数字（O0001-O9999）</li>
</ul>

<h2>MDI操作</h2>
<ul>
<li>按MDI键进入MDI模式</li>
<li>输入单段程序后按INSERT插入</li>
<li>按CYCLE START执行</li>
<li>常用M代码：M03主轴正转、M04主轴反转、M05主轴停止</li>
</ul>

<h2>常用快捷键</h2>
<ul>
<li>POS：显示位置</li>
<li>PROG：程序操作</li>
<li>OFFSET SETTING：刀补设置</li>
<li>SYSTEM：系统参数</li>
<li>MESSAGE：报警信息</li>
</ul>`,
    type: 'manual',
    status: 'published',
    author: mockUsers[1],
    tags: ['FANUC', '0i-MF', '操作指南', '数控系统'],
    equipmentTypes: ['FANUC数控系统'],
    faultTypes: [],
    rating: 4.7,
    viewCount: 2345,
    likeCount: 178,
    createdAt: '2024-05-01T09:00:00Z',
    updatedAt: '2024-06-10T14:30:00Z',
    attachments: [
      { id: 'A006', name: 'FANUC 0i-MF快捷键速查表.pdf', type: 'pdf', url: '#', size: 512000 }
    ]
  },
  {
    id: 'K028',
    title: 'Siemens 828D数控系统操作手册',
    summary: 'Siemens Sinumerik 828D系统的完整操作指南，包含程序管理、参数设置、诊断功能等详细说明。',
    content: `<h2>系统概述</h2>
<p>Sinumerik 828D是西门子公司推出的紧凑型数控系统，采用面板式集成设计，稳定性高，适合车削和铣削加工。</p>

<h2>基本操作</h2>

<h3>开机流程</h3>
<ol>
<li>打开机床主电源</li>
<li>系统自动启动，进入"JOG"模式</li>
<li>执行返回参考点</li>
<li>确认各轴位置</li>
</ol>

<h3>程序编辑</h3>
<ul>
<li>按"程序管理器"进入程序列表</li>
<li>支持在线编辑和外部传输</li>
<li>程序存储在NC内存或USB</li>
<li>支持程序模拟功能</li>
</ul>

<h2>常用功能</h2>

<h3>刀具管理</h3>
<ul>
<li>使用"刀具列表"管理刀具</li>
<li>输入刀补参数</li>
<li>支持刀具测量</li>
</ul>

<h3>测量循环</h3>
<p>系统提供丰富的测量循环，包括工件测量和刀具测量。</p>`,
    type: 'manual',
    status: 'published',
    author: mockUsers[2],
    tags: ['Siemens', '828D', 'Sinumerik', '操作手册'],
    equipmentTypes: ['Siemens数控系统'],
    faultTypes: [],
    rating: 4.6,
    viewCount: 1876,
    likeCount: 145,
    createdAt: '2024-05-05T10:15:00Z',
    updatedAt: '2024-06-12T09:00:00Z',
    attachments: []
  },
  {
    id: 'K029',
    title: 'KUKA机器人编程基础教程',
    summary: 'KUKA工业机器人编程入门指南，涵盖示教编程、在线编程、基本指令等内容，适合初学者。',
    content: `<h2>机器人系统组成</h2>
<ul>
<li>机器人本体（机械手）</li>
<li>控制柜（KRC4）</li>
<li>示教器（SmartPAD）</li>
<li>安全设备</li>
</ul>

<h2>基本操作模式</h2>
<ul>
<li><strong>T1模式：</strong>手动低速，用于示教和调试</li>
<li><strong>T2模式：</strong>手动高速，用于速度测试</li>
<li><strong>AUT模式：</strong>自动运行模式</li>
<li><strong>EXT模式：</strong>外部控制模式</li>
</ul>

<h2>示教编程</h2>
<ol>
<li>切换到T1模式</li>
<li>按下示教按钮</li>
<li>移动机器人到目标位置</li>
<li>按"OK"键保存点位</li>
<li>继续下一个点位</li>
</ol>

<h2>基础指令</h2>
<ul>
<li>PTP：点到点运动</li>
<li>LIN：直线运动</li>
<li>CIRC：圆弧运动</li>
<li>WAIT：等待信号</li>
<li>OUT：输出信号</li>
</ul>`,
    type: 'manual',
    status: 'published',
    author: mockUsers[2],
    tags: ['KUKA', '机器人', '编程', '示教'],
    equipmentTypes: ['KUKA工业机器人'],
    faultTypes: [],
    rating: 4.8,
    viewCount: 1567,
    likeCount: 123,
    createdAt: '2024-05-08T11:30:00Z',
    updatedAt: '2024-06-15T14:00:00Z',
    attachments: [
      { id: 'A007', name: 'KUKA基础指令手册.pdf', type: 'pdf', url: '#', size: 1024000 }
    ]
  },
  {
    id: 'K030',
    title: 'ABB机器人IRC5控制系统操作指南',
    summary: 'ABB机器人IRC5控制器的操作说明，包括FlexPendant示教器使用、程序创建、IO配置等。',
    content: `<h2>系统结构</h2>
<ul>
<li>IRC5控制器 - 机器人控制核心</li>
<li>FlexPendant - 示教器</li>
<li>RobotStudio - 离线编程软件</li>
<li>现场总线接口</li>
</ul>

<h2>基本操作</h2>

<h3>示教点位</h3>
<ol>
<li>将机器人切换到手动模式</li>
<li>使用摇杆移动机器人</li>
<li>到达目标位置后点击"Teach Target"</li>
<li>系统自动记录位置</li>
</ol>

<h3>程序创建</h3>
<ul>
<li>新建例行程序（Routine）</li>
<li>添加运动指令</li>
<li>配置逻辑指令</li>
<li>测试运行</li>
</ul>

<h2>常用指令</h2>
<ul>
<li>MoveJ：关节插补运动</li>
<li>MoveL：直线运动</li>
<li>MoveC：圆弧运动</li>
<li>Set：数字输出</li>
<li>WaitDI：等待数字输入</li>
</ul>`,
    type: 'manual',
    status: 'published',
    author: mockUsers[0],
    tags: ['ABB', 'IRC5', '机器人', 'FlexPendant'],
    equipmentTypes: ['ABB工业机器人'],
    faultTypes: [],
    rating: 4.5,
    viewCount: 1234,
    likeCount: 98,
    createdAt: '2024-05-10T09:45:00Z',
    updatedAt: '2024-06-18T11:30:00Z',
    attachments: []
  },
  {
    id: 'K031',
    title: '加工中心换刀机构常见故障诊断',
    summary: '详细介绍斗山/现代加工中心刀库的各种故障现象、原因分析以及解决方法，帮助维修人员快速定位问题。',
    content: `<h2>故障类型分类</h2>

<h3>1. 刀库不旋转</h3>
<ul>
<li>检查刀库电机电源</li>
<li>检查变频器输出</li>
<li>检查刀库位置传感器</li>
<li>检查PLC输出信号</li>
</ul>

<h3>2. 刀套不翻转</h3>
<ul>
<li>检查翻转气缸压力</li>
<li>检查电磁阀动作</li>
<li>检查接近开关位置</li>
<li>检查刀套机械卡阻</li>
</ul>

<h3>3. 换刀过程报警</h3>
<ul>
<li>检查刀具是否超重</li>
<li>检查刀号是否重复</li>
<li>检查PMC程序</li>
<li>检查原点位置</li>
</ul>

<h2>日常维护建议</h2>
<ul>
<li>每周清洁刀库</li>
<li>定期检查润滑</li>
<li>检查刀具重量</li>
</ul>`,
    type: 'fault_solution',
    status: 'published',
    author: mockUsers[1],
    tags: ['刀库', '换刀机构', '斗山', '现代'],
    equipmentTypes: ['CNC加工中心'],
    faultTypes: ['换刀故障', '刀库问题'],
    rating: 4.7,
    viewCount: 1456,
    likeCount: 112,
    createdAt: '2024-05-12T14:30:00Z',
    updatedAt: '2024-06-20T10:00:00Z',
    attachments: []
  },
  {
    id: 'K032',
    title: '数控车床尾座故障分析与排除',
    summary: '数控车床尾座常见故障（不动作、顶力不足、渗漏）的排查步骤和维修方法。',
    content: `<h2>尾座不动作</h2>

<h3>电气故障</h3>
<ul>
<li>检查尾座前进/后退按钮</li>
<li>检查行程开关</li>
<li>检查中间继电器</li>
<li>检查PLC输入输出</li>
</ul>

<h3>液压故障</h3>
<ul>
<li>检查液压压力</li>
<li>检查电磁阀动作</li>
<li>检查油路泄漏</li>
<li>检查液压缸密封</li>
</ul>

<h2>顶力不足</h2>
<ul>
<li>调整液压压力</li>
<li>检查顶针磨损</li>
<li>检查活塞密封</li>
<li>检查液压缸内泄</li>
</ul>

<h2>渗漏油问题</h2>
<ul>
<li>更换密封圈</li>
<li>检查管路连接</li>
<li>紧固接头</li>
</ul>`,
    type: 'fault_solution',
    status: 'published',
    author: mockUsers[0],
    tags: ['数控车床', '尾座', '液压', '顶力'],
    equipmentTypes: ['数控车床'],
    faultTypes: ['尾座故障', '液压故障'],
    rating: 4.4,
    viewCount: 987,
    likeCount: 76,
    createdAt: '2024-05-15T09:20:00Z',
    updatedAt: '2024-06-22T14:30:00Z',
    attachments: []
  },
  {
    id: 'K033',
    title: '机床冷却系统故障处理指南',
    summary: '机床冷却泵、冷却液循环、喷嘴堵塞等冷却系统故障的全面分析和处理方案。',
    content: `<h2>冷却泵不启动</h2>

<h3>电气检查</h3>
<ul>
<li>检查冷却泵电机</li>
<li>检查热继电器</li>
<li>检查接触器</li>
<li>检查PLC输出</li>
</ul>

<h3>机械检查</h3>
<ul>
<li>检查泵轴转动</li>
<li>检查叶轮状况</li>
<li>检查轴承</li>
</ul>

<h2>冷却液不循环</h2>
<ul>
<li>清理喷嘴堵塞</li>
<li>检查管路泄漏</li>
<li>清理泵入口滤网</li>
<li>检查泵叶轮</li>
</ul>

<h2>冷却效果差</h2>
<ul>
<li>检查切削液浓度</li>
<li>清理喷嘴</li>
<li>检查泵流量</li>
<li>更换切削液</li>
</ul>

<h2>日常维护</h2>
<ul>
<li>每日检查液位</li>
<li>每周清理滤网</li>
<li>定期更换切削液</li>
</ul>`,
    type: 'fault_solution',
    status: 'published',
    author: mockUsers[1],
    tags: ['冷却系统', '冷却泵', '切削液', '故障处理'],
    equipmentTypes: ['CNC加工中心', '数控车床'],
    faultTypes: ['冷却故障', '切削液问题'],
    rating: 4.5,
    viewCount: 1123,
    likeCount: 89,
    createdAt: '2024-05-18T11:45:00Z',
    updatedAt: '2024-06-25T09:15:00Z',
    attachments: []
  },
  {
    id: 'K034',
    title: '数控系统原点丢失问题解决方案',
    summary: '各类数控系统原点丢失的原因分析和恢复方法，包括参数备份、零点设置等关键步骤。',
    content: `<h2>原点丢失原因</h2>
<ul>
<li>电池电量不足或接触不良</li>
<li>系统参数被误修改</li>
<li>编码器故障</li>
<li>参考点减速开关故障</li>
<li>丝杠或联轴节松动</li>
</ul>

<h2>FANUC系统恢复</h2>
<ol>
<li>检查电池电压（应大于3V）</li>
<li>确认原点参数</li>
<li>执行手轮回零</li>
<li>重新设置机械原点</li>
<li>验证位置精度</li>
</ol>

<h2>Siemens系统恢复</h2>
<ol>
<li>检查电池状态</li>
<li>加载备份数据</li>
<li>执行参考点返回</li>
<li>调整参考点偏移</li>
</ol>

<h2>预防措施</h2>
<ul>
<li>定期检查电池</li>
<li>定期备份参数</li>
<li>记录原点位置</li>
<li>防止意外断电</li>
</ul>`,
    type: 'fault_solution',
    status: 'published',
    author: mockUsers[2],
    tags: ['原点丢失', '回零', '参数备份', '编码器'],
    equipmentTypes: ['所有数控设备'],
    faultTypes: ['原点丢失', '位置异常'],
    rating: 4.6,
    viewCount: 1789,
    likeCount: 145,
    createdAt: '2024-05-20T14:00:00Z',
    updatedAt: '2024-06-28T11:30:00Z',
    attachments: []
  }
]

export const mockCategoryTree = [
  {
    id: 'fault',
    label: '故障解决方案',
    children: [
      { id: 'fault_solution', label: '故障解决方案' }
    ]
  },
  {
    id: 'maintenance',
    label: '维护保养',
    children: [
      { id: 'maintenance_guide', label: '维护保养指南' },
      { id: 'manual', label: '操作手册' }
    ]
  },
  {
    id: 'standard',
    label: '技术标准',
    children: [
      { id: 'standard', label: '技术标准' }
    ]
  },
  {
    id: 'training',
    label: '培训资料',
    children: [
      { id: 'training', label: '培训资料' }
    ]
  },
  {
    id: 'safety',
    label: '安全规程',
    children: [
      { id: 'safety_procedure', label: '安全操作规程' }
    ]
  }
]